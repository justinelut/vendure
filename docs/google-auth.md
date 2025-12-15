# Google OAuth Authentication


The complete source of the following example plugin can be found here: example-plugins/google-auth-plugin

[example-plugins/google-auth-plugin](https://github.com/vendure-ecommerce/examples/tree/publish/examples/shop-google-auth)Google OAuth authentication allows customers to sign in using their Google accounts, providing a seamless experience that eliminates the need for password-based registration.

This is particularly valuable for consumer-facing stores where users prefer the convenience and security of Google's authentication system, or for B2B platforms where organizations use Google Workspace.

This guide shows you how to add Google OAuth support to your Vendure store using a custom AuthenticationStrategy and Google Identity Services.

[AuthenticationStrategy](/reference/typescript-api/auth/authentication-strategy/)An AuthenticationStrategy in Vendure defines how users can log in to your store. Learn more about authentication in Vendure.

[authentication in Vendure](/guides/core-concepts/auth/)
## Creating the Plugin​


[​](#creating-the-plugin)First, use the Vendure CLI to create a new plugin for Google authentication:

```
npx vendure add -p GoogleAuthPlugin
```

This creates a basic plugin structure with the necessary files.

[plugin](/guides/developer-guide/plugins/)
## Installing Dependencies​


[​](#installing-dependencies)Google authentication requires the Google Auth Library for token verification:

```
npm install google-auth-library
```

This library handles ID token verification securely on the server side, ensuring the tokens received from Google are authentic.

## Creating the Authentication Strategy​


[​](#creating-the-authentication-strategy)Now create the Google authentication strategy. Unlike traditional OAuth flows that use authorization codes, Google Identity Services provides ID tokens directly, which we verify server-side:

```
import {  AuthenticationStrategy,  ExternalAuthenticationService,  Injector,  Logger,  RequestContext,  User,} from '@vendure/core';import { OAuth2Client } from 'google-auth-library';import { DocumentNode } from 'graphql';import { gql } from 'graphql-tag';export type GoogleAuthData = {  token: string;}export interface GoogleAuthOptions {  googleClientId: string;  onUserCreated?: (ctx: RequestContext, injector: Injector, user: User) => void;  onUserFound?: (ctx: RequestContext, injector: Injector, user: User) => void;}export class GoogleAuthStrategy implements AuthenticationStrategy<GoogleAuthData> {  readonly name = 'google';  private client: OAuth2Client;  private externalAuthenticationService: ExternalAuthenticationService;  private logger: Logger;  private injector: Injector;  constructor(private options: GoogleAuthOptions) {    // Initialize Google OAuth2Client for token verification    this.client = new OAuth2Client(options.googleClientId);    this.logger = new Logger();  }  init(injector: Injector) {    // Get services we'll use for customer management    this.externalAuthenticationService = injector.get(ExternalAuthenticationService);    this.injector = injector;  }  defineInputType(): DocumentNode {    // Define the GraphQL input type for the authenticate mutation    return gql`      input GoogleAuthInput {        token: String!      }    `;  }  async authenticate(ctx: RequestContext, data: GoogleAuthData): Promise<User | false> {    try {      // Step 1: Verify the Google ID token      const ticket = await this.client.verifyIdToken({        idToken: data.token,        audience: this.options.googleClientId,      });      const payload = ticket.getPayload();      if (!payload || !payload.email) {        this.logger.error('Invalid Google token or missing email', 'GoogleAuthStrategy');        return false;      }      // Step 2: Check if this Google user already has a Vendure account      const existingUser = await this.externalAuthenticationService.findCustomerUser(        ctx,        this.name,        payload.sub, // Google's unique user ID      );      if (existingUser) {        // User exists, log them in        this.logger.verbose(`User found: ${existingUser.identifier}`, 'GoogleAuthStrategy');        this.options.onUserFound?.(ctx, this.injector, existingUser);        return existingUser;      }      // Step 3: Create a new customer account for first-time Google users      const createdUser = await this.externalAuthenticationService.createCustomerAndUser(ctx, {        strategy: this.name,        externalIdentifier: payload.sub, // Store Google user ID        verified: payload.email_verified || false, // Use Google's verification status        emailAddress: payload.email,        firstName: payload.given_name || 'Google',        lastName: payload.family_name || 'User',      });      this.options.onUserCreated?.(ctx, this.injector, createdUser);      return createdUser;    } catch (error) {      this.logger.error(`Google authentication failed: ${error.message}`, 'GoogleAuthStrategy');      return false;    }  }}
```

The strategy uses Google's OAuth2Client to verify ID tokens and Vendure's ExternalAuthenticationService to handle customer creation.

[OAuth2Client](https://googleapis.dev/nodejs/google-auth-library/latest/classes/OAuth2Client.html)[ExternalAuthenticationService](/reference/typescript-api/auth/external-authentication-service/)Key differences from other OAuth flows:

- ID Token Verification: Google provides signed JWT tokens that we verify directly
- No Code Exchange: Unlike GitHub OAuth, there's no authorization code to exchange
- Email Verification: We respect Google's email verification status
- Fallback Names: Provides defaults if Google profile lacks name information

## Registering the Strategy​


[​](#registering-the-strategy)Now update the generated plugin file to register your authentication strategy:

```
import { PluginCommonModule, VendurePlugin } from '@vendure/core';import { GoogleAuthStrategy } from './google-auth-strategy';export interface GoogleAuthPluginOptions {  googleClientId: string;}@VendurePlugin({  imports: [PluginCommonModule],  configuration: (config) => {    const options = GoogleAuthPlugin.options;    if (options?.googleClientId) {      config.authOptions.shopAuthenticationStrategy.push(        new GoogleAuthStrategy({ googleClientId: options.googleClientId })      );    }    return config;  },})export class GoogleAuthPlugin {  static options: GoogleAuthPluginOptions;  static init(options: GoogleAuthPluginOptions) {    this.options = options;    return GoogleAuthPlugin;  }}
```

## Adding to Vendure Config​


[​](#adding-to-vendure-config)Add the plugin to your Vendure configuration:

```
import { VendureConfig } from '@vendure/core';import { GoogleAuthPlugin } from './plugins/google-auth-plugin/google-auth-plugin.plugin';export const config: VendureConfig = {  // ... other config  plugins: [    // ... other plugins    GoogleAuthPlugin.init({      googleClientId: process.env.GOOGLE_CLIENT_ID!,    }),  ],  // ... rest of config};
```

## Setting up Google OAuth App​


[​](#setting-up-google-oauth-app)Before you can test the integration, you need to create a Google OAuth 2.0 Client:

- Go to the Google Cloud Console
- Create a new project or select an existing one
- Navigate to APIs & Services → Credentials
- Click "Create Credentials" → "OAuth 2.0 Client ID"
- Select "Web application" as the application type
- Configure the client:

Name: Your app name (e.g., "My Vendure Store")
Authorized JavaScript origins: http://localhost:3001
Authorized redirect URIs: http://localhost:3001/sign-in
- Name: Your app name (e.g., "My Vendure Store")
- Authorized JavaScript origins: http://localhost:3001
- Authorized redirect URIs: http://localhost:3001/sign-in

[Google Cloud Console](https://console.cloud.google.com/)- Name: Your app name (e.g., "My Vendure Store")
- Authorized JavaScript origins: http://localhost:3001
- Authorized redirect URIs: http://localhost:3001/sign-in

The localhost URLs shown here are for local development only. In production, replace localhost:3001 with your actual domain (e.g., https://mystore.com).

- Click "Create" and copy the Client ID

Add the client ID to your environment:

```
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

## Frontend Integration​


[​](#frontend-integration)
### Creating the Sign-in Component​


[​](#creating-the-sign-in-component)For the frontend, we'll use Google's official Identity Services library, which provides a secure and user-friendly sign-in experience:

```
'use client';import { useEffect, useState } from 'react';import { useRouter } from 'next/navigation';const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;declare global {  interface Window {    google: any;    handleCredentialResponse?: (response: any) => void;  }}export function GoogleSignInButton() {  const router = useRouter();  const [pending, setPending] = useState(false);  useEffect(() => {    // Define the callback function globally    window.handleCredentialResponse = async (response: any) => {      setPending(true);      try {        const result = await authenticateWithGoogle(response.credential);        if (result?.success) {          router.replace('/account');        } else {          console.error('Authentication failed:', result?.message);        }      } catch (error) {        console.error('Google authentication error:', error);      } finally {        setPending(false);      }    };    // Load Google Identity Services    if (!window.google && GOOGLE_CLIENT_ID) {      const script = document.createElement('script');      script.src = 'https://accounts.google.com/gsi/client';      script.async = true;      script.onload = () => {        window.google.accounts.id.initialize({          client_id: GOOGLE_CLIENT_ID,          callback: window.handleCredentialResponse,        });      };      document.head.appendChild(script);    }    return () => {      delete window.handleCredentialResponse;    };  }, [router]);  const handleGoogleSignIn = () => {    if (!GOOGLE_CLIENT_ID) {      console.error('Google Client ID not configured');      return;    }    if (window.google) {      window.google.accounts.id.prompt();    } else {      console.error('Google SDK not loaded');    }  };  return (    <button      onClick={handleGoogleSignIn}      disabled={pending}      className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"    >      {pending ? (        'Authenticating...'      ) : (        <>          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>          </svg>          Continue with Google        </>      )}    </button>  );}
```

### Creating the Authentication Function​


[​](#creating-the-authentication-function)Create a server action to handle the Google authentication:

```
'use server';import { gql } from 'graphql-request';const AUTHENTICATE_MUTATION = gql`  mutation AuthenticateWithGoogle($input: AuthenticationInput!) {    authenticate(input: $input) {      ... on CurrentUser {        id        identifier        channels {          code          token          permissions        }      }      ... on InvalidCredentialsError {        authenticationError        errorCode        message      }      ... on NotVerifiedError {        errorCode        message      }    }  }`;export async function authenticateWithGoogle(token: string) {  try {    const result = await vendureClient.request(AUTHENTICATE_MUTATION, {      input: {        google: {          token        }      }    });    if (result.authenticate.__typename === 'CurrentUser') {      // Authentication successful      return { success: true, user: result.authenticate };    } else {      // Handle authentication error      return {        success: false,        message: result.authenticate.message      };    }  } catch (error) {    console.error('Google authentication error:', error);    return {      success: false,      message: 'Authentication failed'    };  }}
```

Add your Google Client ID to the frontend environment:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.comVENDURE_API_ENDPOINT=http://localhost:3000/shop-api
```

The Google Identity Services flow works as follows:

- User clicks "Continue with Google" → Google popup appears
- User signs in with Google → Google returns an ID token
- Frontend sends the token to Vendure → Vendure verifies token with Google
- If valid, Vendure creates/finds customer → User is logged in

## Using the GraphQL API​


[​](#using-the-graphql-api)Once your plugin is running, Google authentication will be available in your shop API:

- Mutation
- Response

```
mutation AuthenticateWithGoogle {  authenticate(input: {    google: {      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."    }  }) {    ... on CurrentUser {      id      identifier      channels {        code        token        permissions      }    }    ... on InvalidCredentialsError {      authenticationError      errorCode      message    }    ... on NotVerifiedError {      errorCode      message    }  }}
```

```
{  "data": {    "authenticate": {      "id": "1",      "identifier": "user@gmail.com",      "channels": [        {          "code": "__default_channel__",          "token": "session_token_here",          "permissions": ["Authenticated"]        }      ]    }  }}
```

## Customer Data Management​


[​](#customer-data-management)Google-authenticated customers are managed like any other Vendure Customer:

[Customer](/reference/typescript-api/entities/customer/)- Email: Uses the user's actual Google email address
- Verification: Inherits Google's email verification status
- External ID: Google's unique user ID (sub claim) for future authentication
- Profile: First and last names from Google profile, with fallbacks
- Security: No password stored - authentication handled entirely by Google

This means Google users work seamlessly with Vendure's order management, promotions, and all customer workflows.

[order management](/guides/core-concepts/orders/)[promotions](/guides/core-concepts/promotions/)
## Testing the Integration​


[​](#testing-the-integration)To test your Google OAuth integration:

- Start your Vendure server with the plugin configured
- Navigate to your storefront and click "Continue with Google"
- Complete the Google OAuth flow when prompted
- Verify customer creation in the Vendure Dashboard
- Test repeat logins to ensure existing customers are found correctly