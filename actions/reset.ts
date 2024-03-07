"use server";
import * as z from "zod";
import { getUserByEmail } from "@/data/user";
import { ResetSchema } from "@/schemas";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFileds = ResetSchema.safeParse(values);

  if (!validatedFileds.success) {
    return { error: "Invalid fields" };
  }

  const { email } = validatedFileds.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  if (!passwordResetToken) {
    return { error: "Error generating reset token" };
  }
  await sendPasswordResetEmail(email, passwordResetToken.token);
  
  return { success: "Reset link sent" };
};
