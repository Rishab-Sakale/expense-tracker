from rest_framework import serializers
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Budget
        fields = ['id', 'category', 'category_name', 'amount', 'month', 'year', 'created_at']
        read_only_fields = ['created_at']
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=Budget.objects.all(),
                fields=['category', 'month', 'year'],
                message="A budget for this category and period already exists."
            )
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0!")
        return round(value, 2)

    def validate_month(self, value):
        if value < 1 or value > 12:
            raise serializers.ValidationError("Month must be between 1 and 12!")
        return value

    def validate_year(self, value):
        if value < 2000 or value > 2100:
            raise serializers.ValidationError("Please enter a valid year!")
        return value