import unittest
import json
from app import db, app
from requests.auth import _basic_auth_str
from app.api_module.helpers import string_generator
import warnings
# from app.api_module.models import Role
# import jwt

'''
To start this test, we should first use postman to create two users with following information
To make sure we have already have this user named role_test
json_user_not_admin = {"name": "role_test", "email": "role_test@email.com",
             "password": 'role123', "admin": False,
             "profile": "Software Engineer",
             "skills": ["java", "C#", "Python"]}
json_user_admin = {"name": "wzc", "email": "wzc@email.com",
             "password": 'wzc123', "admin": True,
             "profile": "Software Engineer",
             "skills": ["java", "C#", "Python"]}
Make sure we have already have a role with {'name': 'role_test_name', 'comment': 'role_test_comment'}
'''

class RoleTest(unittest.TestCase):
    """
      Roles Test Case
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
        # json_user = {"name": "role_test", "email": "role_test@email.com",
        #              "password": 'role123', "admin": False,
        #              "profile": "Software Engineer",
        #              "skills": ["java", "C#", "Python"]}
        # request_token = self.client().get('/api/login/',
        #                                   headers={'Content-Type': 'application/json',
        #                                            'Authorization': _basic_auth_str(self.user_admin.get('username'),
        #                                                                             self.user_admin.get('password'))})
        # json_data = json.loads(request_token.data)
        # self.user_admin['token'] = json_data.get('token')
        # json_role = {'name': 'role_test_name', 'comment': 'role_test_comment'}
        # request_role_create = self.client().post('/api/role/', headers={'Content-Type': 'application/json',
        #                                                                 'x-access-token': self.user_admin['token']},
        #                                          data=json.dumps(json_role))
        # request_user_create = self.client().post('/api/user/', headers={'Content-Type': 'application/json',
        #                                                                 'x-access-token': self.user_admin['token']},
        #                                          data=json.dumps(json_user))
        with self.app.app_context():
            # create all tables
            db.create_all()

    def test_admin_create_role(self):
        """ test role creation """
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user_admin.get('username'),
                                                                                    self.user_admin.get('password'))})
        json_data = json.loads(request_token.data)
        self.user_admin['token'] = json_data.get('token')
        json_role = {'name': string_generator()+'role_test_name', 'comment': string_generator()+'role_test_comment'}
        request_role_admin_create = self.client().post('/api/role/', headers={'Content-Type': 'application/json',
                                                                        'x-access-token': self.user_admin['token']},
                                                 data=json.dumps(json_role))
        json_data = json.loads(request_role_admin_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'New Role created!')
        self.assertEqual(request_role_admin_create.status_code, 200)

    def test_not_admin_create_role(self):
        """ test role creation fail by non admin"""
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user_not_admin.get('username'),
                                                                                    self.user_not_admin.get('password'))})
        json_data = json.loads(request_token.data)
        self.user_not_admin['token'] = json_data.get('token')
        json_role = {'name': string_generator()+'role_test_name', 'comment': string_generator()+'role_test_comment'}
        request_role_not_admin_create = self.client().post('/api/role/', headers={'Content-Type': 'application/json',
                                                                        'x-access-token': self.user_not_admin['token']},
                                                 data=json.dumps(json_role))
        json_data = json.loads(request_role_not_admin_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'Cannot perform that function!')
        self.assertEqual(request_role_not_admin_create.status_code, 200)

    def test_admin_get_all_roles(self):
        """ test to get all roles """
        # user1 = {
        #     'user': 'role_test@email.com',
        #     'pwd': 'role123'}
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user_admin.get('username'),
                                                                                    self.user_admin.get('password'))})
        json_data = json.loads(request_token.data)
        self.user_admin['token'] = json_data.get('token')
        request_admin_get_role = self.client().get('/api/role/', headers={'Content-Type': 'application/json',
                                                                'x-access-token': self.user_admin.get('token')})
        get_data = json.loads(request_admin_get_role.data)
        result = get_data.get('roles')[0]
        result = result.get('name')
        self.assertEqual(result,'role_test_name')

    def test_not_admin_get_all_roles(self):
        """ test to get all roles """
        # user1 = {
        #     'user': 'role_test@email.com',
        #     'pwd': 'role123'}
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user_not_admin.get('username'),
                                                                                    self.user_not_admin.get('password'))})
        json_data = json.loads(request_token.data)
        self.user_not_admin['token'] = json_data.get('token')
        request_not_admin_get_user = self.client().get('/api/role/', headers={'Content-Type': 'application/json',
                                                                'x-access-token': self.user_not_admin.get('token')})
        get_data = json.loads(request_not_admin_get_user.data)
        result = get_data.get('message')
        self.assertEqual(result,'Cannot perform that function!')

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