import serverRequests from '../../js/ServerCommunication/ServerRequests.js'

let actions = (webSocketWriter) => { return( 
    {
    UpsertFaction : function() 
      {
      console.log(this.state.dataEntries.factionData.selectedFaction);
      let faction = this.state.dataEntries.factionData.selectedFaction;
      if(!faction.Uid && faction.Name)
        {
        serverRequests.CreateFaction(faction, (createResponse) => 
          { 
          if(createResponse.code != "Success")
            {
            console.log("Error creating faction: " + createResponse.message);
            }

          serverRequests.GetFactions((response) => 
            {
            this.UpdateState("dataEntries.factionData.factions",response);
            faction.Uid = createResponse.Uid;
            this.UpdateState("dataEntries.factionData.selectedFaction",faction)
            });
          });      
        }
      else if(faction.Name)
        {
        serverRequests.UpdateFaction(faction, (createResponse) => 
          { 
          if(createResponse.code != "Success")
            {
            console.log("Error creating faction: " + createResponse.message);
            }

          serverRequests.GetFactions((response) => 
            {
            this.UpdateState("dataEntries.factionData.factions",response);
            faction.Uid = createResponse.Uid;
            this.UpdateState("dataEntries.factionData.selectedFaction",faction)
            });
          }); 
        }
      },

    DeleteFaction : function()
      {
      let faction = this.state.dataEntries.factionData.selectedFaction;
      if(faction.Uid)
        {
        serverRequests.DeleteFaction(faction.Uid, (deleteResponse) =>
          {
          if(deleteResponse.code != "Success")
            {
            console.log("Error creating faction: " + deleteResponse.message);
            return;
            }

          serverRequests.GetFactions((response) => 
            {
            this.UpdateState("dataEntries.factionData.factions",response);
            faction = { Uid : "", Name : "", StartingUnits : [] };
            this.UpdateState("dataEntries.factionData.selectedFaction",faction)
            });
          });
        }
      },
    AddUnitToFaction()
      {
      let unit = this.state.dataEntries.uiData.factionRecuitUnitSelection;
      if(unit)
        {
        if(!this.state.dataEntries.factionData.selectedFaction.StartingUnits.find(x => x == unit))
          {
          let unitList = [...this.state.dataEntries.factionData.selectedFaction.StartingUnits, unit];
          this.UpdateState("dataEntries.factionData.selectedFaction.StartingUnits", unitList);
          }
        }
      },

    UpsertUnit : function()
      {
      let unit = this.state.unitEdit;

      unit.Health = Number(unit.Health);
      unit.Agility = Number(unit.Agility);
      unit.Movement = Number(unit.Movement);

      if(!unit.uid && unit.Name)
        {
        console.log(unit);
        serverRequests.CreateUnit(unit, (createResponse) => 
          { 
          if(createResponse.code != "Success")
            {
            console.log("Error creating unit: " + createResponse.code);
            return;
            }

          serverRequests.GetUnitList((response) => 
            {
            this.UpdateState("dataEntries.units",response);
            unit.Uid = createResponse.Uid;
            this.UpdateState("unitEdit",unit)
            });
          });      
        }
      },

    SendChatMessage : function(message)
      {
      webSocketWriter.SendChatMessage(message);
      }
    });
  }

export default actions;
