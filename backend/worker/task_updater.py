""" This class updates the task in DB """
import os
import sys

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVER_DIR = os.path.join(BACKEND_DIR, "server")
sys.path.insert(0, SERVER_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")
import django

django.setup()


from django.core.exceptions import ObjectDoesNotExist

from server.asgi import *
from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync


from django.db import transaction
from apps.datasources.models import Query


class TaskUpdater:
    @staticmethod
    def update_db(
        object_type,
        db_id=None,
        task_id=None,
        new_status=None,
        result=None,
        start_time=None,
        error_details=None,
    ):
        objects = {"query": Query}
        if db_id is None and task_id is None:
            raise Exception("You need to specify db_id or task_id to access task.")
        with transaction.atomic():
            try:
                object_model = objects[object_type]
                if db_id is not None:
                    task = object_model.objects.select_for_update().get(pk=db_id)
                elif task_id is not None:
                    task = object_model.objects.select_for_update().get(task_id=task_id)

                if task_id is not None:
                    task.task_id = task_id
                if new_status is not None:
                    task.status = new_status
                if start_time is not None:
                    task.started_at = start_time

                task.save()
                print("task--------------->", task.status)

                data = {
                    "status": new_status,
                    "db_id": db_id,
                    "object_type": object_type,
                }
                if result is not None:
                    data["result"] = result
                if error_details is not None:
                    data["error_details"] = error_details
                msg = {"type": "task_update_message", "data": data}
                TaskUpdater.update_ws(msg)
                return task.id
            except ObjectDoesNotExist as e:
                print("Object task does not exist in DB!")
            except Exception as e:
                print("Exception in TaskUpdater", str(e))
        return None

    @staticmethod
    def update_ws(msg):
        # send to channel
        channel_layer = get_channel_layer()
        print("channel_layer", channel_layer)
        a = async_to_sync(channel_layer.group_send)("personal", msg)
        print(a)


if __name__ == "__main__":
    print("TaskUpdater.__main__")
    data = {"state": "SUCCESS", "progress": 100, "db_id": 1}
    msg = {"type": "task_update_message", "data": data}
    TaskUpdater.update_ws(msg)
