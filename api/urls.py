from django.urls import path
from .views import (
    RegisterView, 
    VideoListCreateView, 
    VideoDetailView, 
    ToggleWatchLaterView,
    LikeDislikeToggleView, 
    LikeDislikeCountView,
    VideoCommentListCreateView,
    ToggleSubscriptionView,
    SubscriptionStatusView, 
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Videos
    path('videos/', VideoListCreateView.as_view(), name='video-list-create'),
    path('videos/<int:pk>/', VideoDetailView.as_view(), name='video-detail'),
    path('videos/<int:pk>/toggle_watch_later/', ToggleWatchLaterView.as_view(), name='toggle-watch-later'),


    # Likes/Dislikes
    path('videos/<int:video_id>/like-toggle/', LikeDislikeToggleView.as_view(), name='like-toggle'),
    path('videos/<int:video_id>/like-count/', LikeDislikeCountView.as_view(), name='like-count'),

    # Comments
    path('videos/<int:pk>/comments/', VideoCommentListCreateView.as_view(), name='video-comments'),

    # Subscriptions
    path('subscribe/<int:channel_id>/', ToggleSubscriptionView.as_view(), name='toggle-subscription'),
    path('subscriptions/<int:channel_id>/status/', SubscriptionStatusView.as_view(), name='subscription-status'),  # ✅ Add this
]
