import MessageType from "./MessageType.js"

class WebSocketWriter
  {
  constructor()
    {
    this.writer = null;
    this.clientUid = "";
    }

  SetClientUid(uid) 
    { 
    this.clientUid = uid;
    this.SendName("Admin");
    }

  SendMessageToServer(input)
    {
    this.writer.write(JSON.stringify(input));
    }

  CreateSocketMessage(MessageType) { return {
    ClientUid : this.clientUid,
    GameUid : "",
    MessageType : MessageType,
    Message : ""
    };
  }

  SetWriter(writer)
    {
    this.writer = writer;
    }

  SendName(name)
    {
    let request = this.CreateSocketMessage(MessageType.clientSetName);
    request.Message = name;
    this.SendMessageToServer(request); 
    }

  SendChatMessage(message)
    {
    let request = this.CreateSocketMessage(MessageType.clientMessage);
    request.Message = JSON.stringify({Sender:'Server', Text:message })
    this.SendMessageToServer(request);
    }

  RequestCurrentGameList()
    {
    let request = this.CreateSocketMessage(MessageType.getDataRequest);
    request.Message = "ActiveGames";
    this.SendMessageToServer(request);
    }

  RequestCurrentPlayerList()
    {
    let request = this.CreateSocketMessage(MessageType.getDataRequest);
    request.Message = "ActivePlayers";
    this.SendMessageToServer(request);
    }
  }

export default WebSocketWriter;
