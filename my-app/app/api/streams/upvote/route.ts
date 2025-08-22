import { prisma } from "@/app/lib/db";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { string, z } from "zod"

const UpvoteSchema = z.object({
    streamId: string()
})

export async function POST(req: NextRequest) {

    const session = await getServerSession()

    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })

    if (!user) {
        NextResponse.json({
            msg: "Login first dumbass!"
        })
        // throw new Error("login first!");
    }


    try {
        const data = UpvoteSchema.parse(await req.json());
        const upvote = await prisma.upvote.create({
            data: {
                userId: user?.id ?? "",
                streamId: data.streamId,
            }
        })
        NextResponse.json(upvote)
    } catch (error) {
        console.log(error)
        NextResponse.json(error)
    }


}