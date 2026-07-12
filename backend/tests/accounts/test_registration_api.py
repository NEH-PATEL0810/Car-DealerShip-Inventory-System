# pyrefly: ignore [missing-import]
import pytest

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient

User = get_user_model()

@pytest.fixture
def api_client():
    """
    Returns a DRF API Client instance.
    """
    return APIClient()

@pytest.mark.django_db
class TestUserRegistration:
    """
    Test suite for user registration API endpoint.
    """

    REGISTER_URL = "/api/auth/register/"

    def test_user_can_register(self, api_client):
        payload={
            "username":"neh",
            "email":"neh@gmail.com",
            "password":"Password@123",
        }

        response = api_client.post(
            self.REGISTER_URL,
            payload,
            format="json",
        )

        assert response.status_code == 201
        assert User.objects.filter(username="neh").exists()

    
    def test_duplicate_username(self,api_client):
        User.objects.create_user(
            username="neh",
            email="abc@gmail.com",
            password="Password@123",
        )

        payload = {
            "username":"neh",
            "email":"new@gmail.com",
            "password":"Password@123",
        }

        response = api_client.post(
            self.REGISTER_URL,
            payload,
            format="json",
        )

        assert response.status_code == 400
    
    def test_duplicate_email(self,api_client):
        User.objects.create_user(
            username="neh",
            email="neh@gmail.com",
            password="Password@123",
        )

        payload = {
            "username":"newuser",
            "email":"neh@gmail.com",
            "password":"Password@123",
        }

        response = api_client.post(
            self.REGISTER_URL,
            payload,
            format="json",
        )

        assert response.status_code == 400
    
    def test_missing_username(self,api_client):
        payload = {
            "email":"neh@gmail.com",
            "password":"Password@123",
        }

        response = api_client.post(
            self.REGISTER_URL,
            payload,
            format="json",
        )

        assert response.status_code == 400
        
    def test_missing_email(self,api_client):
        payload = {
            "username":"neh",
            "password":"Password@123",
        }

        response = api_client.post(
            self.REGISTER_URL,
            payload,
            format="json",
        )

        assert response.status_code == 400
    

    def test_missing_password(self,api_client):
        payload={
            "username":"neh",
            "email":"neh@gmail.com",
        }

        response = api_client.post(
            self.REGISTER_URL,
            payload,
            format = "json",
        )

        assert response.status_code == 400





    