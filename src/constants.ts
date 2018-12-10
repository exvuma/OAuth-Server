export const clientSecret = "vicsecret";
export const credentials = {
    client: {
        id: "victoriasclient",
        secret: "victoriassecret"
    },
    storage: {
        secret: "somesecrettodecryptfromtheKV"
    }

};
export const hosts = {
    auth: "https://error-backup.tk/oauth",
    token: "https://missv.info/token",
}
export const paths = {
    auth: {
        authorize: hosts.auth + "/authorize",
        callback: hosts.auth + "/callback",
        home: hosts.auth + "/home",
        login: hosts.auth + "/login",
        storeCode: hosts.auth + "/code",
    },
    token: {
        resource: hosts.token + "/resource",
        token: hosts.token + "/authorize",
    }
}
// export const oauth_route = credentials.auth.authHost + "/oauth";
// export const oauth_token_route =
//     credentials.auth.tokenHost + "/token";
//protected user information
// export const token_root = "https://error-backup.tk/token"
export const accessToken = "123"
export const userInfo = {
    email: "someuser@ex.com",
    id: 123,
    pwd: "really-dumbed-down-pwd",
    install: {
        options: {
            color: "red"
        }
    }
};


export const init = {
    headers: {
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Headers': "*",
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE,PATCH',

        "content-type": "application/json"
    }
};
export const Cloudflare = {
    api_key: "<redacted>",
    api_email: "victoria@cloudflare.com",
    id: "",
    tokens_id: "4ddfd2890aa04debba7b765d5dda4512",
    codes_id: "15be3acbc472419e86184df527d8c999",
    users_id: "4e8a01ed8eae4c3bb59b397d442889da",
    account_id:"323b0253f67c95c7bf534629f3d2fc04",
    url:"https://api.cloudflare.com/client/v4/accounts/"

}