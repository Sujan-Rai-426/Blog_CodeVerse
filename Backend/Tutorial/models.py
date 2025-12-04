# Tutorial/models.py
from django.db import models
from django.core.exceptions import ValidationError
from cloudinary.models import CloudinaryField



# <-------------============= DATA =========---------------->
# -------------------- CATEGORY --------------------
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name or "No Category"

# -------------------- SECTION --------------------
class Section(models.Model):
    FRONTEND = "Frontend"
    BACKEND = "Backend"
    SECTION_CHOICES = [(FRONTEND, "Frontend"), (BACKEND, "Backend")]

    category = models.ForeignKey(Category, related_name="sections", on_delete=models.CASCADE)
    name = models.CharField(max_length=20, choices=SECTION_CHOICES)

    class Meta:
        unique_together = ("category", "name")

    def __str__(self):
        category_name = getattr(self.category, 'name', 'No Category')
        section_name = self.name or 'No Section'
        return f"{category_name} - {section_name}"

# -------------------- LANGUAGE --------------------
class Language(models.Model):
    section = models.ForeignKey(Section, related_name="languages", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    icon_class = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        unique_together = ("section", "name", "icon_class")

    def __str__(self):
        section_name = getattr(self.section, 'name', 'No Section')
        lang_name = self.name or 'Unnamed Language'
        return f"{lang_name} -- [{section_name}]"

# -------------------- TOPIC --------------------
class Topic(models.Model):
    language = models.ForeignKey(Language, related_name="topics", on_delete=models.CASCADE)
    name = models.CharField(max_length=150)

    class Meta:
        unique_together = ("language", "name")

    def __str__(self):
        lang_name = getattr(self.language, 'name', 'No Language')
        topic_name = self.name or 'Unnamed Topic'
        return f"{topic_name} --- [{lang_name}]"

# -------------------- FRONTEND SOURCE CODE (canonical) --------------------
class FrontendSourceCode(models.Model):
    topic = models.ForeignKey(
        Topic, related_name="source_codes",
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=500, default="Untitled")
    description = models.TextField(blank=True, null=True)

    html_code = models.TextField(blank=True, null=True)
    css_code = models.TextField(blank=True, null=True)
    js_code = models.TextField(blank=True, null=True)

    access_type = models.CharField(
        max_length=10,
        choices=[("Free", "Free"), ("Premium", "Premium")],
        default="Free"
    )
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    hasBought = models.BooleanField(default=False)

    def __str__(self):
        return f"Code: {self.title}"

# -------------------- BACKEND PART (unchanged) --------------------
class BackendImage(models.Model):
    topic = models.ForeignKey('Topic', related_name="images", on_delete=models.CASCADE)
    image = CloudinaryField(
        'image',
        folder='Blog_CodeVerse/Backend_img/',
        blank=False,
        null=False
    )

    def clean(self):
        if getattr(self.topic.language.section, "name", "").lower() != "backend":
            raise ValidationError("Cannot add image to a Frontend topic.")

    def __str__(self):
        topic_name = getattr(self.topic, 'name', None) or "No Topic"
        return f"Image for Topic: [{topic_name}]"

class BackendStep(models.Model):
    topic = models.ForeignKey('Topic', related_name="steps", on_delete=models.CASCADE)
    step_number = models.PositiveIntegerField()
    step_file_name = models.CharField(max_length=200)
    step_description = models.TextField(blank=True, null=True)
    step_source_code = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('topic', 'step_number')
        ordering = ["step_number"]
        verbose_name = "Backend Step"
        verbose_name_plural = "Backend Steps"

    def __str__(self):
        topic_name = getattr(self.topic, 'name', None) or "No Topic"
        step_file = self.step_file_name or "Unnamed Step"
        return f"Step.{self.step_number} of Topic: [{topic_name}] ---> {step_file}"

    def clean(self):
        existing_steps = BackendStep.objects.filter(topic=self.topic)
        if existing_steps.exists():
            max_step = existing_steps.order_by('-step_number').first().step_number
            if existing_steps.filter(step_number=self.step_number).exclude(id=self.id).exists():
                raise ValidationError({
                    "step_number": f"Upto step no. {max_step} already exists in this topic."
                })

# -------------------- CONTACT --------------------
class Contact(models.Model):
    name = models.CharField(max_length=25, null=False)
    email = models.EmailField(null=False)
    message = models.TextField(null=False)
    created_at = models.DateTimeField(auto_now_add=True, null=False)

    def __str__(self):
        return f"Message from {self.name} ({self.email})"

# -------------------- TEMPLATE/OTHER --------------------
ACCESS_CHOICES = [
    ("Free", "Free"),
    ("Premium", "Premium"),
]

class TemplateType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class Template(models.Model):
    title = models.CharField(max_length=200)
    project_info = models.TextField()
    iframe_url = models.URLField()
    download_repo_url = models.URLField(blank=True, null=True)
    documentation = models.URLField(blank=True, null=True)
    template_type = models.ForeignKey(TemplateType, on_delete=models.SET_NULL, null=True, blank=True)
    access_type = models.CharField(max_length=20, choices=ACCESS_CHOICES, default="Free")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title





# <---------=============== CLIENT / USER ================----------------->
from django.contrib.auth.hashers import make_password, check_password
from django.db.models.signals import post_save
from django.dispatch import receiver


# Used for Client / User authentication and Login
class ClientAuth(models.Model):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50)   # duplicates allowed
    password = models.CharField(max_length=128)
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    def __str__(self):
        return f"{self.username} ({self.email})"



from Tutorial.models import ClientAuth
#  Used for Client/User Profile
class ClientProfile(models.Model):
    user = models.OneToOneField(ClientAuth, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.user.username

# -------------------------
# Signal: auto-create profile from register auth
# -------------------------
@receiver(post_save, sender=ClientAuth)
def create_client_profile(sender, instance, created, **kwargs):
    if created:
        ClientProfile.objects.create(user=instance)


