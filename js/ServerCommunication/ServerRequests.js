import request from "./request.js"

let requests = {
  GetServerName : async (callback) => {
  await request.ServerGET("/api/ServerDetails/GetServerName" , (request) =>
    {
    callback(request);
    });
  },

  CreateFaction : async (requestBody, callback) => {
  await request.ServerPOST("/api/faction/create", requestBody, (request) =>
    {
    console.log(request);
    });
  },

  GetFactions : async (requestBody, callback) => {
  await request.ServerGET("/api/faction/GetAll", requestBody, (request) =>
    {
    callback(request);
    });
  },



  GetUnitList : async (callback) => {
  await request.ServerGET("/api/units/GetAll" , (request) =>
    {
    callback(request);
    });
  },
}


export default { ...requests }
