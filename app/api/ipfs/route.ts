import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { imageContent } = await req.json();

  try {
    const buffer = Buffer.from(imageContent, "base64");
    const blob = new Blob([buffer]);
    const file = new File([blob], "file");
    const data = new FormData();
    data.append("file", file);

    const upload = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: data,
      },
    );
    const uploadRes = await upload.json();
    console.log(uploadRes);
    return NextResponse.json({ result: uploadRes });

  } catch (error) {
    console.log(error);
  }
}
