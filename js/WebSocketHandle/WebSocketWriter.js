import MessageType from "./MessageType.js"

class WebSocketWriter
  {
  constructor(writer)
    {
    this.writer = writer;
    this.clientUid = "";
    }

  SetClientUid(uid) { this.clientUid = uid;}

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
