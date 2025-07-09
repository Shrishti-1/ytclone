from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user


from rest_framework import serializers
from .models import Video

class VideoSerializer(serializers.ModelSerializer):
    is_in_watch_later = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'video_file', 'uploaded_at', 'is_in_watch_later']

    def get_is_in_watch_later(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.watch_later.filter(id=user.id).exists()
        return False


from rest_framework import serializers
from .models import LikeDislike

class LikeDislikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LikeDislike
        fields = ['id', 'user', 'video', 'is_like']


from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # shows username

    class Meta:
        model = Comment
        fields = ['id', 'user', 'video', 'content', 'created_at']
        read_only_fields = ['user', 'video', 'created_at']  # ✅ Add 'video' here


from rest_framework import serializers
from .models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'subscriber', 'channel', 'created_at']
        read_only_fields = ['subscriber', 'created_at']

