

from django.urls import path
from expenses.views import ( CategoryListCreateView,CategoryDeleteView, ExpenseListCreateView, ExpenseDetailView
)

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view()),
    path('categories/<int:pk>/', CategoryDeleteView.as_view()),
    path('', ExpenseListCreateView.as_view()),
    path('<int:pk>/', ExpenseDetailView.as_view()),
]