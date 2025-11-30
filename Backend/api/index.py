# Replace 'Backend' with your project folder name
from Backend.asgi import application 

# Vercel expects a callable named `app`
app = application