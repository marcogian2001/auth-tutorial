"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { NewPassowrdSchema } from "@/schemas";
import { hash } from "bcryptjs";
import * as z from "zod";

export const newPassword = async (
  values: z.infer<typeof NewPassowrdSchema>,
  token: string | null
) => {
    console.log(values, token);
  if (!token) {
    return { error: "Invalid token" };
  }

  const validatedFileds = NewPassowrdSchema.safeParse(values);

  if (!validatedFileds.success) {
    return { error: "Invalid fields" };
  }

  const { password } = validatedFileds.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User does not exist" };
  }

  const hashedPassword = await hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password updated" };
};
