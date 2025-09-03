import NextAuth, { DefaultSession } from "next-auth";
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
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) {
        async signIn(account) {
            if (!account.user.email) {
                return false;
            }
            await prisma.user.upsert({
                where: { email: account.user.email },
                update: {}, 
                create: {
                    email: account.user.email,
                    provider: "Google",
                },
            });
            return true
        },
    },
})

export { handler as GET, handler as POST }





























