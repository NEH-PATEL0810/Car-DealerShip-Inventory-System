from django.urls import path
from .views import (
    VehicleAPIView,
    VehicleSearchAPIView,
    PurchaseVehicleAPIView,
    RestockVehicleAPIView,
    UserPurchasesAPIView,
    AllPurchasesAPIView
)

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
        "purchases/",
        UserPurchasesAPIView.as_view(),
        name="user-purchases",
    ),
    path(
        "purchases/all/",
        AllPurchasesAPIView.as_view(),
        name="all-purchases",
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

