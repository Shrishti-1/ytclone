import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

function Dashboard() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        const res = await axios.get('videos/?my=1'); // ✅ fetch only user's videos
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyVideos();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Uploaded Videos</h2>
      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <div>
          {videos.map((video) => (
            <div key={video.id} style={{ marginBottom: '15px' }}>
              <h4>{video.title}</h4>
              <p>{video.description}</p>
              <video width="300" controls src={video.video}></video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
