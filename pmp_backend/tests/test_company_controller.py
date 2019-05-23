import unittest
import json
from app import db, app
from requests.auth import _basic_auth_str
from app.api_module.helpers import string_generator
import warnings
from app.api_module.models import User
import jwt

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
            'username': 'xurui@email.com',
            'password': 'xurui@12345',
            'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNTUxMzIzNjI1fQ.D6yLZwdyVuqvYnQut8_BstlyGXWW2oLkfYiMLjZ4dXk'
        }
        with self.app.app_context():
            # create all tables
            db.create_all()

    def test_create_company(self):
        """ test company creation """
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user.get('username'),
                                                                                    self.user.get('password'))})
        json_data = json.loads(request_token.data)
        self.user['token'] = json_data.get('token')

        json_user = {
            "name": "Software LTD"+ string_generator(),
            "comment": "a software oriented company"
        }

        request_user_create = self.client().post('/api/company/', headers={'Content-Type': 'application/json',
                                                                        'x-access-token': self.user['token']},
                                                 data=json.dumps(json_user))
        json_data = json.loads(request_user_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'New Company created!')
        self.assertEqual(request_user_create.status_code, 200)

    def test_admin_get_all_company(self):
            """ test to get all roles """
            warnings.simplefilter("ignore")
            request_token = self.client().get('/api/login/',
                                              headers={'Content-Type': 'application/json',
                                                       'Authorization': _basic_auth_str(self.user.get('username'),
                                                                                        self.user.get(
                                                                                            'password'))})
            json_data = json.loads(request_token.data)
            self.user['token'] = json_data.get('token')
            request_admin_get_role = self.client().get('/api/company/', headers={'Content-Type': 'application/json',
                                                                              'x-access-token': self.user.get(
                                                                                  'token')})
            get_data = json.loads(request_admin_get_role.data)
            result = get_data.get('companies')[0]
            result = result.get('name')
            self.assertEqual(result, 'Software LTD')

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