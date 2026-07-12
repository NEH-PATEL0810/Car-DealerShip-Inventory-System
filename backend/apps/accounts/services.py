from django.contrib.auth import authenticate, get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
User = get_user_model()


class AuthenticationService:
    """
    Service layer handling authentication and user registration operations.
    """

    @staticmethod
    def register_user(serializer):
        """
        Register a new user using validated serializer data.
        Returns the newly created User instance.
        """
        return serializer.save()
    

    @staticmethod
    def login_user(username: str, password: str):
        """
        Authenticate a user with username and password.
        Returns a dictionary containing the user instance and JWT tokens (refresh and access).
        """
        user = authenticate(
            username=username,
            password=password,
        )

        if user is None:
            raise AuthenticationFailed("Invalid username or password.")
        
        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }