
export const oauth_route = "https://missv.info/oauth"
export const app_route = "https://missv.info/oauth/app"
export const clientSecret = "vicsecret";


export function giveLoginPage(request: Request) {
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
    let loc = "${oauth_route}/callback?code=1111&un=vicasda&email=asdasd&client_id=12312"; 
    console.log(loc)
    window.location.href= loc
}
function getResults(){
    const token = getCookie("token")
    console.log(token)
    const init = {
     headers: {
        "Authorization": token
     }
    };
    fetch( "${oauth_route}/resource", init).then( res =>{
        console.log(res)
        return res.json()
    })
   .then(body =>
        {
            console.log(body)
            var node = document.createElement("LI");                 
            var textnode = document.createTextNode(JSON.stringify(body));         
            node.appendChild(textnode);                             
            document.getElementById("body_id").appendChild(node);  
        })

}
    
//  window.location.href="https://www.cloudflare.com/apps/oauth/?code=1111&username=vicasda&email=asdasd&client_id=12312"; 
</script>
<body id="body_id">

<button onClick=login()> Ask OAuth Server for Permission </button>
<button onClick=getResults()> Results </button>

</body>
</html>


`;
}
export function giveOAuthAcceptPage(request: Request) {
    let req_url = new URL(request.url)
    let redirect_url = req_url.searchParams.get("redirect_uri")
    let OAuth_html = `<!DOCTYPE html>
    <html>
    <script>
    function accept(){
        console.log("senidng away")
        let loc = "${redirect_url}?code=1111&un=vicasda&email=asdasd&client_id=12312"; 
        console.log(loc)
         window.location.href= loc
    }
    </script>
    <body>
        <button onClick=accept()> Accept</button>
    </body>
    </html>
    `;
    return OAuth_html
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