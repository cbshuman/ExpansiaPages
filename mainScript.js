import yoyo from "./js/YoyoFramework/yoyo.js";
import requests from "./js/ServerCommunication/request.js";
import ServerRequests from "./js/ServerCommunication/ServerRequests.js"
import websocket from "./js/ServerCommunication/websockets.js";
import webSocketReader from "./js/WebSocketHandle/WebSocketReader.js";
import WebSocketWriter from "./js/WebSocketHandle/WebSocketWriter.js";
import actions from './YoyoData/YoyoActions/actions.js';

let defaultState = 
  [
    { key: 'clientUid', value: null },
    { key: 'serverName', value: "Server"},
    { key: 'playerList', value: [] },
    { key: 'gameList', value: [] },
    { key: 'chatMessages', value: new Array(10).fill(null)},
    { key: 'outGoingChat', value: '' },
    { key: 'dataEditorOption', value: 'faction' },

    { key: 'factionEdit', value: { Uid : '', Name : '', StartingUnits:[] } },
    { key: 'unitEdit', value: { Uid : '', Name : '' } },
    
    { key: 'dataEntries', value: 
      {
      factionData: 
        { 
          selectedFaction: null, factions:[]
        }, 
      units:[] 
      }
    },
  ]

let dataEditorTriggers = 
  [
    {
      path: "factionEdit.Uid",
      trigger: function() 
        {
        let currentFaction = this.state.dataEntries.factionData.factions.find(x => x.Uid == this.state.factionEdit.Uid);
        if(!currentFaction)
          {
          currentFaction = {Uid : '', Name: '', StartingUnits: []};
          }
        this.UpdateState("factionEdit", currentFaction);
        }
    }
  ];



let yoyoApp = new yoyo(defaultState, actions);

let yoyoPages = 
  [
    { 
      path: "YoyoData/YoyoPages/home.html", 
      triggers : [], 
      yoyoPath : "/home" 
    },
    { 
      path: "YoyoData/YoyoPages/dataEditor.html",
      triggers : dataEditorTriggers,
      yoyoPath : "/dataEditor" 
    }
  ];

let yoyoComponents = 
  [
    { path: "YoyoData/YoyoComponents/header.html", name : "header" },
    { path: "YoyoData/YoyoComponents/chat.html", name : "serverchat" },
  ];


let socketWriter;
let socketReader = new webSocketReader(yoyoApp, () => 
  {
  socketWriter.SetClientUid(yoyoApp.GetStateValue("clientUid"));
  socketWriter.RequestCurrentGameList();
  socketWriter.RequestCurrentPlayerList();
  });

console.log(yoyoApp);

socketReader.yoyo = yoyoApp;

requests.serverAddress = "/"

let pages = [];
let components = [];

let GetYoyoPages = async () => 
  {
  for(let i = 0; i < yoyoComponents.length; i++)
    {
    await requests.ServerGET(yoyoComponents[i].path, (request) => 
      {
      components.push({ name: yoyoComponents[i].name, data: request});
      });
    }

  for (let i = 0; i < yoyoPages.length; i++)
   {
   await requests.ServerGET(yoyoPages[i].path, (request) => 
      {
      pages.push({ path: yoyoPages[i].yoyoPath, triggers: yoyoPages[i].triggers, data: request});
      });
    }

  yoyoApp.start(pages,components);

  let writer = await websocket.OpenWebSocket( (response) => 
    {
    socketReader.HandleWebSocketResponse(response);
    });

  socketWriter = new WebSocketWriter(writer);
  
  yoyoApp.UpdateState("socketWriter", socketWriter);

  await ServerRequests.GetServerName((request) => 
    {
    yoyoApp.UpdateState("serverName", request.ServerName)
    });

  await ServerRequests.GetFactions((response) => {
    yoyoApp.UpdateState("dataEntries.factionData.factions", response)
    });

  await ServerRequests.GetUnitList((response) => {
    yoyoApp.UpdateState("dataEntries.units", response)
    });
  }

GetYoyoPages();
