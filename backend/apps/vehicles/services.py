# Business logic for Vehicle operations

from django.db.models import Q
from .models import Vehicle
from django.shortcuts import get_object_or_404

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
    

    @staticmethod
    def update_vehicle(serializer):
        # Update an existing vehicle.
        return serializer.save()
    
    @staticmethod
    def delete_vehicle(vehicle):
        vehicle.delete()

    @staticmethod
    def purchase_vehicle(vehicle):
        if vehicle.quantity<=0:
            raise ValueError("Vehicle is out of stock.")
        
        vehicle.quantity -=1
        vehicle.save()

        return vehicle

    @staticmethod
    def restock_vehicle(vehicle,quantity):
        # Increase vehicle inventory

        if quantity <=0 :
            raise ValueError(
                "Restock quantity must be greater than zero."
            )

        vehicle.quantity += quantity
        vehicle.save()
        return vehicle

    