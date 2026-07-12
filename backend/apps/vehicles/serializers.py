from rest_framework import serializers
from .models import Vehicle, Purchase
class VehicleSerializer(serializers.ModelSerializer):
    # Serializer for creating and updating vehicles

    make = serializers.CharField(
        error_messages={
            "required": "Vehicle make is required.",
            "blank": "Vehicle make cannot be empty.",
        }
    )
    model = serializers.CharField(
        error_messages={
            "required": "Vehicle model is required.",
            "blank": "Vehicle model cannot be empty.",
        }
    )
    category = serializers.ChoiceField(
        choices=Vehicle.CATEGORY_CHOICES,
        error_messages={
            "required": "Vehicle category is required.",
            "invalid_choice": "Invalid vehicle category choice.",
        }
    )

    class Meta:
        model = Vehicle

        fields=(
            "id",
            "make",
            "model",
            "category",
            "price",
            "quantity",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )

    def validate_price(self,value):
        # Ensure price is greater than zero.
        if value <=0 :
            raise serializers.ValidationError("Price must be greater than zero.")
        
        return value
    
    def validate_quantity(self,value):
        # Ensure quantity is non-negative
        if value<0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        
        return value


class PurchaseSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Purchase
        fields = (
            "id",
            "username",
            "vehicle",
            "price_paid",
            "purchased_at",
        )