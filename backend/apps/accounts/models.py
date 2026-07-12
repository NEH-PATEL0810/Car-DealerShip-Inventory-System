from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Custom User Model for the application

    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username

# Create your models here.
