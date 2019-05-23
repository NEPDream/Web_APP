import unittest
import json
from app import db, app
from requests.auth import _basic_auth_str
from app.api_module.helpers import string_generator
import warnings
from app.api_module.models import Task
from datetime import datetime


class UsersTest(unittest.TestCase):
    """
      Users Test Case
    """

    def setUp(self):
        """
        Test Setup
        """
        self.app = app
        self.client = self.app.test_client
        self.user = {
            'username': 'chenduo@email.com',
            'password': 'chenduo@12345',
            'token': ''
        }
        with self.app.app_context():
            # create all tables
            db.create_all()

    def test_update_task(self):
        """ test update task """
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user.get('username'),
                                                                                    self.user.get('password'))})
        json_task = {
            "name": string_generator(),
            "start_date": '2018-1-12',
            "due_date": '2019-1-23',
            "status": string_generator(),
            "sprint_id": 1,
            "employee_id": 10
        }
        json_data = json.loads(request_token.data)
        self.user['token'] = json_data.get('token')
        request_update_task = self.client().put('/api/task/2/', headers={'Content-Type': 'application/json',
                                                                         'x-access-token': self.user['token']},
                                                data=json.dumps(json_task))
        json_data = json.loads(request_update_task.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'Task Updated!')

    def test_create_task(self):
        """ test task creation """
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user.get('username'),
                                                                                    self.user.get('password'))})
        json_data = json.loads(request_token.data)
        self.user['token'] = json_data.get('token')

        json_task = {
            "name": string_generator(),
            "start_date": '2018-1-12',
            "due_date": '2019-1-23',
            "status": string_generator(),
            "sprint_id": 1,
            "employee_id": 11
        }

        request_task_create = self.client().post('/api/task/', headers={'Content-Type': 'application/json',
                                                                        'x-access-token': self.user['token']},
                                                 data=json.dumps(json_task))
        json_data = json.loads(request_task_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'New Task created!')

    def test_create_new_tracking_on_a_task(self):
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user.get('username'),
                                                                                    self.user.get('password'))})
        json_tracking = {
            "comment": string_generator(),
            "employee_id": 8
        }
        json_data = json.loads(request_token.data)
        self.user['token'] = json_data.get('token')
        request_create_tracking = self.client().post('/api/task/tracking/1/',
                                                     headers={'Content-Type': 'application/json',
                                                              'x-access-token': self.user[
                                                                  'token']},
                                                     data=json.dumps(json_tracking))
        json_data = json.loads(request_create_tracking.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'New TaskTracking created!')

    def test_delete_tracking_on_a_task(self):
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user.get('username'),
                                                                                    self.user.get('password'))})

        json_data = json.loads(request_token.data)
        self.user['token'] = json_data.get('token')
        request_delete_tracking = self.client().delete('/api/task/tracking/1'
                                                       '/',
                                                       headers={'Content-Type': 'application/json',
                                                                'x-access-token': self.user[
                                                                    'token']})
        json_data = json.loads(request_delete_tracking.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'The tracking message has been deleted on the task!')

    def tearDown(self):
        """
        Tear Down
        """

        with self.app.app_context():
            print("ending the app testing")
            # db.session.remove()
            # db.drop_all()


if __name__ == '__main__':
    unittest.main()
