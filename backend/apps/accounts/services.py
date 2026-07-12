# SERVICE LAYER FOR AUTHENTICATION-RELATED BUSINESS LOGUC

from django.contrib.auth import authenticate,get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
User = get_user_model()


class AuthenticationService:
    # handles authentication relatede business opeartions

    @staticmethod
    def register_user(serializer):
        # registers a new user using validated serializer data
        # reteurns User : newly created user instance

        return serializer.save()
    

    @staticmethod
    def login_user(username:str,password:str):
        user = authenticate(
            username=username,
            password=password,
        )

        if user is None:
            raise AuthenticationFailed("Invalid username or password.")
        
        refresh = RefreshToken.for_user(user)

        return{
            "user":user,
            "refresh":str(refresh),
            "access":str(refresh.access_token),
        }