let clientId = '';

export async function OpenWebSocket(websocketCallback, disconnectedCallback,
  connectedCallback, webSocketURL = "ws://localhost:5000/" ) 
  {
  console.log("Connecting Web Socket");

  let reader;
  let writer;
  let websocket;

  //Define listen and reconnect here so we can keep the function calls in scope.
  //Might want to move them out into their own scopes if perfomance is an issue,
  //Or if we feel it's cleaner once we're sure this isn't going to change much.
  let listen = async () => 
    {
    try
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
    catch(error)
      {
      console.log(error);
      disconnectedCallback();
      await reconnect(websocketCallback,connectedCallback,webSocketURL);
      }
    }
  //See note above about closures in this guy.
  let reconnect = async (websocketCallback, connectedCallback, webSocketURL) =>
    {
    if(websocket != null)
      {
      websocket.close();
      }
    await new Promise(resolve => setTimeout(resolve, 5000));
    OpenWebSocket(websocketCallback, disconnectedCallback,connectedCallback, webSocketURL);
    }
  
  //Actual work of this function
  try
    {
    let websocket = new WebSocketStream(webSocketURL);
    const { readable, writable, extensions, protocol } = await websocket.opened;

    reader = readable.getReader();
    writer = writable.getWriter();
  
    window.addEventListener("unload", function () 
      {
      if(websocket.readyState == WebSocket.OPEN)
          {
          websocket.close();
          }
      });

    connectedCallback(writer);
    listen();
    }
  catch(error)
    {
    console.log(error);
    disconnectedCallback();
    await reconnect(websocketCallback,connectedCallback,webSocketURL);
    }
  }

export default { OpenWebSocket };
