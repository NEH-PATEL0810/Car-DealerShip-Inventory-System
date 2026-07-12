from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import VehicleSerializer
from .services import VehicleService

# API Endpoint for creating a new vehicle.

class VehicleCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        serializer = VehicleSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "message":"Vehicle creation failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        vehicle = VehicleService.create_vehicle(serializer)

        response_serializer = VehicleSerializer(vehicle)

        return Response(
            {
                "message":"Vehicle created successfully.",
                "data":response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
    