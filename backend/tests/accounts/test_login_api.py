# There would be 5 Test cases regarding the Login:
# 1)Successfull Login
# 2)Wrong password
# 3)User not found
# 4)Missung username
# 5)Missing password


# pyrefly: ignore [missing-import]
import  pytest

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient


User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture()
def registered_user():

    return User.objects.create_user(
        username="neh",
        email="neh@gmail.com",
        password="Password@123",
    )

@pytest.mark.django_db
class TestUserLogin:

    def test_user_can_login(self,api_client,registered_user):
        payload = {
            "username":"neh",
            "password":"Password@123",
        }

        response = api_client.post(
            reverse("login"),
            payload,
            format="json",
        )

        assert response.status_code == 200
        body = response.json()
        assert body["message"] == "Login successful."
        assert "access" in body["tokens"]
        assert "refresh" in body["tokens"]
        assert body["user"]["username"]=="neh"
    

    def test_invalid_password(self,api_client,registered_user):
        payload = {
            "username":"neh",
            "password":"WrongPassword",
        }

        response = api_client.post(
            reverse("login"),
            payload,
            format="json",
        )

        assert response.status_code == 401
    
    def test_user_not_found(self,api_client):
        payload = {
            "username":"unknown",
            "password":"Password@123",
        }

        response = api_client.post(reverse("login"),payload,format="json")
        assert response.status_code == 401
    
    def test_missing_username(self,api_client):
        payload={
            "password":"Password@123",
        }

        response = api_client.post(
            reverse("login"),
            payload,
            format="json",
        )

        assert response.status_code == 400
    

    def test_missing_password(self,api_client):
        payload = {
            "username":"neh",
        }

        response = api_client.post(
            reverse("login"),
            payload,
            format="json"
        )

        assert response.status_code == 400


