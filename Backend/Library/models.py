from django.db import models
from django.utils.html import format_html
from django.utils.safestring import mark_safe


class LibraryTopic(models.Model):
    id = models.CharField(max_length=50, primary_key=True, help_text="Unique URL-friendly ID (slug). Example: 'backgrounds', 'cards', 'buttons'.")
    name = models.CharField(max_length=100)
    icon_class = models.CharField(max_length=50, help_text="Bootstrap or FontAwesome icon class. Example: 'bi bi-grid-fill'.")
    def __str__(self):
        return self.name





# Linked Props to Component
class LibraryComponentProp(models.Model):
    category = models.ForeignKey(LibraryTopic, related_name="props", on_delete=models.CASCADE, default="All")
    name = models.CharField(max_length=50, help_text="e.g., 'preset'")
    prop_type = models.CharField(max_length=100, help_text="e.g., 'string' or 'Matrix, Waves'")
    default_value = models.CharField(max_length=100, default="null")
    description = models.TextField()
    def __str__(self):
        return f"{self.name} - {self.category}"




class LibraryComponent(models.Model):
    id = models.CharField(max_length=100, primary_key=True, help_text="Unique URL ID for the component. Example: 'matrix-rain-effect'.")
    topic_id = models.ForeignKey(LibraryTopic, related_name='components', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    short_title_info = models.CharField(max_length=255)
    description = models.TextField()
    
    # JSONField is perfect for the "config" object in React
    config = models.JSONField(
                    default=dict, 
                    help_text = mark_safe(
                        '<strong>Preset Usage Examples:</strong><br><br>'
                        
                        '1. Background:'
                        '<pre style="background: #272822; color: #f8f8f2; padding: 12px; border-radius: 5px; margin-bottom: 15px; font-size: 13px;">'
                        '{\n'
                        '  "name": "Background",\n'
                        '  "preset": "Matrix",\n'
                        '  "speed": 1.5,\n'
                        '  "childrenText": "Matrix Rain Background Effect"\n'
                        '}\n</pre>'

                        '2. Button:'
                        '<pre style="background: #272822; color: #f8f8f2; padding: 12px; border-radius: 5px; font-size: 13px;">'
                        '{\n'
                        '  "name": "Button",\n'
                        '  "preset": "Shine",\n'
                        '  "color": "red",\n'
                        '  "processing": {loading},\n'
                        '  "processingText": "loading...",\n'
                        '  "padding": "10px 25px",\n'
                        '  "childrenText": "Click Me"\n'
                        '}\n</pre>'
                    )
                )
    usage = models.TextField(        
                    help_text = format_html(
                        "<strong>Preset Usage Examples:</strong><br><br>"
                        
                        "1. Background:"
                        "<pre style='background: #272822; color: #f8f8f2; padding: 12px; border-radius: 5px; margin-bottom: 15px; font-size: 13px;'>"
                        "&lt;Background preset='Matrix'&gt;\n"
                        "  &lt;div style={{{{ minHeight: '100vh' }}}}&gt;\n"
                        "    Main Content\n"
                        "  &lt;/div&gt;\n"
                        "&lt;/Background&gt;</pre>"

                        "2. Button:"
                        "<pre style='background: #272822; color: #f8f8f2; padding: 12px; border-radius: 5px; font-size: 13px;'>"
                        "&lt;Button\n  preset='Base'\n  color='red'\n  processing={{loading}}  // <-- Pass boolean value of your loading state variable\n  processingText='loading...'\n  padding='10px 25px'\n  className=''\n&gt;\n"
                        "    Click Me\n"
                        "&lt;/Button&gt;</pre>"
                    )
                )
    created_at = models.DateTimeField(auto_now_add=True)
    props = models.ManyToManyField( LibraryComponentProp,  related_name='components',  blank=True, help_text="Select all props that apply to this component" )
    def __str__(self):
        return self.title

