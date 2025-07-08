import { NextRequest, NextResponse } from "next/server";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE!;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const channelName = url.searchParams.get("channel");
  const uid = url.searchParams.get("uid") || "0"; // can be any string/number
  const role = RtcRole.PUBLISHER;
  const expireTimeSeconds = 3600; // 1 hour

  if (!channelName) {
    return NextResponse.json({ error: "channel is required" }, { status: 400 });
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expireTimeSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    Number(uid),
    role,
    privilegeExpiredTs
  );

  return NextResponse.json({ token });
}