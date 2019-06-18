import unittest
import logging

# logging.basicConfig(level=logging.DEBUG)
# logging.getLogger("urllib3").setLevel(logging.ERROR)
# logging.getLogger("amqp").setLevel(logging.ERROR)

# they should work like charm :)
# REST API tests
from tests.tests_api.test_accounts import TestAccounts
from tests.tests_api.test_projects import TestProjects
from tests.tests_api.test_basic_upload import TestBasicUpload
from tests.tests_api.test_file_data_source import TestFileDataSource
from tests.tests_api.test_mlcolumn_usage import TestMLColumnUsage
from tests.tests_api.test_mlexperiment import TestMLExperiment
from tests.tests_api.test_mlmodel import TestMLModel

# worker tests
# from tests.tests_worker.test_process_uploaded_file import TestProcessUploadedFile

# from tests.tests_worker.test_start_mlexperiment import TestStartMLExperiment

if __name__ == "__main__":
    unittest.main()
