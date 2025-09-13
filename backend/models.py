# backend/models.py
from django.db import models
from django.utils import timezone  # Add this import

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class User(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer-not-to-say', 'Prefer not to say'),
    ]

    name = models.CharField(max_length=100)
    college_name=models.CharField(max_length=100)
    year = models.PositiveSmallIntegerField(blank=True, null=True)
    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)

    # Skills
    my_skills = models.ManyToManyField(Skill, related_name="users", blank=True)

    # Social links
    linkedin_url = models.URLField(max_length=200, blank=True, null=True)
    github_url = models.URLField(max_length=200, blank=True, null=True)

    # Additional fields from frontend
    is_beginner = models.BooleanField(default=False)
    known_skills = models.ManyToManyField(Skill, related_name="known_by_users", blank=True)
    desired_skills = models.ManyToManyField(Skill, related_name="desired_by_users", blank=True)

    # Timestamps - ADD DEFAULT VALUES
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']