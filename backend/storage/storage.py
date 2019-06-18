from storage.basic_storage_provider import BasicStorageProvider

"""
absolute path
----------------------------------
             relative_path
             ---------------------
             relative_dir
             -------------
some_storage/org_1_proj_1/filename
"""


class Storage(object):
    def __init__(self):
        self.provider = BasicStorageProvider()

    def put(self, data, data_path):
        return self.provider.put(data, data_path)

    def get(self, data_path):
        return self.provider.get(data_path)

    def get_path(self, relative_dir, filename):
        return self.provider.get_path(relative_dir, filename)
