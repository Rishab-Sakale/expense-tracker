from django.shortcuts import render

from rest_framework.views import APIView
from accounts.serializers import RegisterSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        s_obj = RegisterSerializer(data=request.data)
        if s_obj.is_valid():
            user = s_obj.save()

            return Response({
                "message": "Registration successful!",
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(s_obj.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Login successful!",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response({
            "message": "Invalid username or password!"
        }, status=status.HTTP_401_UNAUTHORIZED)