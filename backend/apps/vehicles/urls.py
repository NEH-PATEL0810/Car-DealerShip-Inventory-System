from django.urls import path
from .views import VehicleAPIView,VehicleSearchAPIView

urlpatterns = [
    path(
        "",
        VehicleAPIView.as_view(),
        name="vehicles",
    ),
    path(
        "search/",
        VehicleSearchAPIView.as_view(),
        name="vehicle-search",
    ),
]