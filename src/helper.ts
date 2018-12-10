import { userInfo, credentials, paths, init } from "./constants"
import {  } from "./generate_html"
import { log } from "util";



export function giveOAuthAcceptPage(request: Request) {
    let req_url = new URL(request.url);
    let redirect_url = encodeURI(req_url.searchParams.get("redirect_uri")) || "window.location";
    return `<!DOCTYPE html>
    <html>
        <script>
        function accept(){
            //Send the code to auth server to store
            {code, email} = await storeCode()
            let loc = "${redirect_url}?code=" + code + "&email="+ email +"&client_id=${credentials.client.id}"; 
            window.location.href= loc
        }
        </script>
        <body id="body_id>
            <button onClick=accept()> Accept</button>
        </body>
    </html>
        `;
    }
    export async function errorRouteNotFoundResponse(request: Request) {
        console.log("route not found");

    let respBody = {
        proceed: false,
        errors: ["route not found on the token worker url: " + request.url],
        install: {}
    }
    return new Response(JSON.stringify(respBody), init)
    }

export function giveLoginPage(request: Request) {
    return `
    <!DOCTYPE html>
<html>
    <script>
        function submitLogin(event){
             let form = document.getElementById("form_id")
            let body = {
                un: form.elements["un"].value,
                pwd: form.elements["pwd"].value
            }
            let init = {
                body: JSON.stringify(body), 
                method:"POST"
            }
            fetch("${paths.auth.storeCode}", init).then(res=>{
                console.log('fetching in browser the code' )
                console.log(res)
            }).catch(e=> console.log('e', e)
            )
        }
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
        function login(){
            console.log("senidng away")
            let loc = "${paths.auth.callback}/?redirect_uri="+ window.location.href +"&email=${
                userInfo.email
                }&client_id=${credentials.client.id}"; 
            console.log(loc)
            window.location.href= loc
        }
        function getResults(){
            const token = getCookie("token")
            console.log(token)
            let init = {}
            if(token) {
                init = {
                    headers: {
                        "Authorization": token,
                        // "Auth-Email": ${userInfo.email}
                    }
                }
            }else{
                let mes = "no token"
                var node = document.createElement("li");                 
                var textnode = document.createTextNode(JSON.stringify(mes));         
                node.appendChild(textnode);                             
                document.getElementById("body_id").appendChild(node);
                return
            }
            fetch( "${ paths.token.resource}", init).then( res =>{
                console.log(init)
                console.log(res)
                if(res.ok)
                return res.json()
                else throw(res.text())
            })
            .catch(err =>{ throw(err)})
            .then(body =>
                {
                    console.log(body)
                    var node = document.createElement("LI");                 
                    var textnode = document.createTextNode(JSON.stringify(body));         
                    node.appendChild(textnode);                             
                    document.getElementById("body_id").appendChild(node);  
                })
            .catch(er=>{
                    console.log(er)
                    var node = document.createElement("li");                 
                    var textnode = document.createTextNode(JSON.stringify(er));         
                    node.appendChild(textnode);                             
                    document.getElementById("body_id").appendChild(node);  
            })
        }
            
        </script>

    <body>
        <button onClick=getResults()> Results </button>
        ${paths.auth.storeCode}
        <form class="" action='${paths.auth.storeCode}' id="form_id" method="post">
            <div class="container">
                <label for="un"><b>Username</b></label>
                <input type="text" placeholder="Enter Username" name="un" required>

                <label for="pwd"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" name="pwd" required>

                <button type="submit" onclick="submitLogin()">Login</button>
            </div>
        </form>

    </body>

</html>

`;
}
