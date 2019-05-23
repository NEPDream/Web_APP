import unittest
import json
from app import db, app
from app.api_module.helpers import string_generator
import warnings

# Import module models (i.e. Team)
from app.api_module.models import Employee, Team, Company, Role


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
            'username': 'admin@email.com',
            'password': 'admin@12345',
            'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNTcyODEyMzAwfQ.WxSX-HpTvUTm3Q4yIr6_-seJl22zPQQtgZ9G-qrFyTM'
        }

        db.session.query(Employee).delete()
        db.session.query(Team).delete()
        db.session.query(Role).delete()
        db.session.query(Company).delete()

        json_employee_test_role = dict(name="roleA", comment="role comment")
        request_role_create = self.client().post('/api/role/', headers={'Content-Type': 'application/json',
                                                                        'x-access-token': self.user['token']},
                                                 data=json.dumps(json_employee_test_role))
        self.assertEqual(request_role_create.status_code, 200)

        json_employee_test_company = {"name": "companyA",
                                      "comment": "company comment"}
        request_company_create = self.client().post('/api/company/', headers={'Content-Type': 'application/json',
                                                                              'x-access-token': self.user['token']},
                                                    data=json.dumps(json_employee_test_company))
        self.assertEqual(request_company_create.status_code, 200)

        json_employee_test_team = {"name": "teamA",
                                   "comment": "team comment",
                                   "company_id": 1}
        request_team_create = self.client().post('/api/team/', headers={'Content-Type': 'application/json',
                                                                        'x-access-token': self.user['token']},
                                                 data=json.dumps(json_employee_test_team))
        self.assertEqual(request_team_create.status_code, 200)

        json_employee_test_employee = {"badge": "badgeA", "start_date": "2019-02-19 13:10:00",
                         "end_date": "",
                         "is_full_time": True,
                         "user_id": 1,
                         "role_id": 1,
                         "team_id": 1,
                         "company_id": 1}

        request_employee_create = self.client().post('/api/employee/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']},
                                                     data=json.dumps(json_employee_test_employee))
        self.assertEqual(request_employee_create.status_code, 200)

        with self.app.app_context():
            # create all tables
            db.create_all()


    def test_create_employee_with_invalid_user(self):
        """test employee creation with invalid user"""
        warnings.simplefilter("ignore")

        json_employee = {"badge": "badge_" + string_generator(), "start_date": "2019-02-19 13:10:00",
                         "end_date": "",
                         "is_full_time": True,
                         "user_id": 100,
                         "role_id": 1,
                         "team_id": 1,
                         "company_id": 1}

        request_employee_create = self.client().post('/api/employee/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']},
                                                     data=json.dumps(json_employee))
        json_data = json.loads(request_employee_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'No company | role | team | user found with your inputs ids')
        self.assertEqual(request_employee_create.status_code, 200)

    def test_create_employee_with_invalid_role(self):
        """test employee creation with invalid role"""
        warnings.simplefilter("ignore")

        json_employee = {"badge": "badge_" + string_generator(), "start_date": "2019-02-19 13:10:00",
                         "end_date": "",
                         "is_full_time": True,
                         "user_id": 1,
                         "role_id": 2,
                         "team_id": 1,
                         "company_id": 1}

        request_employee_create = self.client().post('/api/employee/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']},
                                                     data=json.dumps(json_employee))
        json_data = json.loads(request_employee_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'No company | role | team | user found with your inputs ids')
        self.assertEqual(request_employee_create.status_code, 200)

    def test_create_employee_with_invalid_team(self):
        """test employee creation with invalid team """
        warnings.simplefilter("ignore")

        json_employee = {"badge": "badge_" + string_generator(), "start_date": "2019-02-19 13:10:00",
                         "end_date": "",
                         "is_full_time": True,
                         "user_id": 1,
                         "role_id": 1,
                         "team_id": 2,
                         "company_id": 1}

        request_employee_create = self.client().post('/api/employee/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']},
                                                     data=json.dumps(json_employee))
        json_data = json.loads(request_employee_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'No company | role | team | user found with your inputs ids')
        self.assertEqual(request_employee_create.status_code, 200)

    def test_create_employee_with_invalid_company(self):
        """test employee creation with invalid company """
        warnings.simplefilter("ignore")

        json_employee = {"badge": "badge_" + string_generator(), "start_date": "2019-02-19 13:10:00",
                         "end_date": "",
                         "is_full_time": True,
                         "user_id": 1,
                         "role_id": 1,
                         "team_id": 1,
                         "company_id": 2}

        request_employee_create = self.client().post('/api/employee/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']},
                                                     data=json.dumps(json_employee))
        json_data = json.loads(request_employee_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'No company | role | team | user found with your inputs ids')
        self.assertEqual(request_employee_create.status_code, 200)

    def test_create_employee(self):
        """test employee creation """
        warnings.simplefilter("ignore")

        json_employee = {"badge": "badge_" + string_generator(), "start_date": "2019-02-19 13:10:00",
                         "end_date": "",
                         "is_full_time": True,
                         "user_id": 1,
                         "role_id": 1,
                         "team_id": 1,
                         "company_id": 1}

        request_employee_create = self.client().post('/api/employee/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']},
                                                     data=json.dumps(json_employee))
        json_data = json.loads(request_employee_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'New Employee created!')
        self.assertEqual(request_employee_create.status_code, 200)

    def test_get_all_employee(self):
        """test get all employee function """
        warnings.simplefilter("ignore")

        request_get_all_employee = self.client().get('/api/employee/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']})

        get_data = json.loads(request_get_all_employee.data)
        #result = get_data.get('employees')
        #TBD how to judge?

        self.assertTrue(get_data.get('employees'))

    def test_get_one_employee(self):
        """test get one employee function """
        warnings.simplefilter("ignore")

        request_get_one_employee = self.client().get('/api/employee/1/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']})

        get_data = json.loads(request_get_one_employee.data)
        result = get_data.get('employee')['id']
        #TBD how to judge?

        self.assertTrue(get_data.get('employee'))
        self.assertEqual(result, 1)

    def test_get_all_employee_of_a_company(self):
        """test get all employee of a company function """
        warnings.simplefilter("ignore")

        request_get_all_employee_of_a_company = self.client().get('/api/employee/company/1/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']})

        get_data = json.loads(request_get_all_employee_of_a_company.data)
        result = get_data.get('employees')
        #TBD how to judge?

        self.assertTrue(get_data.get('employees'))

    def test_get_all_employee_of_a_team(self):
        """test get all employee of a team function """
        warnings.simplefilter("ignore")

        request_get_all_employee_of_a_team = self.client().get('/api/employee/company/1/1/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']})

        get_data = json.loads(request_get_all_employee_of_a_team.data)
        result = get_data.get('employees')
        #TBD how to judge?

        self.assertTrue(get_data.get('employees'))

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
