'use client';

import { useRef, useState, useEffect } from 'react';

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '' });
  const [editId, setEditId] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();

    const updatedTasks = await Promise.all(
      data.map(async (task) => {
        if (task.imageUrl) {
          try {
            const res = await fetch(`/api/image-url?key=${task.imageUrl}`);
            const { url } = await res.json();
            return { ...task, imageUrl: url, originalImageKey: task.imageUrl };
          } catch {
            return task;
          }
        }
        return task;
      })
    );

    setTasks(updatedTasks);
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      alert('Image upload failed.');
      return null;
    }

    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title) {
      alert('📌 Title cannot be empty!');
      return;
    }

    const isDuplicate = tasks.some(
      (task) => task.title.toLowerCase() === title.toLowerCase() && task._id !== editId
    );
    if (isDuplicate) {
      alert('⚠️ Task with this title already exists!');
      return;
    }

    let imageUrl = form.imageUrl;
    if (file) {
      const uploaded = await uploadImage();
      if (!uploaded) return;
      imageUrl = uploaded;
    }

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/tasks/${editId}` : '/api/tasks';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, imageUrl }),
    });

    setForm({ title: '', description: '', imageUrl: '' });
    setEditId(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      imageUrl: task.originalImageKey || '',
    });
    setEditId(task._id);
  };

  return (
    <>
      <main className="max-w-2xl mx-auto p-4 mt-10 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-sky-700">📝 Task Manager</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8 border p-4 rounded-md bg-gray-50">
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-neutral-600"
            placeholder="📝 Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            rows={3}
            className="w-full p-2 border rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 text-neutral-600"
            placeholder="📄 Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <label className="block text-sm font-medium text-gray-700">📷 Upload Image</label>
          <div className="flex items-start gap-4">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:border-gray-300 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <div className="flex flex-col items-start gap-2">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded border"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 max-w-[120px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setForm({ ...form, imageUrl: '' });
                      if (fileInputRef.current) {
                        fileInputRef.current.value = null;
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-lg"
                    title="Remove selected image"
                  >
                    ❌
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editId ? '🔁 Update' : '➕ Add'} Task
          </button>
        </form>

        <ul className="space-y-4">
          {tasks.length === 0 && <p className="text-gray-500 text-center">No tasks yet 😢</p>}
          {tasks.map((task) => (
            <li
              key={task._id}
              className="p-4 border rounded shadow-sm bg-gray-100 flex justify-between items-start"
            >
              <div className="flex-1">
                <h2 className="text-indigo-600 font-semibold">{task.title.toUpperCase()}</h2>
                <p className="text-sm text-gray-600">{task.description}</p>
                {task.imageUrl && (
                  <img
                    src={task.imageUrl}
                    alt={task.title}
                    className="mt-2 w-40 h-auto rounded border"
                  />
                )}
              </div>
              <div className="flex flex-col space-y-1 pl-2">
                <button
                  onClick={async () => {
                    if (task.originalImageKey) {
                      try {
                        const res = await fetch(`/api/image-url?key=${task.originalImageKey}`);
                        const { url } = await res.json();
                        setViewTask({ ...task, imageUrl: url });
                      } catch {
                        setViewTask(task);
                      }
                    } else {
                      setViewTask(task);
                    }
                  }}
                  className="text-green-600 hover:underline"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Delete
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
            <p className="text-gray-700">{viewTask.description}</p>
            {viewTask.imageUrl && (
              <img
                src={viewTask.imageUrl}
                alt="View"
                className="mt-4 w-full h-auto rounded border"
              />
            )}
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
