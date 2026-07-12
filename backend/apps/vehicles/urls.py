from django.urls import path
from .views import VehicleAPIView, VehicleSearchAPIView,PurchaseVehicleAPIView,RestockVehicleAPIView

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
    path(
        "<uuid:pk>/",
        VehicleAPIView.as_view(),
        name="vehicle-detail",
    ),
    path(
    "<uuid:pk>/purchase/",
    PurchaseVehicleAPIView.as_view(),
    name="vehicle-purchase",
),
path(
    "<uuid:pk>/restock/",
    RestockVehicleAPIView.as_view(),
    name="vehicle-restock",
),
]

