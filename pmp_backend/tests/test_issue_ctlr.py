import unittest
import json
from app import db, app
from app.api_module.helpers import string_generator
import warnings

# Import module models (i.e. Team)
from app.api_module.models import Employee, Team, Company, Role, Project, Issue, IssueTracking


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
            'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNTcyOTIwNjU1fQ.5x58vXL3Il3mqP9s9HmW5W3WMilW4kXFs2dp--X_BZ4'
        }

        db.session.query(Employee).delete()
        db.session.query(Team).delete()
        db.session.query(Role).delete()
        db.session.query(Company).delete()
        db.session.query(Project).delete()
        db.session.query(Issue).delete()

        for x in range(10):
            json_issue_test_user = {"name": "testuser_" + x.__str__(), "email": string_generator()+"@email.com",
                         "password": string_generator(), "admin": False,
                         "profile": "Software Engineer",
                         "skills": ["java", "C#", "Python"]}
            request_user_create = self.client().post('/api/user/', headers={'Content-Type': 'application/json',
                                                                            'x-access-token': self.user['token']},
                                                     data=json.dumps(json_issue_test_user))
            self.assertEqual(request_user_create.status_code, 200)

        json_issue_test_role = dict(name="roleA", comment="role comment")
        request_role_create = self.client().post('/api/role/', headers={'Content-Type': 'application/json',
                                                                        'x-access-token': self.user['token']},
                                                 data=json.dumps(json_issue_test_role))
        self.assertEqual(request_role_create.status_code, 200)

        json_issue_test_company = {"name": "companyA",
                                      "comment": "company comment"}
        request_company_create = self.client().post('/api/company/', headers={'Content-Type': 'application/json',
                                                                              'x-access-token': self.user['token']},
                                                    data=json.dumps(json_issue_test_company))
        self.assertEqual(request_company_create.status_code, 200)

        json_issue_test_team = {"name": "teamA",
                                   "comment": "team comment",
                                   "company_id": 1}
        request_team_create = self.client().post('/api/team/', headers={'Content-Type': 'application/json',
                                                                        'x-access-token': self.user['token']},
                                                 data=json.dumps(json_issue_test_team))
        self.assertEqual(request_team_create.status_code, 200)

        for x in range(10):
            json_issue_test_employee = {"badge": "badge_"+x.__str__(), "start_date": "2019-02-19 13:10:00",
                         "end_date": "",
                         "is_full_time": True,
                         "user_id": x+1,
                         "role_id": 1,
                         "team_id": 1,
                         "company_id": 1}

            request_employee_create = self.client().post('/api/employee/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']},
                                                     data=json.dumps(json_issue_test_employee))
            self.assertEqual(request_employee_create.status_code, 200)

        for x in range(10):
            json_issue_test_project = {"name": "Project_" + x.__str__(),
                                      "start_date": "2019-02-19 13:10:00",
                                       "due_date": "2019-02-19 13:10:00",
                                       "comment": "test issue",
                                       "company_id": 1}

            request_project_create = self.client().post('/api/project/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']},
                                                     data=json.dumps(json_issue_test_project))
            self.assertEqual(request_project_create.status_code, 200)

        for x in range(5):
            json_issue = {"name": "issue_" + x.__str__(),
                                 "start_date": "2019-02-19 13:10:00",
                                 "due_date": "2019-02-28 20:30:00",
                                 "status": "TODO",
                                 "project_id": x+1,
                                 "employee_id": x+1}

            request_issue_create = self.client().post('/api/issue/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']},
                                                     data=json.dumps(json_issue))
            json_data = json.loads(request_issue_create.data)
            self.assertTrue(json_data.get('message'))
            self.assertEqual(json_data.get('message'), 'New Issue created!')
            self.assertEqual(request_issue_create.status_code, 200)

        with self.app.app_context():
            # create all tables
            db.create_all()

    def test_create_issue(self):
        """test issue creation """
        warnings.simplefilter("ignore")

        json_issue = {"name": "issue_test_creation",
                      "start_date": "2019-02-19 13:10:00",
                      "due_date": "2019-02-28 20:30:00",
                      "status": "TODO",
                      "project_id": 6,
                      "employee_id": 6}

        request_issue_create = self.client().post('/api/issue/', headers={'Content-Type': 'application/json',
                                                                          'x-access-token': self.user['token']},
                                                  data=json.dumps(json_issue))
        json_data = json.loads(request_issue_create.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'New Issue created!')
        self.assertEqual(request_issue_create.status_code, 200)

    def test_update_issue(self):
        """test issue creation """
        warnings.simplefilter("ignore")

        json_issue = {"name": "issue_test_update",
                      "start_date": "2019-02-19 13:10:00",
                      "due_date": "2019-02-28 20:30:00",
                      "status": "DOING",
                      "project_id": 7,
                      "employee_id": 7}

        request_issue_update = self.client().put('/api/issue/1/', headers={'Content-Type': 'application/json',
                                                                          'x-access-token': self.user['token']},
                                                  data=json.dumps(json_issue))
        json_data = json.loads(request_issue_update.data)
        self.assertTrue(json_data.get('message'))
        self.assertEqual(json_data.get('message'), 'Issue Updated!')
        self.assertEqual(request_issue_update.status_code, 200)

    def test_get_all_issues(self):
        """test get all issues function """
        warnings.simplefilter("ignore")

        request_get_all_issue = self.client().get('/api/issue/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']})

        get_data = json.loads(request_get_all_issue.data)
        result = get_data.get('issues')
        self.assertTrue(get_data.get('issues'))
        print(*[i for i in result], sep='\n')

    def test_get_one_issue(self):
        """test get all issues function """
        warnings.simplefilter("ignore")

        request_get_one_issue = self.client().get('/api/issue/1/', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']})
        get_data = json.loads(request_get_one_issue.data)
        result = get_data.get('issue')
        self.assertTrue(get_data.get('issue'))
        print(*[i for i in result], sep='\n')

    """
    def test_get_all_issues_of_a_project(self):
        warnings.simplefilter("ignore")

        request_get_all_issues_of_a_project = self.client().get('/api/issue/1/1', headers={'Content-Type': 'application/json',
                                                                                'x-access-token': self.user['token']})
        get_data = json.loads(request_get_all_issues_of_a_project.data)
        result = get_data.get('issues')
        self.assertTrue(get_data.get('issues'))
        print(*[i for i in result], sep='\n')

    def test_get_all_issues_of_a_project_with_status(self):
        warnings.simplefilter("ignore")

    def test_get_all_issues_of_one_employee(self):
        warnings.simplefilter("ignore")

    def test_get_all_issues_of_one_employee_with_status(self):
        warnings.simplefilter("ignore")

    def test_create_new_tracking_on_a_task(self):
        warnings.simplefilter("ignore")

    def test_delete_tracking_on_a_issue(self):
        warnings.simplefilter("ignore")
    """
    
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
