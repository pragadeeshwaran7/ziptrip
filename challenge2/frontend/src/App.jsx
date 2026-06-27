import React, { useState, useEffect } from 'react';

const CATEGORIES = ['General', 'Design', 'Backend', 'Documentation', 'Frontend', 'Marketing'];

function App() {
  const [todos, setTodos] = useState([]);
  const [allCategories, setAllCategories] = useState(CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering / Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // New Todo State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('General');
  const [showAddForm, setShowAddForm] = useState(false);

  // Inline Editing State
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [editCategory, setEditCategory] = useState('General');

  // Fetch todos from backend
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filterStatus) params.append('status', filterStatus);
      if (filterPriority) params.append('priority', filterPriority);
      if (filterCategory) params.append('category', filterCategory);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const res = await fetch(`/api/todos?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to retrieve tasks');
      const data = await res.json();
      setTodos(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not connect to backend server. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Run search/filter/sort queries when their values change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTodos();
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filterStatus, filterPriority, filterCategory, sortBy, sortOrder]);

  // Load all unique categories on mount to populate sidebar filter
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/todos');
        if (res.ok) {
          const allData = await res.json();
          const uniqueCats = Array.from(new Set([
            ...CATEGORIES,
            ...allData.map(t => t.category).filter(Boolean)
          ]));
          setAllCategories(uniqueCats);
        }
      } catch (err) {
        console.error("Could not fetch categories list", err);
      }
    };
    loadCategories();
  }, [todos]);

  // Create a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, dueDate, category })
      });

      if (!res.ok) throw new Error('Failed to create task');
      
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setCategory('General');
      setShowAddForm(false);
      
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle todo status (completed / active)
  const handleToggleComplete = async (todo) => {
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      });
      if (!res.ok) throw new Error('Failed to update task status');
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // Start inline editing
  const startEdit = (todo) => {
    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate || '');
    setEditCategory(todo.category || 'General');
  };

  // Cancel inline editing
  const cancelEdit = () => {
    setEditingTodoId(null);
  };

  // Submit inline editing changes
  const handleUpdateTodo = async (id) => {
    if (!editTitle.trim()) return;
    try {
      const res = await fetch(`/api/todos/${id}`, {
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
      if (!res.ok) throw new Error('Failed to update task');
      setEditingTodoId(null);
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // Quick stats calculation
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const isOverdue = (todo) => {
    if (todo.completed || !todo.dueDate) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(todo.dueDate);
    due.setHours(0,0,0,0);
    return due < today;
  };

  return (
    <div className="app-container">
      {/* 1. SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-section">
          <span className="logo-icon">🚀</span>
          <h2>InfinityTodo</h2>
        </div>

        {/* Dashboard Stats */}
        <div className="stats-panel">
          <h3>Progress</h3>
          <div className="progress-container">
            <svg className="progress-ring" width="120" height="120">
              <circle className="progress-ring-bg" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" r="50" cx="60" cy="60" />
              <circle
                className="progress-ring-bar"
                stroke="url(#gradient-accent)"
                strokeWidth="8"
                fill="transparent"
                r="50"
                cx="60"
                cy="60"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - completionPercentage / 100)}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="progress-label">
              <span className="percentage">{completionPercentage}%</span>
              <span className="label">Done</span>
            </div>
          </div>
          <div className="stats-breakdown">
            <div className="stat-item">
              <span className="stat-val">{totalTasks}</span>
              <span className="stat-lbl">Total Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-val text-neon-blue">{activeTasks}</span>
              <span className="stat-lbl">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-val text-neon-pink">{completedTasks}</span>
              <span className="stat-lbl">Completed</span>
            </div>
          </div>
        </div>

        {/* Sidebar Filters */}
        <div className="sidebar-filters">
          <h3>Categories</h3>
          <div className="category-list">
            <button
              className={`cat-btn ${filterCategory === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              📂 All Categories
            </button>
            {allCategories.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${filterCategory === cat.toLowerCase() ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat.toLowerCase())}
              >
                🏷️ {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="main-content">
        <header className="main-header">
          <div className="search-bar-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search tasks or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Close Form' : '➕ Add New Task'}
          </button>
        </header>

        {/* Quick-add Todo Form */}
        {showAddForm && (
          <form className="add-todo-form glassmorphic" onSubmit={handleAddTodo}>
            <h3>Create a New Task</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Add a detailed description... (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
                rows="2"
              />
            </div>
            <div className="form-row">
              <div className="form-group half">
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
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
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group half">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g. Design, Personal"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                  list="categories-datalist"
                />
                <datalist id="categories-datalist">
                  {allCategories.map(cat => <option key={cat} value={cat} />)}
                </datalist>
              </div>
              <div className="form-group half align-bottom">
                <button type="submit" className="btn btn-submit">Save Task</button>
              </div>
            </div>
          </form>
        )}

        {/* Filter / Sort Control Bar */}
        <section className="filter-controls-bar">
          <div className="filter-status-group">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
              onClick={() => setFilterStatus('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </button>
          </div>

          <div className="sort-group">
            <label htmlFor="priority-filter-select">Priority:</label>
            <select
              id="priority-filter-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="select-control"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <label htmlFor="sort-by-select">Sort by:</label>
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-control"
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Alphabetical</option>
            </select>

            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? 'Ascending Order' : 'Descending Order'}
            >
              {sortOrder === 'asc' ? '▲' : '▼'}
            </button>
          </div>
        </section>

        {/* Task List Section */}
        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state-card glassmorphic">
            <p className="emoji">🎉</p>
            <h3>No tasks found</h3>
            <p>Try refining your search, clearing your filters, or creating a new task!</p>
          </div>
        ) : (
          <div className="todo-list">
            {todos.map(todo => {
              const isEditing = editingTodoId === todo.id;
              
              if (isEditing) {
                return (
                  <div key={todo.id} className="todo-card editing-card glassmorphic">
                    <div className="edit-form-body">
                      <div className="form-group">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="form-control"
                          rows="2"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group third">
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            className="form-control"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div className="form-group third">
                          <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group third">
                          <input
                            type="text"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="edit-actions">
                        <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdateTodo(todo.id)}>Save Changes</button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={todo.id} className={`todo-card glassmorphic ${todo.completed ? 'completed' : ''}`}>
                  <div className="card-left-accent">
                    <button
                      className={`status-checkbox priority-${todo.priority} ${todo.completed ? 'checked' : ''}`}
                      onClick={() => handleToggleComplete(todo)}
                      title={todo.completed ? "Mark Incomplete" : "Mark Complete"}
                    >
                      {todo.completed && '✓'}
                    </button>
                  </div>
                  
                  <div className="card-main-content">
                    <div className="card-header-row">
                      <h3 className="todo-title">{todo.title}</h3>
                      <div className="tag-group">
                        <span className="tag-pill tag-category">{todo.category}</span>
                        <span className={`tag-pill tag-priority priority-${todo.priority}`}>
                          {todo.priority}
                        </span>
                        {todo.dueDate && (
                          <span className={`tag-pill tag-date ${isOverdue(todo) ? 'overdue' : ''}`}>
                            📅 {todo.dueDate} {isOverdue(todo) && '(Overdue)'}
                          </span>
                        )}
                      </div>
                    </div>
                    {todo.description && (
                      <p className="todo-description">{todo.description}</p>
                    )}

                    <div className="card-subtasks-preview">
                      {todo.subtasks && todo.subtasks.length > 0 && (
                        <span className="subtasks-count">
                          📋 {todo.subtasks.filter(s => s.completed).length}/{todo.subtasks.length} subtasks
                        </span>
                      )}
                      {todo.notes && todo.notes.length > 0 && (
                        <span className="notes-count">
                          📝 {todo.notes.length} note{todo.notes.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-actions">
                    <a
                      href={`/todo.html?id=${todo.id}`}
                      className="action-btn-link"
                      title="View full details"
                    >
                      👁️ Details
                    </a>
                    <button
                      className="action-btn"
                      onClick={() => startEdit(todo)}
                      title="Quick edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="action-btn text-danger"
                      onClick={() => handleDeleteTodo(todo.id)}
                      title="Delete task"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
