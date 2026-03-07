

from django.urls import path
from budgets.views import (
    BudgetListCreateView,
    BudgetDetailView,
    BudgetCheckView
)

urlpatterns = [
    path('', BudgetListCreateView.as_view()),
    path('<int:pk>/', BudgetDetailView.as_view()),
    path('check/', BudgetCheckView.as_view()),
]