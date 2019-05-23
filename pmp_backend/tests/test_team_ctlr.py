import unittest
import json
from app import db, app
from requests.auth import _basic_auth_str
from app.api_module.helpers import string_generator
import warnings
from app.api_module.models import Team


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

    def test_create_team(self):
        """ test user creation """
        warnings.simplefilter("ignore")
        request_token = self.client().get('/api/login/',
                                          headers={'Content-Type': 'application/json',
                                                   'Authorization': _basic_auth_str(self.user.get('username'),
                                                                                    self.user.get('password'))})
        json_data = json.loads(request_token.data)
        self.user['token'] = json_data.get('token')

        json_team = {"name": string_generator(),
                     "comment": 'This is a Team for CS',
                     "company_id": 1}

        request_team_create = self.client().post('/api/team/', headers={'Content-Type': 'application/json',
                                                                        'x-access-token': self.user['token']},
                                                 data=json.dumps(json_team))
        json_data = json.loads(request_team_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'New Team created!')

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
