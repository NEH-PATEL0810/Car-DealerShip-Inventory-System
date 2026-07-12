# Business logic for Vehicle operations

from .models import Vehicle

class VehicleService:
    """
    Service layer providing business logic for vehicle operations.
    """

    @staticmethod
    def create_vehicle(serializer):
        """
        Create a new vehicle using validated serializer data.
        """
        return serializer.save()
    
    @staticmethod
    def get_all_vehicles():
        """
        Retrieve all vehicles in the inventory.
        """
        return Vehicle.objects.all()

    @staticmethod
    def search_vehicles(filters):
        """
        Search vehicles based on optional filters (make, model, category, price range).
        """
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
        """
        Update an existing vehicle using validated serializer data.
        """
        return serializer.save()
    
    @staticmethod
    def delete_vehicle(vehicle):
        """
        Delete a vehicle from the inventory.
        """
        vehicle.delete()

    @staticmethod
    def purchase_vehicle(vehicle, user):
        """
        Purchase a vehicle by decreasing its inventory quantity by one.
        """
        if vehicle.quantity <= 0:
            raise ValueError("Vehicle is out of stock.")
        
        vehicle.quantity -= 1
        vehicle.save()

        from vehicles.models import Purchase
        Purchase.objects.create(
            user=user,
            vehicle=vehicle,
            price_paid=vehicle.price,
        )

        return vehicle

    @staticmethod
    def restock_vehicle(vehicle, quantity):
        """
        Increase the inventory quantity of a vehicle by a specified amount.
        """
        if quantity <= 0:
            raise ValueError(
                "Restock quantity must be greater than zero."
            )

        vehicle.quantity += quantity
        vehicle.save()
        return vehicle

    