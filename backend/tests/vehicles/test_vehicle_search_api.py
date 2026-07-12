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
        username="search_user",
        email="search@test.com",
        password="Password@123",
    )

    api_client.force_authenticate(user=user)

    return api_client


@pytest.fixture
def sample_vehicles():

    Vehicle.objects.create(
        make="Toyota",
        model="Fortuner",
        category="SUV",
        price="4500000.00",
        quantity=5,
    )

    Vehicle.objects.create(
        make="Toyota",
        model="Innova",
        category="SUV",
        price="3000000.00",
        quantity=4,
    )

    Vehicle.objects.create(
        make="Honda",
        model="City",
        category="Sedan",
        price="1500000.00",
        quantity=8,
    )


@pytest.mark.django_db
class TestVehicleSearchAPI:

    def test_search_by_make(
        self,
        authenticated_client,
        sample_vehicles,
    ):

        response = authenticated_client.get(
            reverse("vehicle-search"),
            {
                "make": "Toyota",
            },
        )

        assert response.status_code == 200

        body = response.json()

        assert body["count"] == 2

    def test_search_by_category(
        self,
        authenticated_client,
        sample_vehicles,
    ):

        response = authenticated_client.get(
            reverse("vehicle-search"),
            {
                "category": "SUV",
            },
        )

        assert response.status_code == 200

        body = response.json()

        assert body["count"] == 2

    def test_search_by_price_range(
        self,
        authenticated_client,
        sample_vehicles,
    ):

        response = authenticated_client.get(
            reverse("vehicle-search"),
            {
                "min_price": 1000000,
                "max_price": 2000000,
            },
        )

        assert response.status_code == 200

        body = response.json()

        assert body["count"] == 1

        assert body["data"][0]["model"] == "City"

    def test_combined_filters(
        self,
        authenticated_client,
        sample_vehicles,
    ):

        response = authenticated_client.get(
            reverse("vehicle-search"),
            {
                "make": "Toyota",
                "model": "Fortuner",
            },
        )

        assert response.status_code == 200

        body = response.json()

        assert body["count"] == 1

    def test_no_matching_vehicle(
        self,
        authenticated_client,
        sample_vehicles,
    ):

        response = authenticated_client.get(
            reverse("vehicle-search"),
            {
                "make": "BMW",
            },
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
            reverse("vehicle-search"),
            {
                "make": "Toyota",
            },
        )

        assert response.status_code == 401