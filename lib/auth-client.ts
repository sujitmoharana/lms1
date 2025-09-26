import { createAuthClient } from "better-auth/react"
import { emailOTPClient } from "better-auth/client/plugins";//4
import { adminClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({
    plugins: [ 
        emailOTPClient(),adminClient()
    ]
})