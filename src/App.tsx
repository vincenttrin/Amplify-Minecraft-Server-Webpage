import { useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
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
      setMessage(data.statusText);
    } catch (error){
      console.error('Error:', error);
      setMessage('An error occurred while triggering the lambda function');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>ip address: mc-server-nlb-15cf4a07a5c7beb3.elb.us-east-2.amazonaws.com</h1>
      <button onClick={startMinecraftServer} disabled={isLoading}>
        {isLoading ? 'Starting the server...' : 'Start the Server'}
      </button>
      {message && <p>{message}</p>}
    </main>
  );
}

export default App;
