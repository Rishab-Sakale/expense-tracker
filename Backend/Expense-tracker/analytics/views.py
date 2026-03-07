from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from expenses.models import Expense, Category
from django.db.models import Sum
from datetime import datetime

class MonthlySummaryView(APIView):

    def get(self, request):
        month = request.query_params.get('month', datetime.now().month)
        year = request.query_params.get('year', datetime.now().year)

        total = Expense.objects.filter(
            user=request.user,
            date__month=month,
            date__year=year
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        return Response({
            "month": month,
            "year": year,
            "total_spent": total
        }, status=status.HTTP_200_OK)


class CategoryWiseView(APIView):

    def get(self, request):
        month = request.query_params.get('month', datetime.now().month)
        year = request.query_params.get('year', datetime.now().year)

        categories = Category.objects.filter(user=request.user)
        result = []

        for category in categories:
            total = Expense.objects.filter(
                user=request.user,
                category=category,
                date__month=month,
                date__year=year
            ).aggregate(Sum('amount'))['amount__sum'] or 0

            if total > 0:
                result.append({
                    "category": category.name,
                    "total": total
                })

        return Response(result, status=status.HTTP_200_OK)


class MonthlyTrendView(APIView):

    def get(self, request):
        result = []
        now = datetime.now()

        for i in range(5, -1, -1):
            if now.month - i <= 0:
                month = now.month - i + 12
                year = now.year - 1
            else:
                month = now.month - i
                year = now.year

            total = Expense.objects.filter(
                user=request.user,
                date__month=month,
                date__year=year
            ).aggregate(Sum('amount'))['amount__sum'] or 0

            result.append({
                "month": datetime(year, month, 1).strftime("%b %Y"),
                "total": total
            })

        return Response(result, status=status.HTTP_200_OK)