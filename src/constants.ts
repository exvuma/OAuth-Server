import { hosts } from "./private";

export const credentials = {
    client: {
        id: "victoriasclient",
        secret: "victoriassecret"
    },
    storage: {
        secret: "somesecrettodecryptfromtheKV"
    }

};

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
// bogus user info
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
        //to avoid cors issue is using different hosts for token and auth servers
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Headers': "*",
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE,PATCH',

        "content-type": "application/json"
    }
};
