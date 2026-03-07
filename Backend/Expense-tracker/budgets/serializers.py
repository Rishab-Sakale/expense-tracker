

from rest_framework import serializers
from budgets.models import Budget

class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )

    class Meta:
        model = Budget
        fields = [
            'id',
            'category',
            'category_name',
            'amount',
            'month',
            'year',
            'created_at'
        ]
        read_only_fields = ['created_at']