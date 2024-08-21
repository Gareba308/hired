import NextAuth from "next-auth/next";
import { db } from "@/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import cryptoRandomString from "crypto-random-string";

interface Color {
  name: string;
  bg: string;
  text: string;
}

const colors = [
  { name: "sky", bg: "#bae6fd", text: "#0284c7" },
  { name: "emerald", bg: "#a7f3d0", text: "#059669" },
  { name: "teal", bg: "#99f6e4", text: "#0d9488" },
  { name: "indigo", bg: "#c7d2fe", text: "#4f46e5" },
  { name: "slate", bg: "#e2e8f0", text: "#475569" },
];

function getRandomColor(colors: Color[]): Color {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

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
    // added this signIn callback, can be removed
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google" && credentials?.userType) {
        (account as any).userType = credentials.userType;
      }
      return true;
    },
    jwt: async ({ user, token, account }): Promise<JWT> => {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? "";
        token.email = user.email;
        token.role = user.role;
      }
      if (account?.userType) {
        token.userType = account.userType;
      } else if (token.role) {
        token.userType = token.role;
      }
  
      return token;
    },

    session: async ({ session, token,trigger, newSession }): Promise<Session> => {
      if (session.user) {
        session.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.role = (token.userType as string) ?? "";
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
    signIn: "/home/login",
    error: "/error",
  },

  // added this event, can be removed
  events: {
    signIn: async ({ user, isNewUser, account, }) => {
      if (account && account.provider === "google") {
        if (user && isNewUser) {
          let dbUser = await db.user.findFirst({
            where: {
              email: user.email as string,
            },
          });
  
          if (dbUser) {
            if (dbUser.role === "worker") {
              const isWorker = await db.workers.create({
                data: {
                  workerEmail: dbUser.email,
                },
              });
  
              await db.workerCreditPoints.create({
                data: {
                  userEmail: dbUser.email,
                  isWorkerID: isWorker.id,
                },
              });

              await db.user.update({
                where: {
                  id: dbUser.id
                },
                data: {
                  referralCode: cryptoRandomString({
                    length: 8,
                    type: "alphanumeric",
                  }),
                }
              })
            }
  
            dbUser = await db.user.findFirst({
              where: {
                email: user.email as string,
              },
            });
            user.role = dbUser?.role as string;
          }
        }
      }
    },
  },
};

const handlers = NextAuth(authOptions);

export { handlers as GET, handlers as POST };