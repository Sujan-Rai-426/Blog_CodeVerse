from django.db import models
from django.utils.html import format_html
from django.utils.safestring import mark_safe


class LibraryTopic(models.Model):
    id = models.CharField(max_length=50, primary_key=True, help_text="Unique URL-friendly ID (slug). Example: 'backgrounds', 'cards', 'buttons'.")
    name = models.CharField(max_length=100)
    icon_class = models.CharField(max_length=50, help_text="Bootstrap or FontAwesome icon class. Example: 'bi bi-grid-fill'.")
    def __str__(self):
        return self.name


class LibraryComponent(models.Model):
    id = models.CharField(max_length=100, primary_key=True, help_text="Unique URL ID for the component. Example: 'matrix-rain-effect'.")
    topic_id = models.ForeignKey(LibraryTopic, related_name='components', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    short_title_info = models.CharField(max_length=255)
    description = models.TextField()
    
    # JSONField is perfect for the "config" object in React
    config = models.JSONField(
                    default=dict, 
                    help_text=mark_safe("""
Example JSON Structure: <pre style="background: #272822; color: #f8f8f2; padding: 12px; border-radius: 5px; margin-top: 5px;">
{
    "name": "MatrixBackground",
    "childrenText": "Matrix Background",
    "props": { "speed": 1 }
}</pre>
                            """)
                )
    usage = models.TextField(        
                help_text=format_html(
                        "Example usage sequence:<br><pre style='background: #272822; color: #f8f8f2; padding: 10px;'>"
                        "&lt;MatrixBackground&gt;\n"
                        "  &lt;div style={{{{minHeight:'100vh'}}}}&gt;\n"
                        "      Here is your Body\n"
                        "  &lt;/div&gt;\n"
                        "&lt;/MatrixBackground&gt;</pre>"
                    )
                )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title