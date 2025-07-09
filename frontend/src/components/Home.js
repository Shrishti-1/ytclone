import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';

function Home() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async (query = '') => {
    try {
      const url = query ? `videos/?search=${query}` : 'videos/';
      const res = await axios.get(url);
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(searchTerm);
  };

  const toggleWatchLater = async (videoId) => {
    const token = localStorage.getItem('access');
  if (!token) {
    alert('Login required to toggle Watch Later');
    return;
  }

    try {
      await axios.post(`videos/${videoId}/toggle_watch_later/`,
        {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      );
  
      setVideos(prev =>
        prev.map(video =>
          video.id === videoId
            ? { ...video, is_in_watch_later: !video.is_in_watch_later }
            : video
        )
      );
    } catch (err) {
      console.error('Error toggling watch later:', err);
    }
  };
  

  return (
    <div>
      <h2 style={{ padding: '10px' }}>All Videos</h2>

      {/* ✅ Search Bar */}
      <form onSubmit={handleSearch} style={{ padding: '10px' }}>
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit">Search</button>
      </form>

      {videos.length === 0 ? (
        <p style={{ paddingLeft: '10px' }}>No videos uploaded yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', padding: '10px' }}>
          {videos.map(video => (
            <div key={video.id} style={{ margin: '1rem', width: '300px', border: '1px solid #ccc', padding: '10px' }}>
              <video width="300" controls src={video.video_file}></video>
              <h4>{video.title}</h4>
              <p>{video.description}</p>
              <Link to={`/video/${video.id}`}>Watch</Link>
              <br />
              <button
                onClick={() => {
                  console.log('Toggling watch later...', video.id);
                  toggleWatchLater(video.id);
                }}
                style={{ marginTop: '10px' }}
              >
                {video.is_in_watch_later ? 'Remove from Watch Later' : 'Add to Watch Later'}
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
