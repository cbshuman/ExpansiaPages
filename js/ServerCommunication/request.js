let serverAddress = '';
let globalHeaders = {};

async function ServerGET(path, callback, errorCallback)
  {
  await fetch(serverAddress + path, { headers : globalHeaders })
      .then(response => {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) 
          {
          return response.json();
          } 
        else 
          {
          return response.text();
          }
      })
      .then(callback)
      .catch(error => 
        {
        if(errorCallback)
          {
          errorCallback(error);
          }
        });
  }

async function ServerPOST(path, body, callback, errorCallback) 
  {
  await fetch(serverAddress + path, 
    {
    method: "POST",
    headers: { ...globalHeaders,"Content-Type": "application/json" },
    body: JSON.stringify(body) 
    })
    .then(response => 
      {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) 
        {
        return response.json();
        } 
      else 
        {
        return response.text();
        }
      })
    .then(callback)
    .catch(error => 
      {
      if(errorCallback)
        {
        errorCallback(error);
        }
      });
    }


export default { serverAddress, globalHeaders, ServerGET, ServerPOST }
