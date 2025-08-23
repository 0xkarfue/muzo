import NextAuth, {DefaultSession} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/app/lib/db";

const handler = NextAuth({
    // providers start all providers in here github, google, twitter, etc
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) {
        async signIn(account) {
            if (!account.user.email) {
                return false;
            }
            await prisma.user.create({
                data: {
                    email: account.user.email,
                    provider: "Google"
                }
            })
            return true
        },
        async session({session, token}) {
            if(session.user) {
                session.user.id = token.sub ?? ""
            }
            return session
        }
    },
})

export { handler as GET, handler as POST }































// import { prisma } from "@/app/lib/db";
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions = {

//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID || "",
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
//         })
//     ],

//     callbacks: {
//         // @ts-ignore
//         async signIn({user}) {
//             if(!user.email) {
//                 return false;
//             }
//             await prisma.user.create({
//                 data: {
//                     email: user.user.email ,
//                     provider: "Google",
//                 }
//             })
//             return true;
//         }
//     }
// }

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };