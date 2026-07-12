# Business logic for Vehicle operations

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