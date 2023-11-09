import { getUserSesion } from "@/src/lib/utils";
import { SendMessageValidator } from "@/src/lib/validators/SendMessageValidator";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  // endpoint for asking a question to a PDF file

  const body = await req.json();

  const user = getUserSesion();

  const { id: userId } = user;
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { fileId, message } = SendMessageValidator.parse(body);
  
}