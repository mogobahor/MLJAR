import psycopg2
import json
import pandas as pd
import select


def _wait(conn, timeout=None):
    while 1:
        try:
            state = conn.poll()
            if state == psycopg2.extensions.POLL_OK:
                break
            elif state == psycopg2.extensions.POLL_WRITE:
                select.select([], [conn.fileno()], [], timeout)
            elif state == psycopg2.extensions.POLL_READ:
                select.select([conn.fileno()], [], [], timeout)
            else:
                raise psycopg2.OperationalError("poll() returned %s" % state)
        except select.error:
            raise psycopg2.OperationalError("select.error received")


class InterruptException(Exception):
    pass


class PostgresQueryRunner:
    def __init__(self, settings):
        self.settings = settings

    def _get_connection(self):

        connection = psycopg2.connect(
            user=self.settings.get("user"),
            password=self.settings.get("password"),
            host=self.settings.get("host"),
            port=self.settings.get("port"),
            dbname=self.settings.get("database"),
        )
        return connection

    def test_connection(self):
        try:
            return self.run_query("select 1;")
        except psycopg2.OperationalError as e:
            data = None
            error = str(e)
            return data, error

    def run_query(self, sql_query):
        connection = self._get_connection()
        _wait(connection, timeout=10)

        cursor = connection.cursor()

        try:
            cursor.execute(sql_query)
            _wait(connection)

            if cursor.description is not None:
                error = None
                columns = [i.name for i in cursor.description]
                data = pd.DataFrame(cursor.fetchall(), columns=columns)
            else:
                error = "Query completed but it returned no data."
                data = None
        except (select.error, OSError) as e:
            error = "Query interrupted. Please retry."
            data = None
        except psycopg2.DatabaseError as e:
            error = str(e)
            data = None
        except (KeyboardInterrupt, InterruptException):
            connection.cancel()
            error = "Query cancelled by user."
            data = None
        finally:
            connection.close()

        return data, error
