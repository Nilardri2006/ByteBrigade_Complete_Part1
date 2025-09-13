# backend/urls.py

from django.urls import path
from . import api_views

urlpatterns = [
    # Users
    path("users/", api_views.UserListCreateView.as_view(), name="user-list-create"),
    path("users/<int:pk>/", api_views.UserDetailView.as_view(), name="user-detail"),
    path("users/<int:user_id>/skills/", api_views.UserUpdateSkillsView.as_view(), name="user-update-skills"),

    # Skills
    path("skills/", api_views.SkillListCreateView.as_view(), name="skill-list-create"),
    path("skills/<int:pk>/", api_views.SkillDetailView.as_view(), name="skill-detail"),

    # Search
    path("search/users/", api_views.UserSearchView.as_view(), name="user-search"),
    path("users/by-skill/", api_views.UserBySkillView.as_view(), name="user-by-skill"),

    # Health check
    path("health/", api_views.HealthCheckView.as_view(), name="health-check"),
]