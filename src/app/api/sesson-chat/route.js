import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm"; 


export async function GET(req) {
    const {searchParams} = new URL(req.url);   
    const sessionId = searchParams.get("sessionId");
    const user = await currentUser();


    const result = await db
        .select()
        .from(SessionChatTable)
        .where(eq(SessionChatTable.sessionId, sessionId));


    return NextResponse.json(result);

}