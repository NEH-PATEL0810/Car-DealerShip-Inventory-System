from django.urls import path
from .views import VehicleAPIView

urlpatterns = [
    path(
        "",
        VehicleAPIView.as_view(),
        name="vehicles",
    ),
]