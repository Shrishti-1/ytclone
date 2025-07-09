from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework import generics, permissions, filters
from .models import Video
from .serializers import VideoSerializer

class VideoListCreateView(generics.ListCreateAPIView):
    queryset = Video.objects.all().order_by('-uploaded_at')
    serializer_class = VideoSerializer
    filter_backends = [filters.SearchFilter]  
    search_fields = ['title', 'description'] 

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return []

    def get_serializer_context(self):
        return {'request': self.request}




from rest_framework import generics
from .models import Video
from .serializers import VideoSerializer

class VideoDetailView(generics.RetrieveAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

def get_serializer_context(self):
    return {'request': self.request}


from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from .models import Video
from .serializers import VideoSerializer

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-uploaded_at')
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_watch_later(self, request, pk=None):
        video = self.get_object()
        user = request.user

        if video.watch_later.filter(id=user.id).exists():
            video.watch_later.remove(user)
            return Response({'status': 'removed from watch later'})
        else:
            video.watch_later.add(user)
            return Response({'status': 'added to watch later'})


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Video

class ToggleWatchLaterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            video = Video.objects.get(pk=pk)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if video.watch_later.filter(id=user.id).exists():
            video.watch_later.remove(user)
            return Response({"status": "removed from watch later"})
        else:
            video.watch_later.add(user)
            return Response({"status": "added to watch later"})



from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import LikeDislike, Video
from .serializers import LikeDislikeSerializer

class LikeDislikeToggleView(generics.GenericAPIView):
    serializer_class = LikeDislikeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, video_id):
        is_like = request.data.get('is_like')  # True or False
        video = Video.objects.get(id=video_id)
        user = request.user

        obj, created = LikeDislike.objects.update_or_create(
            user=user,
            video=video,
            defaults={'is_like': is_like}
        )
        return Response({'message': 'Updated like/dislike'}, status=status.HTTP_200_OK)

class LikeDislikeCountView(generics.GenericAPIView):
    def get(self, request, video_id):
        likes = LikeDislike.objects.filter(video_id=video_id, is_like=True).count()
        dislikes = LikeDislike.objects.filter(video_id=video_id, is_like=False).count()
        return Response({'likes': likes, 'dislikes': dislikes})


from rest_framework.permissions import AllowAny

class RegisterView(APIView):
    permission_classes = [AllowAny]  # 🔓 Allow public access

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import generics, permissions
from .models import Comment
from .serializers import CommentSerializer

class VideoCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        video_id = self.kwargs['pk']
        return Comment.objects.filter(video__id=video_id).order_by('-created_at')

    def perform_create(self, serializer):
        video_id = self.kwargs['pk']
        serializer.save(user=self.request.user, video_id=video_id)



from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subscription, User

class ToggleSubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, channel_id):
        subscriber = request.user
        try:
            channel = User.objects.get(id=channel_id)
        except User.DoesNotExist:
            return Response({"error": "Channel not found"}, status=status.HTTP_404_NOT_FOUND)

        if subscriber == channel:
            return Response({"error": "You cannot subscribe to yourself"}, status=status.HTTP_400_BAD_REQUEST)

        sub, created = Subscription.objects.get_or_create(subscriber=subscriber, channel=channel)
        if not created:
            sub.delete()
            return Response({"status": "Unsubscribed"})
        return Response({"status": "Subscribed"})


# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Subscription
from django.contrib.auth.models import User

class ToggleSubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, channel_id):
        user = request.user
        try:
            channel = User.objects.get(id=channel_id)
        except User.DoesNotExist:
            return Response({'error': 'Channel not found'}, status=status.HTTP_404_NOT_FOUND)

        if Subscription.objects.filter(subscriber=user, channel=channel).exists():
            Subscription.objects.filter(subscriber=user, channel=channel).delete()
            return Response({'status': 'Unsubscribed'})
        else:
            Subscription.objects.create(subscriber=user, channel=channel)
            return Response({'status': 'Subscribed'})

class SubscriptionStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, channel_id):
        user = request.user
        is_subscribed = Subscription.objects.filter(subscriber=user, channel_id=channel_id).exists()
        return Response({'subscribed': is_subscribed})
