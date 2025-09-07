import arcjet, {detectBot,fixedWindow,protectSignup,sensitiveInfo,shield,slidingWindow} from "@arcjet/next"
import { env } from "./env" //1

export {
    detectBot,fixedWindow,protectSignup,sensitiveInfo,shield,slidingWindow
}

export default arcjet(
    {
    key:env.ARCJET_KEY,
    characteristics:["fingerprint"],

    //define base rule here,can also be empty if y dont wnat to have any base rule
    rules:[
        shield({
            mode:'LIVE'
        }) 
    ]
    }
)