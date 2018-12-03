import * as jwt from "jsonwebtoken";
import * as oauth2_lib from "simple-oauth2";
import { getCookie, } from "./shared";
import { errorRouteNotFoundResponse} from "./helper"
import {credentials, paths, init, accessToken} from "./constants"
import { userInfo } from "os";
// import * from "./helper";
// var jwt:any  = require("jsonwebtoken");

//https://www.npmjs.com/package/simple-oauth2
// const oauth2 = oauth2_lib.create(credentials);


/* for /token endpoints*/
addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url);
  // url.password()
  console.log(url.pathname);

  if (url.pathname.includes("/authorize"))
    return event.respondWith(giveToken(event.request));
  if (url.pathname.includes("/resource"))
    return event.respondWith(giveResource(event.request));
  if (url.pathname.includes("/hook"))
    return event.respondWith(giveInstall(event.request));
  else return event.respondWith(errorRouteNotFoundResponse(event.request));
});

/* use the bearer token to get the resource */
export async function giveResource(request: Request) {
  let req_url = encodeURI(request.url)
  let info = {}
  let token = ""
  try {
    token = getCookie(request.headers.get("cookie"), "token")
    if (!token) token = request.headers.get("Authorization").substring(7)
  }
  catch (e) {
    info = {
      errors: ["token not found ", e]
    }
    return new Response(JSON.stringify(info), init)
  }
  try {
    info = {
      token: jwt.decode(token)
    }
    info = Object.assign(info, userInfo)
    console.log("info" , info);
    
    
  } catch (e) {
    info = {
      errors: ["error decoding  ", e]
    }
  }
  return new Response(JSON.stringify(info), init)

}
/* use the bearer token to get the install */
export async function giveInstall(request: Request) {
  console.log("giving reources");
  
  let install = {}
  let token = ""
  // get Bearer token
  let respBody = {
    proceed: false,
    errors: [""],
    install: {}
  }
  try {
    let reqJSON = await request.json()
      respBody.proceed = true
      let modInstall = reqJSON.install
      modInstall.schema.properties.myTokenOption = {
        type: 'string',
        title: 'Token Option'
      }
      try {
        token = reqJSON.install.authentications.account.token.token
      } catch (e) {
        token = "there was no token"
      }
      modInstall.options.myTokenOption = token

      respBody.install = modInstall
    // })
  } catch (e) {
    respBody.errors.push("Error getting the token from the request body")
    console.log(e);
    
    // respBody.errors.push(e)
  }
  return new Response(JSON.stringify(respBody), init)
}

/* generate a token form the code passed in the query string */
export async function giveToken(request: Request) {
  console.log("Got request", request);

  // const token = jwt.sign({ user: userInfo }, clientSecret);
  let req_url = new URL(request.url);
  let code = req_url.searchParams.get("code");

  let token = "";
  let headers = new Headers(init.headers);
  console.log("here");
  console.log(code);
  let respBody = {
  }
  if (code) {
    token = jwt.sign(code, credentials.client.secret);
    headers.append("set-cookie", "token=Bearer " + token);
    respBody = {
      "access_token": accessToken,
      "token_type": "bearer",
      "expires_in": 2592000,
      "id_token": token
      // "scope": "read", "uid": 100101, "info": { "name": "Mark E. Mark", "email": "mark@thefunkybunch.com" }
    }
  } else {
    respBody = { errors: "there was no code sent to the authorize token url " }
  }
  return new Response(JSON.stringify(respBody), { headers });
}
