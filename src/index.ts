import * as jwt from "jsonwebtoken";
import * as oauth2_lib from "simple-oauth2";
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
} from "./constants"

// import * from "./helper";
// var jwt  = require("jsonwebtoken");
// userInfo = {
//   email: "v"
// };
// secret = "123"
// const code = jwt.sign(userInfo.email, secret)
// jwt.decode(code, secret)


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
    return event.respondWith(serveCallBack(event.request));
   return event.respondWith(errorRouteNotFoundResponse(event.request));
});

/* Client */
function requestToken(code: String) {
  console.log("request token url");

  console.log(
    paths.token.token + "?code=" + code
  );
  // return new Promise((res, rej) => {
  //   res(checkCodeGiveToken(code))
  // })
  return fetch(
    paths.token.token + "?code=" + code
  );
}
/* User Agent */
export async function giveLoginPageResponse(request: Request) {
  console.log("Got request", request);

  // const token = jwt.sign({ user: userInfo }, clientSecret);
  let req_url = new URL(request.url);
  let code = req_url.searchParams.get("code");
  let token = "";
  let headers = new Headers(Object.assign(init.headers, {
    "content-type": "text/html",
  }));
  // console.log("headers after adding ",
    // headers.forEach(head => console.log(head));
  
  let errors: string[] = []

  if (code) {
    try {
      let response = await requestToken(code)
      // errors.push(response)
      try {
        let responseJSON = await response.json()
        console.log("responseJSON",responseJSON);
        
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
    // let tokenJson = await requestToken(code)
    //   .then(res => res.json())
    //   .catch(err => {
    //     console.log("error in then");
    //      throw(String(err))
    //   })
    //   .then(body => {
    //     console.log("body");

    //     console.log(body);
    //     headers.append("set-cookie", "token=Bearer " + body.token);

    //     return body.token;
    //   })
    //   .catch(err => {
    //     console.log("error in 2nd");
    //     return String(err);
    //   });
    // token = await pro//.then( e=>e )
  }
  console.log("headers", JSON.stringify(headers));
  console.log("set cookie header", headers.get("set-cookie"));
  console.log(errors);



  return new Response(giveLoginPage(request, token), { headers });
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

/* Resource Server */
async function serveCallBack(request: Request) {
  //Sign and set cookie with the token
  let req_url = new URL(
    request.url //|| oauth_route + "/callback?un=1231&pwd=123&code=123"
  );
  // const client_id = req_url.searchParams.get("client_id");
  // const redirect_uri = req_url.searchParams.get("redirect_uri");

  try {
    const code = jwt.sign({ email: userInfo.email, client_id: credentials.client.id }, credentials.client.secret)
    console.log("The resulting token: ", code);
    console.log("The resulting email: ", userInfo.email);

    let headers = Object.assign(init.headers, {
      "content-type": "text/html",
      // "access-control-allow-origin":" no-cors"
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
