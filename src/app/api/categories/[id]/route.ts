import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const { name } = await request.json();
  const category = await prisma.category.update({ where: { id }, data: { name } });
  return NextResponse.json(category);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const count = await prisma.prompt.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: "Cannot delete category with existing prompts" },
      { status: 400 }
    );
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
