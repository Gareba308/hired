import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TRPCError, initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const header = headers();
  const cookiePairs = header.get("cookie");
  let viewID;
  for (const pair of cookiePairs ? cookiePairs.split(";") : []) {
    const [key, value] = pair.split("=").map((item) => item.trim());
    if (key === "__Host-next-auth.csrf-token" || key === "next-auth.csrf-token") {
      viewID = value;
      break;
    }
  }

  if (!viewID) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message:
        "We encourage you to login appropriately, to be able to view details about this job",
    });
  }

  const session = await getServerSession(authOptions);
  if (!session)
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User unauthorized" });

  const userId = session?.id;

  const user = session.user;

  const email = user?.email;

  const name = user?.name;

  if (!userId || !user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User does not exist",
    });
  }

  if (!email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User does not have an email",
    });
  }

  if (!name) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User does not have a name",
    });
  }
  return opts.next({
    ctx: {
      userId,
      name,
      email,
      viewID
    },
  });
});

const isViewAuth = middleware(async (opts) => {
  const header = headers();
  const cookiePairs = header.get("cookie");
  let viewID;
  for (const pair of cookiePairs ? cookiePairs.split(";") : []) {
    const [key, value] = pair.split("=").map((item) => item.trim());
    if (key === "__Host-next-auth.csrf-token" || key === "next-auth.csrf-token") {
      viewID = value;
      break;
    }
  }
  if (!viewID) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message:
        "We encourage you to login, to be able to view details about this job",
    });
  }

  const session = await getServerSession(authOptions);

  const userId = session?.id as string;

  const email = session?.user?.email as string;
  return opts.next({
    ctx: {
      userId,
      email,
      viewID,
    },
  });
});

const isContactAuth = middleware(async (opts) => {
  const header = headers();
  const cookiePairs = header.get("cookie");
  let viewID;
  for (const pair of cookiePairs ? cookiePairs.split(";") : []) {
    const [key, value] = pair.split("=").map((item) => item.trim());
    if (key === "__Host-next-auth.csrf-token" || key === "next-auth.csrf-token") {
      viewID = value;
      break;
    }
  }
  if (!viewID) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message:
        "We encourage you to login, to be able to view details about this job",
    });
  }

  const ipAddress = header.get("x-forwarded-for") || "Unknown";
  const location = header.get("user-agent") || "Unknown";

  return opts.next({
    ctx: {
      viewID,
      ipAddress,
      location,
    },
  });
});

const whitelistedIPs = [
  "196.201.214.200",
  "196.201.214.206",
  "196.201.213.114",
  "196.201.214.207",
  "196.201.214.208",
  "196.201.213.44",
  "196.201.212.127",
  "196.201.212.138",
  "196.201.212.129",
  "196.201.212.136",
  "196.201.212.74",
  "196.201.212.69",
];

const isIPWhitelisted = middleware(async (opts) => {
  const header = headers();
  const ip = header.get("x-forwarded-for") || header.get("remote-addr");

  // if (!ip || !whitelistedIPs.includes(ip)) {
  //   throw new TRPCError({
  //     code: "FORBIDDEN",
  //     message: "Your IP address is not whitelisted to access this resource",
  //   });
  // }

  return opts.next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
export const viewsProcedure = t.procedure.use(isViewAuth);
export const externalProcedure = t.procedure.use(isIPWhitelisted);
export const contactProcedure = t.procedure.use(isContactAuth);
