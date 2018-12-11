import * as jwt from "jsonwebtoken";
import {
  getCookie,
  getTokenFromRequest
} from "./shared";
import {
  giveLoginPage,
  giveAcceptPage,
  errorRouteNotFoundResponse,
  giveGetResultsPage
} from "./html_pages";
import {
  paths,
  init,
  credentials
} from "./constants"
import { factoryHookResponse, factoryIError, factoryCodeResponse, factoryJWTPayload } from "./types";
import { give403Page } from "./html_pages";

/* for authetication endpoints, the first part of the oauth flow */
addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url);

  if (url.pathname.includes("/home"))
    return event.respondWith(giveLoginPageResponse(event.request));
  if (url.pathname.includes("/callback"))
    return event.respondWith(sendtoAuthorize(event.request));
  if (url.pathname.includes("/authorize"))
    return event.respondWith(giveLoginPageResponse(event.request));
  if (url.pathname.includes("/code"))
    return event.respondWith(giveAcceptPageResponse(event.request));
  return event.respondWith(errorRouteNotFoundResponse(event.request));
});

/* Ask resource/token server for the token using the code */
function requestToken(code: String) {
  return fetch(
    paths.token.token + "?code=" + code
  );
}

// verifyUser checks if token or un/pwd combos were passed in
// return {msg: "403"} if this doesn't match expected vallus
// returns {msg: "" } if user didn't exist
// return { email, token , pwd, msg} if legit
export async function verifyUser(request: Request): Promise<{ email: string, pwd: string, token: string, msg: string }> {
  let res = factoryHookResponse({})

  // first see if there was a token passed in meaning the user is signed in
  try {
    let token = getCookie(request.headers.get("cookie"), "token")
    if (!token) token = request.headers.get("Authorization").substring(7)
    if (!token) throw new Error("no token")
    let userInfo = jwt.decode(token)
    let email = userInfo.sub
    console.log("email:", email);

    // @ts-ignore
    let storedToken = await TOKENS.get(email)
    // if (token != storedToken) return { email: "403", token: "403" }
    return { email: "email", token: token, pwd: "", msg: "" }
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
      // case where user does not exist DNE
      return { email: un, token: "", "pwd": pwd, msg: "dne" }
    }
    try {
      //verify this password is the same as the encrypted one stored
      let oldPwd = jwt.verify(storedPWD, credentials.storage.secret)

      if (oldPwd != pwd) {
        res.errors.push(factoryIError({ message: "old password does not match" }))
        return { email: un, pwd: pwd, msg: "403", token: "" }
      }
      // @ts-ignore
      let token = await TOKENS.get(un)
      return { email: un, token: token, msg: "", pwd: "" }
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
}
// check for the token only and store the code that will be returned
export async function giveAcceptPageResponse(request: Request) {
  let { email, token, msg, pwd } = await verifyUser(request)

  if (msg == "403") return new Response(give403Page(), { status: 403 })
  if (msg == "dne") return registerNewUser(email, pwd)
  let code = Math.random().toString(36).substring(2, 12)
  // @ts-ignore
  await CODES.put(email, code)
  let body = { email, code, token }
  return new Response(JSON.stringify(body))
}
//check for a token or a un and pwd, generate a random code if
//valid and store it if so
export async function signIn(request: Request) {
  let res = factoryHookResponse({})
  let { email, token } = await verifyUser(request)
  if (email == "403") {
    res.proceed = false
    res.errors.push(factoryIError({ message: "could not verify the user" }))
    return
  }
  if (email == "") {
    res.proceed = false
    res.errors.push(factoryIError({ message: "could not verify the user" }))
    return
  }
  let headers = Object.assign(init.headers, {
    "content-type": "text/html",
  });
  return new Response(giveAcceptPage(request), {
    headers
  });

}
export async function registerNewUser(email: string, pwd: string) {
  let res = factoryCodeResponse({ un: email })
  let headers = new Headers(init.headers)
  try {

    //@ts-ignore
    let existingUser = await USERS.get(email)
    if (existingUser) {
      //return error user already registered
      res.errors.push(factoryIError({ message: "trying to register username that has an existing user " + email }))
    }
    // encrypt the pwd then store it
    let storedPWD = jwt.sign(pwd, credentials.storage.secret)
    let uJWTPayload = factoryJWTPayload({ sub: email })
    let storedUserTok = jwt.sign(uJWTPayload, credentials.storage.secret)
    headers.append("set-cookie", "token=Bearer " + storedUserTok);
    let code = Math.random().toString(36).substring(2, 12)
    //@ts-ignore
    await USERS.put(email, storedPWD)
    // @ts-ignore
    await CODES.put(email, code)
    // @ts-ignore
    await TOKENS.put(email, storedUserTok)


  }
  catch (e) {
    res.errors.push(factoryIError({ message: " some error while trying to register " + e }))
  }
  return new Response(JSON.stringify(res))
}

/* User Agent */

export async function giveLoginPageResponse(request: Request) {
  // check if a code was passed in
  let req_url = new URL(request.url);
  let code = req_url.searchParams.get("code");
  let token = getTokenFromRequest(request)

  let headers = new Headers(Object.assign(init.headers, {
    "content-type": "text/html",
  }));

  let errors: string[] = []
  if (token) { //they are already signed in
    let headers = Object.assign(init.headers, {
      "content-type": "text/html",
    });
    return new Response(giveAcceptPage(request), {
      headers
    });
  }
  if (code) {
    // call the token/resource server to ask for a token using the code
    // logging in with a code implies they accept
    try {
      let response = await requestToken(code)
      try {
        let responseJSON = await response.json()
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
    return new Response(giveGetResultsPage(request), init)
  } else {
    return new Response(giveLoginPage(request), { headers });
  }
}
// sendtoAuthorize generates a URL to request for a code
// then responds with a redirect to this URL
async function sendtoAuthorize(request: Request) {
  let req_url = encodeURI(request.url)
  let authorizationUri = new URL(paths.auth.authorize);
  authorizationUri.searchParams.set("scope", "user.read");
  authorizationUri.searchParams.set("state", "someState");
  authorizationUri.searchParams.set("response_type", "code");
  authorizationUri.searchParams.set("client_id", credentials.client.id);
  authorizationUri.searchParams.set("redirect_uri", paths.auth.home);

  console.log(authorizationUri.href);
  //http://<auth server> /oauth/authorize?response_type=code&client_id=vicsecret&redirect_uri=https%3A%2F%2Fmissv.info%2Foauth%2Fapp%2Fcallback&scope=user.read&state=someState
  return Response.redirect(authorizationUri.href, 302);
}





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
