import {Cloudflare} from "./private"
import { resolve } from "url";
export interface IError {
    type: string,
    message: string,
    fields: string[],
}
export interface Message {
    body: string,
    buttonText: string,
    buttonDestination: string,
    dismissButtonText: string,
}
export interface Worker {
    priority:  number,
    src:       string,
}
export interface Link {
    title :        string, 
    description :  string, 
    href :         string, 
}
export interface Permission  {
    grantedByUserID :  string,
    created :          string,
    scope : string[],
}

export interface Permissions{
    // map[string]Permission
    [key: string]: Permission
}
export interface DNSRecord {
    iD:          string
    type:        string
    name:        string
    content:     string
    proxiable:   boolean
    proxied:     boolean
    tTL:         number
    locked:      boolean
    zoneID:      string
    zoneName:    string
    createdOn:   Date
    modifiedOn:  Date
    data:        any
    meta:        any
    priority:    number
}
export interface Install {
    id: string,
    appId: string,
    versionTag: string,
    siteId: string,
    options?: any,
    schema?: any,
    private?: any,
    dNS: DNSRecord[],
    workers: Worker[],
    links: Link[],
    uRLPatterns: string[],
    pending: boolean,
    pastDue: boolean,
    installerUserId: string,
    subscriptionId: string,
    productId: string,
    amount: number,
    active: boolean,
    deactivatedAt?: string,
    refundedAt?: string,
    refundedAmount: number,
    refundId: string,
    deleted: boolean,
    metadata: any,
    permissions: Permissions,
    created?: string,
}
export interface HookResponse {
    proceed: boolean,
    errors?: IError[],
    message?: Message,
    install?: Install,
}
export interface CodeResponse {
    un: string,
    token?: string,
    code?: string,
    errors?: IError[],
}
export interface TokenResponse {
    access_token: string,
    token: string,
    expires_in: number,
    token_type?: string,
    refresh_token?: string,
    errors?: IError[],
}
// const Cloudflare = {
//     api_key: "dd7d1a2414d7a7479bb88abefdec7287a8fdc",
//     api_email: "victoria@cloudflare.com",
//     id: "",
//     tokens_id: "4ddfd2890aa04debba7b765d5dda4512",
//     codes_id: "15be3acbc472419e86184df527d8c999",
//     account_id: "323b0253f67c95c7bf534629f3d2fc04",
//     url: "https://api.cloudflare.com/client/v4/accounts/"

// }
 export class Namespace {
    id: string
    url: string
    headers: { [key: string]: string }
    
    constructor(id: string) {
        this.id = id
        this.url = Cloudflare.url + Cloudflare.account_id
        this.headers = { "X-Auth-Email" : Cloudflare.api_email, 
         "X-Auth-Key" : Cloudflare.api_key, 
         "Content-Type" : "application/json", 
        }
    }
    
    put(key: string, val: string): Promise<Response> {
        let init: RequestInit = {
            method: "PUT",
            body: JSON.stringify({
                value: val
            }),
            headers: new Headers(this.headers)
        }
        console.log("herree");
        
        return fetch(this.url + "/storage/kv/namespaces/" + this.id + "/values/" + key, init )
        // return new Promise((res, rej)=> resolve("da"))
    }
    get(key: string): Promise<Response> {
        let init: RequestInit = {
            method: "GET",
            headers: new Headers(this.headers)
        }
        return fetch(this.url + "/storage/kv/namespaces/" + this.id + "/values/" + key , init)
    }
}

// const codesKV = new Namespace(Cloudflare.codes_id)
// codesKV.put("john", "somecode")


export function factoryIError(attrs: Partial<IError> = {}): IError { 
    var error: IError = {
        type: '',
        fields: [],
        message: ''
    }
    return Object.assign(error, attrs)
}
export function factoryCodeResponse(attrs: Partial<CodeResponse> = {}): CodeResponse { 
    var codeResp: CodeResponse = {
        errors: [],
        un:""
    }
    return Object.assign(codeResp, attrs)
}
export function factoryTokenResponse(attrs: Partial<TokenResponse> = {}): TokenResponse { 
    var tokenResp: TokenResponse = {
        errors: [],
        access_token: "",
        token: "",
        token_type: "bearer",
        expires_in: 0
        
    }
    return Object.assign(tokenResp, attrs)
}
export function factoryHookResponse(attrs: Partial<HookResponse> = {}): HookResponse { 
    var hookResp: HookResponse = {
        proceed: true,
        errors: [],
        install: factoryInstall({}),
    }
    return Object.assign(hookResp, attrs)
}
export function factoryInstall(attrs: Partial<Install> = {} ): Install{
    var install: Install = {
        id: "",
        appId: "",
        versionTag: "",
        siteId: "",
        dNS: [],
        workers: [],
        links: [],
        uRLPatterns: [],
        pending: false,
        pastDue: false,
        installerUserId: "",
        subscriptionId: "",
        productId: "",
        amount: 0,
        active: false,
        refundedAmount: 0,
        refundId: "",
        deleted: false,
        metadata: {},
        permissions: {},
    }

    return Object.assign(install, attrs)
}