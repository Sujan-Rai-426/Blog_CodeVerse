import sys
import os

# Add the project folder containing the Django settings
project_home = '/home/sujancom/CodeVora_Backend/Backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set the settings module for Django
os.environ['DJANGO_SETTINGS_MODULE'] = 'Backend.settings'

# Import Django's WSGI handler
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
