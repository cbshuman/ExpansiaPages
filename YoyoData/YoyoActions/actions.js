import serverRequests from '../../js/ServerCommunication/ServerRequests.js'

let actions = 
    {
    UpsertFaction : function() 
      {
      console.log(this.state.factionEdit);
      let faction = this.state.factionEdit;
      if(!faction.uid && faction.Name)
        {
        serverRequests.CreateFaction(faction, (response) => console.log(response) );      
        }
      serverRequests.GetFactions((response) => this.UpdateState("dataEntries.factionData.factions",response) );
      }
    }

export default actions;
