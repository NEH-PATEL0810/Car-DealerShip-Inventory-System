from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model extending Django's abstract user.
    """

    is_admin = models.BooleanField(default=False)

    def __str__(self):
        """
        String representation of the user.
        """
        return self.username
