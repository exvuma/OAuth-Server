import { Cloudflare } from "./private"
import { resolve } from "url";
import { paths, userInfo } from "./constants";
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
    priority: number,
    src: string,
}
export interface Link {
    title: string,
    description: string,
    href: string,
}
export interface Permission {
    grantedByUserID: string,
    created: string,
    scope: string[],
}

export interface Permissions {
    [key: string]: Permission
}
export interface DNSRecord {
    iD: string
    type: string
    name: string
    content: string
    proxiable: boolean
    proxied: boolean
    tTL: number
    locked: boolean
    zoneID: string
    zoneName: string
    createdOn: Date
    modifiedOn: Date
    data: any
    meta: any
    priority: number
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
export interface JWTPayload {
    version?: string,
    iss?: string,
    sub: string,
    type: string,
    aud?: string,
    kid?: string,
    exp: number,
    iat: number
}
export interface Session {
    email: string,
    token: string,
    msg: string,
    pwd: string
}

export class Namespace {
    id: string
    url: string
    headers: { [key: string]: string }

    constructor(id: string) {
        this.id = id
        this.url = Cloudflare.url + Cloudflare.account_id
        this.headers = {
            "X-Auth-Email": Cloudflare.api_email,
            "X-Auth-Key": Cloudflare.api_key,
            "Content-Type": "application/json",
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

        return fetch(this.url + "/storage/kv/namespaces/" + this.id + "/values/" + key, init)
    }
    get(key: string): Promise<Response> {
        let init: RequestInit = {
            method: "GET",
            headers: new Headers(this.headers)
        }
        return fetch(this.url + "/storage/kv/namespaces/" + this.id + "/values/" + key, init)
    }
}

export function factoryIError(attrs: Partial<IError> = {}): IError {
    var error: IError = {
        type: '',
        fields: [],
        message: ''
    }
    return Object.assign(error, attrs)
}
export function factorySession(attrs: Partial<Session> = {}): Session {
    var sess: Session = {
        email: '',
        token: '',
        msg: '',
        pwd:''
    }
    return Object.assign(sess, attrs)
}
export function factoryCodeResponse(attrs: Partial<CodeResponse> = {}): CodeResponse {
    var codeResp: CodeResponse = {
        errors: [],
        un: ""
    }
    return Object.assign(codeResp, attrs)
}
export function factoryTokenResponse(attrs: Partial<TokenResponse> = {}): TokenResponse {
    var tokenResp: TokenResponse = {
        errors: [],
        access_token: "",
        token: "",
        token_type: "bearer",
        expires_in: Math.round((Date.now() / 1000) + (5 * 24 * 60 * 60)), /* expire in 5 days */

    }
    return Object.assign(tokenResp, attrs)
}
export function factoryJWTPayload(attrs: Partial<JWTPayload> = {}): JWTPayload {
    var JWTResp: JWTPayload = {
        iss: paths.token.token,
        sub: userInfo.email,
        type: "un/pwd",
        exp: Math.round((Date.now() / 1000) + ( 5 * 24 * 60 * 60)), /* expire in 5 days */
        iat: Math.round( Date.now() / 1000)
    }
    return Object.assign(JWTResp, attrs)
}
export function factoryHookResponse(attrs: Partial<HookResponse> = {}): HookResponse {
    var hookResp: HookResponse = {
        proceed: true,
        errors: [],
        install: factoryInstall({}),
    }
    return Object.assign(hookResp, attrs)
}
export function factoryInstall(attrs: Partial<Install> = {}): Install {
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