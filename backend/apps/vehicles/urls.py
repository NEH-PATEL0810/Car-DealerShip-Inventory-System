from django.urls import path
from .views import VehicleCreateAPIView

urlpatterns = [
    path(
        "",
        VehicleCreateAPIView.as_view(),
        name="vehicle-create",
    ),
]