let clientId = '';

export async function OpenWebSocket(websocketCallback, webSocketURL = "ws://localhost:5000/" ) 
  {
  console.log("Connecting Web Socket");
  let websocket = new WebSocketStream(webSocketURL);

  const { readable, writable, extensions, protocol } = await websocket.opened;

  const reader = readable.getReader();
  const writer = writable.getWriter();

  let listen = async () => 
    {
    while (true) 
     {
      const { value, done } = await reader.read();
      websocketCallback(value);
      if (done) 
        {
        break;
        }
      }
    }

  listen();
  window.addEventListener("unload", function () 
    {
    if(websocket.readyState == WebSocket.OPEN)
        websocket.close();
    });
  return(writer);
  }

export default { OpenWebSocket };
