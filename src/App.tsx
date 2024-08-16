import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

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

      const response = await fetch(minecraftLauncherApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'applicaiton/json',
        },
      });
    
      if (!response.ok) {
        throw new Error ('Network response was not ok');
      }
      const data: Response = await response.json();
      setMessage(data.body);
    } catch (error){
      console.error('Error:', error);
      setMessage('An error occurred while triggering the lambda function');
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
