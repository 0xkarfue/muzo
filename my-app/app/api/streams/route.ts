import { NextRequest, NextResponse } from "next/server";
import { number, z } from "zod";
import { prisma } from "../../lib/db";

import youtubesearchapi from "youtube-search-api";

const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([A-Za-z0-9_-]{11})/

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string().url().refine(
        (val) =>
            val.includes("youtube.com") ||
            val.includes("youtu.be") ||
            val.includes("spotify.com"),
        {
            message: "URL must be from YouTube or Spotify",
        }
    ),
});

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const matchResult = data.url.match(youtubeRegex);
        if (!matchResult) {
            return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
        }
        const extractedId = matchResult[1];

        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        // console.log(res.title)
        // console.log(res.thumbnail)
        // console.log(res.thumbnail.thumbnails);
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: { width: number }, b: { width: number }) => a.width < b.width ? -1 : 1);
        const smallImgObj = (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2] : thumbnails[thumbnails.length - 1]);
        const bigImgObj = thumbnails[thumbnails.length - 1];

        const fallbackUrl = "https://play-lh.googleusercontent.com/R3oQgp4euQlsXUDaYuMes3K8JGtifoD-wrvHkq6q0xTYcROLiuYPqz3OBTZVWlrTq_k";

        const smallImg = smallImgObj?.url ?? fallbackUrl;
        const bigImg = bigImgObj?.url ?? fallbackUrl;

        await prisma.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",
                title: res.title ?? "Cant find",
                smallImg,
                bigImg
            }
        });
        return NextResponse.json({
            msg: "done"
        })
    } catch (error) {
        console.log(error)
        console.log("asasdfdfaslfjslfjsaldjflasjflsdj")
        return NextResponse.json(error)
    }
}


export async function Get(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    if (!creatorId) {
        throw new Error("error")
    }
    const streams = await prisma.stream.findMany({
        where: {
            userId: creatorId
        }
    })

    return NextResponse.json({
        streams
    })
}