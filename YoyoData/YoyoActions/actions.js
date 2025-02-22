import serverRequests from '../../js/ServerCommunication/ServerRequests.js'

let actions = 
    {
    UpsertFaction : function() 
      {
      console.log(this.state.dataEntries.factionData.selectedFaction);
      let faction = this.state.dataEntries.factionData.selectedFaction;
      if(!faction.uid && faction.Name)
        {
        serverRequests.CreateFaction(faction, (createResponse) => 
          { 
          if(createResponse.code != "Success")
            {
            console.log("Error creating faction: " + createResponse.code);
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
            console.log("Error creating faction: " + deleteResponse.code);
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
      }
    }

export default actions;
