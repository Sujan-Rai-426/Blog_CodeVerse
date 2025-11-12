import sys
import os

# Add the folder containing the inner Backend folder to PYTHONPATH
project_home = '/home/sujancom/CodeVoraBackend/Backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'Backend.settings'

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
