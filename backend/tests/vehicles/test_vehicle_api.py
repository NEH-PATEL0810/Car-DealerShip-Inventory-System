# pyrefly: ignore [missing-import]
import pytest

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(api_client):

    user = User.objects.create_user(
        username="vehicle_admin",
        email="vehicle@test.com",
        password="Password@123",
    )

    api_client.force_authenticate(user=user)

    return api_client


@pytest.mark.django_db
class TestVehicleAPI:

    def test_create_vehicle_success(
        self,
        authenticated_client,
    ):

        payload = {
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "price": "4500000.00",
            "quantity": 10,
        }

        response = authenticated_client.post(
            reverse("vehicle-create"),
            payload,
            format="json",
        )

        assert response.status_code == 201

        body = response.json()

        assert body["message"] == "Vehicle created successfully."

        assert body["data"]["make"] == "Toyota"

        assert body["data"]["model"] == "Fortuner"

        assert body["data"]["category"] == "SUV"

        assert body["data"]["quantity"] == 10

    def test_create_vehicle_unauthorized(
        self,
        api_client,
    ):

        payload = {
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "price": "4500000.00",
            "quantity": 10,
        }

        response = api_client.post(
            reverse("vehicle-create"),
            payload,
            format="json",
        )

        assert response.status_code == 401

    def test_missing_make(
        self,
        authenticated_client,
    ):

        payload = {
            "model": "Fortuner",
            "category": "SUV",
            "price": "4500000.00",
            "quantity": 10,
        }

        response = authenticated_client.post(
            reverse("vehicle-create"),
            payload,
            format="json",
        )

        assert response.status_code == 400

    def test_missing_price(
        self,
        authenticated_client,
    ):

        payload = {
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "quantity": 10,
        }

        response = authenticated_client.post(
            reverse("vehicle-create"),
            payload,
            format="json",
        )

        assert response.status_code == 400