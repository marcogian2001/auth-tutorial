import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    return await db.twoFactorToken.findUnique({
      where: {
        token,
      },
    });
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
      return await db.twoFactorToken.findFirst({
        where: {
          email,
        },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  };