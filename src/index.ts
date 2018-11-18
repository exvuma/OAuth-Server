import * as jwt from "jsonwebtoken";
import * as oauth2_lib from "simple-oauth2";
// var jwt:any  = require("jsonwebtoken");
const clientSecret = "some secret";
const credentials = {
  client: {
    id: "123",
    secret: "some secret"
  },
  auth: {
    tokenHost: "https://api.oauth.com"
  }
};
//https://www.npmjs.com/package/simple-oauth2 
const oauth2 = oauth2_lib.create(credentials);

addEventListener("fetch", (event: FetchEvent) => {
    const url = new URL(event.request.url);
    // url.password()
  console.log(url.pathname)
  // let fakeResp =  Promise.resolve(new Response("asda"))
  // event.respondWith(fakeResp)
  if (url.pathname.endsWith("/token"))
    event.respondWith(getTokenHandler(event.request));
  if (url.pathname.endsWith("/verify"))
  event.respondWith(validateTokenHandler(event.request));
  if (url.pathname.endsWith("/code"))
    event.respondWith(sendtoCallBack(event.request));
});





async function sendtoCallBack(request: Request) {
    // Authorization oauth2 URI
    const authorizationUri = 'sdad'
    //     oauth2.authorizationCode.authorizeURL({
    //     redirect_uri: 'http://missv.info/callback',
    //     scope: '<scope>', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
    //     state: '<state>'
    // });
    console.log(authorizationUri)
    return Response.redirect(authorizationUri, 302)
}
async function getTokenHandler(request: Request) {
  const url = new URL(request.url);
  const pwd = url.searchParams.get("pwd");
  const un = url.searchParams.get("un");

  var token = jwt.sign({ un: pwd }, clientSecret);
  const respBody = {
    JWT: token
  };
  const init = {
    headers: {
      "content-type": "application/json"
    }
  };
  console.log(respBody)
  return new Response(JSON.stringify(respBody), init);
}
async function validateTokenHandler(request: Request) {
  const url = new URL(request.url);
  const token = request.headers.get("Authorization");

  const ver = jwt.verify(token, clientSecret);
  const respBody = {
    JWT: token
  };
  const init = {
    headers: {
      "content-type": "application/json"
    }
  };
  console.log(ver);
  
  return new Response(JSON.stringify(ver), init);
}
