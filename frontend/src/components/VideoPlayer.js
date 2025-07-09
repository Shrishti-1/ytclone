import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useParams } from 'react-router-dom';

function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [watchLaterStatus, setWatchLaterStatus] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);


  useEffect(() => {
    axios.get(`videos/${id}/`)
      .then(res => {
        setVideo(res.data);
        fetchCounts(res.data.id);
      })
      .catch(err => {
        console.error('Error fetching video:', err);
      });
  }, [id]);

  useEffect(() => {
    if (video) {
      fetchComments(video.id);
      checkSubscription(video.user);
    }
  }, [video]);
  
  
  
  const checkSubscription = async (channelId) => {
    const token = localStorage.getItem('access');
    if (!token) return;
  
    try {
      const res = await axios.get(`/subscriptions/${channelId}/status/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsSubscribed(res.data.subscribed);
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  };
  

  // ✅ This function fetches comments
  const fetchComments = async (videoId) => {
    try {
      const res = await axios.get(`/videos/${videoId}/comments/`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  // ✅ This function handles posting new comments
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Login required to comment');
      return;
    }

    try {
      await axios.post(
        `/videos/${video.id}/comments/`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments(video.id);
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("Error posting comment");
    }
  };


  const fetchCounts = async (videoId) => {
    try {
      const res = await axios.get(`videos/${videoId}/like-count/`)

      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error('Error fetching like counts:', err);
    }
  };

  const handleLike = async (is_like) => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Please login to like/dislike');
      return;
    }

    try {
      await axios.post(
        `videos/${video.id}/like-toggle/`,      
        { is_like },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCounts(video.id);
    } catch (err) {
      console.error('Error toggling like/dislike:', err);
    }
  };

  const handleWatchLater = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Login required to add to Watch Later');
      return;
    }

    try {
      const res = await axios.post(
        `videos/${video.id}/toggle-watch-later/`,
      
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.status);  // 'added to watch later' or 'removed from watch later'
      setWatchLaterStatus(res.data.status);
    } catch (err) {
      console.error("Watch later error:", err.response?.data || err.message);
      alert("Failed to toggle Watch Later");
    }
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Login required to subscribe');
      return;
    }
  
    try {
      const res = await axios.post(
        `subscribe/${video.user}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.status);
      setIsSubscribed(res.data.status === "Subscribed");
    } catch (err) {
      console.error("Subscribe error:", err);
      alert("Failed to subscribe/unsubscribe");
    }
  };
  

  if (!video) return <p>Loading...</p>;

  return (
    <div>
      <h2>{video.title}</h2>
      <video width="640" height="360" controls>
        <source src={video.video_file} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>{video.description}</p>

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => handleLike(true)}>👍 {likes}</button>
        <button onClick={() => handleLike(false)}>👎 {dislikes}</button>
        <button onClick={handleWatchLater} style={{ marginLeft: '10px' }}>
          ➕ Watch Later
        </button>
        <button onClick={handleSubscribe} style={{ marginLeft: '10px' }}>
          🔔 {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>

      </div>

      <hr />
      <h3>Comments</h3>

      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
          style={{ width: '100%', marginBottom: '10px' }}
          placeholder="Write a comment..."
          required
        />
        <button type="submit">Post</button>
      </form>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} style={{ marginTop: '10px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
            <strong>{comment.user}</strong> • <small>{new Date(comment.created_at).toLocaleString()}</small>
            <p>{comment.content}</p>
          </div>
        ))
      )}

    </div>
  );
}

export default VideoPlayer;
