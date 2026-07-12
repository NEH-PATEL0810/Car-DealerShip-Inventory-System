# Business logic for Vehicle operations

from django.db.models import Q
from .models import Vehicle

class VehicleService:
    # Service layer

    @staticmethod
    def create_vehicle(serializer):
        # Cretes a new vehicle using validated serializer data.
        # Returns newly created vehicle
        # Arguments conssis of a validated serializer(vehicle) instance
        return serializer.save()
    
    @staticmethod
    def get_all_vehicles():
        # Return all vehicles.
        

        return Vehicle.objects.all()

    @staticmethod
    def search_vehicles(filters):
     
        # Search vehicles using optional filters.
        

        queryset = Vehicle.objects.all()

        make = filters.get("make")
        model = filters.get("model")
        category = filters.get("category")
        min_price = filters.get("min_price")
        max_price = filters.get("max_price")

        if make:
            queryset = queryset.filter(
                make__icontains=make
            )

        if model:
            queryset = queryset.filter(
                model__icontains=model
            )

        if category:
            queryset = queryset.filter(
                category__iexact=category
            )

        if min_price:
            queryset = queryset.filter(
                price__gte=min_price
            )

        if max_price:
            queryset = queryset.filter(
                price__lte=max_price
            )

        return queryset