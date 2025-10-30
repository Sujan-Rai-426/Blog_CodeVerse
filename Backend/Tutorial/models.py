from django.db import models
from django.core.exceptions import ValidationError
from cloudinary.models import CloudinaryField

# -------------------- CATEGORY --------------------
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)  # e.g. Web Development
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


# -------------------- SECTION (Frontend / Backend) --------------------
class Section(models.Model):
    FRONTEND = "Frontend"
    BACKEND = "Backend"
    SECTION_CHOICES = [
        (FRONTEND, "Frontend"),
        (BACKEND, "Backend"),
    ]
    category = models.ForeignKey(Category, related_name="sections", on_delete=models.CASCADE)
    name = models.CharField(max_length=20, choices=SECTION_CHOICES)

    class Meta:
        unique_together = ("category", "name")

    def __str__(self):
        return f"{self.category.name} - {self.name}"


# -------------------- LANGUAGE --------------------
class Language(models.Model):
    section = models.ForeignKey(Section, related_name="languages", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)  # e.g. JavaScript, React, Django, NodeJS
    icon_class = models.CharField(max_length=200, blank=True, null=True)  # Class of icon from devicon library

    class Meta:
        unique_together = ("section", "name", "icon_class")

    def __str__(self):
        return f"{self.name} -- [ {self.section.name} ]"


# -------------------- TOPIC --------------------
class Topic(models.Model):
    language = models.ForeignKey(Language, related_name="topics", on_delete=models.CASCADE)
    name = models.CharField(max_length=150 )  # e.g. Sidebar, Create API, etc.

    class Meta:
        unique_together = ("language", "name")

    def __str__(self):
        return f"{self.name} --- [ {self.language.name} ]"


# -------------------- FRONTEND PART --------------------

class FrontendVideo(models.Model):
    topic = models.ForeignKey(Topic, related_name="videos", on_delete=models.CASCADE)
    title = models.CharField(max_length=1500)
    video_url = CloudinaryField('video', resource_type='video', folder='Blog_CodeVerse/Frontend_videos/')

    def clean(self):
        if self.topic.language.section.name != "Frontend":
            raise ValidationError("Cannot add video to a Backend topic.")

    def __str__(self):
        return f" Topic : [ {self.topic.name} ]    ----   {self.title}  "


class FrontendVideoInfo(models.Model):
    video = models.OneToOneField(FrontendVideo, related_name="info", on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Description for Topic title : [ {self.video.title} ] "


class FrontendSourceCode(models.Model):
    video = models.ForeignKey(FrontendVideo, related_name="source_codes", on_delete=models.CASCADE)
    html_code = models.TextField(blank=True, null=True)
    css_code = models.TextField(blank=True, null=True)
    js_code = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Source code for Topic title: [ {self.video.title} ]"


# -------------------- BACKEND PART --------------------
class BackendImage(models.Model):
    topic = models.ForeignKey(
        'Topic',
        related_name="images",
        on_delete=models.CASCADE
    )
    image = CloudinaryField(
        'image',
        folder='Blog_CodeVerse/Backend_img/',
        blank=False,    # must always have an image
        null=False      # never null
    )

    def clean(self):
        # Ensure image is only added to Backend topics
        if self.topic.language.section.name.lower() != "backend":
            raise ValidationError("Cannot add image to a Frontend topic.")

    def __str__(self):
        return f"Image for Topic: [{self.topic.name}]"


class BackendStep(models.Model):
    topic = models.ForeignKey(
        'Topic', 
        related_name="steps", 
        on_delete=models.CASCADE
    )
    step_number = models.PositiveIntegerField()
    step_title = models.CharField(max_length=200)
    step_description = models.TextField(blank=True, null=True)
    step_source_code = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('topic', 'step_number')  # Prevent duplicates step number within the same topic
        ordering = ["step_number"]
        verbose_name = "Backend Step"
        verbose_name_plural = "Backend Steps"

    def __str__(self):
        return f"Step.{self.step_number}  of  Topic: [ {self.topic.name}  ] ---> {self.step_title} "
    
        #  Custom validation to show your message or notification of duplicate step_number if someone tries to add it.
    def clean(self):
        existing_steps = BackendStep.objects.filter(topic=self.topic)
        if existing_steps.exists():
            max_step = existing_steps.order_by('-step_number').first().step_number

            # check if duplicate step_number exists
            duplicate = existing_steps.filter(step_number=self.step_number).exclude(id=self.id).exists()
            if duplicate:
                raise ValidationError({
                    "step_number": f"Upto step no. {max_step} already exists in this topic."
                })


