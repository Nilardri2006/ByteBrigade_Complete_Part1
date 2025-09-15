

from rest_framework import serializers
from .models import User, Skill, HackathonExperience


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name"]


class HackathonExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HackathonExperience
        fields = ["id", "organizer_name", "hackathon_name", "description", "achievements", "created_at"]
        read_only_fields = ["id", "created_at"]


class UserSerializer(serializers.ModelSerializer):
    # Authentication fields
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, required=False, min_length=6)

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

    # Hackathon experiences
    hackathon_experiences = HackathonExperienceSerializer(many=True, read_only=True)
    hackathonExperiences = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=False
    )

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
            "id", "username", "password", "name", "college_name", "year", "email",
            "gender", "skills", "my_skills",
            "linkedin_url", "github_url", "is_beginner",
            "known_skills", "desired_skills", "hackathon_experiences", "created_at", "updated_at",
            # write-only fields for frontend compatibility
            "knownSkills", "desiredSkills", "linkedin", "github", "isBeginner", "hackathonExperiences"
        ]
        extra_kwargs = {
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True}
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set required fields based on operation type
        if self.instance is None:  # Creating new user
            self.fields['username'].required = True
            self.fields['password'].required = True
        else:  # Updating existing user
            self.fields['username'].required = False
            self.fields['password'].required = False

    def validate_username(self, value):
        # Check if username already exists during creation
        if self.instance is None:  # Creating new user
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        # Allow same email for same user during updates
        if self.instance is None:  # Creating new user
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("A user with this email already exists.")
        else:  # Updating existing user
            # Allow same email for the same user, but check for other users
            existing_user = User.objects.filter(email=value).exclude(id=self.instance.id).first()
            if existing_user:
                raise serializers.ValidationError("Another user with this email already exists.")
        return value

    def create(self, validated_data):
        # Extract password
        password = validated_data.pop('password')

        # Handle different skill input formats
        skills_text = validated_data.pop("skills", "")
        known_skills_list = validated_data.pop("knownSkills", [])
        desired_skills_list = validated_data.pop("desiredSkills", [])
        hackathon_experiences_list = validated_data.pop("hackathonExperiences", [])

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

        # Create user
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

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
                user.my_skills.add(skill)

        # Handle desired skills
        for skill_name in desired_skills_list:
            if skill_name.strip():
                skill, _ = Skill.objects.get_or_create(name=skill_name.strip().capitalize())
                user.desired_skills.add(skill)

        # Handle hackathon experiences
        for exp_data in hackathon_experiences_list:
            if exp_data.get('hackathon_name') and exp_data.get('organizer_name'):
                HackathonExperience.objects.create(
                    user=user,
                    organizer_name=exp_data.get('organizer_name', ''),
                    hackathon_name=exp_data.get('hackathon_name', ''),
                    description=exp_data.get('description', ''),
                    achievements=exp_data.get('achievements', '')
                )

        return user

    def update(self, instance, validated_data):
        # Don't allow username/password changes in update
        validated_data.pop('username', None)
        validated_data.pop('password', None)

        # Handle skill input formats for updates
        known_skills_list = validated_data.pop("knownSkills", None)
        desired_skills_list = validated_data.pop("desiredSkills", None)
        hackathon_experiences_list = validated_data.pop("hackathonExperiences", None)

        # Handle social links
        linkedin = validated_data.pop("linkedin", None)
        github = validated_data.pop("github", None)
        is_beginner = validated_data.pop("isBeginner", None)

        # Handle college name and year
        college_name = validated_data.pop("college", None)
        year = validated_data.pop("year", None)

        # Update fields from the frontend
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.gender = validated_data.get('gender', instance.gender)

        # Handle social links
        if linkedin is not None:
            instance.linkedin_url = linkedin
        if github is not None:
            instance.github_url = github
        if is_beginner is not None:
            instance.is_beginner = is_beginner

        # Handle college and year
        if college_name is not None:
            instance.college_name = college_name
        if year is not None:
            instance.year = year

        instance.save()

        # Update skills if provided
        if known_skills_list is not None:
            instance.known_skills.clear()
            instance.my_skills.clear()
            for skill_name in known_skills_list:
                if skill_name.strip():
                    skill, _ = Skill.objects.get_or_create(name=skill_name.strip().capitalize())
                    instance.known_skills.add(skill)
                    instance.my_skills.add(skill)

        if desired_skills_list is not None:
            instance.desired_skills.clear()
            for skill_name in desired_skills_list:
                if skill_name.strip():
                    skill, _ = Skill.objects.get_or_create(name=skill_name.strip().capitalize())
                    instance.desired_skills.add(skill)

        # Update hackathon experiences if provided
        if hackathon_experiences_list is not None:
            # Clear existing experiences
            instance.hackathon_experiences.all().delete()

            # Add new experiences
            for exp_data in hackathon_experiences_list:
                if exp_data.get('hackathon_name') and exp_data.get('organizer_name'):
                    HackathonExperience.objects.create(
                        user=instance,
                        organizer_name=exp_data.get('organizer_name', ''),
                        hackathon_name=exp_data.get('hackathon_name', ''),
                        description=exp_data.get('description', ''),
                        achievements=exp_data.get('achievements', '')
                    )

        return instance
