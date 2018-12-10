import { userInfo, credentials, paths, init } from "./constants"
import { factoryHookResponse, factoryIError } from "./types";


export function giveOriginWarnPage() {
    return `<!DOCTYPE html>
    <html>
    <body>
        Warning this link wants to go to origin
    </body>
    </html>
    `;
}
export function give403Page() {
    return `<!DOCTYPE html>
    <html>
    <body>
        403 unauthorized returned
    </body>
    </html>
    `;
}
export async function errorRouteNotFoundResponse(request: Request) {
    console.log("route not found");

    let respBody = factoryHookResponse({
        errors: [factoryIError({ message: "route not found on the token worker url: " + request.url})]
    })
    return new Response(JSON.stringify(respBody), init)
}
export function giveOAuthAcceptPage(request: Request) {
    let req_url = new URL(request.url);
    let redirect_url = encodeURI(req_url.searchParams.get("redirect_uri")) || "window.location";
    return `<!DOCTYPE html>
    <html>
        <script>
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
        function accept(){
            //Send the code to auth server to store
            const token = getCookie("token")
            // trade the credentials for a code
            let resp = await fetch("${paths.auth.storeCode}",{headers: {
                    "Authorization": token
            })
            let respBody = await resp.json()
            let code =respBody.code
            console.log("code", code)
            // redirect the browser to the URL specified by the callback link with this gathered code
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


export function giveLoginPage(request: Request) {
    let req_url = new URL(request.url);
    let redirect_url = encodeURI(req_url.searchParams.get("redirect_uri")) || "window.location";
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
            // trade the credentials for a code
            let resp = await fetch("${paths.auth.storeCode}", init)
            let respBody = await resp.json()
            let code =respBody.code
            console.log("code", code)
            // redirect the browser to the original URL with this gathered code
            let loc = "${redirect_url}?code=" + code + "&email="+ email +"&client_id=${credentials.client.id}"; 
            window.location.href= loc
            
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
        <form class="" id="form_id" method="post">
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
