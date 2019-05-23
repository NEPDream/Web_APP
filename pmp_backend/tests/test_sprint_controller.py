import unittest
import json
from app import db, app
from requests.auth import _basic_auth_str
from app.api_module.helpers import string_generator
import warnings

# from app.api_module.models import Role
# import jwt

'''
To start this test, we should first use postman to create at least one company and two different projects in the database
And we must have no sprint under project_id=2 because one project_id can only have one sprint
we should have one sprint with following information in the database:
json_sprint = {"name": "sprint_test_name",
                "start_date": "2019-02-20 00:00:00",
                "due_date": "2019-02-28 00:00:00",
                "comment": "sprint_test_comment",
                "project_id": 1}
'''


class SprintTest(unittest.TestCase):
    """
      Sprints Test Case
    """

    def setUp(self):
        """
        Test Setup
        """
        self.app = app
        self.client = self.app.test_client
        self.user_admin = {
            'username': 'wzc@email.com',
            'password': 'wzc123',
            'token': ''
        }
        self.user_not_admin = {
            'username': 'role_test@email.com',
            'password': 'role123',
            'token': ''
        }

        with self.app.app_context():
            # create all tables
            db.create_all()

    def test_admin_create_sprint(self):
        """ test role creation """
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user_admin.get('username'),
                                                                                    self.user_admin.get('password'))})
        json_data = json.loads(request_token.data)
        self.user_admin['token'] = json_data.get('token')
        json_sprint = {"name": string_generator(),
                       "start_date": "2019-02-20 00:00:00",
                       "due_date": "2019-02-28 00:00:00",
                       "comment": string_generator(),
                       "project_id": 2}
        request_sprint_admin_create = self.client().post('/api/sprint/', headers={'Content-Type': 'application/json',
                                                                                  'x-access-token': self.user_admin[
                                                                                      'token']},
                                                         data=json.dumps(json_sprint))
        json_data = json.loads(request_sprint_admin_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'New sprint created!')
        self.assertEqual(request_sprint_admin_create.status_code, 200)

    def test_admin_get_all_sprints(self):
        """ test to get all roles """
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user_admin.get('username'),
                                                                                    self.user_admin.get('password'))})
        json_data = json.loads(request_token.data)
        self.user_admin['token'] = json_data.get('token')
        request_admin_get_sprint = self.client().get('/api/sprint/', headers={'Content-Type': 'application/json',
                                                                              'x-access-token': self.user_admin.get(
                                                                                  'token')})
        get_data = json.loads(request_admin_get_sprint.data)
        result = get_data.get('sprints')[0]['name']
        self.assertEqual(result, 'sprint_test_name')

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
