import * as jwt from "jsonwebtoken";
import * as oauth2_lib from "simple-oauth2";
import {
  getCookie,
  getTokenFromRequest
} from "./shared";
import {
  giveLoginPage,
  giveOAuthAcceptPage,
  errorRouteNotFoundResponse
} from "./helper";
import {
  paths,
  userInfo,
  init,

  clientSecret,
  credentials,
  Cloudflare,
} from "./constants"
import { factoryHookResponse, factoryIError, Namespace, factoryCodeResponse } from "./types";
import { giveOriginWarnPage, give403Page } from "./generate_html";
import { fchmod } from "fs";


// var constants = require('./constants');
// // var jwt  = require("jsonwebtoken");
// userInfo = {
//   email: "v"
// };
// secret = "123";
//  code = jwt.sign(userInfo.email, secret)
// jwt.decode(code, secret)


// var CODES = this.CODES as any
// for testing KV

// addEventListener('fetch', event => {
//   event.respondWith(handleRequest(event.request))
// })
// async function handleRequest(request) {
//   let tokenResp = await TOKENS.get("un")
//   return new Response(tokenResp)
// }

//https://www.npmjs.com/package/simple-oauth2
// const oauth2 = oauth2_lib.create(credentials);
/* for /oauth endpoints*/
addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url);
  // url.password()
  console.log(url.pathname);

  if (url.pathname.includes("/home"))
    return event.respondWith(giveLoginPageResponse(event.request));
  if (url.pathname.includes("/callback"))
    return event.respondWith(sendtoAuthorize(event.request));
  if (url.pathname.includes("/authorize"))
    return event.respondWith(giveLoginPageResponse(event.request));
  if (url.pathname.includes("/code"))
    return event.respondWith(accept(event.request));
  return event.respondWith(errorRouteNotFoundResponse(event.request));
});

/* Client */
function requestToken(code: String) {
  // return new Promise((res, rej) => {
  //   res(checkCodeGiveToken(code))
  // })
  return fetch(
    paths.token.token + "?code=" + code
  );
}

// checks if token or un/pwd combos were passed in
// return {"403", "403"} if this doesn't match expected vallus
// returns { blank, blank } if user didn't exist
// return { email, token } if legit
export async function verifyUser(request: Request): Promise<{email: string, pwd:string, token:string, msg:string}>{
  let res = factoryHookResponse({})

  // first see if there was a token passed in meaning the user is signed in
  try {
    let token = getCookie(request.headers.get("cookie"), "token")
    if (!token) token = request.headers.get("Authorization").substring(7)
    if (!token) throw new Error("no token")
    // @ts-ignore
    let storedToken = await TOKENS.get(email)
    let email = jwt.verify(token, credentials.storage.secret)
    // if (token != storedToken) return { email: "403", token: "403" }
    return  { email: "email", token: token, pwd:"", msg:""}
  }
  catch (e) {
    console.log("error with auth token", e);
  }
  try {
    let reqBody = await request.json()
    let un = reqBody.un
    let pwd = reqBody.pwd

    // @ts-ignore
    let storedPWD = await USERS.get(un)

    if (!storedPWD) {
      return { email: un, token: "" , "pwd": pwd, msg: "dne"}
      // return registerNewUser(request)
    }
    try {
      //verify this password is the same as the encrypted one stored
      console.log(storedPWD);
      
      let oldPwd = jwt.verify(storedPWD, credentials.storage.secret)
      console.log("old");
      
      if (oldPwd != pwd) {
        console.log("pass don't match");

        res.errors.push(factoryIError({ message: "old password does not match" }))
        return {email: un , pwd: pwd, msg:"403",token:"" }
      }
      // @ts-ignore
      let token = await TOKENS.get(un)
      return { email: un, token: token, msg: "", pwd:"" }
    }
    catch (e) {
      console.log("couldn't verify passworks", e);
    }
  }
  catch (e) {
    console.log("couldn't get un or pwd", e);
    return { email: "403", token: "403", msg: "403", pwd: "" }
  }
  return { email: "403", token: "403", msg: "403", pwd: "" }
  // }
  //     catch (e) {
  //   res.proceed = false
  //   res.errors.push(e)
  // }

  // } catch (e) {
  //   res.proceed = false
  //   res.errors.push(factoryIError({ message: "could not get the un and pwd from the JSON of the request" + e.message || " no error message" }))
  //   res.errors.push(e)

  // }
}
// check for the token only and store the code that will be returned
export async function accept(request: Request) {
  let {email, token, msg, pwd} = await verifyUser(request)
  console.log("email", email);
  
  if (msg == "403") return new Response(give403Page(), { status: 403 })
  if (msg == "dne") return registerNewUser(email, pwd)
  let code = Math.random().toString(36).substring(2, 12)
  // @ts-ignore
  await CODES.put(email, code)
  let body = {email, code, token}
  return new Response(JSON.stringify(body))
}
//check for a token or a un and pwd, generate a random code if
//valid and store it if so
export async function signIn(request: Request) {
  let res = factoryHookResponse({})
  let {email, token} = await verifyUser(request)
  if (email == "403"){
    res.proceed = false
    res.errors.push(factoryIError({ message: "could not verify the user" }))
    return
  }
  if (email == ""){
    res.proceed = false
    res.errors.push(factoryIError({ message: "could not verify the user" }))
    return
  }

  // res.proceed = true
  let headers = Object.assign(init.headers, {
    "content-type": "text/html",
    // "access-control-allow-origin":" no-cors"
  });
  return new Response(giveOAuthAcceptPage(request), {
    headers
  });
  // return new Response(JSON.stringify(res))

}
export async function registerNewUser(un: string, pwd: string) {
  let res = factoryCodeResponse({un})
  let headers = new Headers(init.headers)
  // let headers = new Headers(Object.assign(init.headers, {
  //   "content-type": "text/html",
  // }));
  try {
    //  var TOKENS: any
    // let existingUser = "await TOKENS.get(un)"
    //@ts-ignore
    let existingUser = await USERS.get(un)
    if (existingUser) {
      //return error user already registered
      res.errors.push(factoryIError({ message: "trying to register username that has an existing user " + un }))
    }
    // encrypt the pwd then store it
    let storedPWD = jwt.sign(pwd, credentials.storage.secret)
    let storedUserTok = jwt.sign(un, credentials.storage.secret)
    headers.append("set-cookie", "token=Bearer " + storedUserTok);
    let code = Math.random().toString(36).substring(2, 12)
    //@ts-ignore
    await USERS.put(un, storedPWD)
    // @ts-ignore
    await CODES.put(un, code)
    // @ts-ignore
    await TOKENS.put(un, storedUserTok)


  }
  catch (e) {
    res.errors.push(factoryIError({ message: " some error while trying to register " + e }))
  }
  return new Response(JSON.stringify(res))
}

/* User Agent */

export async function giveLoginPageResponse(request: Request) {
  console.log("Got request", request);

  // const token = jwt.sign({ user: userInfo }, clientSecret);
  let req_url = new URL(request.url);
  // check if a code was passed in
  let code = req_url.searchParams.get("code");
  // let token = new Headers(request.headers).get("cookie");
  let token = getTokenFromRequest(request)
  let headers = new Headers(Object.assign(init.headers, {
    "content-type": "text/html",
  }));

  let errors: string[] = []
  if (token) {
    let headers = Object.assign(init.headers, {
      "content-type": "text/html",
    });
    return new Response(giveOAuthAcceptPage(request), {
      headers
    });
  }
  if (code) {
    try {
      let response = await requestToken(code)
      try {
        let responseJSON = await response.json()
        console.log("responseJSON", responseJSON);

        headers.append("set-cookie", "token=Bearer " + responseJSON.id_token);

      }
      catch (e) {
        errors.push("error parsing the JSON")
        errors.push(e)
      }

    }
    catch (e) {
      errors.push("error getting token")
      errors.push(e)

    }
  } else {
    return new Response(giveLoginPage(request), { headers });
    // return signIn(request)
  }
  console.log("headers", JSON.stringify(headers));
  console.log("set cookie header", headers.get("set-cookie"));
  console.log(errors);

  return new Response(giveLoginPage(request), { headers });
}
async function sendtoAuthorize(request: Request) {
  let req_url = encodeURI(request.url)
  let authorizationUri = new URL(paths.auth.authorize);
  authorizationUri.searchParams.set("scope", "user.read");
  authorizationUri.searchParams.set("state", "someState");
  authorizationUri.searchParams.set("response_type", "code");
  authorizationUri.searchParams.set("client_id", credentials.client.id);
  // authorizationUri.searchParams.set("redirect_uri", req_url);
  authorizationUri.searchParams.set("redirect_uri", paths.auth.home);
  // sign the client info
  // const token = jwt.sign({ user: userInfo }, clientSecret);

  console.log(authorizationUri.href);
  //http://missv.info/oauth/authorize?response_type=code&client_id=vicsecret&redirect_uri=https%3A%2F%2Fmissv.info%2Foauth%2Fapp%2Fcallback&scope=user.read&state=someState
  return Response.redirect(authorizationUri.href, 302);
}
// async function signRequestandCallAPI(request: Request) {
//   let req_url = new URL(request.url);
//   const token = jwt.sign({ un: req_url.searchParams.get("un") }, clientSecret);
//   let header = Object.assign(init.headers, {
//     Authorization: "Bearer " + token
//   });
//   let result = await fetch(oauth_route + "/resource", { headers: header });
//   let json_results = await result.json();
//   return new Response(JSON.stringify(json_results), { headers: header });
// }




// MyWebpage
//   /login
//   Login->OauthProvider ?appId=123-mywebpage
// OauthProvider
//   Makes sure user is logged in
//   Once logged in, redirect to callback url on MyWebpage
// MyWebpage
//    /oauth/callback?token=alksdjf
//    Use nonce alksdjf to call to OauthProvider to get real token
//    Associate real token to current session
