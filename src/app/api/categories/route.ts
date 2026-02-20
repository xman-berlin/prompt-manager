import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { prompts: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const category = await prisma.category.create({ data: { name } });
  return NextResponse.json(category, { status: 201 });
}
