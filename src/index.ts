import * as jwt from "jsonwebtoken";
import * as oauth2_lib from "simple-oauth2";
import { giveLoginPage, giveOAuthAcceptPage,  oauth_route, app_route, clientSecret } from "./helper";
// var jwt:any  = require("jsonwebtoken");
const credentials = {
  client: {
    id: "vicsecret",
    secret: "vicsecret"
  },
  auth: {
    tokenHost: "https://missv.info",
    tokenPath: '/oauth/token',
    authorizePath: '/oauth/authorize',
  }
};
//https://www.npmjs.com/package/simple-oauth2 
const oauth2 = oauth2_lib.create(credentials);
const init = {
  headers: {
    "content-type": "application/json"
  }
};

addEventListener("fetch", (event: FetchEvent) => {
    const url = new URL(event.request.url);
    // url.password()
  console.log(url.pathname)
  // let fakeResp =  Promise.resolve(new Response("asda"))
  // event.respondWith(fakeResp)
  if (url.pathname.endsWith("/home"))
    event.respondWith(giveLoginPageResponse(event.request));
  if (url.pathname.endsWith("/callback"))
    event.respondWith(sendtoAuthorize(event.request));
  if (url.pathname.endsWith("/resource"))
    event.respondWith(checkTokenGiveData(event.request));
  // if (url.pathname.endsWith("/verify"))
  //   event.respondWith(validateTokenHandler(event.request));
  if (url.pathname.endsWith("/authorize"))
    event.respondWith(serveCallBack(event.request));
});




/* Consumer */
export async function giveLoginPageResponse(request: Request) {
  console.log('Got request', request)
  const headers = {
    "content-type": "text/html"
  }
  const init = { headers }
  return new Response(giveLoginPage(request), init)
}
  async function sendtoAuthorize(request: Request) {
    // const authorizationUri = oauth2.authorizationCode.authorizeURL({
    //   redirect_uri: app_route + "/home",
    //   scope: "user.read", // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
    //   state: "someState"
    // });
    // app_route = "https://missv.info"
    // oauth_route = "https://missv.info"
    let authorizationUri = new URL(oauth_route + "/authorize");
    authorizationUri.searchParams.set("scope", "user.read")
    authorizationUri.searchParams.set("state", "someState")
    authorizationUri.searchParams.set("response_type", "code")
    authorizationUri.searchParams.set("redirect_uri",  app_route + "/home")

    console.log(authorizationUri.href);
    //http://missv.info/oauth/authorize?response_type=code&client_id=vicsecret&redirect_uri=https%3A%2F%2Fmissv.info%2Foauth%2Fapp%2Fcallback&scope=user.read&state=someState
    return Response.redirect(authorizationUri.href, 302);
  }
async function signRequestandCallAPI(request: Request) { 
  let req_url = new URL(request.url)
  const token = jwt.sign({ un: req_url.searchParams.get("un") }, clientSecret);
  let newHEads = Object.assign(init.headers, {
    "Authorization": "Bearer " + token
  });
  let result = await fetch(oauth_route + "/resource", { headers: newHEads });
  let json_results = await result.json()
  return new Response(JSON.stringify(json_results), { headers: newHEads });
}

/* Producer */
async function serveCallBack(request: Request) {
  //Sign and set cookie with the token
  let req_url = new URL(request.url || oauth_route + "/callback?un=1231&pwd=123&code=123")
  const code = req_url.searchParams.get("code");
  // const client_id = req_url.searchParams.get("client_id");
  // const secret = credentials.client.secret
  const un = req_url.searchParams.get("un");
  console.log("serveing code", code);
  const options = {
    code,
    redirect_uri: app_route + "/callback",
    scope: "user.read"
  };
  console.log("serveing callback");

  try {
    console.log("options", options);

    // const token = oauth2.accessToken.create(code);
    // const token = jwt.sign({ code: code, un: un }, clientSecret);

    const token = jwt.sign({ code: 123, un: "pook" }, "vicsecret");
    console.log("The resulting token: ", token);

    // return .status(200).json(token)
    let newHEads = Object.assign(init.headers, {
      "Set-Cookie": "token=Bearer " + token,
      "content-type": "text/html"
    });
    return new Response(giveOAuthAcceptPage(request), { headers: newHEads });
  } catch (error) {
    console.error("Error setting token", error.message);
    return new Response(error, { status: 500 });
    // return res.status(500).json('Authentication failed');
  }
}
async function checkTokenGiveData(request: Request) {
  const url = new URL(request.url);
  let token = request.headers.get("Authorization").substring(7)// string out "bearer "
  console.log("token", token);
  try {
    const ver = jwt.verify(token, clientSecret);
    const info = jwt.decode(token);
    console.log("info", info);
    console.log(ver);
    
  } catch (e) {
    console.log(e);
    
    return new Response("error with JWT" + e, { status: 200 })
  }
  const respBody = {
    JWT: token,
    some_user_data: 'user jane'
  };
  console.log(respBody)
  return new Response(JSON.stringify(respBody), init);
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