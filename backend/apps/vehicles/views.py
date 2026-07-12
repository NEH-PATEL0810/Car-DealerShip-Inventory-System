from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import VehicleSerializer
from .services import VehicleService
from .models import Vehicle

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

    def put(self, request, pk):
        vehicle = get_object_or_404(
            Vehicle,
            pk=pk,
        )

        serializer = VehicleSerializer(
            vehicle,
            data=request.data,
        )

        if not serializer.is_valid():
            return Response(
                {
                    "message": "Vehicle update failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        vehicle = VehicleService.update_vehicle(
            serializer
        )

        response_serializer = VehicleSerializer(
            vehicle
        )

        return Response(
            {
                "message": "Vehicle updated successfully.",
                "data": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):
        vehicle = get_object_or_404(
            Vehicle,
            pk=pk,
        )

        if not request.user.is_staff:
            return Response(
                {
                    "message": "Only administrators can delete vehicles."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        VehicleService.delete_vehicle(
            vehicle
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
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
    
