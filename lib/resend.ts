import {Resend} from "resend"  //1
import { env } from "./env"
export const resend = new Resend(env.RESEND_API_KEY)