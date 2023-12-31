import type { User, ExternalAccount, Verification } from "@clerk/clerk-sdk-node";

export interface GoogleAccount{
    object: "google_account"
    id: string
    google_id: string
    approved_scopes: string,
    email_address: string
    given_name: string,
    family_name: string
    picture: string
    username: string|null
    public_metadata: Record<string, unknown> | null
    label: string|null
    verification: Verification|null
}

type UnknownExternalAccount = ExternalAccount | GoogleAccount

export interface ClerkUser extends User {
    readonly externalAccounts: UnknownExternalAccount[]
}

export const isGoogleAccount = (x: unknown): x is GoogleAccount => x.object === 'google_account'