import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/todos
export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(todos);
}

// POST /api/todos
export async function POST(request: Request) {
  const { title } = await request.json();

  const todo = await prisma.todo.create({
    data: {
      title,
    },
  });

  return NextResponse.json(todo);
}
