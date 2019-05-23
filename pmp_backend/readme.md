# Back end for CS673Proj
- The Back end is mainly a Flask Rest API
- The api_module will handle all the call from the client side
- The file structure is represented as follows :
```
├── app
│   ├── __init__.py
│   ├── __pycache__
│   │   └── __init__.cpython-36.pyc
│   ├── api_module
│   │   ├── __init__.py
│   │   ├── chat_controller.py
│   │   ├── chat_events.py
│   │   ├── company_controller.py
│   │   ├── employee_controller.py
│   │   ├── helpers.py
│   │   ├── issue_controller.py
│   │   ├── models.py
│   │   ├── project_controller.py
│   │   ├── role_controller.py
│   │   ├── sprint_controller.py
│   │   ├── task_controller.py
│   │   ├── team_controller.py
│   │   └── user_controllers.py
│   └── templates
│       ├── 404.html
│       └── docstring.html
├── app.yaml
├── config.py
├── local
│   └── db
│       └── app.db
├── readme.md
├── requirements.txt
├── run.py
├── static
└── tests
    ├── payload.txt
    ├── pmp_backend.postman_collection.json
    └── test_user_ctlr.py


```

- Run a development server using the run.py
    - GET : http://0.0.0.0:5005/api/ 

# Requirements : 
- Python 3.6
    - flask == 1.0.2
    - pip == 19.0.1
    - SQLAlchemy == 1.2.17
    - pyjwt == 1.7.1
    - flask_sqlalchemy == 2.3.2
    - flask_cors == 3.0.7
    - flask_socketio == 3.1.2
    - gevent == 1.4.0
    - gevent-websocket == 0.10.1
    - pyopenssl == 19.0.0
    - gunicorn == 19.9.0
    - pytest == 4.2.1
    - urllib3 == 1.24.1
    
# Run : 
- pip install requirements.txt
- python run.py

# Deployment
This API is currently deployed on Google Cloud Platform
- https://ckp-python-234314.appspot.com/
The console log is accessible from here :
- https://console.cloud.google.com/cloud-build/builds?authuser=1&project=ckp-python-234314

    - GCP Commands :
        - Deploy : gcloud app deploy (from the root folder containing requirements.txt, app.yaml)
        - Deploy : gcloud app logs tail -s default
