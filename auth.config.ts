import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs'
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import Google from "next-auth/providers/google"
// Notice this is only an object, not a full Auth.js instance
export default {

  providers: [
    Google({
       clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET_ID,
    }),
    Credentials({
      async authorize(credentials){
        const validatedFields= LoginSchema.safeParse(credentials);

        if(validatedFields.success){
          const {email, password}= validatedFields.data;

          const user=await getUserByEmail(email);
          if(!user || !user.password) return null;

          const passwordMatch=await bcrypt.compare(
            password,user.password
          );
          if (passwordMatch) return user;
        }

    return null;


      }
    })
  ],
} satisfies NextAuthConfig