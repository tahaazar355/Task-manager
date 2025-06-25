import { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/TaskForm.css';

const TaskForm = ({ onTaskAdded, existingTask, clearEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title || '');
      setDescription(existingTask.description || '');
      setStatus(existingTask.status || 'Pending');
      setDueDate(existingTask.dueDate ? existingTask.dueDate.slice(0, 16) : '');
    }
  }, [existingTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('Pending');
    setDueDate('');
    if (clearEdit) clearEdit();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const taskData = { title, description, status, dueDate };

    if (existingTask && existingTask._id) {
      // Update task
      axios
        .put(`http://localhost:5000/tasks/${existingTask._id}`, taskData)
        .then(() => {
          alert('✅ Task updated!');
          onTaskAdded();
          resetForm();
        })
        .catch((err) => {
          console.error('Update error:', err);
          alert('❌ Update failed!');
        });
    } else {
      // Create new task
      axios
        .post('http://localhost:5000/tasks', taskData)
        .then(() => {
          alert('✅ Task added!');
          onTaskAdded();
          resetForm();
        })
        .catch((err) => {
          console.error('Create error:', err);
          alert('❌ Failed to add task!');
        });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>{existingTask ? 'Edit Task' : 'Add New Task'}</h3>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />

      <button type="submit">
        {existingTask ? 'Update Task' : 'Add Task'}
      </button>

      {existingTask && (
        <button type="button" onClick={resetForm}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default TaskForm;
