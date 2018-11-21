import * as jwt from "jsonwebtoken";
import * as oauth2_lib from "simple-oauth2";
import {
  giveLoginPage,
  giveOAuthAcceptPage,
  oauth_route,
  app_route,
  clientSecret,
  userInfo,
  credentials
} from "./helper";
// import * from "./helper";
// var jwt:any  = require("jsonwebtoken");

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
  console.log(url.pathname);
  // let fakeResp =  Promise.resolve(new Response("asda"))
  // event.respondWith(fakeResp)
  if (url.pathname.endsWith("/home"))
    event.respondWith(giveLoginPageResponse(event.request));
  if (url.pathname.endsWith("/callback"))
    event.respondWith(sendtoAuthorize(event.request));
  if (url.pathname.endsWith("/authorize"))
    event.respondWith(serveCallBack(event.request));
});

/* Client */
function requestToken(code: String) {
  console.log("request token url");

  console.log(
    credentials.auth.tokenHost + credentials.auth.tokenPath + "?code=" + code
  );
  // return new Promise((res, rej) => {
  //   res(checkCodeGiveToken(code))
  // })
  return fetch(
    credentials.auth.tokenHost + credentials.auth.tokenPath + "?code=" + code
  );
}
/* User Agent */
export async function giveLoginPageResponse(request: Request) {
  console.log("Got request", request);

  // const token = jwt.sign({ user: userInfo }, clientSecret);
  let req_url = new URL(request.url);
  let code = req_url.searchParams.get("code");
  let token = "";
  let headers = new Headers({
    "content-type": "text/html"
  });
  console.log("here");
  console.log(code);

  if (code) {
    //  token = jwt.sign(code, credentials.client.secret);
  // headers.append("set-cookie", "token=Bearer " + body.token);
    let pro = requestToken(code)
      .then(res => res.json())
      .catch(err => {
        console.log("error in then");
         throw(String(err))
      })
      .then(body => {
        console.log("body");

        console.log(body);
        headers.append("set-cookie", "token=Bearer " + body.token);

        return body.token;
      })
      .catch(err => {
        console.log("error in 2nd");
        return String(err);
      });
    // token = await pro//.then( e=>e )
  }
  console.log("headers", JSON.stringify(headers));
  console.log("set cookie header" , headers.get("set-cookie"));
  

  return new Response(giveLoginPage(request, token), { headers });
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
  authorizationUri.searchParams.set("scope", "user.read");
  authorizationUri.searchParams.set("state", "someState");
  authorizationUri.searchParams.set("response_type", "code");
  authorizationUri.searchParams.set("client_id", credentials.client.id);
  authorizationUri.searchParams.set("redirect_uri", app_route + "/home");
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

/* Resource Server */
async function serveCallBack(request: Request) {
  //Sign and set cookie with the token
  let req_url = new URL(
    request.url //|| oauth_route + "/callback?un=1231&pwd=123&code=123"
  );
  // const code = req_url.searchParams.get("code");
  const client_id = req_url.searchParams.get("client_id");
  // console.log("serveing code", code);
  // const options = {
  //   code,
  //   redirect_uri: app_route + "/callback",
  //   scope: "user.read"
  // };
  console.log("serveing callback");

  try {
    // console.log("options", options);

    // const token = oauth2.accessToken.create(code);
    // const token = jwt.sign({ code: code, un: un }, clientSecret);

    const code = jwt.sign(userInfo, credentials.client.secret)
    console.log("The resulting token: ", code);

    let headers = Object.assign(init.headers, {
      "content-type": "text/html"
    });
    return new Response(giveOAuthAcceptPage(request, code), {
      headers
    });
  } catch (error) {
    console.error("Error setting token", error.message);
    return new Response(error, { status: 500 });
  }
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
