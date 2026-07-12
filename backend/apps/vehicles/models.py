from django.core.validators import MinValueValidator
from django.db import models
from django.conf import settings
import uuid

# Create your models here.

class Vehicle(models.Model):
    """
    Vehicle model representing an inventory item in the dealership.
    """
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
        """
        String representation of the vehicle.
        """
        return f"{self.make}{self.model}"


class Purchase(models.Model):
    """
    Purchase model representing a transaction where a user buys a vehicle.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="purchases",
    )
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="purchases",
    )
    price_paid = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-purchased_at"]

    def __str__(self):
        return f"{self.user.username} purchased {self.vehicle.make} {self.vehicle.model}"

    