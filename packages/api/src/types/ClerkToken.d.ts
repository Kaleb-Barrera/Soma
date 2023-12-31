import type { OauthAccessTokenJSON } from '@clerk/clerk-sdk-node';

export interface ClerkError {
    errors: [
        {
            message: string;
            long_message: string;
            code: string;
            meta: object;
            clerk_trace_id: string;
        },
    ];
    meta: object;
}

export type TokenResponse = OauthAccessTokenJSON[] | ClerkError;

export const isClerkError = (x: unknown): x is ClerkError => !!x.errors;
export const isOauthAccessToken = (x: unknown): x is OauthAccessTokenJSON =>
    x.object === 'oauth_access_token';
