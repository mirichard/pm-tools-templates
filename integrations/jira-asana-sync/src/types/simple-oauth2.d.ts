declare module 'simple-oauth2' {
  export class AuthorizationCode {
    constructor(config: any);
    authorizeURL(params: any): string;
    getToken(params: any): Promise<any>;
  }
}
