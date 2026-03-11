const API_BASE = '/api/todos';

export const todoApi = {
  async getAll() {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  async create(text) {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },

  async toggle(id, completed) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!response.ok) throw new Error('Failed to toggle todo');
    return response.json();
  },
};