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
    callback(request);
    });
  },

  UpdateFaction : async (requestBody, callback) => {
  await request.ServerPOST("/api/faction/update", requestBody, (request) =>
    {
    callback(request);
    });
  },

  DeleteFaction : async (requestBody, callback) => {
  await request.ServerPOST("/api/faction/delete", requestBody, (request) =>
    {
    callback(request);
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

  CreateUnit : async (requestBody, callback) => {
  await request.ServerPOST("/api/units/create", requestBody, (request) =>
    {
    callback(request);
    });
  },
}


export default { ...requests }
