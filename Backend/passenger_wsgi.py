import os
import sys

# Path to your Django project (where manage.py is)
sys.path.insert(0, '/home/sujancom/CodeVora_Backend/Backend')
sys.path.insert(0, '/home/sujancom/CodeVora_Backend')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
