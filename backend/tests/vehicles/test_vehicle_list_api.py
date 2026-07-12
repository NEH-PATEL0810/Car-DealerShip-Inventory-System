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
        username="viewer",
        email="viewer@test.com",
        password="Password@123",
    )

    api_client.force_authenticate(user=user)

    return api_client


@pytest.mark.django_db
class TestVehicleListAPI:

    def test_get_all_vehicles(
        self,
        authenticated_client,
    ):

        Vehicle.objects.create(
            make="Toyota",
            model="Fortuner",
            category="SUV",
            price="4500000.00",
            quantity=5,
        )

        Vehicle.objects.create(
            make="Honda",
            model="City",
            category="Sedan",
            price="1500000.00",
            quantity=7,
        )

        response = authenticated_client.get(
            reverse("vehicle-list")
        )

        assert response.status_code == 200

        body = response.json()

        assert body["count"] == 2

        assert len(body["data"]) == 2

    def test_empty_vehicle_list(
        self,
        authenticated_client,
    ):

        response = authenticated_client.get(
            reverse("vehicle-list")
        )

        assert response.status_code == 200

        body = response.json()

        assert body["count"] == 0

        assert body["data"] == []

    def test_requires_authentication(
        self,
        api_client,
    ):

        response = api_client.get(
            reverse("vehicle-list")
        )

        assert response.status_code == 401