from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import VehicleSerializer
from .services import VehicleService

# API Endpoint for listing and creating vehicles.

class VehicleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vehicles = VehicleService.get_all_vehicles()
        serializer = VehicleSerializer(vehicles, many=True)

        return Response(
            {
                "message": "Vehicles retrieved successfully.",
                "count": len(serializer.data),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = VehicleSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "message": "Vehicle creation failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        vehicle = VehicleService.create_vehicle(serializer)
        response_serializer = VehicleSerializer(vehicle)

        return Response(
            {
                "message": "Vehicle created successfully.",
                "data": response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class VehicleSearchAPIView(APIView):
    
    # API endpoint for searching vehicles.
    

    permission_classes = [IsAuthenticated]

    def get(self, request):

        vehicles = VehicleService.search_vehicles(
            request.query_params
        )

        serializer = VehicleSerializer(
            vehicles,
            many=True,
        )

        return Response(
            {
                "message": "Vehicles retrieved successfully.",
                "count": len(serializer.data),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )