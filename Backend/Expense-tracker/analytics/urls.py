


from django.urls import path
from analytics.views import (
    MonthlySummaryView,
    CategoryWiseView,
    MonthlyTrendView
)

urlpatterns = [
    path('monthly-summary/', MonthlySummaryView.as_view()),
    path('category-wise/', CategoryWiseView.as_view()),
    path('monthly-trend/', MonthlyTrendView.as_view()),
]