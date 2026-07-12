from django.utils.translation import trim_whitespace
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class RegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer responsible for validation and creation of a new user furing registration
    """
    email = serializers.EmailField(
    required=True,
    allow_blank=False,
    )
    password = serializers.CharField(
        write_only=True,
        # min_length=8,
        validators=[validate_password],
        style={"input_type":"password"},
    )

    class Meta:
        model = User
        fields = ("username","email","password")

    
    # def validate_username(self,value):
    #     """
    #     Ensuring uniqueness of an username
    #     """

    #     if User.objects.filter(username=value).exists():
    #         raise serializers.ValidationError(
    #             "Username already exists."
    #         )
    #     return value
    
    def validate_email(self,value):
        """
        Ensuring uniqueness of an email
        """
        value = value.lower().strip()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )
        return value
    
    def create(self,validated_data):
        """
        Create user with hashed password.
        """

        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


class LoginSerializer(serializers.Serializer):
    # RESPONSIBLE FOR VALIDATING USER LOGIN REQUESTS

    username = serializers.CharField(required=True,allow_blank=False,trim_whitespace=True)

    password= serializers.CharField(
        required = True,
        write_only=True,
        allow_blank=False,
        style={"input_type","password"},
    )
        
