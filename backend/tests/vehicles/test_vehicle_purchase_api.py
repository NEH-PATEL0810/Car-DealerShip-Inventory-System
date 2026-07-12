import uuid

# pyrefly: ignore [missing-import]
import pytest

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient

# pyrefly: ignore [missing-import]
from vehicles.models import Vehicle

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(api_client):

    user = User.objects.create_user(
        username="buyer",
        email="buyer@test.com",
        password="Password@123",
    )

    api_client.force_authenticate(user=user)

    return api_client


@pytest.fixture
def vehicle():

    return Vehicle.objects.create(
        make="Toyota",
        model="Fortuner",
        category="SUV",
        price="4500000.00",
        quantity=5,
    )


@pytest.fixture
def out_of_stock_vehicle():

    return Vehicle.objects.create(
        make="Honda",
        model="City",
        category="Sedan",
        price="1500000.00",
        quantity=0,
    )


@pytest.mark.django_db
class TestVehiclePurchaseAPI:

    def test_purchase_vehicle_success(
        self,
        authenticated_client,
        vehicle,
    ):

        response = authenticated_client.post(
            reverse(
                "vehicle-purchase",
                kwargs={"pk": vehicle.id},
            )
        )

        assert response.status_code == 200

        vehicle.refresh_from_db()

        assert vehicle.quantity == 4


    def test_purchase_out_of_stock(
        self,
        authenticated_client,
        out_of_stock_vehicle,
    ):

        response = authenticated_client.post(
            reverse(
                "vehicle-purchase",
                kwargs={"pk": out_of_stock_vehicle.id},
            )
        )

        assert response.status_code == 400

        out_of_stock_vehicle.refresh_from_db()

        assert out_of_stock_vehicle.quantity == 0


    def test_purchase_invalid_vehicle(
        self,
        authenticated_client,
    ):

        response = authenticated_client.post(
            reverse(
                "vehicle-purchase",
                kwargs={
                    "pk": uuid.uuid4(),
                },
            )
        )

        assert response.status_code == 404


    def test_requires_authentication(
        self,
        api_client,
        vehicle,
    ):

        response = api_client.post(
            reverse(
                "vehicle-purchase",
                kwargs={"pk": vehicle.id},
            )
        )

        assert response.status_code == 401