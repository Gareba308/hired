import NextAuth from "next-auth/next";
import { db } from "@/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "johnsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials.email) {
          throw new Error(
            "Please enter your valid email or re-enter the email"
          );
        }

        if (!credentials.password) {
          throw new Error("Please enter your correct password");
        }
        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
            accounts: {
              none: {
                provider: {
                  equals: "google",
                },
              },
            },
          },
        });

        if (!user || !user?.password) {
          throw new Error(
            "User by the provided details not found or could have signed up using Google gateway"
          );
        }

        const verified = await db.user.findFirst({
          where: {
            email: credentials.email,
            emailVerified: {
              equals: true,
            },
          },
        });

        if (!verified) {
          throw new Error(
            "User has not been verified. Register or confirm your email."
          );
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("You entered an incorrect password");
        }

        return user as any;
      },
    }),
  ],

  callbacks: {
    jwt: async ({ user, token }): Promise<JWT> => {
      return { ...user, ...token };
    },

    session: async ({ session, token }): Promise<Session> => {
      if (session.user) {
        session.id = token.id;
        session.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/signout",
    error: "/error",
    verifyRequest: "/auth/verify-request",
  },
};

const handlers = NextAuth(authOptions);

export { handlers as GET, handlers as POST };
