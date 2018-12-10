import * as jwt from "jsonwebtoken";
import { giveOriginWarnPage } from "./html_pages";
import { credentials } from "./constants"

//protected user information

export function checkToken(
  request: Request,
  clientSecret: string,
  cliendID: string
) /* Checks the auth header for the Bearer token then returns the decoded payload */{
  const url = new URL(request.url);
  let token = request.headers.get("Authorization").substring(7); // string out "bearer "
  console.log("token", token);
  let result = {
    verified: false,
    error: "",
    // payload: String | Object, 
  };
  try {
    const ver = jwt.verify(token, credentials.client.secret);
    console.log(ver);
    result.verified = true;
    // result.payload = ver
    // const info = jwt.decode(token);
    // console.log("info", info);
  } catch (e) {
    console.log(e);
    result.error = e;
  }
  return result;
}
export function getCookie(cookieStr: String, cname: String) {
  var name = cname + "=";
  if( !cookieStr )return ""
    var ca = cookieStr.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
}
export async function goingToOrigin(request: Request) {
  let headers = new Headers({
    "content-type": "text/html"
  });
  return new Response(giveOriginWarnPage(), { headers });
  
}
export function getTokenFromRequest(request: Request) {
  let token = getCookie(request.headers.get("cookie"), "token")
  if (!token) {
    try {
      token = request.headers.get("Authorization").substring(7)
    } catch (e) {
      console.log(e);
    }
  }
  return token
}