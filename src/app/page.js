'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [viewTask, setViewTask] = useState(null);


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const title = form.title.trim();
    const description = form.description.trim();
    
    if (!title) {
      alert('Title cannot be empty!');
      return;
    }

  
    const isDuplicate = tasks.some(task => 
      task.title.toLowerCase() === title.toLowerCase() && 
      task._id !== editId  
    );

    if (isDuplicate) {
      alert('Task with this title already exists!');
      return;
    }

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/tasks/${editId}` : '/api/tasks';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    
    setForm({ title: '', description: '' });
    setEditId(null);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setForm({ title: task.title, description: task.description });
    setEditId(task._id);
  };


  return (
  <>
    <main className="max-w-2xl mx-auto p-4 mt-10 bg-white rounded shadow-md">
    <h1>CHECKING THE GITHUB ACTIONS WORKFLOWS</h1>
      <h1 className="text-3xl font-bold mb-6 text-center text-sky-700">📝 Task Manager</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-8 border p-4 rounded-md bg-gray-50"
      >
        <input
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-neutral-600"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
          <textarea
            rows={3}
            className="w-full p-2 border rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 text-neutral-600"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editId ? 'Update' : 'Add'} Task
        </button>
      </form>

      <ul className="space-y-4">
        {tasks.length === 0 && <p className="text-gray-500 text-center">No tasks yet</p>}
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-4 border rounded shadow-sm bg-gray-100 flex justify-between items-center"
          >
            <div>
              <h2 className="text-indigo-600 font-semibold">{task.title.toUpperCase()}</h2>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewTask(task)}
                className="text-green-600 hover:underline"
              >
                View
              </button>
              <button
                onClick={() => handleEdit(task)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>

    {viewTask && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">{viewTask.title}</h2>
          <p className="text-gray-700 ">{viewTask.description}</p>
          <button
            onClick={() => setViewTask(null)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </>
);
}