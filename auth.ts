import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { UserRole } from "@prisma/client";
import { db } from "./lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "./data/user";
import { getTwoFactorConfirmationByuserId } from "./data/two-factor-confirmation";
import {  getAccountByUserId } from "./data/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    // async signIn({user}:any){
    //    const existingUser=await getUserById(user.id);

    //    if(!existingUser || !existingUser.emailVerified){
    //     return false
    //    }
    //   return true;
    // },
    async signIn({ user, account }: any) {
      if (account?.provider !== "credentials") return true;

      const exisitingUser = await getUserById(user.id);

      if (!exisitingUser?.emailVerified) return false;

      if (exisitingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByuserId(
          exisitingUser.id
        );

        if (!twoFactorConfirmation) return false;

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled=token.isTwoFactorEnabled as boolean;
      }
      if(session.user){
        session.user.name=token.name;
        session.user.email=token.email as  string;
        session.user.isOAuth=token.isOAuth as boolean;
        
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const  existingAccount=await getAccountByUserId(existingUser.id)

      token.isOAuth= !!existingAccount;
      token.name=existingUser.name;
      token.email=existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled=existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
