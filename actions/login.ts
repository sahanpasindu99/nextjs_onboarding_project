"use server";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { generateTwoFactorToken } from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByuserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>,callbackUrl?:string | null) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validatedFields.data;

  const exisitingUser = await getUserByEmail(email);

  if (!exisitingUser || !exisitingUser.email || !exisitingUser.password) {
    return { error: "User email does not exist!" };
  }

  if (!exisitingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      exisitingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation Email Sent!" };
  }

  if (exisitingUser.isTwoFactorEnabled && exisitingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(
        exisitingUser.email
      );

   

      if (!twoFactorToken) {
        return { error: "Invalid code" };
      }

      if (twoFactorToken.token !== code) {
        console.log({
            twoFactorToken,
            code
        })
        return { error: "Invalid code" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "code has expired" };
      }

      await db.twoFactorToken.delete({
        where:{id: twoFactorToken.id},
    });

       const existingConfirmation=await getTwoFactorConfirmationByuserId(exisitingUser.id);
      
       if(existingConfirmation){
        await db.twoFactorConfirmation.delete({
            where:{id:existingConfirmation.id}
        })
       }
        await db.twoFactorConfirmation.create({
            data:{userId:exisitingUser.id}
        })


    } else {
      const twoFactorToken = await generateTwoFactorToken(exisitingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl ||DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "something went wrong!" };
      }
    }
    throw error;
  }
};
