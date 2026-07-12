from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import VehicleSerializer, PurchaseSerializer
from .services import VehicleService
from .models import Vehicle, Purchase

class VehicleAPIView(APIView):
    """
    APIView for managing vehicle collection and individual instances.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        List all vehicles.
        """
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
        """
        Create a new vehicle.
        """
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
        """
        Update an existing vehicle details.
        """
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
        """
        Delete a vehicle. Only accessible by administrators (staff users).
        """
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
    """
    APIView for searching vehicles using query parameters.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Search vehicles with filters applied.
        """
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


class PurchaseVehicleAPIView(APIView):
    """
    APIView for purchasing a vehicle, which decrements its stock.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """
        Decrease the stock of a vehicle by 1.
        """
        vehicle = get_object_or_404(
            Vehicle,
            pk=pk,
        )

        try:
            vehicle = VehicleService.purchase_vehicle(
                vehicle,
                request.user,
            )
        except ValueError as e:
            return Response(
                {
                    "message": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = VehicleSerializer(vehicle)

        return Response(
            {
                "message": "Vehicle purchased successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class RestockVehicleAPIView(APIView):
    """
    APIView for restocking vehicle quantities. Only accessible by administrators.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """
        Increase the vehicle quantity.
        """
        if not request.user.is_staff:
            return Response(
                {
                    "message": "Only administrators can restock vehicles."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        vehicle = get_object_or_404(
            Vehicle,
            pk=pk,
        )

        quantity = request.data.get("quantity")
        if quantity is None:
            return Response(
                {
                    "message": "Quantity is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(quantity)
            vehicle = VehicleService.restock_vehicle(
                vehicle,
                quantity,
            )
        except ValueError as e:
            return Response(
                {
                    "message": str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = VehicleSerializer(
            vehicle
        )

        return Response(
            {
                "message": "Vehicle restocked successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class UserPurchasesAPIView(APIView):
    """
    APIView to list purchases made by the logged-in user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        purchases = Purchase.objects.filter(user=request.user)
        serializer = PurchaseSerializer(purchases, many=True)
        return Response(
            {
                "message": "Purchased vehicles retrieved successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class AllPurchasesAPIView(APIView):
    """
    APIView to list all dealership purchases (accessible only to administrators).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(
                {
                    "message": "Only administrators can view all purchases."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        purchases = Purchase.objects.all()
        serializer = PurchaseSerializer(purchases, many=True)
        return Response(
            {
                "message": "All dealership purchases retrieved successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )