import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession()
    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })

    if (!user) {
        return NextResponse.json({
            msg: "Unauthenticated"
        })
    }


    return NextResponse.json({
        id: user.id
    })

    // const creatorId = req.nextUrl.searchParams.get("creatorId");
    // if (!creatorId) {
    //     throw new Error("error")
    // }
    // const streams = await prisma.stream.findMany({
    //     where: {
    //         userId: creatorId
    //     }
    // })

    // return NextResponse.json({
    //     streams
    // })

}