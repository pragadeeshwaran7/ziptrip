import React, { useState, useEffect } from 'react';

function TodoDetailApp() {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing toggle state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [editCategory, setEditCategory] = useState('General');

  // Subtasks inputs
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Notes inputs
  const [newNoteContent, setNewNoteContent] = useState('');

  // Extract todo ID from URL query parameters
  const getTodoId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  };

  const todoId = getTodoId();

  const fetchTodoDetails = async () => {
    if (!todoId) {
      setError('No task ID was specified in the URL.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/todos/${todoId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('The requested task could not be found.');
        }
        throw new Error('Failed to retrieve task details.');
      }
      const data = await res.json();
      setTodo(data);
      
      // Initialize edit fields
      setEditTitle(data.title);
      setEditDescription(data.description || '');
      setEditPriority(data.priority);
      setEditDueDate(data.dueDate || '');
      setEditCategory(data.category || 'General');

      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoDetails();
  }, [todoId]);

  // Toggle todo status (completed / active)
  const handleToggleComplete = async () => {
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      });
      if (!res.ok) throw new Error('Failed to update task status');
      
      // Refresh local state
      const updated = await res.json();
      setTodo(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  // Save general edits
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          priority: editPriority,
          dueDate: editDueDate,
          category: editCategory
        })
      });
      if (!res.ok) throw new Error('Failed to save task edits');
      
      const updated = await res.json();
      setTodo(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete the entire todo
  const handleDeleteTodo = async () => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      
      // Redirect back to dashboard list page
      window.location.href = '/index.html';
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================================================================
  // SUBTASKS ACTIONS
  // =========================================================================

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSubtask = {
      id: 'sub-' + Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false
    };

    const updatedSubtasks = [...(todo.subtasks || []), newSubtask];

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: updatedSubtasks })
      });
      if (!res.ok) throw new Error('Failed to add subtask');
      
      const updated = await res.json();
      setTodo(updated);
      setNewSubtaskTitle('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    const updatedSubtasks = todo.subtasks.map(s => {
      if (s.id === subtaskId) {
        return { ...s, completed: !s.completed };
      }
      return s;
    });

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: updatedSubtasks })
      });
      if (!res.ok) throw new Error('Failed to toggle subtask status');
      
      const updated = await res.json();
      setTodo(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    const updatedSubtasks = todo.subtasks.filter(s => s.id !== subtaskId);

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: updatedSubtasks })
      });
      if (!res.ok) throw new Error('Failed to delete subtask');
      
      const updated = await res.json();
      setTodo(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================================================================
  // NOTES ACTIONS
  // =========================================================================

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newNote = {
      id: 'note-' + Date.now(),
      content: newNoteContent.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [newNote, ...(todo.notes || [])]; // Prepend new note

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      });
      if (!res.ok) throw new Error('Failed to save comment');
      
      const updated = await res.json();
      setTodo(updated);
      setNewNoteContent('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    const updatedNotes = todo.notes.filter(n => n.id !== noteId);

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      });
      if (!res.ok) throw new Error('Failed to delete note');
      
      const updated = await res.json();
      setTodo(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  // Format date readable
  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  // Loading & Error States Layout
  if (loading) {
    return (
      <div className="center-container">
        <div className="spinner"></div>
        <p>Retrieving task details...</p>
      </div>
    );
  }

  if (error && !todo) {
    return (
      <div className="center-container">
        <div className="error-card glassmorphic">
          <p className="emoji">⚠️</p>
          <h3>An Error Occurred</h3>
          <p>{error}</p>
          <a href="/index.html" className="btn btn-primary mt-4">↩ Back to Dashboard</a>
        </div>
      </div>
    );
  }

  if (!todo) return null;

  return (
    <div className="detail-app-container">
      {/* Page Header */}
      <header className="detail-header">
        <a href="/index.html" className="back-link">
          ← Back to Dashboard
        </a>
        <div className="detail-header-actions">
          <button 
            className={`btn ${todo.completed ? 'btn-secondary' : 'btn-success'}`}
            onClick={handleToggleComplete}
          >
            {todo.completed ? '↩ Mark Active' : '✓ Mark Complete'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Edit' : '✏️ Edit Task'}
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleDeleteTodo}
          >
            🗑️ Delete Task
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="detail-grid">
        {/* Left Column: Metadata & General Edit Form */}
        <section className="detail-left-column">
          {isEditing ? (
            <form onSubmit={handleSaveChanges} className="edit-form-full glassmorphic">
              <h3>Edit Task Configuration</h3>
              
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="form-control"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="form-control"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div className="form-group half">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category Tag</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="form-control"
                />
              </div>

              <button type="submit" className="btn btn-submit mt-3">Save All Updates</button>
            </form>
          ) : (
            <div className="task-show-card glassmorphic">
              <div className="priority-badge-row">
                <span className={`priority-indicator priority-${todo.priority}`}></span>
                <span className={`tag-pill tag-priority priority-${todo.priority}`}>{todo.priority} Priority</span>
                <span className="tag-pill tag-category">{todo.category}</span>
                {todo.completed && <span className="tag-pill tag-completed-badge">✓ Completed</span>}
              </div>

              <h1 className={`task-title-full ${todo.completed ? 'line-through' : ''}`}>
                {todo.title}
              </h1>

              {todo.description ? (
                <div className="task-desc-full">
                  <p>{todo.description}</p>
                </div>
              ) : (
                <p className="no-desc-msg">No description provided for this task.</p>
              )}

              <hr className="divider" />

              <table className="meta-table">
                <tbody>
                  {todo.dueDate && (
                    <tr>
                      <td className="meta-label">📅 Due Date</td>
                      <td className="meta-value">{todo.dueDate}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="meta-label">➕ Created At</td>
                    <td className="meta-value">{formatTimestamp(todo.createdAt)}</td>
                  </tr>
                  <tr>
                    <td className="meta-label">🔄 Last Modified</td>
                    <td className="meta-value">{formatTimestamp(todo.updatedAt)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Right Column: Subtasks & Notes */}
        <section className="detail-right-column">
          {/* Subtasks Section */}
          <div className="detail-section subtasks-section glassmorphic">
            <h2>📋 Subtasks Checklist</h2>
            
            <form onSubmit={handleAddSubtask} className="subtask-add-form">
              <input
                type="text"
                placeholder="Add a step to accomplish..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="form-control form-control-inline"
              />
              <button type="submit" className="btn btn-primary btn-inline">Add</button>
            </form>

            {todo.subtasks && todo.subtasks.length > 0 ? (
              <ul className="subtasks-list">
                {todo.subtasks.map(sub => (
                  <li key={sub.id} className={`subtask-item ${sub.completed ? 'completed' : ''}`}>
                    <label className="subtask-checkbox-label">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => handleToggleSubtask(sub.id)}
                        className="subtask-checkbox"
                      />
                      <span className="subtask-title">{sub.title}</span>
                    </label>
                    <button 
                      className="delete-sub-btn"
                      onClick={() => handleDeleteSubtask(sub.id)}
                      title="Remove step"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="section-empty-msg">No subtasks defined. Break this task into smaller steps!</p>
            )}
          </div>

          {/* Notes / Comments Section */}
          <div className="detail-section notes-section glassmorphic">
            <h2>📝 Discussion & Notes</h2>

            <form onSubmit={handleAddNote} className="note-add-form">
              <textarea
                placeholder="Write a status update, note, or comment..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="form-control"
                rows="3"
                required
              />
              <button type="submit" className="btn btn-primary mt-2">Add Note</button>
            </form>

            {todo.notes && todo.notes.length > 0 ? (
              <div className="notes-list">
                {todo.notes.map(note => (
                  <div key={note.id} className="note-item">
                    <div className="note-header">
                      <span className="note-date">🗓️ {formatTimestamp(note.createdAt)}</span>
                      <button 
                        className="delete-note-btn"
                        onClick={() => handleDeleteNote(note.id)}
                        title="Delete note"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <div className="note-body">
                      <p>{note.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="section-empty-msg">No notes added yet. Keep records or reminders here.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default TodoDetailApp;
