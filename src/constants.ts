export const clientSecret = "vicsecret";
export const credentials = {
    client: {
        id: "victoriasclient",
        secret: "victoriassecret"
    },

};
export const hosts = {
    auth: "https://error-backup.tk/oauth",
    token: "https://missv.info/token",
}
export const paths = {
    auth: {
        authorize: hosts.auth + "/authorize",
        callback: hosts.auth + "/callback",
        home: hosts.auth + "/home"
    },
    token: {
        token: hosts.token + "/authorize",
        resource: hosts.token + "/resource"
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