import os
from config import BASIC_STORAGE_DIR

import logging

logger = logging.getLogger(__name__)


class BasicStorageProvider(object):
    def __init__(self):
        self.base_dir = BASIC_STORAGE_DIR

    # do nothing file is already in our scope
    # this will be needed when cloud storage will be supported
    def put(self, data, data_path):
        logger.debug("Put")

    def get(self, data_path):
        logger.debug("Get")

    def create_dir(self, destination):
        dst_dir = os.path.join(self.base_dir, destination)
        if not os.path.exists(dst_dir):
            try:
                logger.debug("Create directory at {0}".format(dst_dir))
                os.makedirs(dst_dir)
            except OSError:
                logger.error("Creation of the directory {0} failed".format(dst_dir))

    def get_path(self, relative_dir, filename):
        path = os.path.join(self.base_dir, relative_dir, filename)
        self.create_dir(relative_dir)
        return path
