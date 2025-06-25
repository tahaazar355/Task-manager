import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import { Link } from 'react-router-dom';
import '../pages/Home.css';

const Home = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchTasks = () => {
    axios
      .get('http://localhost:5000/tasks')
      .then((res) => setTasks(res.data))
      .catch((err) => {
        console.error(err);
        setError('❌ Unable to fetch tasks. Please make sure the backend is running.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogoutClick = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      onLogout();
    }, 1000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      axios
        .delete(`http://localhost:5000/tasks/${id}`)
        .then(() => {
          alert('✅ Task deleted!');
          fetchTasks();
        })
        .catch(() => {
          alert('❌ Delete failed!');
        });
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput.trim().toLowerCase());
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const clearEdit = () => setEditTask(null);

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query ? <mark key={i}>{part}</mark> : part
    );
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery) ||
    task.description.toLowerCase().includes(searchQuery)
  );

  const completedCount = tasks.filter(task => task.status === 'Completed').length;
  const inProgressCount = tasks.filter(task => task.status === 'In Progress').length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  let progressColor = '#4caf50';
  if (inProgressCount > 0 && completedCount < total) {
    progressColor = '#f0ad4e';
  }

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home-container" style={{ position: 'relative' }}>
      {/* 👍 Logout Button */}
      <button
        onClick={handleLogoutClick}
        disabled={isLoggingOut}
        className={`logout-btn ${isLoggingOut ? 'logging-out' : ''}`}
        title="Logout"
      >
        {isLoggingOut ? '👍' : 'Logout'}
      </button>

      <h2>Task List</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="🔍 Search tasks by title or description"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
          style={{ flex: 1 }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${progress}%`,
            backgroundColor: progressColor,
            color: 'white',
            padding: '5px',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          {progress}% Completed
        </div>
      </div>

      <TaskForm
        onTaskAdded={fetchTasks}
        existingTask={editTask}
        clearEdit={clearEdit}
      />

      {filteredTasks.length === 0 ? (
        <p className="no-tasks">🔎 No tasks matched your search.</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task._id} className="task-item">
              <h3>{highlightMatch(task.title, searchQuery)}</h3>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Due Date:</strong> {formatDate(task.dueDate)}</p>
              <Link to={`/tasks/${task._id}`}>
                <button className="view-btn">View Details</button>
              </Link>
              <div className="task-actions">
                <button onClick={() => setEditTask(task)}>Edit</button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
