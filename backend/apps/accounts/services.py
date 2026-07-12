# SERVICE LAYER FOR AUTHENTICATION-RELATED BUSINESS LOGUC

from django.contrib.auth import get_user_model

User = get_user_model()


class AuthenticationService:
    # handles authentication relatede business opeartions

    @staticmethod
    def register_user(serializer):
        # registers a new user using validated serializer data
        # reteurns User : newly created user instance

        return serializer.save()