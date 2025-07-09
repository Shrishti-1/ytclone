import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) return alert("Please choose a video!");

    const formData = new FormData();
    formData.append('video_file', video);
    formData.append('title', title);
    formData.append('description', description);

    try {
      await axios.post('videos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Upload successful!');
      navigate('/');
    } catch (err) {
      alert('Upload failed. Are you logged in?');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="file" accept="video/*" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;
