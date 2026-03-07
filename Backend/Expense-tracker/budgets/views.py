from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from budgets.models import Budget
from budgets.serializers import BudgetSerializer
from expenses.models import Expense
from django.db.models import Sum

class BudgetListCreateView(APIView):

    def get(self, request):
        budgets = Budget.objects.filter(user=request.user)
        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BudgetDetailView(APIView):

    def put(self, request, pk):
        try:
            budget = Budget.objects.get(pk=pk, user=request.user)
            serializer = BudgetSerializer(budget, data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Budget.DoesNotExist:
            return Response({"message": "Budget not found!"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            budget = Budget.objects.get(pk=pk, user=request.user)
            budget.delete()
            return Response({"message": "Budget deleted!"}, status=status.HTTP_200_OK)
        except Budget.DoesNotExist:
            return Response({"message": "Budget not found!"}, status=status.HTTP_404_NOT_FOUND)


class BudgetCheckView(APIView):

    def get(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        budgets = Budget.objects.filter(
            user=request.user,
            month=month,
            year=year
        )
        result = []
        for budget in budgets:
            total_spent = Expense.objects.filter(
                user=request.user,
                category=budget.category,
                date__month=month,
                date__year=year
            ).aggregate(Sum('amount'))['amount__sum'] or 0

            result.append({
                "category": budget.category.name,
                "budget": budget.amount,
                "spent": total_spent,
                "remaining": budget.amount - total_spent,
                "exceeded": total_spent > budget.amount
            })
        return Response(result, status=status.HTTP_200_OK)