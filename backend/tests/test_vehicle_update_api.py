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
        username="editor",
        email="editor@test.com",
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


@pytest.mark.django_db
class TestVehicleUpdateAPI:

    def test_update_vehicle_success(
        self,
        authenticated_client,
        vehicle,
    ):

        payload = {
            "make": "Toyota",
            "model": "Fortuner Legender",
            "category": "SUV",
            "price": "4700000.00",
            "quantity": 8,
        }

        response = authenticated_client.put(
            reverse(
                "vehicle-detail",
                kwargs={"pk": vehicle.id},
            ),
            payload,
            format="json",
        )

        assert response.status_code == 200

        body = response.json()

        assert body["data"]["model"] == "Fortuner Legender"

        assert body["data"]["quantity"] == 8

    def test_update_invalid_vehicle(
        self,
        authenticated_client,
    ):

        payload = {
            "make":"Toyota",
            "model":"Fortuner",
            "category":"SUV",
            "price":"4500000.00",
            "quantity":5,
        }

        response = authenticated_client.put(
            reverse(
                "vehicle-detail",
                kwargs={"pk": uuid.uuid4()},
            ),
            payload,
            format="json",
        )

        assert response.status_code == 404

    def test_negative_price(
        self,
        authenticated_client,
        vehicle,
    ):

        payload = {
            "make":"Toyota",
            "model":"Fortuner",
            "category":"SUV",
            "price":"-100",
            "quantity":5,
        }

        response = authenticated_client.put(
            reverse(
                "vehicle-detail",
                kwargs={"pk":vehicle.id},
            ),
            payload,
            format="json",
        )

        assert response.status_code == 400

    def test_negative_quantity(
        self,
        authenticated_client,
        vehicle,
    ):

        payload = {
            "make":"Toyota",
            "model":"Fortuner",
            "category":"SUV",
            "price":"4500000",
            "quantity":-5,
        }

        response = authenticated_client.put(
            reverse(
                "vehicle-detail",
                kwargs={"pk":vehicle.id},
            ),
            payload,
            format="json",
        )

        assert response.status_code == 400

    def test_requires_authentication(
        self,
        api_client,
        vehicle,
    ):

        payload = {
            "make":"Toyota",
            "model":"Fortuner",
            "category":"SUV",
            "price":"4500000",
            "quantity":5,
        }

        response = api_client.put(
            reverse(
                "vehicle-detail",
                kwargs={"pk":vehicle.id},
            ),
            payload,
            format="json",
        )

        assert response.status_code == 401