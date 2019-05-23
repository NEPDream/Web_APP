# Statement for enabling the development environment
DEBUG = True

# Define the application directory
import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Define the database - we are working with
# SQLite for this example
# SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'local', 'db', 'app.db')
# SQLALCHEMY_DATABASE_URI = 'mysql://b10c57cb5bea59:92a834dc@us-cdbr-iron-east-03.cleardb.net/heroku_3440541e3141452'
# SQLALCHEMY_DATABASE_URI = 'mysql://root:admin123@localhost/pmp_db'
SQLALCHEMY_DATABASE_URI = 'mysql://bc4af197a608dc:8ee2c423@us-cdbr-iron-east-03.cleardb.net/heroku_2a740fc0973bc5b'
DATABASE_CONNECT_OPTIONS = {}

# Application threads. A common general assumption is
# using 2 per available processor cores - to handle
# incoming requests using one and performing background
# operations using the other.
THREADS_PER_PAGE = 2

# Enable protection agains *Cross-site Request Forgery (CSRF)*
CSRF_ENABLED = True

# Use a secure, unique and absolutely secret key for
# signing the data.
CSRF_SESSION_KEY = "secret"

# Secret key for signing cookies
SECRET_KEY = "secretkey-team2"

# track modifications to the SQLAlchemy session
SQLALCHEMY_TRACK_MODIFICATIONS = True

# mysql://bc4af197a608dc:8ee2c423@us-cdbr-iron-east-03.cleardb.net/heroku_2a740fc0973bc5b?reconnect=true
