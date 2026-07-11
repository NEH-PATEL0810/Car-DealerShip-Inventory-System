# Requirements :
# Vehicle can have models : make,model,category,price,quantity
# Price cannot be negative
# Quantity cannot be negative
# Make cannot be empty
# Model cannot be emoty


# pyrefly: ignore [missing-import]
import pytest

from apps.vehicles.models import Vehicle

@pytest.mark.django_db
def test_create_vehicle():
    vehicle = Vehicle.objects.create(
        make="Toyota",
        model="Fortuner",
        category="SUV",
        price=45000000,
        quantity=5,
    )
    assert vehicle.make == "Toyota"
    assert vehicle.quantity == 5

@pytest.mark.django_db
def test_vehicle_price_should_not_be_negative():
    vehicle = Vehicle(
        make="BMW",
        model="X5",
        category="SUV",
        price=-10,
        quantity=2,
    )

    with pytest.raises(Exception):
        vehicle.full_clean()


@pytest.mark.django_db
def test_vehicle_quantity_should_not_be_negative():
    vehicle = Vehicle(
        make="Audi",
        model="A4",
        category="Sedan",
        price=500000000,
        quantity=-5,
    )

    with pytest.raises(Exception):
        vehicle.full_clean()

