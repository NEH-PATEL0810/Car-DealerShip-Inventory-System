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
def admin_client(api_client):

    admin = User.objects.create_user(
        username="admin",
        email="admin@test.com",
        password="Password@123",
        is_staff=True,
    )

    api_client.force_authenticate(user=admin)

    return api_client


@pytest.fixture
def authenticated_client(api_client):

    user = User.objects.create_user(
        username="user",
        email="user@test.com",
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
class TestVehicleRestockAPI:

    def test_admin_can_restock_vehicle(
        self,
        admin_client,
        vehicle,
    ):

        response = admin_client.post(
            reverse(
                "vehicle-restock",
                kwargs={"pk": vehicle.id},
            ),
            {
                "quantity": 10,
            },
            format="json",
        )

        assert response.status_code == 200

        vehicle.refresh_from_db()

        assert vehicle.quantity == 15


    def test_non_admin_cannot_restock(
        self,
        authenticated_client,
        vehicle,
    ):

        response = authenticated_client.post(
            reverse(
                "vehicle-restock",
                kwargs={"pk": vehicle.id},
            ),
            {
                "quantity": 5,
            },
            format="json",
        )

        assert response.status_code == 403


    def test_invalid_quantity(
        self,
        admin_client,
        vehicle,
    ):

        response = admin_client.post(
            reverse(
                "vehicle-restock",
                kwargs={"pk": vehicle.id},
            ),
            {
                "quantity": -5,
            },
            format="json",
        )

        assert response.status_code == 400


    def test_invalid_vehicle(
        self,
        admin_client,
    ):

        response = admin_client.post(
            reverse(
                "vehicle-restock",
                kwargs={
                    "pk": uuid.uuid4(),
                },
            ),
            {
                "quantity": 5,
            },
            format="json",
        )

        assert response.status_code == 404


    def test_requires_authentication(
        self,
        api_client,
        vehicle,
    ):

        response = api_client.post(
            reverse(
                "vehicle-restock",
                kwargs={"pk": vehicle.id},
            ),
            {
                "quantity": 5,
            },
            format="json",
        )

        assert response.status_code == 401