import { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Spinner, Tabs, Tab } from 'react-bootstrap';
import { todoApi } from './api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getAll();
      setTodos(data);
      setError('');
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const created = await todoApi.create(newTodo.trim());
      setTodos([created, ...todos]);
      setNewTodo('');
      setError('');
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const updated = await todoApi.toggle(id, !completed);
      setTodos(todos.map(todo => todo.id === id ? updated : todo));
      setError('');
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  const TodoItem = ({ todo }) => (
    <ListGroup.Item
      className="d-flex align-items-center justify-content-between"
      action
      onClick={() => handleToggle(todo.id, todo.completed)}
      style={{ cursor: 'pointer' }}
    >
      <span
        style={{
          textDecoration: todo.completed ? 'line-through' : 'none',
          color: todo.completed ? '#6c757d' : 'inherit',
        }}
      >
        {todo.text}
      </span>
      <Form.Check
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => {
          e.stopPropagation();
          handleToggle(todo.id, todo.completed);
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </ListGroup.Item>
  );

  return (
    <Container className="py-4" style={{ maxWidth: '600px' }}>
      <h1 className="text-center mb-4">To-Do List</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Add a new to-do..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            size="lg"
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-100"
          disabled={!newTodo.trim()}
        >
          Add To-Do
        </Button>
      </Form>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          fill
        >
          <Tab eventKey="active" title={`Active (${activeTodos.length})`}>
            {activeTodos.length === 0 ? (
              <p className="text-center text-muted py-4">
                No active to-dos. Add one above!
              </p>
            ) : (
              <ListGroup>
                {activeTodos.map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </ListGroup>
            )}
          </Tab>
          <Tab eventKey="completed" title={`Completed History (${completedTodos.length})`}>
            {completedTodos.length === 0 ? (
              <p className="text-center text-muted py-4">
                No completed to-dos yet.
              </p>
            ) : (
              <ListGroup>
                {completedTodos.map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </ListGroup>
            )}
          </Tab>
        </Tabs>
      )}
    </Container>
  );
}

export default App;