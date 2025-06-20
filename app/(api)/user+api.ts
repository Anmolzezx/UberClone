import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(request: Request) {
  try {
    const { name, email, clerkID } = await request.json();

    if (!name || !email || !clerkID) {
      return Response.json(
        { error: "Missing required parameters." },
        { status: 400 },
      );
    }

    const response = await sql`
      INSERT INTO users (
        name,
        email,
        clerk_id
      ) VALUES (
        ${name},
        ${email},
        ${clerkID}
      )
      RETURNING *
    `;

    return new Response(JSON.stringify({ data: response }), { status: 201 });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
