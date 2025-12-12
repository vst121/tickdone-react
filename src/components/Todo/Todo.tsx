import { useState, useEffect } from 'react';


interface Todo {
    id: number;
    taskName: string;
    deadline: string | null;
    done: boolean;
}

function Todo() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [newDeadline, setNewDeadline] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/todos')
            .then(res => res.json())
            .then(data => {
            setTodos(data);
            setLoading(false);
            })
            .catch(err => {
            console.error('Error fetching todos:', err);
            setError('An unexpected error occurred while fetching the todos.');
            setTodos([]);
            setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        setError(null);

        const newTodoData = {
            taskName: newTask.trim(),
            deadline: newDeadline ? new Date(newDeadline).toISOString() : null,
        };

        try {
            const response = await fetch('/todos', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify(newTodoData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to create todo');
            return;
        }
        const createdTodo = await response.json();
        setTodos(prev => [...prev, createdTodo]);
        setNewTask('');
        setNewDeadline('');
        } catch (err) {
        console.error('Error creating todo:', err);
        setError('An unexpected error occurred while creating the todo.');
        }
    };



    if (loading) {
        return (
        <div className="todo-container">
            <div className="loading">Loading your todos...</div>
        </div>
        );
    }


    return (
        <>
            <div className="todo-container">
                <h1>Todos</h1>
                {error && <div className="error">{error}</div>}
                <h2>todos.Length</h2>

                <form onSubmit={handleSubmit} className="todo-form">
                <input
                    type="text"
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    placeholder="What needs to be done?"
                    required
                />
                <input
                    type="datetime-local"
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
                    title="Set a deadline"
                />
                <button type="submit">Add</button>
                </form>
            </div>
        </>
    );    
}

export default Todo;