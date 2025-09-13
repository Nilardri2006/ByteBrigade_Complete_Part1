# backend/api_views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import User, Skill
from .serializer import UserSerializer, SkillSerializer


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all().prefetch_related("my_skills", "known_skills", "desired_skills")
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Add pagination support
        skip = int(self.request.query_params.get('skip', 0))
        limit = int(self.request.query_params.get('limit', 100))
        return queryset[skip:skip + limit]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all().prefetch_related("my_skills", "known_skills", "desired_skills")
    serializer_class = UserSerializer


class UserUpdateSkillsView(APIView):
    """
    Update user skills (known_skills, desired_skills)
    """

    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get skill data from request
        known_skills = request.data.get('knownSkills', [])
        desired_skills = request.data.get('desiredSkills', [])

        # Update known_skills
        if known_skills is not None:
            user.known_skills.clear()
            user.my_skills.clear()  # Also clear for backward compatibility
            for skill_name in known_skills:
                if skill_name and skill_name.strip():
                    skill, _ = Skill.objects.get_or_create(
                        name=skill_name.strip().capitalize()
                    )
                    user.known_skills.add(skill)
                    user.my_skills.add(skill)

        # Update desired_skills
        if desired_skills is not None:
            user.desired_skills.clear()
            for skill_name in desired_skills:
                if skill_name and skill_name.strip():
                    skill, _ = Skill.objects.get_or_create(
                        name=skill_name.strip().capitalize()
                    )
                    user.desired_skills.add(skill)

        user.save()

        # Return updated user data
        serializer = UserSerializer(user)
        return Response(
            {
                "message": "Skills updated successfully",
                "user": serializer.data
            },
            status=status.HTTP_200_OK
        )

    def patch(self, request, user_id):
        """
        Partial update of user skills
        """
        return self.put(request, user_id)


class SkillListCreateView(generics.ListCreateAPIView):
    queryset = Skill.objects.all().order_by("name")
    serializer_class = SkillSerializer


class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class UserSearchView(APIView):
    """
    Search users based on skills and filters

    """

    def get(self, request):
        # Get query parameters
        skills_param = request.query_params.get('skills', '')
        include_beginner = request.query_params.get('include_beginner', 'true').lower() == 'true'
        team_size = request.query_params.get('team_size', '3')

        # Start with all users
        users = User.objects.all().prefetch_related("known_skills", "desired_skills", "my_skills")

        # Filter by skills if provided
        if skills_param:
            skill_list = [s.strip() for s in skills_param.split(',') if s.strip()]
            # Create Q objects for each skill search across multiple skill fields
            skill_queries = Q()
            for skill in skill_list:
                skill_queries |= (
                        Q(known_skills__name__icontains=skill) |
                        Q(my_skills__name__icontains=skill) |
                        Q(desired_skills__name__icontains=skill)
                )
            users = users.filter(skill_queries).distinct()

        # Filter by beginner preference
        if not include_beginner:
            users = users.filter(is_beginner=False)

        # Serialize and return
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserBySkillView(generics.ListAPIView):
    """
    Get users by a specific skill
    """
    serializer_class = UserSerializer

    def get_queryset(self):
        skill_name = self.request.query_params.get("skill", None)
        if skill_name:
            return User.objects.filter(
                Q(my_skills__name__icontains=skill_name.strip()) |
                Q(known_skills__name__icontains=skill_name.strip())
            ).distinct().prefetch_related("my_skills", "known_skills", "desired_skills")
        return User.objects.none()


class HealthCheckView(APIView):
    """
    Health check endpoint
    """

    def get(self, request):
        return Response({"status": "healthy"}, status=status.HTTP_200_OK)