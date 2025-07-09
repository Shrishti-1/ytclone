import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';

function WatchLater() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchWatchLaterVideos();
  }, []);

  const fetchWatchLaterVideos = async () => {
    try {
      const token = localStorage.getItem('access');
      const res = await axios.get('videos/', {
        headers: {
          Authorization: `Bearer ${token}`,  // ✅ Include token for authenticated info
        },
      });
  
      const watchLater = res.data.filter(video => video.is_in_watch_later);
      setVideos(watchLater);
    } catch (err) {
      console.error('Error fetching watch later videos:', err);
    }
  };
  

  const toggleWatchLater = async (videoId) => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Login required to toggle Watch Later');
      return;
    }
    console.log('Toggling Watch Later for video ID:', videoId);
  
    try {
      await axios.post(
        `videos/${videoId}/toggle_watch_later/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchWatchLaterVideos();
       
  } catch (err) {
    console.error('Error toggling watch later:', err);
  }
};
  

  return (
    <div>
      <h2 style={{ padding: '10px' }}>Watch Later</h2>
      {videos.length === 0 ? (
        <p style={{ paddingLeft: '10px' }}>No videos in watch later.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', padding: '10px' }}>
          {videos.map((video) => (
            <div key={video.id} style={{ margin: '1rem', width: '300px', border: '1px solid #ccc', padding: '10px' }}>
              <video width="300" controls src={video.video_file}></video>
              <h4>{video.title}</h4>
              <p>{video.description}</p>
              <Link to={`/video/${video.id}`}>Watch</Link>
              <br />
              <button onClick={() => toggleWatchLater(video.id)} style={{ marginTop: '10px' }}>
                Remove from Watch Later
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchLater;
