from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed

from .serializers import RegistrationSerializer,LoginSerializer
from .services import AuthenticationService

class RegistrationAPIView(APIView):
    """
    APIView for user registration.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        """
        Create a new user registration.
        """
        serializer = RegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = AuthenticationService.register_user(serializer)

            return Response(
                {
                    "message": "User registered successfully.",
                    "data": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email, 
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "message": "Registration failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginAPIView(APIView):
    """
    APIView for user login and token generation.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        """
        Authenticate user credentials and return JWT tokens.
        """
        serializer = LoginSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                {
                    "message": "Login failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = AuthenticationService.login_user(
                username=serializer.validated_data["username"],
                password=serializer.validated_data["password"],
            )
        except AuthenticationFailed as exc:
            return Response(
                {
                    "message": str(exc),
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        
        return Response(
            {
                "message": "Login successful.",
                "tokens": {
                    "access": result["access"],
                    "refresh": result["refresh"],
                },
                "user": {
                    "id": result["user"].id,
                    "username": result["user"].username,
                    "email": result["user"].email,
                },
            },
            status=status.HTTP_200_OK,
        )