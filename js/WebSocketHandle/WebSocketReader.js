import MessageType from "./MessageType.js"

class WebSocketReader
  {
  constructor(yoyo,connectionCallback)
    {
    this.yoyo = yoyo;
    this.connectionCallback = connectionCallback;
    }

  HandleWebSocketResponse(inputJson)
    {
    let value = JSON.parse(inputJson);

    let messageJson;
    switch(value.MessageType)
      {
        case MessageType.connectionResponse:
          this.yoyo.UpdateState("clientUid", value.ClientUid);
          this.connectionCallback(value.ClientUid);
          break;
        case MessageType.clientMessage:
          messageJson = JSON.parse(value.Message);
          this.ReadClientMessage(messageJson);
          break;
        case MessageType.returnDataRequest:
          messageJson = JSON.parse(value.Message);
          this.ReadDataRequest(messageJson);
          break;
      }
    }

  ReadDataRequest(message)
    {
    let target = "";
    switch(message.Type)
      {
      case(0):
        target = "gameList";
        break;
      case(1):
        target = "playerList";
        break;
      }

    this.yoyo.UpdateState(target, message.Data == '[]' ? [] : message.Data);
    }

  ReadClientMessage(message)
    {
    let currentMessages = this.yoyo.GetStateValue("chatMessages");

    if(currentMessages.length >= 10)
      {
      currentMessages.shift();
      }
    currentMessages.push(message);
    this.yoyo.UpdateState("chatMessages",currentMessages);
    }
  }

export default  WebSocketReader;
