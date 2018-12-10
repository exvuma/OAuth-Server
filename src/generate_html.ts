import {
  userInfo,
    credentials,
  paths
  
} from "./constants";
// export function giveOAuthAcceptPage(request: Request, code: String) {
//     let req_url = new URL(request.url);
//     console.log("");
//     console.log(" req_url.searchParams", req_url.searchParams);
    
//     let redirect_url = encodeURI(req_url.searchParams.get("redirect_uri"));
    
//     console.log("redirect", redirect_url);
    

//     if (redirect_url) {
//         return loginModal()
//         let html =  `<!DOCTYPE html>
//           <html>
//           <script>
//           function accept(){
      
//               console.log(" code in accpt", "${code}")
//               let loc = "${redirect_url}?code=${code}&email=${userInfo.email}&client_id=${credentials.client.id}"; 
//               window.location.href= loc
//           }
//           </script>
//           <body>
//               <form>
      
//               <button onClick=accept()> Accept</button>
//           </body>
//           </html>
//           `;
//         return html
        
        
//     }
//     else {
//         return loginModal()
//     }

// }
// export function giveUserPage(request: Request, token: String) { 
//     return `<!DOCTYPE html>
//     <html>
//     <script>
//     function getCookie(cname) {
//     var name = cname + "=";
//     var ca = document.cookie.split(';');
//     for(var i = 0; i < ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
//     }
//     function getResults(){
//         const token = getCookie("token")
//         console.log(token)
//         let init = {}
//         if(token) {
//             init = {
//                 headers: {
//                     "Authorization": token
//                 }
//             }
//         }else{
//             let mes = "no token"
//             var node = document.createElement("li");
//             var textnode = document.createTextNode(JSON.stringify(mes));
//             node.appendChild(textnode);
//             document.getElementById("body_id").appendChild(node);
//             return
//         }
//         fetch( "${paths.token.host}/resource", init).then( res =>{
//             console.log(init)
//             console.log(res)
//             if(res.ok)
//             return res.json()
//             else throw(res.text())
//         })
//         .catch(err =>{ throw(err)})
//         .then(body =>
//             {
//                 console.log(body)
//                 var node = document.createElement("LI");                 
//                 var textnode = document.createTextNode(JSON.stringify(body));         
//                 node.appendChild(textnode);                             
//                 document.getElementById("body_id").appendChild(node);  
//             })
//         .catch(er=>{
//                 console.log(er)
//                 var node = document.createElement("li");                 
//                 var textnode = document.createTextNode(JSON.stringify(er));         
//                 node.appendChild(textnode);                             
//                 document.getElementById("body_id").appendChild(node);  
//         })
//     }
//     </script>
//     <body>
//     <body id="body_id">
//         <button onClick=getResults()> Results </button>
//     </body>
//     </html>
//     `;
// }
// export function giveOAuthRequestPage(request: Request) {
//   return `<!DOCTYPE html>
// <html>
// <script>
// function getCookie(cname) {
//     var name = cname + "=";
//     var ca = document.cookie.split(';');
//     for(var i = 0; i < ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }
// function login(){
//     console.log("senidng away")
//       let authorizationUri = new URL(${paths.auth.host + paths.auth.authorizePath});
//   authorizationUri.searchParams.set("scope", "user.read");
//   authorizationUri.searchParams.set("state", "someState");
//   authorizationUri.searchParams.set("response_type", "code");
//   authorizationUri.searchParams.set("client_id", ${credentials.client.id});
//   authorizationUri.searchParams.set("redirect_uri", ${paths.auth.host +paths.auth.homePath});

//     let loc = authorizationUri
//     // let loc = "${paths.auth.host}/callback?redirect_uri="+ window.location.href +"&email=${userInfo.email}&client_id=${credentials.client.id}"; 
//     console.log(loc)
//     window.location.href= loc
// }
// function getResults(){
//     const token = getCookie("token")
//     console.log(token)
//     let init = {}
//     if(token) {
//         init = {
//             headers: {
//                 "Authorization": token
//             }
//         }
//     }else{
//         let mes = "no token"
//         var node = document.createElement("li");                 
//         var textnode = document.createTextNode(JSON.stringify(mes));         
//         node.appendChild(textnode);                             
//         document.getElementById("body_id").appendChild(node);
//         return
//     }
//     fetch( "${token_root}/resource", init).then( res =>{
//         console.log(init)
//         console.log(res)
//         if(res.ok)
//         return res.json()
//         else throw(res.text())
//     })
//     .catch(err =>{ throw(err)})
//     .then(body =>
//         {
//             console.log(body)
//             var node = document.createElement("LI");                 
//             var textnode = document.createTextNode(JSON.stringify(body));         
//             node.appendChild(textnode);                             
//             document.getElementById("body_id").appendChild(node);  
//         })
//     .catch(er=>{
//             console.log(er)
//             var node = document.createElement("li");                 
//             var textnode = document.createTextNode(JSON.stringify(er));         
//             node.appendChild(textnode);                             
//             document.getElementById("body_id").appendChild(node);  
//     })
// }
    
// </script>
// <body id="body_id">
//     <button onClick=login()> Ask OAuth Server for Permission </button>
//     <button onClick=getResults()> Results </button>

// </body>
// </html>

// `;
// }

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
        403 returned
    </body>
    </html>
    `;
}
// export function loginModalScript() {
// // Get the modal
// var modal = document.getElementById('id01');

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
//     var TestVar = form.inputbox.value;
//     console.log(TestVar)

// }

export function loginHTML(): string {
  return `  
  <form class="" action="${paths.auth.storeCode}" id="form_id" method="post">
    <div class="container">
      <label for="un"><b>Username</b></label>
      <input type="text" placeholder="Enter Username" name="un" required>

      <label for="pwd"><b>Password</b></label>
      <input type="password" placeholder="Enter Password" name="pwd" required>

      <button type="submit">Login</button>
    </div>
  </form>` }
export function modalHTML() : string { return  `
<!-- The Modal -->
<div class="modal" id="id01">
  <span onclick="document.getElementById('id01').style.display='none'" 
class="close" title="Close Modal">&times;</span>

  <!-- Modal Content -->
  <form class="modal-content animate" action="/action_page.php">
    <div class="imgcontainer">
      <img src="img_avatar2.png" alt="Avatar" class="avatar">
    </div>

    <div class="container">
      <label for="uname"><b>Username</b></label>
      <input type="text" placeholder="Enter Username" name="uname" required>

      <label for="psw"><b>Password</b></label>
      <input type="password" placeholder="Enter Password" name="psw" required>

      <button type="submit">Login</button>
      <label>
        <input type="checkbox" checked="checked" name="remember"> Remember me
      </label>
    </div>

    <div class="container" style="background-color:#f1f1f1">
      <button type="button" onclick="document.getElementById('id01').style.display='none'" class="cancelbtn">Cancel</button>
      <span class="psw">Forgot <a href="#">password?</a></span>
    </div>
  </form>
  </div>`
}