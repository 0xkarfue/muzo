"use server"

import { getServerSession } from "next-auth"
import { prisma } from "./db";

export default async function getCreatorId() {
    const session = await getServerSession();
    const email = session?.user?.email
    const user = await prisma.user.findFirst({
        where: {
            email: email ?? ""
        },
        select: {
            id: true
        }
    })
    return user?.id;
}