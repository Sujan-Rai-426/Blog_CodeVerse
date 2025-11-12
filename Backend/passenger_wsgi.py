import sys
import os

# Add your project directory to the PYTHONPATH
project_home = '/home/sujancom/CodeVoraBackend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variable for Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'CodeVoraBackend.settings'  # <-- corrected

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
