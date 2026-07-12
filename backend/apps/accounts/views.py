from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegistrationSerializer
from .services import AuthenticationService

class RegistrationAPIView(APIView):
    # API endpoint for registering a new user

    authentication_classes=[]
    permission_classes=[]

    def post(self,request):
        serializer = RegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = AuthenticationService.register_user(serializer)

            return Response(
                {
                    "message":"User registered successfully.",
                    "data":{
                        "id":user.id,
                        "username":user.username,
                        "email":user.email, 
                    },
                },
                status = status.HTTP_201_CREATED,
            )
        return Response(
            {
                "message":"Registration failed.",
                "errors":serializer.errors,
            },
            status = status.HTTP_400_BAD_REQUEST,
        )