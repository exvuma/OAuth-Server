import { userInfo, credentials, paths, init } from "./constants"

export function giveOAuthAcceptPage(request: Request, code: String) {
    let req_url = new URL(request.url);
    let redirect_url = encodeURI(req_url.searchParams.get("redirect_uri"));
    return `<!DOCTYPE html>
    <html>
    <script>
    function accept(){

        console.log(" code in accpt", "${code}")
        let loc = "${redirect_url}?code=${code}&email=${userInfo.email}&client_id=${credentials.client.id}"; 
         window.location.href= loc
    }
    </script>
    <body>
        from hlper
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
export function giveLoginPage(request: Request, token: String) {
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
                "Authorization": token
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
<body id="body_id">
    from helper <br> 
<button onClick=login()> First step of Oauth </button>
<button onClick=getResults()> Results </button>

</body>
</html>

`;
}

// export async function setJWTHeader(request: Request) {
//     console.log('Got request', request)
//     // const response = await fetch(request)
//     //console.log('Got response', response)
//     // const token = request.headers.get("Authorization")

//     let token = request.headers.get("Authorization").substring(7)// string out "bearer "
//     const headers = {
//         "content-type": "text/html"
//     }
//     const init = { headers }
//     return new Response(html, init)
// }
