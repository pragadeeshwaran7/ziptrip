import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'todos.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper functions for reading and writing data
async function readTodos() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, create it with empty array
        if (error.code === 'ENOENT') {
            await writeTodos([]);
            return [];
        }
        console.error("Error reading todos database file:", error);
        return [];
    }
}

async function writeTodos(todos) {
    try {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing to todos database file:", error);
    }
}

let todosCache = null;

async function getTodos() {
    if (todosCache === null) {
        todosCache = await readTodos();
    }
    return todosCache;
}

async function saveTodos(todos) {
    todosCache = todos;
    await writeTodos(todos);
}

// Priority weight helper for sorting
const PRIORITY_WEIGHTS = {
    high: 3,
    medium: 2,
    low: 1
};

// =========================================================================
// API ENDPOINTS
// =========================================================================

// 1. GET /api/todos - Get all todos (with filtering, searching, and sorting)
app.get('/api/todos', async (req, res) => {
    try {
        let todos = await getTodos();
        const { q, status, priority, category, sortBy, sortOrder = 'asc' } = req.query;

        // A. Search by text (title or description)
        if (q) {
            const query = q.toLowerCase();
            todos = todos.filter(t => 
                t.title.toLowerCase().includes(query) || 
                (t.description && t.description.toLowerCase().includes(query))
            );
        }

        // B. Filter by status (completed / active)
        if (status && status !== 'all') {
            const isCompleted = status === 'completed';
            todos = todos.filter(t => t.completed === isCompleted);
        }

        // C. Filter by priority
        if (priority && priority !== 'all') {
            todos = todos.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
        }

        // D. Filter by category
        if (category && category !== 'all') {
            todos = todos.filter(t => t.category && t.category.toLowerCase() === category.toLowerCase());
        }

        // E. Sort results
        if (sortBy) {
            // Create a copy to sort to avoid mutating the cached array directly
            todos = [...todos];
            todos.sort((a, b) => {
                let comparison = 0;

                if (sortBy === 'dueDate') {
                    // Handle case where one or both have no due date
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    comparison = new Date(a.dueDate) - new Date(b.dueDate);
                } else if (sortBy === 'priority') {
                    const weightA = PRIORITY_WEIGHTS[a.priority.toLowerCase()] || 0;
                    const weightB = PRIORITY_WEIGHTS[b.priority.toLowerCase()] || 0;
                    comparison = weightB - weightA; // High priority first by default
                } else if (sortBy === 'createdAt') {
                    comparison = new Date(a.createdAt) - new Date(b.createdAt);
                } else if (sortBy === 'title') {
                    comparison = a.title.localeCompare(b.title);
                }

                return sortOrder === 'desc' ? -comparison : comparison;
            });
        }

        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve todos' });
    }
});

// 2. GET /api/todos/:id - Get a single todo by ID
app.get('/api/todos/:id', async (req, res) => {
    try {
        const todos = await getTodos();
        const todo = todos.find(t => t.id === req.params.id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve todo details' });
    }
});

// 3. POST /api/todos - Create a new todo
app.post('/api/todos', async (req, res) => {
    try {
        const { title, description, priority = 'medium', dueDate = '', category = 'General' } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }

        const todos = await getTodos();
        const now = new Date().toISOString();

        const newTodo = {
            id: uuidv4(),
            title: title.trim(),
            description: (description || '').trim(),
            completed: false,
            priority: priority.toLowerCase(),
            dueDate: dueDate,
            category: category.trim() || 'General',
            createdAt: now,
            updatedAt: now,
            subtasks: [],
            notes: []
        };

        todos.push(newTodo);
        await saveTodos(todos);

        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// 4. PUT /api/todos/:id - Update an existing todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const todos = await getTodos();
        const todoIndex = todos.findIndex(t => t.id === req.params.id);

        if (todoIndex === -1) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        const existingTodo = todos[todoIndex];
        const updates = req.body;

        // Build updated object
        const updatedTodo = {
            ...existingTodo,
            title: updates.title !== undefined ? updates.title.trim() : existingTodo.title,
            description: updates.description !== undefined ? updates.description.trim() : existingTodo.description,
            completed: updates.completed !== undefined ? Boolean(updates.completed) : existingTodo.completed,
            priority: updates.priority !== undefined ? updates.priority.toLowerCase() : existingTodo.priority,
            dueDate: updates.dueDate !== undefined ? updates.dueDate : existingTodo.dueDate,
            category: updates.category !== undefined ? updates.category.trim() : existingTodo.category,
            subtasks: updates.subtasks !== undefined ? updates.subtasks : existingTodo.subtasks,
            notes: updates.notes !== undefined ? updates.notes : existingTodo.notes,
            updatedAt: new Date().toISOString()
        };

        // Basic validation
        if (!updatedTodo.title || updatedTodo.title.trim() === '') {
            return res.status(400).json({ error: 'Title cannot be empty' });
        }

        todos[todoIndex] = updatedTodo;
        await saveTodos(todos);

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// 5. DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const todos = await getTodos();
        const todoIndex = todos.findIndex(t => t.id === req.params.id);

        if (todoIndex === -1) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todos.splice(todoIndex, 1);
        await saveTodos(todos);

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Backend server is running on port ${PORT}`);
    });
}

export default app;
