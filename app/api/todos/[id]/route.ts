import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT /api/todos/[id]
export async function PUT(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const { title, completed } = await request.json();
  const todo = await prisma.todo.update({
    where: { id },
    data: {
      title,
      completed,
    },
  });

  return NextResponse.json(todo);
}

// DELETE /api/todos/[id]
export async function DELETE(
  _request: Request,
  { params: { id } }: { params: { id: string } }
) {
  await prisma.todo.delete({
    where: { id },
  });

  return NextResponse.json({ status: "OK" });
}
