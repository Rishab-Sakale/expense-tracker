

from rest_framework import serializers
from expenses.models import Category, Expense

class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = ["id", "name", "created_at"]
        read_only_fields = ["created_at"]

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name", 
        read_only=True
    )

    class Meta:
        model = Expense
        fields = [
            "id",
            "category",
            "category_name",
            "amount",
            "note",       
            "date",
            "created_at"
        ]
        read_only_fields = ["created_at"]