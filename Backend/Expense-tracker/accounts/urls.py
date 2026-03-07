
from accounts.views import RegisterView , LoginView
from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/",RegisterView.as_view()),
    path("login/",LoginView.as_view()),
    path("token/refresh/",TokenRefreshView.as_view()),
]