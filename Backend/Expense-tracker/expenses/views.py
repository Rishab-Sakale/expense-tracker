from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from expenses.models import Category, Expense
from expenses.serializers import CategorySerializer, ExpenseSerializer

class CategoryListCreateView(APIView):

    def get(self, request):
        categories = Category.objects.filter(user=request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDeleteView(APIView):

    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk, user=request.user)
            category.delete()
            return Response({"message": "Category deleted!"}, status=status.HTTP_200_OK)
        except Category.DoesNotExist:
            return Response({"message": "Category not found!"}, status=status.HTTP_404_NOT_FOUND)


class ExpenseListCreateView(APIView):

    def get(self, request):
        expenses = Expense.objects.filter(user=request.user)
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpenseDetailView(APIView):

    def get(self, request, pk):
        try:
            expense = Expense.objects.get(pk=pk, user=request.user)
            serializer = ExpenseSerializer(expense)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Expense.DoesNotExist:
            return Response({"message": "Expense not found!"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            expense = Expense.objects.get(pk=pk, user=request.user)
            serializer = ExpenseSerializer(expense, data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Expense.DoesNotExist:
            return Response({"message": "Expense not found!"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            expense = Expense.objects.get(pk=pk, user=request.user)
            expense.delete()
            return Response({"message": "Expense deleted!"}, status=status.HTTP_200_OK)
        except Expense.DoesNotExist:
            return Response({"message": "Expense not found!"}, status=status.HTTP_404_NOT_FOUND)