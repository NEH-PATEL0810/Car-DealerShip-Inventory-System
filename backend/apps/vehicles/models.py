from django.core.validators import MinValueValidator
from django.db import models
import uuid

# Create your models here.

class Vehicle(models.Model):
    CATEGORY_CHOICES = [
        ("SUV","SUV"),
        ("Sedan","Sedan"),
        ("Hatchback","Hatchback"),
        ("Truck","Truck"),
        ("Luxury","Luxury"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default = uuid.uuid4,
        editable=False,
    )
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    category = models.CharField(max_length=20,choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10,decimal_places=2,validators=[MinValueValidator(0)])
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        ordering = ["make","model"]

    def __str__(self):
        return f"{self.make}{self.model}"
    