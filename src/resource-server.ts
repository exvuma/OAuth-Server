import * as jwt from "jsonwebtoken";
import { getCookie, } from "./shared";
import { factoryTokenResponse, factoryJWTPayload, JWTPayload } from "./types"
import { errorRouteNotFoundResponse, give403Page } from "./html_pages"
import { HookResponse, factoryHookResponse, factoryIError, factoryCodeResponse } from "./types"
import { credentials, init } from "./constants"


/* for token and resource endpoints*/
addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url);

  if (url.pathname.includes("/authorize"))
    return event.respondWith(giveToken(event.request));
  if (url.pathname.includes("/resource"))
    return event.respondWith(giveResource(event.request));
  if (url.pathname.includes("/hook"))
    return event.respondWith(giveInstall(event.request));
  else return event.respondWith(errorRouteNotFoundResponse(event.request));
});
function getPersonalInstall(email: string) {
  //TODO: get the personalize install
  let resp: HookResponse = factoryHookResponse({})
  return resp.install
}
function isExpired(token: JWTPayload): boolean {
  // check expiration
  if (token.exp - Math.round(Date.now() / 1000) < 0)
    return true
  return false
}
/* use the bearer token to get the resource */
export async function giveResource(request: Request) {
  var respBody: HookResponse = factoryHookResponse({})
  let token = ""
  let decodedJWT = factoryJWTPayload()
  try { //validate request is who they claim
    token = getCookie(request.headers.get("cookie"), "token")
    if (!token) token = request.headers.get("Authorization").substring(7)
    let decodedJWT = jwt.verify(token, credentials.storage.secret)
    // @ts-ignore
    let storedToken = await TOKENS.get(decodedJWT.sub)
    if (isExpired(storedToken)) throw new Error("token is expired") /* TODO instead of throwing error send to refresh */
    if (storedToken != token) throw new Error("token does not match what is stored")
  }
  catch (e) {
    respBody.errors.push(factoryIError({ message: e.message, type: "oauth" }))
    return new Response(JSON.stringify(respBody), init)
  }

  respBody.install = getPersonalInstall(decodedJWT.sub)
  return new Response(JSON.stringify(respBody), init)

}
/* use the bearer token to get the install */
export async function giveInstall(request: Request) {

  let token = ""
  let respBody: HookResponse = factoryHookResponse({})
  try {
    let reqJSON = await request.json()
    respBody.proceed = true
    let modInstall = reqJSON.install
    modInstall.schema.properties.myTokenOption = {
      type: 'string',
      title: 'Token Option'
    }
    try {
      token = reqJSON.authentications.account.token.token
    } catch (e) {
      token = "there was no token"
      token = reqJSON
    }
    modInstall.options.myTokenOption = token

    respBody.install = modInstall
    // })
  } catch (e) {
    respBody.errors.push(factoryIError({
      type: "oauth",
      message: "Error getting the token from the request body"
    }
    ));
  }
  return new Response(JSON.stringify(respBody), init)
}

/* generate a token form the code passed in the query string */
export async function giveToken(request: Request) {
  let respBody = factoryTokenResponse()
  let req_url = new URL(request.url);
  let code = req_url.searchParams.get("code");
  let email = req_url.searchParams.get("email");

  if (!code) {
    try {
      // check request body for the code
      let reqBody = await request.text()

      let params = new URLSearchParams(reqBody)
      code = params.get('code')
      email = params.get('email')
      // code = reqBody.code || reqBody.metadata.code || reqBody.code[0] || reqBody.metadata.code[0]
    }
    catch (e) {
      respBody.errors.push(factoryIError({ message: "request sent didn't have code in the body " + e.message }))
      return new Response(JSON.stringify(respBody), init);
    }
  }

  let headers = new Headers(init.headers);

  if (code) {
    // @ts-ignore
    let storedCode = await CODES.get(email)
    if (storedCode && code != storedCode) return new Response(give403Page(), { status: 403 })
    // @ts-ignore
    await CODES.put(email, code)
    let uJWTPayload = factoryJWTPayload({ sub: email })
    let tokenJWT = jwt.sign(uJWTPayload, credentials.storage.secret);
    console.log(uJWTPayload);

    headers.append("set-cookie", "token=Bearer " + tokenJWT);
    // @ts-ignore
    await TOKENS.put(email, tokenJWT)

    respBody.access_token = tokenJWT
    respBody.token = tokenJWT
    // Other potential fields we could specify
    //"token_type": "bearer",
    // "expires_in": 2592000,
    // "refresh_token": tokenJWT,
    // "token": tokenJWT
    // "scope": "read", "uid": 100101, "info": { "name": "Mark E. Mark", "email": "mark@thefunkybunch.com" }
  } else {
    respBody.errors.push(factoryIError({ message: "there was no code sent to the authorize token url" }))
  }
  return new Response(JSON.stringify(respBody), { headers });
}
