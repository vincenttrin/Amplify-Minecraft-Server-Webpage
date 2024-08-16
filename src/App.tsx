import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import axios from 'axios';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);
  
  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }
  
  const startMinecraftServer = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const minecraftLauncherApi = 'https://p23vmmnxqh.execute-api.us-east-1.amazonaws.com/default/minecraft-launcher'

      const response = await axios.post<APIResponse>(minecraftLauncherApi);

      setMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage('An error occured while triggering the lambda function');
        console.error('Error:', error);
      } else {
        setMessage('An unexpected error occurred.');
        console.error('Unexpected error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <button onClick={startMinecraftServer} disabled={isLoading}>
        {isLoading ? 'Starting the server...' : 'Start the Server'}
      </button>
      {message && <p>{message}</p>}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
