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
export function factoryIError(attrs: Partial<IError> = {}): IError { 
    var error: IError = {
        type: '',
        fields: [],
        message: ''
    }
    return Object.assign(error, attrs)
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