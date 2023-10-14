import { sql } from '@vercel/postgres';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const petName = searchParams.get('petName');
  const ownerName = searchParams.get('ownerName');
 
  // try {
  //   if (!petName || !ownerName) throw new Error('Pet and owner names required');
  //   await sql`INSERT INTO Pets (Name, Owner) VALUES (${petName}, ${ownerName});`;
  // } catch (error) {
  //   return NextResponse.json({ error }, { status: 500 });
  // }
 
  const pets = pgTable('pets', {
    petName: text('name'),
    ownerName: text('owner'),
  });
  const db = drizzle(sql);
  const result = await db.select().from(pets);
  // const pets = await sql`SELECT * FROM Pets;`;
  return NextResponse.json({ result }, { status: 200 });
}
