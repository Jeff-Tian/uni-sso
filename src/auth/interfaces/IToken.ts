export interface IToken {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
}

export interface IKeycloakToken extends IToken {
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}
