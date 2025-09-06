import { createAuthClient } from "better-auth/react"
import { emailOTPClient } from "better-auth/client/plugins";//4
export const authClient = createAuthClient({
    plugins: [ //4
        emailOTPClient()
    ]
})