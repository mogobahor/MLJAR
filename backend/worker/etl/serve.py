import os
import json
import numpy as np
import pandas as pd

import logging

logger = logging.getLogger(__name__)


class DataServe:

    # TODO needs to add reading from Storage abstraction
    @staticmethod
    def get(full_file_path):
        try:
            print("Serve data from {0}".format(full_file_path))
            logger.debug("Serve data from {0}".format(full_file_path))
            data = DataServe._read_csv(full_file_path)
            return data  # return pandas data frame
        except Exception as e:
            logger.error("Data serve error, {0}".format(str(e)))
            raise e

    # TODO needs to add writing to Storage abstraction
    @staticmethod
    def put_string(string_data, full_file_path):
        try:
            logger.debug("Put string data to {0}".format(full_file_path))
            with open(full_file_path, "w") as fout:
                fout.write(string_data)
        except Exception as e:
            logger.error("Put string data error, {0}".format(str(e)))
            raise e

    @staticmethod
    def _read_csv(fname):
        print("Read data from {0}".format(fname))
        df = pd.read_csv(fname, skipinitialspace=True)
        return df
