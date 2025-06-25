import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../pages/TaskDetails.css';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/tasks/${id}`)
      .then((res) => setTask(res.data))
      .catch(() => alert('Failed to load task details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading task...</p>;

  if (!task) {
    return (
      <div className="task-details-container">
        <h2>Task Not Found</h2>
        <p className="error-message">We couldn’t load the task details. The task may not exist or something went wrong.</p>
        <Link to="/" className="back-link">← Back to Task List</Link>
      </div>
    );
  }

  const dueDateTime = task.dueDate
    ? new Date(task.dueDate).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'No due date';

  return (
    <div className="task-details-container">
      <h2>Task Details</h2>
      <div className="task-card">
        <h3>{task.title}</h3>
        <p><strong>Description:</strong> {task.description || 'No description'}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Priority:</strong> {task.priority || 'Normal'}</p>
        <p><strong>Due Date & Time:</strong> {dueDateTime}</p>
      </div>

      <Link to="/" className="back-link">← Back to Task List</Link>
    </div>
  );
};

export default TaskDetails;
