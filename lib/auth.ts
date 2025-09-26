
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins"
import { resend } from "./resend";
import { admin } from "better-auth/plugins"
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders:{
        github:{
         clientId:env.AUTH_GITHUB_CLIENT_ID,
         clientSecret:env.AUTH_GITHUB_SECRET
        }
    },
    plugins: [ //3
        emailOTP({ 
            async sendVerificationOTP({ email, otp }) { 
                 await resend.emails.send({
                    from: 'SujitLms<onboarding@resend.dev>',
                    to: [email],
                    subject: 'SujitLms verify your email',
                    html:`<p>your otp is <strong> ${otp} </strong></p>`
                }); 
            }, 
        }) ,
        admin(),
    ]
});
