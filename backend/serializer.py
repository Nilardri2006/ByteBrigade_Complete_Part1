# backend/serializers.py
from rest_framework import serializers
from .models import User, Skill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name"]


class UserSerializer(serializers.ModelSerializer):
    # For backward compatibility with existing fields
    skills = serializers.CharField(write_only=True, required=False)
    my_skills = SkillSerializer(many=True, read_only=True)

    # For frontend compatibility
    knownSkills = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    desiredSkills = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    known_skills = SkillSerializer(many=True, read_only=True)
    desired_skills = SkillSerializer(many=True, read_only=True)

    # Social links for frontend compatibility
    linkedin = serializers.URLField(write_only=True, required=False, allow_blank=True)
    github = serializers.URLField(write_only=True, required=False, allow_blank=True)

    # Read-only social links
    linkedin_url = serializers.URLField(read_only=True)
    github_url = serializers.URLField(read_only=True)

    # Beginner field
    isBeginner = serializers.BooleanField(write_only=True, required=False)
    is_beginner = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "name", "college_name", "year", "email",
            "gender", "skills", "my_skills",
            "linkedin_url", "github_url", "is_beginner",
            "known_skills", "desired_skills", "created_at", "updated_at",
            # read-only for web-view ~24-08-25
            "knownSkills", "desiredSkills", "linkedin", "github", "isBeginner"
        ]
        extra_kwargs = {

            'created_at': {'read_only': True},
            'updated_at': {'read_only': True}
        }

    def create(self, validated_data):
        # Handle different skill input formats
        skills_text = validated_data.pop("skills", "")
        known_skills_list = validated_data.pop("knownSkills", [])
        desired_skills_list = validated_data.pop("desiredSkills", [])

        # Handle social links
        linkedin = validated_data.pop("linkedin", None)
        github = validated_data.pop("github", None)
        is_beginner = validated_data.pop("isBeginner", False)

        # Handle college name and year
        college_name = validated_data.pop("college", None)
        year = validated_data.pop("year", None)

        if linkedin:
            validated_data["linkedin_url"] = linkedin
        if github:
            validated_data["github_url"] = github
        validated_data["is_beginner"] = is_beginner

        if college_name:
            validated_data["college_name"] = college_name
        if year:
            validated_data["year"] = year

        user = User.objects.create(**validated_data)

        # Handle backward compatibility skills
        if skills_text:
            skills_list = [s.strip().lower() for s in skills_text.split(",") if s.strip()]
            for skill_name in skills_list:
                skill, _ = Skill.objects.get_or_create(name=skill_name.capitalize())
                user.my_skills.add(skill)

        # Handle known skills
        for skill_name in known_skills_list:
            if skill_name.strip():
                skill, _ = Skill.objects.get_or_create(name=skill_name.strip().capitalize())
                user.known_skills.add(skill)
                user.my_skills.add(skill)  # Also add to my_skills for backward compatibility

        # Handle desired skills
        for skill_name in desired_skills_list:
            if skill_name.strip():
                skill, _ = Skill.objects.get_or_create(name=skill_name.strip().capitalize())
                user.desired_skills.add(skill)

        return user

    def update(self, instance, validated_data):
        # Update fields from the frontend
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.college_name = validated_data.get('college_name', instance.college_name)
        instance.year = validated_data.get('year', instance.year)
        instance.linkedin_url = validated_data.get('linkedin', instance.linkedin_url)
        instance.github_url = validated_data.get('github', instance.github_url)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.is_beginner = validated_data.get('isBeginner', instance.is_beginner)

        instance.save()

        # Update skills
        known_skills_list = self.context.get("knownSkills")
        if known_skills_list is not None:
            instance.known_skills.clear()
            for skill_name in known_skills_list:
                if skill_name.strip():
                    skill, _ = Skill.objects.get_or_create(name=skill_name.strip().capitalize())
                    instance.known_skills.add(skill)

        desired_skills_list = self.context.get("desiredSkills")
        if desired_skills_list is not None:
            instance.desired_skills.clear()
            for skill_name in desired_skills_list:
                if skill_name.strip():
                    skill, _ = Skill.objects.get_or_create(name=skill_name.strip().capitalize())
                    instance.desired_skills.add(skill)

        return instance