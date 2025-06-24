import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm"; 

export async function POST(req) {
  const user = await currentUser();

  if (!user || !user.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "User not authenticated or missing email." }, { status: 401 });
  }

  try {
    // Check if user already exists
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.primaryEmailAddress.emailAddress));

    if (users.length === 0) {
      // Insert new user
      const result = await db
        .insert(usersTable)
        .values({
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          credits: 10,
        })
        .returning();
        console.log(result[0])
      return NextResponse.json(result[0]);
    }
    // User already exists
    return NextResponse.json(users[0]);
  } catch (e) {
    console.error("Error inserting user:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
