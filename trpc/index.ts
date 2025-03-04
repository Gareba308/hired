import {
  externalProcedure,
  privateProcedure,
  publicProcedure,
  contactProcedure,
  router,
  viewsProcedure,
} from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import cryptoRandomString from "crypto-random-string";
import axios from "axios";
import { CronJob } from "cron";
import sanitizeHtml from "sanitize-html";
import {
  format,
  addMinutes,
  subMinutes,
  addDays,
  differenceInMinutes,
  subDays,
} from "date-fns";
import googleIndexAPI from "@/lib/indexing";
import googleIndexBlogAPI from "@/lib/indexingBlogs";
import { authorize } from "@/lib/indexAuth";

const generateID = () => {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 5; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
const productionBASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const emailPassword = process.env.PASSWORD;
const ourAdmins = process.env.ADMIN_EMAILS?.split(",") || [];
const hiredEmployers = process.env.HIRED_EMPLOYERS?.split(",") || [];
const removeHtmlTags = (htmlString: string): string => {
  const cleanedHtml = sanitizeHtml(htmlString, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const noHashString = cleanedHtml.replace(/#(\w+)/g, "$1");

  return noHashString;
};
const shortDescription = (htmlString: string): string => {
  const cleanedString = removeHtmlTags(htmlString);
  if (cleanedString.length > 300) {
    return `${cleanedString.slice(0, 300)}...`;
  }
  return cleanedString;
};

CronJob.from({
  cronTime: "0 */6 * * *",
  onTick: async function () {
    try {
      await googleIndexAPI();
      console.log("Google Indexing Task completed successfully.");
    } catch (error) {
      console.error("Error running Google Indexing Task:", error);
    }
  },
  start: true,
  timeZone: "America/Los_Angeles",
});
CronJob.from({
  cronTime: "0 13 * * *",
  onTick: async function () {
    try {
      await googleIndexBlogAPI();
      console.log("Google Indexing Blog Task completed successfully.");
    } catch (error) {
      console.error("Error running Google Indexing Blog Task:", error);
    }
  },
  start: true,
  timeZone: "America/Los_Angeles",
});

export const appRouter = router({
  // User Section
  registerUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        confirm_password: z.string(),
        role: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      interface Color {
        name: string;
        bg: string;
        text: string;
      }
      const { name, email, password, confirm_password, role } = input;

      if (!name || !email || !password || !confirm_password || !role)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There are some details lacking in application",
        });

      if (password.length < 6)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Minimum password length has to be 6 characters",
        });

      if (password !== confirm_password)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your passwords does not match",
        });

      const existsVerified = await db.user.findFirst({
        where: {
          email,
          emailVerified: {
            equals: true,
          },
        },
      });

      if (existsVerified)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User by that email exists",
        });

      const existsNotVerified = await db.user.findFirst({
        where: {
          email,
          emailVerified: {
            equals: false,
          },
        },
      });

      if (existsNotVerified)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "User by that email exists. Would you like to verify the email?",
        });

      const passwordHash = await bcrypt.hash(password, 10);
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

      const selectedColor = getRandomColor(colors);
      const verifyToken = cryptoRandomString({
        length: 30,
        type: "alphanumeric",
      });

      const verifyTokenExpiry = new Date();

      verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 1);
      const mainAdmin = ourAdmins.includes(email);

      const referralCode = cryptoRandomString({
        length: 8,
        type: "alphanumeric",
      });

      if (role === "worker" && !mainAdmin) {
        const exists = await db.workers.findFirst({
          where: {
            workerEmail: email,
          },
        });

        if (exists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This email has a registered user",
          });
        const createWorker = await db.workers.create({
          data: {
            workerEmail: email,
          },
        });

        await db.workerCreditPoints.create({
          data: {
            userEmail: email,
            isWorkerID: createWorker.id,
          },
        });
      }

      if (role === "employer" && !mainAdmin) {
        const exist = await db.employers.findFirst({
          where: {
            employerEmail: email,
          },
        });

        if (exist)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This email has a registered user",
          });
        const createEmployer = await db.employers.create({
          data: {
            employerEmail: email,
            bgColor: selectedColor.bg,
            bgTextColor: selectedColor.text,
          },
        });

        await db.accountBalance.create({
          data: {
            userEmail: email,
            isEmployerID: createEmployer.id,
          },
        });
      }

      if (role === "employer" && mainAdmin) {
        const exist = await db.admin.findFirst({
          where: {
            adminEmail: email,
          },
        });

        if (exist)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This email has a registered user",
          });
        await db.admin.create({
          data: {
            adminEmail: email,
          },
        });
      }

      if (role === "worker" && mainAdmin) {
        const exist = await db.admin.findFirst({
          where: {
            adminEmail: email,
          },
        });

        if (exist)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This email has a registered user",
          });
        await db.admin.create({
          data: {
            adminEmail: email,
          },
        });
      }

      const newRole = mainAdmin ? "admin" : role;
      await db.user.create({
        data: {
          name,
          email,
          referralCode,
          password: passwordHash,
          role: newRole,
        },
      });

      await db.verification.create({
        data: {
          verifyToken,
          verifyTokenExpiry,
          email,
          name,
          role: newRole,
        },
      });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Email Address Confirmation",
        html: `
          <div style="font-size: 14px; line-height: 22px; display: flex; justify-content: center; align-items: center; width: 100%; background: #f7fafa;">
              <div style="margin: 1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem; max-width: 900px; background: #fff;">
             <p>Hello ${name},</p>
             <p>Welcome to Hired Jobs! Please verify your email address by clicking the button below. The link expires in 1 hour.</p>
          <div style="text-align: center; margin: 1rem 0;">
            <a href="${productionBASE_URL}/home/activate/${verifyToken}" style="text-decoration: none;">
             <button style="color: white; padding: 0.5rem 1.5rem; background: #005580; font-size: 14px; border: none; border-radius: 4px; cursor: pointer;">Confirm Account</button>
             </a>
          </div>
            <p>This is an automated message. Please do not reply.</p>
            <p>If you did not sign up for Hired Jobs, kindly ignore this email.</p>
            <p>Follow us on Twitter/X: 
              <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
            </p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 1rem 0;">
            <p style="text-align: center; font-size: 14px;">&copy; Hired Jobs Kenya. All rights reserved.</p>
          </div>
          </div>
            `,
        priority: "high" as const,
      };

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    }),

  registerReferredUser: viewsProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        confirm_password: z.string(),
        name: z.string(),
        referrerUserId: z.string(),
        referrerEmail: z.string(),
        referrerName: z.string(),
        referrerRole: z.string(),
        referrerUniqueCode: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      interface Color {
        name: string;
        bg: string;
        text: string;
      }
      const {
        name,
        email,
        password,
        confirm_password,
        referrerUserId,
        referrerEmail,
        referrerName,
        referrerRole,
        referrerUniqueCode,
      } = input;
      const { viewID } = ctx;
      const referralWithViewIDExists = await db.userReferrals.findFirst({
        where: {
          inviteeViewID: viewID,
          myRole: {
            equals: referrerRole,
          },
          email: referrerEmail,
          userId: referrerUserId,
        },
      });
      if (!name || !email || !password || !confirm_password)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There are some details lacking in application",
        });

      if (password.length < 6)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Minimum password length has to be 6 characters",
        });

      if (password !== confirm_password)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your passwords does not match",
        });

      const existsVerified = await db.user.findFirst({
        where: {
          email,
          emailVerified: {
            equals: true,
          },
        },
      });

      if (existsVerified)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User by that email exists",
        });

      const existsNotVerified = await db.user.findFirst({
        where: {
          email,
          emailVerified: {
            equals: false,
          },
        },
      });

      if (existsNotVerified)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "User by that email exists. Would you like to verify the email?",
        });

      const passwordHash = await bcrypt.hash(password, 10);
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

      const selectedColor = getRandomColor(colors);
      const verifyToken = cryptoRandomString({
        length: 30,
        type: "alphanumeric",
      });

      const verifyTokenExpiry = new Date();

      verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 1);
      const mainAdmin = ourAdmins.includes(email);

      const referralCode = cryptoRandomString({
        length: 8,
        type: "alphanumeric",
      });

      if (referrerRole === "worker" && !mainAdmin) {
        const exists = await db.workers.findFirst({
          where: {
            workerEmail: email,
          },
        });

        if (exists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This email has a registered user",
          });
        const createWorker = await db.workers.create({
          data: {
            workerEmail: email,
          },
        });

        await db.workerCreditPoints.create({
          data: {
            userEmail: email,
            isWorkerID: createWorker.id,
          },
        });
      }

      if (referrerRole === "employer" && !mainAdmin) {
        const exist = await db.employers.findFirst({
          where: {
            employerEmail: email,
          },
        });

        if (exist)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This email has a registered user",
          });
        const createEmployer = await db.employers.create({
          data: {
            employerEmail: email,
            bgColor: selectedColor.bg,
            bgTextColor: selectedColor.text,
          },
        });

        await db.accountBalance.create({
          data: {
            userEmail: email,
            isEmployerID: createEmployer.id,
          },
        });
      }

      if (referrerRole === "employer" && mainAdmin) {
        const exist = await db.admin.findFirst({
          where: {
            adminEmail: email,
          },
        });

        if (exist)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This email has a registered user",
          });
        await db.admin.create({
          data: {
            adminEmail: email,
          },
        });
      }

      if (referrerRole === "worker" && mainAdmin) {
        const exist = await db.admin.findFirst({
          where: {
            adminEmail: email,
          },
        });

        if (exist)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This email has a registered user",
          });
        await db.admin.create({
          data: {
            adminEmail: email,
          },
        });
      }

      const newRole = mainAdmin ? "admin" : referrerRole;

      const checkUserReferralExists = await db.userReferrals.findFirst({
        where: {
          uniqueCode: referrerUniqueCode,
          inviteeEmail: email,
          userId: referrerUserId,
        },
      });

      if (checkUserReferralExists) {
        if (referralWithViewIDExists) {
          await db.userReferrals.update({
            where: {
              id: checkUserReferralExists.id,
              uniqueCode: referrerUniqueCode,
              inviteeEmail: email,
              userId: referrerUserId,
            },
            data: {
              inviteeViewID: viewID,
              recurringViewID: true,
            },
          });

          const transporter = nodemailer.createTransport({
            port: 587,
            host: "smtp.gmail.com",
            auth: {
              user: "gethiredinkenya@gmail.com",
              pass: emailPassword,
            },
            secure: false,
          });

          await new Promise((resolve, reject) => {
            transporter.verify(function (error, success) {
              if (error) {
                console.log(error);
                reject(error);
              } else {
                console.log("Server is ready to take our message");
                resolve(success);
              }
            });
          });

          const mailOptions = {
            from: {
              name: "Hired Jobs",
              address: "gethiredinkenya@gmail.com",
            },
            replyTo: "gethiredinkenya@gmail.com",
            to: checkUserReferralExists.email,
            subject: "Suspicious Referral Activities",
            html: `
                <div style="font-size: 14px; line-height: 22px; display: flex; justify-content: center; align-items: center; width: 100%; background: #f7fafa;">
                <div style="margin: 1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem; max-width: 900px; background: #fff;">
                  <p>Hello ${checkUserReferralExists.fullName},</p>
                  <p>
                    Our system has detected suspicious referral activity, and the referral has been flagged as "cheat." Please contact our support team for assistance. Note that more than three such flags may result in account suspension.
                  </p>
                  <p>This is an automated message. Please do not reply.</p>
                  <p>If you did not sign up for Hired Jobs, kindly ignore this email.</p>
                  <p>Follow us on Twitter/X: 
                    <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                  </p>
                  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 1rem 0;">
                  <p style="text-align: center; font-size: 14px;">&copy; Hired Jobs Kenya. All rights reserved.</p>
                </div>
              </div>

                `,
            priority: "high" as const,
          };

          await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                console.log(info);
                resolve(info);
              }
            });
          });
        } else {
          await db.userReferrals.update({
            where: {
              id: checkUserReferralExists.id,
              uniqueCode: referrerUniqueCode,
              inviteeEmail: email,
              userId: referrerUserId,
            },
            data: {
              inviteeViewID: viewID,
            },
          });
        }
      }

      if (!checkUserReferralExists) {
        if (referralWithViewIDExists) {
          await db.userReferrals.create({
            data: {
              userId: referrerUserId,
              fullName: referrerName,
              email: referrerEmail,
              inviteeEmail: email,
              inviteeName: name,
              uniqueCode: referrerUniqueCode,
              myRole: referrerRole,
              inviteeViewID: viewID,
              recurringViewID: true,
            },
          });
        } else {
          await db.userReferrals.create({
            data: {
              userId: referrerUserId,
              fullName: referrerName,
              email: referrerEmail,
              inviteeEmail: email,
              inviteeName: name,
              uniqueCode: referrerUniqueCode,
              myRole: referrerRole,
              inviteeViewID: viewID,
            },
          });
        }
      }

      await db.user.create({
        data: {
          name,
          email,
          referralCode,
          password: passwordHash,
          role: newRole,
          referred: true,
        },
      });

      await db.verification.create({
        data: {
          verifyToken,
          verifyTokenExpiry,
          email,
          name,
          role: newRole,
          referrerUniqueCode: referrerUniqueCode,
          referrerUserId: referrerUserId,
          referrerEmail: referrerEmail,
          referrerName: referrerName,
        },
      });
      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Email Address Confirmation",
        html: `
            <div style="font-size: 14px; line-height: 22px; display: flex; justify-content: center; align-items: center; width: 100%; background: #f7fafa;">
            <div style="margin: 1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem; max-width: 900px; background: #fff;">
              <p>Hello ${name},</p>
              <p>Welcome to Hired Jobs! Please verify your email address.</p>
              <p>Use the button below to confirm your email address. The link's token expires in 1 hour.</p>
            <div style="cursor: pointer; text-align: center; margin: 1rem 0;">
              <a href="${productionBASE_URL}/home/activate/${verifyToken}">
              <button style="color: white; padding: 0.3rem 1rem; background: #005580; font-size: 14.2px; line-height: 22px; cursor: pointer; border: none; border-radius: 4px;">
                Confirm Account
              </button>
              </a>
            </div>
              <p>This is an automated message. Please do not reply.</p>
              <p>If you did not sign up for Hired Jobs, kindly ignore this email.</p>
              <p>Follow us on Twitter/X: 
                <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
              </p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 1rem 0;">
              <p style="text-align: center; font-size: 14px;">&copy; Hired Jobs Kenya. All rights reserved.</p>
            </div>
            </div>

            `,
        priority: "high" as const,
      };

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    }),

  employerReferEmployers: privateProcedure
    .input(
      z.object({
        inviteeEmail: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { inviteeEmail } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
        select: {
          name: true,
          referralCode: true,
          role: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const fullName = dbUser.name as string;
      const referralCode = dbUser.referralCode as string;
      const role = dbUser.role as string;

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const invitationCode = cryptoRandomString({
        length: 9,
        type: "alphanumeric",
      });

      const inviteeExists = await db.user.findFirst({
        where: {
          email: inviteeEmail,
        },
      });

      if (inviteeExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The user you are inviting already exists in our system.",
        });

      const inviteeAlreadyInvited = await db.userReferrals.findFirst({
        where: {
          uniqueCode: referralCode,
          inviteeEmail: inviteeEmail,
          email: email,
          userId,
        },
      });

      if (inviteeAlreadyInvited)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Kindly note, this potential employer already has your pending invitation",
        });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: inviteeEmail,
        subject: `${fullName},${email} invites you to Hired`,
        html: `
               <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
              <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                  <p>Hello there,</p>
                  <p>
                  You are receiving this email because <b>${fullName}</b> of address ${email} has invited you to join Hired. 
                  Hired Kenya is a user friendly, affordable platform to source for skilled employees for your company/organization. 
                  Click on the button link below to sign up and automatically redeem your credit of Ksh.500 which you can use to post a job on the platform.
                  </p>
                  <div style='cursor: pointer;'><a href='${productionBASE_URL}/referrals/mailed/${invitationCode}'><button style='color:white; padding:.3rem 1rem; background:#005580; font-size:14.2px; line-height:22.22px; cursor:pointer;'>Confirm Account</button></a></div>
                  <p style='margin-top:0.5rem; font-size:12.5px'>Note: This is autogenerated email, please do not reply to this email.</p>
                  <hr>
                  <p style='text-align:center; font-size:12.5px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
              </div>
              </div>
              `,
        priority: "high" as const,
      };

      await db.userReferrals.create({
        data: {
          userId,
          fullName,
          email,
          myRole: role,
          inviteeEmail,
          invitationCode,
          uniqueCode: referralCode,
        },
      });

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    }),

  workerReferWorkers: privateProcedure
    .input(
      z.object({
        inviteeEmail: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { inviteeEmail } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
        select: {
          name: true,
          referralCode: true,
          role: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const fullName = dbUser.name as string;
      const referralCode = dbUser.referralCode as string;
      const role = dbUser.role as string;

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const invitationCode = cryptoRandomString({
        length: 9,
        type: "alphanumeric",
      });

      const inviteeExists = await db.user.findFirst({
        where: {
          email: inviteeEmail,
        },
      });

      if (inviteeExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The user you are inviting already exists in our system.",
        });

      const inviteeAlreadyInvited = await db.userReferrals.findFirst({
        where: {
          uniqueCode: referralCode,
          inviteeEmail: inviteeEmail,
          email: email,
          userId,
        },
      });

      if (inviteeAlreadyInvited)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Kindly note, this job seeker already has your pending invitation.",
        });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: inviteeEmail,
        subject: `${fullName},${email} invites you to Hired`,
        html: `
               <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
              <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                  <p>Hello there,</p>
                  <p>
                  You are receiving this email because <b>${fullName}</b> of address ${email} has invited you to join Hired. 
                  Hired Kenya is a user friendly, dynamic and very easy to use platform for potential job applicants. 
                  Click on the button link below to sign up and apply for any job that you meet the requirements.
                  </p>
                  <div style='cursor: pointer;'><a href='${productionBASE_URL}/referrals/mailed/${invitationCode}'><button style='color:white; padding:.3rem 1rem; background:#005580; font-size:14.2px; line-height:22.22px; cursor:pointer;'>Sign Up Now</button></a></div>
                  <p style='margin-top:0.5rem; font-size:12.5px'>Note: This is autogenerated email, please do not reply to this email.</p>
                  <p>Follow us on Twitter/X: 
                    <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                  </p>
                  <hr>
                  <p style='text-align:center; font-size:12.5px; line-height:22.22px;'>Copyright © Hired. All rights reserved.</p>
              </div>
              </div>
              `,
        priority: "high" as const,
      };

      await db.userReferrals.create({
        data: {
          userId,
          fullName,
          email,
          myRole: role,
          inviteeEmail,
          invitationCode,
          uniqueCode: referralCode,
        },
      });

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    }),

  workerRequestRedeem: privateProcedure
    .input(
      z.object({
        availablePoints: z.number().int(),
        subTotal: z.number().int(),
        tax: z.number().int(),
        totalPayable: z.number().int(),
        transactionFee: z.number().int(),
        paymentDate: z.coerce.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, email } = ctx;
      const {
        availablePoints,
        subTotal,
        tax,
        totalPayable,
        transactionFee,
        paymentDate,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
        select: {
          name: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, you have to login and try again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });
      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section",
        });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      const paymentID =
        "HK" +
        cryptoRandomString({
          length: 8,
          type: "alphanumeric",
        }).toUpperCase();

      const contactDetails = await db.workerContact.findFirst({
        where: {
          userId,
        },
        select: {
          phone: true,
        },
      });

      const creditPoints = await db.workerCreditPoints.findFirst({
        where: {
          userEmail: email,
        },
        select: {
          id: true,
          balance: true,
        },
      });

      if (!creditPoints)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you have no credit balance details",
        });

      if (creditPoints.balance < 10)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Your credit points balance is less that the minimum required 200 points",
        });

      await db.workerRequestRedeem.create({
        data: {
          fullName: dbUser.name as string,
          paymentID: paymentID,
          phoneNumber: contactDetails?.phone as string,
          paymentPhone: contactDetails?.phone as string,
          paymentDate,
          userId,
          isWorkerID: isWorker.id,
          email,
          availablePoints,
          subtotal: subTotal,
          tax,
          transactionFee,
          totalPayable,
        },
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Redeem credit points requested",
        html: `
          <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
              <p>Hello ${dbUser.name as string},</p>
              <p>We have received a request to have your <b>${availablePoints}</b> credit points redeemed to an equivalent of <b>Ksh.${totalPayable}</b>. Payments will be channeled to your mPesa <b>${contactDetails?.phone as string
          }</b> on <b>${format(paymentDate, "PPP")}</b>.</p>
            <p>Follow us on Twitter/X: 
              <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
            </p>  
            <hr>
              <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });

      return await db.workerCreditPoints.update({
        where: {
          id: creditPoints.id,
          userEmail: email,
        },
        data: {
          balance: {
            decrement: subTotal,
          },
          onRedeem: {
            increment: subTotal,
          },
        },
      });
    }),

  employerTopUp: privateProcedure
    .input(
      z.object({
        paymentPhone: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { paymentPhone, amount } = input;

      const formattedPhone = paymentPhone.startsWith("0")
        ? paymentPhone.slice(1)
        : paymentPhone;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login and try again",
        });
      }

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
      });

      if (!isEmployer) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is employers' only section",
        });
      }

      const companyExists = await db.company.findFirst({
        where: {
          userId: dbUser.id,
          isEmployerID: isEmployer.id,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have not created a user profile. Create your profile to continue.",
        });

      const currentDate = new Date();
      const thresholdDate = subMinutes(currentDate, 3);
      const topUpSameAmountPhoneLessFiveMinutesExists =
        await db.topUp.findFirst({
          where: {
            amount,
            paymentPhone: `254${formattedPhone}`,
            userId,
            createdAt: {
              gte: thresholdDate,
            },
          },
        });
      if (topUpSameAmountPhoneLessFiveMinutesExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "There is a similar request with same amount that is still pending. Give the system 3 minutes to clear it and try again.",
        });

      const getOtherPending = await db.topUp.findMany({
        where: {
          userId,
          paymentPhone: `254${formattedPhone}`,
        },
      });
      const pendingIDS = getOtherPending.flatMap((pending) => pending.id);
      if (getOtherPending.length > 0) {
        await db.topUp.deleteMany({
          where: {
            id: {
              in: pendingIDS,
            },
          },
        });
      }
      const oauthEndpoint =
        "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
      const consumer_key = process.env.CONSUMER_KEY;
      const consumer_secret = process.env.CONSUMER_SECRET;

      if (!consumer_key || !consumer_secret) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Missing consumer key or secret",
        });
      }

      const access = Buffer.from(`${consumer_key}:${consumer_secret}`).toString(
        "base64"
      );
      const oauthHeaders = {
        Authorization: `Basic ${access}`,
      };

      let access_token;
      try {
        const oauthResponse = await axios.get(oauthEndpoint, {
          headers: oauthHeaders,
        });
        if (oauthResponse.status !== 200) {
          throw new Error("Failed to fetch access token");
        }
        access_token = oauthResponse.data.access_token;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to fetch access token",
          cause: error,
        });
      }
      const date = new Date();
      const timeStamp = format(date, "yyyyMMddHHmmss");

      const shortCode = process.env.SHORT_CODE;
      const shortCode2 = process.env.SHORT_CODE2;
      const passkey = process.env.MPESA_PASSKEY;

      if (!shortCode || !shortCode2 || !passkey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Missing short code or passkey",
        });
      }

      const password = Buffer.from(
        `${shortCode}${passkey}${timeStamp}`
      ).toString("base64");

      const endPoint2 =
        "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
      const requestBody = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timeStamp,
        TransactionType: "CustomerBuyGoodsOnline",
        Amount: amount,
        PartyA: `254${formattedPhone}`,
        PartyB: shortCode2,
        PhoneNumber: `254${formattedPhone}`,
        CallBackURL: "https://www.hired.co.ke/api/trpc/callBackDetails",
        AccountReference: "Hired Jobs",
        TransactionDesc: "For everyone",
      };

      const headers = {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      };
      try {
        const apiResponse = await axios.post(endPoint2, requestBody, {
          headers,
        });
        if (apiResponse.status !== 200) {
          throw new Error("Failed to process payment");
        }

        const topUpData = await db.topUp.create({
          data: {
            userId,
            userEmail: dbUser.email,
            county: companyExists.county as string,
            town: companyExists.town as string,
            zip: companyExists.zip,
            postal: companyExists.postal as string,
            companyName: companyExists.company_name as string,
            companyID: companyExists.id,
            fullName: dbUser.name as string,
            isEmployerID: isEmployer.id,
            paymentPhone: `254${formattedPhone}`,
            amount,
          },
        });

        return {
          ...apiResponse.data,
          topUpData,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to initiate payment",
          cause: error,
        });
      }
    }),

  callBackDetails: externalProcedure
    .input(
      z.object({
        Body: z.object({
          stkCallback: z.object({
            MerchantRequestID: z.string(),
            CheckoutRequestID: z.string(),
            ResultCode: z.number(),
            ResultDesc: z.string(),
            CallbackMetadata: z.object({
              Item: z.array(
                z.object({
                  Name: z.string(),
                  Value: z.union([z.string(), z.number()]),
                })
              ),
            }),
          }),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const callbackData = input;
      if (!callbackData.Body.stkCallback.CallbackMetadata) {
        return "OK";
      }
      const metadataItems = callbackData.Body.stkCallback.CallbackMetadata.Item;
      const phoneItem = metadataItems.find(
        (item) => item.Name === "PhoneNumber"
      );
      const amountItem = metadataItems.find((item) => item.Name === "Amount");
      const transactionIDItem = metadataItems.find(
        (item) => item.Name === "MpesaReceiptNumber"
      );

      if (!phoneItem || !amountItem || !transactionIDItem) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing required callback metadata",
        });
      }

      const paymentPhone = String(phoneItem.Value);
      const amount = Number(amountItem.Value);
      const transactionID = String(transactionIDItem.Value);

      const getUserTopUp = await db.topUp.findFirst({
        where: {
          paymentPhone,
          amount,
        },
      });

      if (!getUserTopUp)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No initiated transaction from this user",
        });

      const existingTransaction = await db.payment.findFirst({
        where: {
          mPesaID: transactionID,
          amount: amount,
          companyID: getUserTopUp.companyID,
        },
      });

      if (existingTransaction)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There exists a similar transaction recorded",
        });
      const result = await db.payment.create({
        data: {
          paymentPhone,
          amount,
          mPesaID: transactionID,
          isEmployerID: getUserTopUp.isEmployerID,
          companyName: getUserTopUp.companyName,
          companyID: getUserTopUp.companyID,
          postal: getUserTopUp.postal,
          zip: getUserTopUp.zip,
          town: getUserTopUp.town,
          county: getUserTopUp.county,
          userId: getUserTopUp.userId,
          userEmail: getUserTopUp.userEmail,
          fullName: getUserTopUp.fullName,
        },
      });

      const accountExists = await db.accountBalance.findFirst({
        where: {
          isEmployerID: getUserTopUp.isEmployerID,
        },
      });

      if (!accountExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The user has no account balance details",
        });

      await db.accountBalance.update({
        where: {
          id: accountExists.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      await db.topUp.delete({
        where: {
          id: getUserTopUp.id,
        },
      });

      return {
        message: "Callback processed successfully",
        result,
      };
    }),

  adminCreateEmployerPlans: privateProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        unit: z.number(),
        feature1: z.string(),
        feature2: z.string(),
        feature3: z.string(),
        feature4: z.string(),
        feature5: z.string(),
        feature6: z.string(),
        forJobs: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        price,
        unit,
        feature1,
        feature2,
        feature3,
        feature4,
        feature5,
        feature6,
        forJobs,
      } = input;
      const { userId, email } = ctx;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is an admin section.",
        });

      const planNameExists = await db.employerPlans.findFirst({
        where: {
          name,
        },
      });

      if (planNameExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There is a plan with that similar plan name",
        });
      const planPriceExists = await db.employerPlans.findFirst({
        where: {
          price,
        },
      });

      if (planPriceExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There is a plan with that similar plan price",
        });

      return await db.employerPlans.create({
        data: {
          name,
          price,
          unit,
          feature1,
          feature2,
          feature3,
          feature4,
          feature5,
          feature6,
          forJobs,
          isAdminID: isAdmin.id,
        },
      });
    }),

  adminEditEmployerPlans: privateProcedure
    .input(
      z.object({
        planID: z.string(),
        name: z.string().optional(),
        price: z.number().optional(),
        unit: z.number().optional(),
        feature1: z.string().optional(),
        feature2: z.string().optional(),
        feature3: z.string().optional(),
        feature4: z.string().optional(),
        feature5: z.string().optional(),
        feature6: z.string().optional(),
        forJobs: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const {
        planID,
        name,
        price,
        unit,
        feature1,
        feature2,
        feature3,
        feature4,
        feature5,
        feature6,
        forJobs,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is an admin section.",
        });

      const planExists = await db.employerPlans.findFirst({
        where: {
          id: planID,
        },
      });

      if (!planExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sorry, this plan does not exist.",
        });

      return await db.employerPlans.update({
        where: {
          id: planExists.id,
        },
        data: {
          name,
          price,
          unit,
          feature1,
          feature2,
          feature3,
          feature4,
          feature5,
          feature6,
          forJobs,
        },
      });
    }),

  employerPurchasePlan: privateProcedure
    .input(
      z.object({
        planID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { planID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
      });
      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is an employer section.",
        });

      const companyExists = await db.company.findFirst({
        where: {
          userId,
          isEmployerID: isEmployer.id,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have to fully create your profile to continue.",
        });

      const planExists = await db.employerPlans.findFirst({
        where: {
          id: planID,
        },
      });

      if (!planExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The selected plan does not exist.It could have been deleted",
        });

      const invoiceID =
        "#HG" +
        cryptoRandomString({
          length: 8,
          type: "alphanumeric",
        }).toUpperCase();
      const sufficientAccountBalance = await db.accountBalance.findFirst({
        where: {
          isEmployerID: isEmployer.id,
          userEmail: email,
          balance: {
            gte: planExists.price,
          },
        },
      });

      if (!sufficientAccountBalance)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You do not have enough account balance. Top up and try again.",
        });

      await db.accountBalance.update({
        where: {
          id: sufficientAccountBalance.id,
        },
        data: {
          units: {
            increment: planExists.unit,
          },
          balance: {
            decrement: planExists.price,
          },
        },
      });
      return await db.purchaseJobPlan.create({
        data: {
          userId,
          isEmployerID: isEmployer.id,
          fullName: dbUser.name as string,
          planID: planExists.id,
          companyName: companyExists.company_name as string,
          companyID: companyExists.id,
          postal: companyExists.postal as string,
          zip: companyExists.zip,
          county: companyExists.county as string,
          town: companyExists.town,
          invoiceID,
          planName: planExists.name,
          planPrice: planExists.price,
          planUnits: planExists.unit,
        },
      });
    }),

  adminDeleteEmployerPlan: privateProcedure
    .input(
      z.object({
        planID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { planID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is an admin section.",
        });

      const planExists = await db.employerPlans.findFirst({
        where: {
          id: planID,
        },
      });

      if (!planExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sorry, this plan does not exist.",
        });

      return await db.employerPlans.delete({
        where: {
          id: planExists.id,
        },
      });
    }),

  adminApproveWorkerCredit: privateProcedure
    .input(
      z.object({
        referralID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { referralID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You are in unauthorized section. This is admin only section",
        });

      const referralDetailsExists = await db.userReferrals.findFirst({
        where: {
          id: referralID,
          approved: false,
          failed: false,
        },
      });

      if (!referralDetailsExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The referral details does not exist. Or could have been worked on.",
        });

      const balanceDetailsExists = await db.workerCreditPoints.findFirst({
        where: {
          userEmail: referralDetailsExists.email,
        },
      });

      if (!balanceDetailsExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This candidate does not have credit balance account.",
        });
      if (referralDetailsExists.recurringViewID === true) {
        await db.userReferrals.update({
          where: {
            id: referralID,
          },
          data: {
            credit: {
              decrement: 10,
            },
            failed: true,
          },
        });

        const transporter = nodemailer.createTransport({
          port: 587,
          host: "smtp.gmail.com",
          auth: {
            user: "gethiredinkenya@gmail.com",
            pass: emailPassword,
          },
          secure: false,
        });

        await new Promise((resolve, reject) => {
          transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
              reject(error);
            } else {
              console.log("Server is ready to take our message");
              resolve(success);
            }
          });
        });

        const mailOptions = {
          from: {
            name: "Hired",
            address: "gethiredinkenya@gmail.com",
          },
          replyTo: "gethiredinkenya@gmail.com",
          to: referralDetailsExists.email,
          subject: "Referral credit deducted.",
          html: `
             <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                <p>Hello ${referralDetailsExists.fullName},</p>
                <p>Our system detected that there was a problem with the referred candidate and the system marked the candidate as "cheat". </p>
                <p>Therefore, kindly note that we will not add you credit points for this referral. Thank you.</p>
                <p>This is an automated message. Please do NOT reply to this email.</p>
                <p>Note: If you did not sign up to Hired Jobs, please ignore this email.</p>
                <p>Follow us on Twitter/X: 
                  <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                </p>
                <hr>
                <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
            </div>
            `,
          priority: "high" as const,
        };

        return await new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              console.log(info);
              resolve(info);
            }
          });
        });
      }

      await db.workerCreditPoints.update({
        where: {
          id: balanceDetailsExists.id,
          userEmail: referralDetailsExists.email,
        },
        data: {
          balance: {
            increment: 10,
          },
        },
      });

      return await db.userReferrals.update({
        where: {
          id: referralID,
        },
        data: {
          approved: true,
        },
      });
    }),

  adminApproveEmployerCredit: privateProcedure
    .input(
      z.object({
        referralID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { referralID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You are in unauthorized section. This is admin only section",
        });

      const referralDetailsExists = await db.userReferrals.findFirst({
        where: {
          id: referralID,
          approved: false,
          failed: false,
        },
      });

      if (!referralDetailsExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The referral details does not exist. Or could have been worked on.",
        });

      const balanceDetailsExists = await db.accountBalance.findFirst({
        where: {
          userEmail: referralDetailsExists.email,
        },
      });

      if (!balanceDetailsExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This employer does not have credit balance account.",
        });
      if (referralDetailsExists.recurringViewID === true) {
        await db.userReferrals.update({
          where: {
            id: referralID,
          },
          data: {
            credit: {
              decrement: 500,
            },
            failed: true,
          },
        });

        const transporter = nodemailer.createTransport({
          port: 587,
          host: "smtp.gmail.com",
          auth: {
            user: "gethiredinkenya@gmail.com",
            pass: emailPassword,
          },
          secure: false,
        });

        await new Promise((resolve, reject) => {
          transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
              reject(error);
            } else {
              console.log("Server is ready to take our message");
              resolve(success);
            }
          });
        });

        const mailOptions = {
          from: {
            name: "Hired",
            address: "gethiredinkenya@gmail.com",
          },
          replyTo: "gethiredinkenya@gmail.com",
          to: referralDetailsExists.email,
          subject: "Referral credit deducted.",
          html: `
               <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
              <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                  <p>Hello ${referralDetailsExists.fullName},</p>
                  <p>Our system detected that there was a problem with a referred candidate ${referralDetailsExists.inviteeName} and the system marked the candidate as "cheat". </p>
                  <p>Therefore, kindly note that we will not add you credit points for this referral. Thank you.</p>
                  <p>This is an automated message. Please do NOT reply to this email.</p>
                  <p>Note: If you did not sign up to Hired Jobs, please ignore this email.</p>
                  <p>Follow us on Twitter/X: 
                    <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                  </p>
                  <hr>
                  <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
              </div>
              </div>
              `,
          priority: "high" as const,
        };

        return await new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              console.log(info);
              resolve(info);
            }
          });
        });
      }

      await db.accountBalance.update({
        where: {
          id: balanceDetailsExists.id,
          userEmail: referralDetailsExists.email,
        },
        data: {
          balance: {
            increment: 500,
          },
        },
      });

      return await db.userReferrals.update({
        where: {
          id: referralID,
        },
        data: {
          approved: true,
        },
      });
    }),

  workerDeleteRedeemHistory: privateProcedure
    .input(
      z.object({
        redeemID: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, email } = ctx;
      const { redeemID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, you have to login and try again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section",
        });

      const redeemHistoryExists = await db.workerRequestRedeem.findFirst({
        where: {
          id: redeemID,
          isWorkerID: isWorker.id,
        },
      });

      if (!redeemHistoryExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We did not find a redeem history detail, matching the provided ID",
        });

      return await db.workerRequestRedeem.update({
        where: {
          id: redeemHistoryExists.id,
        },
        data: {
          hide: true,
        },
      });
    }),

  workerDeleteReferralHistory: privateProcedure
    .input(
      z.object({
        referralID: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, email } = ctx;
      const { referralID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, you have to login and try again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section",
        });

      const referralHistoryExists = await db.userReferrals.findFirst({
        where: {
          id: referralID,
        },
      });

      if (!referralHistoryExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "We did not find referral detail, matching the provided ID",
        });

      return await db.userReferrals.update({
        where: {
          id: referralHistoryExists.id,
        },
        data: {
          hide: true,
        },
      });
    }),

  employerDeleteReferralHistory: privateProcedure
    .input(
      z.object({
        referralID: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, email } = ctx;
      const { referralID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, you have to login and try again.",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section",
        });

      const referralHistoryExists = await db.userReferrals.findFirst({
        where: {
          id: referralID,
        },
      });

      if (!referralHistoryExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "We did not find referral detail, matching the provided ID",
        });

      return await db.userReferrals.update({
        where: {
          id: referralHistoryExists.id,
        },
        data: {
          hide: true,
        },
      });
    }),

  userSelfGenerateReferralLink: privateProcedure.mutation(async ({ ctx }) => {
    const { userId, email } = ctx;

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
        email,
      },
      select: {
        referralCode: true,
      },
    });

    if (!dbUser)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You have to login again and try",
      });

    if (dbUser.referralCode)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are only allowed to have a single unique referral link.",
      });

    const referralCode = cryptoRandomString({
      length: 8,
      type: "alphanumeric",
    });

    return await db.user.update({
      where: {
        id: userId,
        email,
      },
      data: {
        referralCode: referralCode,
      },
    });
  }),

  reVerify: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;

      const dbUser = await db.user.findFirst({
        where: {
          email,
          emailVerified: {
            equals: false,
          },
        },
        select: {
          name: true,
          role: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not exist or is already verified",
        });
      const name = dbUser.name as string;
      const givenRole = dbUser.role as string;

      const userHasToken = await db.verification.findFirst({
        where: {
          email,
        },
      });

      if (userHasToken) {
        await db.verification.delete({
          where: {
            email,
          },
        });
      }

      const verifyToken = cryptoRandomString({
        length: 30,
        type: "alphanumeric",
      });

      const verifyTokenExpiry = new Date();

      verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 1);

      await db.verification.create({
        data: {
          verifyToken,
          verifyTokenExpiry,
          email,
          name,
          role: givenRole,
        },
      });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Email Address Confirmation",
        html: `
             <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                <p>Hello ${name},</p>
                <p>Welcome to Hired Jobs, please verify your email address.</p>
                <p>Use the link button below to confirm your email address. The link's token expires in 1 hour.</p>
            <div style='cursor: pointer;'><a href='${productionBASE_URL}/home/activate/${verifyToken}'><button style='color:white; padding:.3rem 1rem; background:#005580; font-size:14.2px; line-height:22.22px; cursor:pointer;'>Confirm Account</button></a></div>
                <p>This is an automated message. Please do NOT reply to this email.</p>
                <p>Note: If you did not sign up to Hired Jobs, please ignore this email.</p>
                <p>Follow us on Twitter/X: 
                  <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                </p>
                <hr>
                <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
            </div>
            `,
        priority: "high" as const,
      };

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    }),

  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;
      if (!email)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing email field",
        });

      const exists = await db.user.findFirst({
        where: {
          email,
        },
        select: {
          name: true,
          password: true,
          role: true,
        },
      });

      if (!exists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User by that email does not exists",
        });

      const { name, password } = exists;

      if (!password)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you had signed up using google",
        });

      const hasResetToken = await db.reset.findFirst({
        where: {
          email,
        },
      });

      if (hasResetToken) {
        await db.reset.delete({
          where: {
            email,
          },
        });
      }

      const resetToken = cryptoRandomString({
        length: 30,
        type: "alphanumeric",
      });

      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

      await db.reset.create({
        data: {
          resetToken,
          resetTokenExpiry,
          email,
          role: exists.role,
        },
      });

      const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: true,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Password Reset Confirmation",
        html: `
             <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                <p>Hello ${name},</p>
                <p>Following your request to have your Hired Jobs account password changed, we would like you to verify the request.</p>
                <p>Use the link button below to change your password. The link's token expires in 30 minutes.</p>
            <div style='cursor: pointer;'><a href='${productionBASE_URL}/home/reset/${resetToken}'><button style='color:white; padding:.3rem 1rem; background:#005580; font-size:14.2px; line-height:22.22px; cursor:pointer;'>Confirm Account</button></a></div>
                <p>This is an automated message. Please do NOT reply to this email.</p>
                <p>Note: If you did not sign up to Hired Jobs, please ignore this email.</p>
                <p>Follow us on Twitter/X: 
                  <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                </p>
                <hr>
                <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
            </div>
            `,
        priority: "high" as const,
      };

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        resetToken: z.string(),
        password: z.string(),
        confirm_password: z.string(),
      })
    )

    .mutation(async ({ input }) => {
      const { resetToken, password, confirm_password } = input;
      const currentDate = new Date();

      if (!resetToken || !password || !confirm_password)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "All field must be filled",
        });

      const userExists = await db.reset.findFirst({
        where: {
          resetToken,
        },
        select: {
          resetTokenExpiry: true,
          email: true,
        },
      });

      if (!userExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Seems user with the reset token has already reset password or did not request to reset password",
        });

      const { resetTokenExpiry, email } = userExists;

      if (resetTokenExpiry < currentDate)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Invalid or expired reset token, you can request again to reset your password",
        });

      if (password !== confirm_password)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your passwords does not match",
        });

      if (password.length < 6)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Your password is too short, has to be a minimum of 6 characters",
        });

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await db.user.update({
        where: {
          email,
        },
        data: {
          password: passwordHash,
        },
      });

      await db.reset.delete({
        where: {
          resetToken,
          email,
        },
      });

      return newUser;
    }),

  updateUserEmail: privateProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        oldEmail: z.string().email(),
        newEmailConfirm: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, name } = ctx;
      const { email, oldEmail, newEmailConfirm } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access. User has to login",
        });

      if (email !== newEmailConfirm)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The two emails you entered does not match",
        });

      const currentEmailExists = await db.user.findFirst({
        where: {
          id: userId,
          email: oldEmail,
        },
      });

      if (!currentEmailExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "User with the current email you want to change does not exist. Enter your current email correctly",
        });

      const checkNewNotExist = await db.user.findFirst({
        where: {
          id: userId,
          email: {
            not: {
              equals: email,
            },
          },
        },
      });

      if (!checkNewNotExist)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The email you provided is similar to the new email.",
        });

      const emailExists = await db.user.findFirst({
        where: {
          email: email,
        },
      });

      if (emailExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There is a user with the 'new' email you provided",
        });

      const checkIfUserHadSimilar = await db.updateEmailVerify.findFirst({
        where: {
          userId: userId,
        },
      });

      if (checkIfUserHadSimilar) {
        await db.updateEmailVerify.delete({
          where: {
            userId,
          },
        });
      }
      const verifyToken = cryptoRandomString({
        length: 30,
        type: "alphanumeric",
      });

      const verifyTokenExpiry = new Date();

      verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 1);

      await db.updateEmailVerify.create({
        data: {
          newEmail: email,
          userId,
          verifyToken,
          verifyTokenExpiry,
        },
      });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions1 = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Email Address Changes",
        html: `
             <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                <p>Hello ${name},</p>
                <p>Please note that we have received a request (from we hope that it's you?) to have your email changed.</p>
                <p>Use the link button below to confirm that you would like to implement the said changes. The link's token expires in 1 hour.</p>
            <div style='cursor: pointer;'><a href='${productionBASE_URL}/new_changes/email/${verifyToken}'><button style='color:white; padding:.3rem 1rem; background:#005580; font-size:14.2px; line-height:22.22px; cursor:pointer;'>Confirm Account</button></a></div>
                <p>This is an automated message. Please do NOT reply to this email.</p>
                <p>Note: If you did not sign up to Hired Jobs, please ignore this email.</p>
                <p>Follow us on Twitter/X: 
                  <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                </p>
                <hr>
                <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
            </div>
            `,
        priority: "high" as const,
      };
      const mailOptions2 = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: oldEmail,
        subject: "Email Address Changes",
        html: `
             <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                <p>Hello ${name},</p>
                <p>Please note that we have received a request (from we hope that it's you?) to have your email changed.</p>
                <p>If you did NOT request to have your email changed, talk to our team or change your password. The email changes have not been made and will most likely be effected within an hour.</p>
                <p>This is an automated message. Please do NOT reply to this email.</p>
                <p>Note: If you did not sign up to Hired Jobs, please ignore this email.</p>
                <p>Follow us on Twitter/X: 
                  <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                </p>
                <hr>
                <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
            </div>
            `,
        priority: "high" as const,
      };
      return (await Promise.all([mailOptions1, mailOptions2])).map(
        (mailOption) =>
          new Promise((resolve, reject) => {
            transporter.sendMail(mailOption, (err, info) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                console.log(info);
                resolve(info);
              }
            });
          })
      );
    }),

  acceptUserEmailChange: publicProcedure
    .input(
      z.object({
        verifyToken: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { verifyToken } = input;

      const tokenExists = await db.updateEmailVerify.findFirst({
        where: {
          verifyToken,
        },
        select: {
          userId: true,
          verifyTokenExpiry: true,
          newEmail: true,
        },
      });

      if (!tokenExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "User did not request to change email or has already changed.",
        });

      const { userId, verifyTokenExpiry, newEmail } = tokenExists;

      if (!newEmail)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We did not find your new email. Please make sure you submitted a new email.",
        });

      const userInDb = await db.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          name: true,
          email: true,
        },
      });

      if (!userInDb)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist in our database.",
        });

      const { name, email } = userInDb;

      if (verifyTokenExpiry < new Date())
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your verification token has expired.",
        });

      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          email: newEmail,
        },
      });

      await db.updateEmailVerify.delete({
        where: {
          verifyToken,
          userId,
        },
      });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: newEmail,
        subject: "Email Changes Successful",
        html: `
             <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                <p>Hello ${name},</p>
                <p>Following your request to have your email address changes, we have successfully implemented the changes.</p>
                <p>You will be using the new email address <b>${newEmail}</b> with your current password to login to your account.</p>
                <p>If you did not request to have your email changed, please talk to our team for assistance or change your password.</p>
                <p>This is an automated message. Please do NOT reply to this email.</p><br/>
                <p>Note: If you did not sign up to Hired Jobs, please ignore this email.</p>
                <p>Follow us on Twitter/X: 
                  <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                </p>
                <hr>
                <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
            </div>
            `,
        priority: "high" as const,
      };

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    }),

  userUpdatePassword: privateProcedure
    .input(
      z.object({
        password: z.string().optional(),
        confirm_password: z.string().optional(),
        oldPassword: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, name, email } = ctx;
      const { password, confirm_password, oldPassword } = input;

      if (password !== confirm_password)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your password and confirm password do not match.",
        });

      if (!password || !confirm_password || !oldPassword)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "All required field must be filled.",
        });

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          password: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are required to login to request to make this change.",
        });

      const { password: dbPassword } = dbUser;
      if (!dbPassword)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems your sign up method is Google",
        });

      if (oldPassword && oldPassword !== null) {
        const samePassword = await bcrypt.compare(oldPassword, dbPassword);

        if (samePassword === false)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "You entered an incorrect old password. Enter a correct account's password",
          });
        const passwordAvailable = await db.user.findFirst({
          where: {
            email,
            accounts: {
              none: {
                provider: {
                  equals: "google",
                },
              },
            },
          },
        });

        if (!passwordAvailable)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The old password you provided is incorrect or you had signed up using Google",
          });
      }

      const checkHadRequested = await db.updatePasswordVerify.findFirst({
        where: {
          userId,
        },
      });

      if (checkHadRequested) {
        await db.updatePasswordVerify.delete({
          where: {
            userId,
          },
        });
      }

      if (!password)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You need to enter password",
        });

      const passwordHash = await bcrypt.hash(password, 10);

      const verifyToken = cryptoRandomString({
        length: 30,
        type: "alphanumeric",
      });

      const verifyTokenExpiry = new Date();

      verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 1);

      await db.updatePasswordVerify.create({
        data: {
          newPassword: passwordHash,
          userId,
          verifyToken,
          verifyTokenExpiry,
        },
      });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Password Change Confirmation",
        html: `
             <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                <p>Hello ${name},</p>
                <p>Please note that we have received a request(we hope it's from you?) to have your password changed.</p>
                <p>Due to sensitivity of the request, we ask you to verify the request by clicking on the link below.</p>
                <p>The link's token expires in 1 hour.</p>
            <div style='cursor: pointer;'><a href='${productionBASE_URL}/new_changes/password/${verifyToken}'><button style='color:white; padding:.3rem 1rem; background:#005580; font-size:14.2px; line-height:22.22px; cursor:pointer;'>Confirm Account</button></a></div>
                <p>If you did not request to have your password changed, please talk to our team for assistance or change your password.</p>
                <p>This is an automated message. Please do NOT reply to this email.</p>
                <p>Note: If you did not sign up to Hired Jobs, please ignore this email.</p>
                <p>Follow us on Twitter/X: 
                  <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                </p>
                <hr>
                <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
            </div>
            `,
        priority: "high" as const,
      };

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    }),

  acceptUserPasswordChange: publicProcedure
    .input(
      z.object({
        verifyToken: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { verifyToken } = input;

      const tokenExists = await db.updatePasswordVerify.findFirst({
        where: {
          verifyToken,
        },
        select: {
          verifyTokenExpiry: true,
          userId: true,
          newPassword: true,
        },
      });

      if (!tokenExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "User has not requested to change password, or the password has already been changed.",
        });

      const { userId, verifyTokenExpiry, newPassword } = tokenExists;

      const userInDb = await db.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          name: true,
          email: true,
        },
      });

      if (!userInDb)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist in our database",
        });

      const { name, email } = userInDb;

      if (verifyTokenExpiry < new Date())
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your verification token has expired.",
        });

      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          password: newPassword,
        },
      });

      await db.updatePasswordVerify.delete({
        where: {
          verifyToken,
          userId,
        },
      });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Password Changes Successful",
        html: `
             <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                <p>Hello ${name},</p>
                <p>Following your request to have your password changed, we have successfully implemented the changes.</p>
                <p>You will be using the <b>NEW PASSWORD</b> with your current email to login to your account.</p>
                <p>If you did not request to have your password changed, please talk to our team for assistance or change your password to a much stronger password.</p>
                <p>This is an automated message. Please do NOT reply to this email.</p><br/>
                <p>Note: If you did not sign up to Hired Jobs, please ignore this email.</p>
                <p>Follow us on Twitter/X: 
                  <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                </p>
                <hr>
                <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
            </div>
            `,
        priority: "high" as const,
      };

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    }),

  updateUserRole: privateProcedure
    .input(
      z.object({
        role: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const { role } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login or sign up to continue",
        });

      return await db.user.update({
        where: {
          id: userId,
          role: {
            equals: "new",
          },
        },
        data: {
          role,
        },
      });
    }),

  updateUserName: privateProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const { name } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please login to continue",
        });

      return await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
        },
      });
    }),

  updateEmployerPosition: privateProcedure
    .input(
      z.object({
        jobPosition: z.string(),
        isEmployerID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { jobPosition, isEmployerID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "The user is unauthenticated. Please login and try again.",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
          id: isEmployerID,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with the details, not in our database",
        });

      return await db.employers.update({
        where: {
          id: isEmployerID,
          employerEmail: email,
        },
        data: {
          jobPosition,
        },
      });
    }),

  //Job Section
  employerCreateJob: privateProcedure
    .input(
      z.object({
        job_title: z.string().min(1, { message: "Title required!" }),
        job_description: z.string(),
        responsibilities: z.string(),
        requirement: z.string(),
        personal_skills: z
          .array(z.string())
          .refine(
            (skill) => skill.length >= 4,
            "Kindly select a minimum of 4 skills"
          ),
        platform: z.string(),
        emailPlatform: z.string(),
        linkPlatform: z.string(),
        otherPlatform: z.string(),
        ownPlatformMethod: z.string(),
        experienceDesired: z.string(),
        experience: z.string(),
        numberOfPositions: z.string(),
        possible_pay: z.string(),
        job_type: z.string(),
        seniority: z.string(),
        subCategory: z.string(),
        category: z.string(),
        county: z.string(),
        address: z.string(),
        academic: z.string(),
        benefits: z.array(z.string()),
        assessmentOneID: z.string(),
        assessmentTwoID: z.string(),
        instructions: z.string(),
        addAssessment: z.boolean().default(false),
        academicDesired: z.string(),
        deadline: z.coerce.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated, login to create a job",
        });

      const job_id = parseInt(generateID());

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          name: true,
          email: true,
        },
      });

      const isEmployerPosting = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployerPosting)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
        });

      const { id: isEmployerID } = isEmployerPosting;

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated, login to create a job",
        });
      const { name } = dbUser;
      const {
        job_type,
        job_title,
        job_description,
        responsibilities,
        requirement,
        personal_skills,
        experience,
        numberOfPositions,
        possible_pay,
        category,
        county,
        deadline,
        platform,
        emailPlatform,
        linkPlatform,
        otherPlatform,
        ownPlatformMethod,
        experienceDesired,
        address,
        academic,
        benefits,
        instructions,
        assessmentOneID,
        assessmentTwoID,
        addAssessment,
        academicDesired,
        seniority,
        subCategory,
      } = input;

      const employerProfile = await db.company.findFirst({
        where: {
          userId,
        },
        select: {
          id: true,
          company_name: true,
          website: true,
          category: true,
          company_description: true,
          logo: true,
        },
      });

      if (!employerProfile || employerProfile === null)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You need to create a profile to be able to create a job.",
        });

      const { id: companyId, company_description } = employerProfile;

      const company_name = employerProfile?.company_name!.trim() as string;

      if (assessmentOneID) {
        if (assessmentTwoID === assessmentOneID)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The identity of the first assessment is same as the second",
          });
        const assessmentByIDExists = await db.assessmentBanner.findFirst({
          where: {
            id: assessmentOneID,
          },
        });

        if (!assessmentByIDExists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The first assessment you requesting to include in the job does not exist. Could have been deleted.",
          });

        let randomBannerId: string | null = null;
        const bonusBanners = await db.assessmentBanner.findMany({
          where: {
            category: {
              in: [
                "Language Test",
                "Reading Test",
                "Comprehension Test",
                "Communication Skills",
              ],
            },
          },
          select: {
            id: true,
          },
        });

        if (bonusBanners.length > 0) {
          const randomIndex = Math.floor(Math.random() * bonusBanners.length);
          randomBannerId = bonusBanners[randomIndex].id;
        }

        const checkIfEmployerRequestedID =
          await db.pickAssessCandidate.findFirst({
            where: {
              testID: assessmentByIDExists.id,
            },
          });

        if (!checkIfEmployerRequestedID)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "You have not ordered this assessment. Go to assessment section to order it.",
          });

        await db.pickAssessCandidate.update({
          where: {
            id: checkIfEmployerRequestedID.id,
          },
          data: {
            utilized: true,
          },
        });

        if (assessmentTwoID) {
          if (assessmentTwoID === assessmentOneID)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "The identity of the second assessment is same as the first",
            });
          const secondAssessmentByIDExists =
            await db.assessmentBanner.findFirst({
              where: {
                id: assessmentTwoID,
              },
            });

          if (!secondAssessmentByIDExists)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "The second assessment you requesting to include in the job does not exist. Could have been deleted.",
            });

          const checkIfHadOrderedSecond =
            await db.pickAssessCandidate.findFirst({
              where: {
                testID: secondAssessmentByIDExists.id,
              },
            });

          if (!checkIfHadOrderedSecond)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "You haven't ordered for the second assessment you're requesting to add in the job. Order in the assessments section.",
            });

          await db.pickAssessCandidate.update({
            where: {
              id: checkIfHadOrderedSecond.id,
            },
            data: {
              utilized: true,
            },
          });

          return await db.job.create({
            data: {
              userId,
              isEmployerID,
              job_id,
              createdByName: name,
              companyId,
              company_name,
              company_description,
              companyLogo: employerProfile?.logo as string,
              companyCategory: employerProfile?.category as string,
              companyWebsite: employerProfile?.website as string,
              companyEmail: dbUser.email,
              job_type,
              job_title,
              job_description,
              summaryDescription: shortDescription(job_description),
              responsibilities,
              requirement,
              personal_skills,
              experience,
              numberOfPositions,
              possible_pay,
              category,
              county,
              deadline,
              platform,
              emailPlatform,
              linkPlatform,
              otherPlatform,
              ownPlatformMethod,
              experienceDesired,
              address,
              academic,
              benefits,
              instructions,
              addAssessment,
              academicDesired,
              assessmentOneID: checkIfEmployerRequestedID.testID,
              assessmentTwoID: checkIfHadOrderedSecond.testID,
              bonusTestID: randomBannerId,
              seniority,
              subCategory,
            },
          });
        }
        return await db.job.create({
          data: {
            userId,
            isEmployerID,
            job_id,
            createdByName: name,
            companyId,
            company_name,
            company_description,
            job_type,
            job_title,
            job_description,
            companyCategory: employerProfile?.category as string,
            companyLogo: employerProfile?.logo as string,
            companyWebsite: employerProfile?.website as string,
            companyEmail: dbUser.email,
            summaryDescription: shortDescription(job_description),
            responsibilities,
            requirement,
            personal_skills,
            experience,
            numberOfPositions,
            possible_pay,
            category,
            county,
            deadline,
            platform,
            emailPlatform,
            linkPlatform,
            otherPlatform,
            ownPlatformMethod,
            experienceDesired,
            address,
            academic,
            benefits,
            instructions,
            addAssessment,
            academicDesired,
            assessmentOneID: checkIfEmployerRequestedID.testID,
            bonusTestID: randomBannerId,
            seniority,
            subCategory,
          },
        });
      }

      return await db.job.create({
        data: {
          userId,
          isEmployerID,
          job_id,
          createdByName: name,
          companyId,
          company_name,
          company_description,
          companyCategory: employerProfile?.category as string,
          companyLogo: employerProfile?.logo as string,
          companyEmail: dbUser.email,
          companyWebsite: employerProfile?.website as string,
          job_type,
          job_title,
          job_description,
          summaryDescription: shortDescription(job_description),
          responsibilities,
          requirement,
          personal_skills,
          experience,
          numberOfPositions,
          possible_pay,
          category,
          county,
          deadline,
          platform,
          emailPlatform,
          linkPlatform,
          otherPlatform,
          addAssessment,
          ownPlatformMethod,
          experienceDesired,
          address,
          academic,
          benefits,
          instructions,
          academicDesired,
          seniority,
          subCategory,
        },
      });
    }),

  adminDeleteCategoryEmails: privateProcedure
    .input(
      z.object({
        categoryEmailID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { categoryEmailID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section",
        });
      const { id: isAdminID } = isAdmin;

      const categoryEmailExists = await db.emailWorker.findFirst({
        where: {
          id: categoryEmailID,
          isAdminID,
          userId,
        },
      });

      if (!categoryEmailExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We did not find an email with that ID. The email could have been deleted or you are not authorized to delete it.",
        });

      return await db.emailWorker.delete({
        where: {
          id: categoryEmailID,
          isAdminID,
          userId,
        },
      });
    }),
  adminDeleteSkillsEmails: privateProcedure
    .input(
      z.object({
        skillsEmailID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { skillsEmailID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section",
        });
      const { id: isAdminID } = isAdmin;

      const skillsEmailExists = await db.emailWorkerOnJobSkills.findFirst({
        where: {
          id: skillsEmailID,
          isAdminID,
          userId,
        },
      });

      if (!skillsEmailExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We did not find an email with that ID. The email could have been deleted or you are not authorized to delete it.",
        });

      return await db.emailWorkerOnJobSkills.delete({
        where: {
          id: skillsEmailID,
          isAdminID,
          userId,
        },
      });
    }),
  adminDeleteGeneralEmails: privateProcedure
    .input(
      z.object({
        generalEmailID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { generalEmailID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section",
        });
      const { id: isAdminID } = isAdmin;

      const generalEmailExists = await db.emailWorkerGeneral.findFirst({
        where: {
          id: generalEmailID,
          isAdminID,
          userId,
        },
      });

      if (!generalEmailExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We did not find an email with that ID. The email could have been deleted or you are not authorized to delete it.",
        });

      return await db.emailWorkerGeneral.delete({
        where: {
          id: generalEmailID,
          isAdminID,
          userId,
        },
      });
    }),
  adminEmailWorkerOnGeneral: privateProcedure
    .input(
      z.object({
        reason: z.string(),
        subject: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      let { reason, subject, message } = input;

      const dbUser = await db.user.findFirst({ where: { id: userId, email } });
      if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized." });

      const isAdmin = await db.admin.findFirst({ where: { adminEmail: email }, select: { id: true } });
      if (!isAdmin) throw new TRPCError({ code: "BAD_REQUEST", message: "Unauthorized section" });

      if (reason === "Jobs Opportunities") {
        const dayOfWeek = format(new Date(), "EEEE");

        const subjectsByDay: Record<string, string> = {
          Monday: "Start Your Week with Top Jobs!",
          Tuesday: "Tuesday's Best Job Openings",
          Wednesday: "Midweek Job Picks - Apply Now!",
          Thursday: "Thursday's Top Hiring Opportunities",
          Friday: "End the Week Strong - Apply Today!",
          Saturday: "Weekend Job Alert - Fresh Listings!",
          Sunday: "Sunday's Top Jobs - Get Ready for the Week",
        };
        subject = subjectsByDay[dayOfWeek] || "Latest Job Openings - Apply Now!";
      }
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const emailLogs = await db.emailLog.findMany({
        where: { adminId: isAdmin.id, createdAt: { gte: twentyFourHoursAgo } },
        orderBy: { createdAt: "desc" },
      });

      if (emailLogs.length >= 5) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You have exceeded the limit of 5 email requests in the last 24 hours.",
        });
      }

      const lastEmailSent = emailLogs.length > 0 ? emailLogs[0].createdAt : null;
      if (lastEmailSent && new Date(lastEmailSent) > oneHourAgo) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You can only send one email batch per hour. Please try again later.",
        });
      }

      const previousRounds = await db.emailRound.findMany({
        orderBy: { round: "asc" },
      });

      const allSentEmails = new Set(previousRounds.flatMap((round) => round.emails));

      let newBatchUsers = await db.user.findMany({
        where: { email: { notIn: Array.from(allSentEmails) } },
        select: { email: true },
        orderBy: { createdAt: "desc" },
        take: 80,
      });

      let usersToEmail = newBatchUsers.map((u) => u.email);

      if (usersToEmail.length === 0) {
        for (const round of previousRounds) {
          const pendingEmails = round.allUsers.filter((email) => !allSentEmails.has(email)).slice(0, 80);
          if (pendingEmails.length > 0) {
            usersToEmail = pendingEmails;
            break;
          }
        }
      }

      if (usersToEmail.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No users left to email." });
      }

      const latestRound = await db.emailRound.create({
        data: {
          round: (previousRounds.length || 0) + 1,
          emails: usersToEmail,
          allUsers: usersToEmail,
          isAdminID: isAdmin.id,
        },
      });

      let jobListHTML = "";
      if (reason === "Jobs Opportunities") {
        const latestJobs = await db.job.findMany({
          where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
          select: { job_title: true, id: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        if (latestJobs.length < 2) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The minimum latest jobs to email is 2. You have less than the minimum.",
          });
        }

        jobListHTML = latestJobs
          .map(
            (job) =>
              `<li style='font-size: 13.5px; line-height:22px;'><strong>${job.job_title}:</strong> 
              <a href="https://www.hired.co.ke/home/jobs/${job.id}">https://www.hired.co.ke/home/jobs/${job.id}</a></li>`
          )
          .join("");

        jobListHTML = `<p style='font-size: 13.5px; line-height:22px;'>Exciting job opportunities available now on Hired (<a href="https://www.hired.co.ke">https://www.hired.co.ke</a>)!</p><ul>${jobListHTML}</ul>`;
      }

      const emailMessage = reason === "Jobs Opportunities"
        ? jobListHTML
        : `<p style='font-size: 13.5px; line-height:22px;'>${message}</p>`;

      const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: { user: "gethiredinkenya@gmail.com", pass: emailPassword },
        secure: true,
      });

      await db.emailLog.create({ data: { adminId: isAdmin.id } });

      await Promise.allSettled(
        usersToEmail.map(async (email) => {
          const user = await db.user.findFirst({ where: { email }, select: { name: true } });
          if (!user) return Promise.reject(`User with email ${email} does not exist`);

          const mailOptions = {
            from: { name: "Hired Jobs", address: "gethiredinkenya@gmail.com" },
            replyTo: "gethiredinkenya@gmail.com",
            to: email,
            subject,
            html: `<div><p style='font-size: 13.5px; line-height:22px;'>Dear ${user.name},</p>${emailMessage}<p style='font-size: 13.5px; line-height:22px; margin-top: 5px;'>This is an automated message. Please do NOT reply.</p><p style='font-size: 13.5px; line-height:22px;'>Follow us on Twitter/X: <a href="https://www.x.com/hiredKE">www.twitter.com/hiredke</a></p></div>`,
            priority: "high" as "high",
          };

          return transporter.sendMail(mailOptions);
        })
      );

      return { msg: `Emails sent successfully for round ${latestRound.round}` };
    }),
  adminEmailWorkersOnSkills: privateProcedure
    .input(
      z.object({
        reason: z.string(),
        subject: z.string(),
        message: z.string(),
        finalData: z
          .record(
            z.array(
              z.object({
                jobId: z.string(),
                matchingSkills: z.array(z.string()),
              })
            )
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { reason, subject, message, finalData } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: true,
      });

      if (!finalData) {
        console.error("finalData is undefined");
        return;
      }

      const userIds = Object.keys(finalData);
      const jobIds = Object.values(finalData).flatMap((userData) =>
        userData.map(({ jobId }) => jobId)
      );

      await Promise.all(
        Object.entries(finalData).map(async ([userId, userData]) => {
          const user = await db.user.findFirst({
            where: {
              id: userId,
            },
            select: {
              email: true,
              name: true,
            },
          });

          if (!user) {
            console.error(`User with userId ${userId} not found`);
            return;
          }

          const { name, email: userEmail } = user;
          let emailContent = `<p>${message}</p><ul>`;

          for (const { jobId, matchingSkills } of userData) {
            const job = await db.job.findUnique({
              where: {
                id: jobId,
              },
              select: {
                job_title: true,
              },
            });

            if (job) {
              const { job_title } = job;
              emailContent += `<strong>${job_title}</strong><br>`;
              for (const skill of matchingSkills) {
                emailContent += `- ${skill}<br>`;
              }
              emailContent += `<br>`;
            }
          }

          const mailOptions = {
            from: {
              name: "Hired",
              address: "gethiredinkenya@gmail.com",
            },
            replyTo: "gethiredinkenya@gmail.com",
            to: userEmail,
            subject,
            html: `
                <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
                    <div style='justify-content:center; margin:1rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                        <p>Hello ${name},</p>
                        <div>${emailContent}</div>
                        <p>This is an automated message. Please do NOT reply to this email.</p>
                        <p>Follow us on Twitter/X: 
                          <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                        </p>
                        <hr>
                        <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
                    </div>
                </div>
            `,
            priority: "high" as const,
          };

          await new Promise<void>((resolve, reject) => {
            transporter.sendMail(mailOptions, async (err) => {
              if (err) {
                console.error(`Failed to send email to ${userEmail}: ${err}`);
                reject(err);
              } else {
                resolve();
              }
            });
          });
        })
      );

      await db.job.updateMany({
        where: {
          id: {
            in: jobIds,
          },
        },
        data: {
          emailed: true,
        },
      });

      const emailWorker = await db.emailWorkerOnJobSkills.create({
        data: {
          userId,
          isAdminID: isAdmin.id,
          reason,
          subject,
          message,
          emailedUserIds: userIds,
          emailedJobIds: jobIds,
        },
      });

      return { msg: "Emails sent successfully", emailWorker };
    }),
  adminEmailWorkers: privateProcedure
    .input(
      z.object({
        reason: z.string(),
        subject: z.string(),
        recipientsEmail: z.array(z.string()).default([]),
        toEmailJobIDs: z.array(z.string()).default([]),
        recipientsUserIds: z.array(z.string()).default([]),
        emailBody: z.string(),
        jobCategory: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const {
        reason,
        subject,
        recipientsEmail,
        emailBody,
        jobCategory,
        toEmailJobIDs,
        recipientsUserIds,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      if (!recipientsEmail || recipientsEmail.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing or empty emails array",
        });

      const messageBody = removeHtmlTags(emailBody);
      const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: true,
      });

      const promises = recipientsEmail.map(async (email) => {
        const user = await db.user.findFirst({
          where: {
            email,
          },
          select: {
            name: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `User with email ${email} does not exist`,
          });
        }

        const { name } = user;
        const mailOptions = {
          from: {
            name: "Hired",
            address: "gethiredinkenya@gmail.com",
          },
          replyTo: "gethiredinkenya@gmail.com",
          to: email,
          subject,
          html: `
            <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
              <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                <p>Dear ${name},</p>
                <div>${messageBody}</div>
                <p>This is an automated message. Please do NOT reply to this email.</p>
                <p>Follow us on Twitter/X: 
                  <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                </p>
                <hr>
                <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
              </div>
            </div>
          `,
          priority: "high" as const,
        };

        return new Promise<void>((resolve, reject) => {
          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });

      await Promise.all(promises);

      await db.job.updateMany({
        where: {
          id: {
            in: toEmailJobIDs,
          },
        },
        data: {
          emailed: true,
        },
      });

      const emailWorker = await db.emailWorker.create({
        data: {
          userId,
          isAdminID: isAdmin.id,
          reason,
          subject,
          recipientsEmail,
          toEmailJobIDs,
          recipientsUserIds,
          emailBody,
          jobCategory,
        },
      });

      return { msg: "Emails sent successfully", emailWorker };
    }),

  adminCreateJob: privateProcedure
    .input(
      z.object({
        job_title: z.string().min(1, { message: "Title required!" }),
        job_description: z.string(),
        responsibilities: z.string(),
        requirement: z.string(),
        personal_skills: z
          .array(z.string())
          .refine(
            (skill) => skill.length >= 4,
            "Kindly select a minimum of 4 skills"
          ),
        platform: z.string(),
        emailPlatform: z.string(),
        linkPlatform: z.string(),
        otherPlatform: z.string(),
        ownPlatformMethod: z.string(),
        experienceDesired: z.string(),
        experience: z.string(),
        numberOfPositions: z.string(),
        possible_pay: z.string(),
        job_type: z.string(),
        seniority: z.string(),
        subCategory: z.string(),
        category: z.string(),
        county: z.string(),
        address: z.string(),
        academic: z.string(),
        benefits: z.array(z.string()),
        instructions: z.string(),
        academicDesired: z.string(),
        deadline: z.coerce.date(),
        companyID: z.string(),
        addAssessment: z.boolean().default(false),
        assessmentOneID: z.string(),
        assessmentTwoID: z.string(),
        jobFormNonRegisteredCompany: z.boolean().default(false),
        adminCreatingCompanyName: z.string(),
        adminCreatingCompanyDescription: z.string(),
        adminCreatingCompanyCategory: z.string(),
        adminCreatingCompanyWebsite: z.string(),
        adminCreatingCompanyEmail: z.string(),
        adminCreatingAddLogo: z.string(),
        unregisteredKnown: z.boolean().default(false),
        unregisteredID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const {
        job_type,
        job_title,
        job_description,
        responsibilities,
        requirement,
        personal_skills,
        experience,
        numberOfPositions,
        possible_pay,
        category,
        county,
        deadline,
        platform,
        emailPlatform,
        linkPlatform,
        otherPlatform,
        ownPlatformMethod,
        experienceDesired,
        address,
        academic,
        benefits,
        instructions,
        academicDesired,
        companyID,
        addAssessment,
        jobFormNonRegisteredCompany,
        adminCreatingCompanyName,
        adminCreatingCompanyDescription,
        adminCreatingCompanyCategory,
        adminCreatingCompanyWebsite,
        adminCreatingCompanyEmail,
        assessmentOneID,
        assessmentTwoID,
        unregisteredKnown,
        adminCreatingAddLogo,
        unregisteredID,
        seniority,
        subCategory,
      } = input;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated, login to create a job for the employers",
        });

      const job_id = parseInt(generateID());

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          name: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated, login to create a job",
        });

      const hiredEmployerAccounts = await db.user.findMany({
        where: {
          email: {
            in: hiredEmployers,
          },
          role: {
            equals: "employer",
          },
        },
        select: {
          id: true,
        },
      });

      const hiredIDs = hiredEmployerAccounts.flatMap((hired) => hired.id);

      const companyForUnregistered = await db.company.findFirst({
        where: {
          userId: {
            in: hiredIDs,
          },
        },
        select: {
          id: true,
        },
      });

      const assignCompanyID = jobFormNonRegisteredCompany
        ? companyForUnregistered?.id
        : companyID;

      const companyExists = await db.company.findFirst({
        where: {
          id: assignCompanyID,
        },
        select: {
          userId: true,
          isEmployerID: true,
          company_name: true,
          website: true,
          category: true,
          company_description: true,
          logo: true,
          id: true,
          employerName: true,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "There is no a company with the provided details. Kindly check, ensure the company has profile and try again.",
        });
      const companyUser = await db.user.findFirst({
        where: {
          id: companyExists.userId,
        },
        select: {
          email: true,
        },
      });
      const {
        userId: employerUserId,
        isEmployerID,
        employerName,
      } = companyExists;

      const unregisteredKnownExists = await db.unregisteredCompany.findFirst({
        where: {
          id: unregisteredID,
        },
      });

      const company_nameOld =
        jobFormNonRegisteredCompany &&
          !unregisteredKnownExists &&
          unregisteredKnown === false
          ? adminCreatingCompanyName
          : jobFormNonRegisteredCompany &&
            unregisteredKnownExists &&
            unregisteredKnown === true
            ? unregisteredKnownExists.companyName
            : (companyExists.company_name as string);

      const company_name = company_nameOld.trim();

      const company_description =
        jobFormNonRegisteredCompany &&
          !unregisteredKnownExists &&
          unregisteredKnown === false
          ? adminCreatingCompanyDescription
          : jobFormNonRegisteredCompany &&
            unregisteredKnownExists &&
            unregisteredKnown === true
            ? unregisteredKnownExists.companyDescription
            : (companyExists.company_description as string);

      const companyCategory =
        jobFormNonRegisteredCompany &&
          !unregisteredKnownExists &&
          unregisteredKnown === false
          ? adminCreatingCompanyCategory
          : jobFormNonRegisteredCompany &&
            unregisteredKnownExists &&
            unregisteredKnown === true
            ? unregisteredKnownExists.companyCategory
            : (companyExists.category as string);

      const companyWebsite =
        jobFormNonRegisteredCompany &&
          !unregisteredKnownExists &&
          unregisteredKnown === false
          ? adminCreatingCompanyWebsite
          : jobFormNonRegisteredCompany &&
            unregisteredKnownExists &&
            unregisteredKnown === true
            ? unregisteredKnownExists.companyWebsite
            : (companyExists.website as string);

      const companyEmail =
        jobFormNonRegisteredCompany &&
          !unregisteredKnownExists &&
          unregisteredKnown === false
          ? adminCreatingCompanyEmail
          : jobFormNonRegisteredCompany &&
            unregisteredKnownExists &&
            unregisteredKnown === true
            ? unregisteredKnownExists.companyEmail
            : (companyUser?.email as string);

      const logo =
        jobFormNonRegisteredCompany &&
          !unregisteredKnownExists &&
          unregisteredKnown === false
          ? adminCreatingAddLogo
          : jobFormNonRegisteredCompany &&
            unregisteredKnownExists &&
            unregisteredKnown === true
            ? unregisteredKnownExists.logo
            : companyExists.logo;

      if (unregisteredKnown === false && jobFormNonRegisteredCompany === true) {
        await db.unregisteredCompany.create({
          data: {
            companyName: company_name,
            companyDescription: company_description,
            companyCategory,
            companyWebsite,
            companyEmail,
            logo: logo,
          },
        });
      }

      const isEmployerPostingExists = await db.employers.findFirst({
        where: {
          id: isEmployerID,
        },
      });

      if (!isEmployerPostingExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Looks like the employer you are posting for, does not exist.",
        });

      if (assessmentOneID) {
        if (assessmentTwoID === assessmentOneID)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The identity of the first assessment is same as the second",
          });
        const assessmentByIDExists = await db.assessmentBanner.findFirst({
          where: {
            id: assessmentOneID,
          },
        });

        if (!assessmentByIDExists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The first assessment you requesting to include in the job does not exist. Could have been deleted.",
          });
        let randomBannerId: string | null = null;
        const bonusBanners = await db.assessmentBanner.findMany({
          where: {
            category: {
              in: [
                "Language Test",
                "Reading Test",
                "Comprehension Test",
                "Communication Skills",
              ],
            },
          },
          select: {
            id: true,
          },
        });

        if (bonusBanners.length > 0) {
          const randomIndex = Math.floor(Math.random() * bonusBanners.length);
          randomBannerId = bonusBanners[randomIndex].id;
        }

        const checkIfEmployerRequestedID =
          await db.pickAssessCandidate.findFirst({
            where: {
              testID: assessmentByIDExists.id,
            },
          });

        if (!checkIfEmployerRequestedID)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The employer has not ordered for this assessment. Ask them to go to assessment section to order for it.",
          });

        await db.pickAssessCandidate.update({
          where: {
            id: checkIfEmployerRequestedID.id,
          },
          data: {
            utilized: true,
          },
        });

        if (assessmentTwoID) {
          if (assessmentTwoID === assessmentOneID)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "The identity of the second assessment is same as the first",
            });
          const secondAssessmentByIDExists =
            await db.assessmentBanner.findFirst({
              where: {
                id: assessmentTwoID,
              },
            });

          if (!secondAssessmentByIDExists)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "The second assessment you requesting to include in the job does not exist. Could have been deleted.",
            });

          const checkIfHadOrderedSecond =
            await db.pickAssessCandidate.findFirst({
              where: {
                testID: secondAssessmentByIDExists.id,
              },
            });

          if (!checkIfHadOrderedSecond)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "The employer ordered for the second assessment you're requesting to add in the job. Ask them to order in the assessments section.",
            });

          await db.pickAssessCandidate.update({
            where: {
              id: checkIfHadOrderedSecond.id,
            },
            data: {
              utilized: true,
            },
          });

          return await db.job.create({
            data: {
              userId: employerUserId,
              isEmployerID,
              job_id,
              createdByName: employerName,
              companyId: companyExists.id,
              company_name,
              company_description,
              companyCategory,
              companyWebsite,
              companyEmail,
              companyLogo: logo,
              job_type,
              adminPosted: true,
              job_title,
              job_description,
              summaryDescription: shortDescription(job_description),
              responsibilities,
              jobFormNonRegisteredCompany,
              adminCreatingCompanyName,
              requirement,
              personal_skills,
              experience,
              numberOfPositions,
              possible_pay,
              category,
              county,
              deadline,
              platform,
              emailPlatform,
              linkPlatform,
              otherPlatform,
              ownPlatformMethod,
              experienceDesired,
              address,
              academic,
              benefits,
              instructions,
              academicDesired,
              addAssessment,
              assessmentOneID: checkIfEmployerRequestedID.testID,
              assessmentTwoID: checkIfHadOrderedSecond.testID,
              bonusTestID: randomBannerId,
              seniority,
              subCategory,
            },
          });
        }
        return await db.job.create({
          data: {
            userId: employerUserId,
            isEmployerID,
            job_id,
            createdByName: employerName,
            companyId: companyExists.id,
            company_name,
            company_description,
            companyCategory,
            companyWebsite,
            companyEmail,
            companyLogo: logo,
            job_type,
            adminPosted: true,
            job_title,
            job_description,
            summaryDescription: shortDescription(job_description),
            responsibilities,
            jobFormNonRegisteredCompany,
            adminCreatingCompanyName,
            requirement,
            personal_skills,
            experience,
            numberOfPositions,
            possible_pay,
            category,
            county,
            deadline,
            platform,
            emailPlatform,
            linkPlatform,
            otherPlatform,
            ownPlatformMethod,
            experienceDesired,
            address,
            academic,
            benefits,
            instructions,
            academicDesired,
            addAssessment,
            assessmentOneID: checkIfEmployerRequestedID.testID,
            bonusTestID: randomBannerId,
            seniority,
            subCategory,
          },
        });
      }

      return await db.job.create({
        data: {
          userId: employerUserId,
          isEmployerID,
          job_id,
          createdByName: employerName,
          companyId: companyExists.id,
          company_name,
          company_description,
          companyCategory,
          companyWebsite,
          companyEmail,
          companyLogo: logo,
          job_type,
          adminPosted: true,
          job_title,
          job_description,
          summaryDescription: shortDescription(job_description),
          responsibilities,
          jobFormNonRegisteredCompany,
          adminCreatingCompanyName,
          requirement,
          personal_skills,
          experience,
          numberOfPositions,
          possible_pay,
          category,
          county,
          deadline,
          platform,
          emailPlatform,
          linkPlatform,
          otherPlatform,
          ownPlatformMethod,
          experienceDesired,
          address,
          academic,
          benefits,
          instructions,
          addAssessment,
          academicDesired,
          seniority,
          subCategory,
        },
      });
    }),

  adminTriggerIndexing: privateProcedure.mutation(async ({ ctx }) => {
    const { userId, email } = ctx;
    const currentDate = new Date();
    const baseUrl = "https://www.hired.co.ke";
    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
        email,
      },
    });

    if (!dbUser)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are unauthorized, you have to login to continue.",
      });

    const isAdmin = await db.admin.findFirst({
      where: {
        adminEmail: email,
      },
    });

    if (!isAdmin)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "This is an admin's only section.",
      });

    const jobs = await db.job.findMany({
      where: {
        deadline: {
          gte: currentDate,
        },
        published: {
          equals: true,
        },
        createdAt: {
          gte: new Date(currentDate.getTime() - 12 * 60 * 60 * 1000),
        },
      },
    });

    const convertToSlug = (text: string): string => {
      return text.toLowerCase().replace(/\s+/g, "-");
    };

    const slugify = (str: string): string => {
      return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, (char) => encodeURIComponent(char))
        .replace(/\s+/g, "_")
        .replace(/__+/g, "_");
    };
    const companyUrls = Array.from(
      new Set(jobs.map((job) => job.company_name))
    ).map((company_name) => {
      const companySlug = slugify(company_name);
      return `${baseUrl}/home/companies/${companySlug}`;
    });

    const subCategoryUrls = Array.from(
      new Set(
        jobs.filter((job) => job.subCategory).map((job) => job.subCategory)
      )
    ).map((subCategory) => {
      const subCategorySlug = convertToSlug(subCategory as string);
      return `${baseUrl}/home/jobs/subcategory/${subCategorySlug}`;
    });

    const jobsUrls = jobs.map((job) => `${baseUrl}/home/jobs/${job.id}`);

    const urlsToIndex = [...companyUrls, ...subCategoryUrls, ...jobsUrls];

    const lastIndexExists = await db.lastRequestJobsIndex.findFirst({
      select: {
        id: true,
      },
    });

    let indexId;
    if (!lastIndexExists) {
      const createIndexRecord = await db.lastRequestJobsIndex.create({
        data: {
          number: urlsToIndex.length,
        },
      });

      indexId = createIndexRecord.id;
    }

    const updateIndexId = lastIndexExists ? lastIndexExists.id : indexId;
    await db.lastRequestJobsIndex.update({
      where: {
        id: updateIndexId,
      },
      data: {
        number: urlsToIndex.length,
      },
    });
    const token = await authorize();

    for await (const url of urlsToIndex) {
      await fetch(
        "https://indexing.googleapis.com/v3/urlNotifications:publish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url, type: "URL_UPDATED" }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          console.log({ response }, "indexed url");
        })
        .catch((err) => {
          console.log({ err }, "failed to index");
        });
    }

    return { message: "Indexing completed successfully." };
  }),

  adminTriggerIndexingBlogs: privateProcedure.mutation(async ({ ctx }) => {
    const { userId, email } = ctx;
    const currentDate = new Date();
    const convertToSlug = (text: string): string => {
      return text.toLowerCase().replace(/\s+/g, "-");
    };
    const baseUrl = "https://www.hired.co.ke";

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
        email,
      },
    });

    if (!dbUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are unauthorized, you have to log in to continue.",
      });
    }

    const isAdmin = await db.admin.findFirst({
      where: {
        adminEmail: email,
      },
    });

    if (!isAdmin) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "This is an admin's only section.",
      });
    }

    const workerBlogs = await db.blogs.findMany({
      where: {
        target: { in: ["Worker", "All"] },
        createdAt: {
          gte: new Date(currentDate.getTime() - 12 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const employerBlogs = await db.blogs.findMany({
      where: {
        target: { in: ["Employer", "All"] },
        createdAt: {
          gte: new Date(currentDate.getTime() - 12 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const workerCategories = Array.from(
      new Set(workerBlogs.map((blog) => blog.category))
    );
    const employerCategories = Array.from(
      new Set(employerBlogs.map((blog) => blog.category))
    );

    const urlsToIndex = [
      ...workerBlogs.map(
        (blog) => `${baseUrl}/home/blogs/job-seekers/${blog.id}`
      ),
      ...workerBlogs.flatMap((blog) =>
        workerCategories.map(
          (category) =>
            `${baseUrl}/home/blogs/job-seekers/${blog.id
            }/categories/${convertToSlug(category)}`
        )
      ),
      ...employerBlogs.map(
        (blog) => `${baseUrl}/home/blogs/employers/${blog.id}`
      ),
      ...employerBlogs.flatMap((blog) =>
        employerCategories.map(
          (category) =>
            `${baseUrl}/home/blogs/employers/${blog.id
            }/categories/${convertToSlug(category)}`
        )
      ),
      ...workerBlogs.flatMap((blog) => {
        const tags = blog.body.match(/#\w+/g);
        return tags
          ? tags.map(
            (tag) =>
              `${baseUrl}/home/blogs/job-seekers/${blog.id}/${convertToSlug(
                tag.replace("#", "")
              )}`
          )
          : [];
      }),
      ...employerBlogs.flatMap((blog) => {
        const tags = blog.body.match(/#\w+/g);
        return tags
          ? tags.map(
            (tag) =>
              `${baseUrl}/home/blogs/employers/${blog.id}/${convertToSlug(
                tag.replace("#", "")
              )}`
          )
          : [];
      }),
    ];

    const lastIndexExists = await db.lastRequestBlogsIndex.findFirst({
      select: { id: true },
    });

    let indexId;
    if (!lastIndexExists) {
      const createIndex = await db.lastRequestBlogsIndex.create({
        data: {
          number: urlsToIndex.length,
        },
      });

      indexId = createIndex.id;
    }

    const updateIndexId = lastIndexExists ? lastIndexExists.id : indexId;

    await db.lastRequestBlogsIndex.update({
      where: { id: updateIndexId },
      data: { number: urlsToIndex.length },
    });

    const token = await authorize();

    for await (const url of urlsToIndex) {
      await fetch(
        "https://indexing.googleapis.com/v3/urlNotifications:publish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            url,
            type: "URL_UPDATED",
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          console.log({ response }, "indexed url");
        })
        .catch((err) => {
          console.log({ err }, "failed to index");
        });
    }

    return { message: "Indexing completed successfully." };
  }),

  adminCreateAssessmentBanner: privateProcedure
    .input(
      z.object({
        name: z.string(),
        category: z.string(),
        briefSummary: z.string(),
        forDemo: z.boolean().default(false),
        forPublic: z.boolean().default(false),
        instructions: z.string(),
        numberQuestions: z.string(),
        completeTime: z.string(),
        attemptNumbers: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const {
        name,
        category,
        briefSummary,
        attemptNumbers,
        instructions,
        numberQuestions,
        completeTime,
        forDemo,
        forPublic,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section. Admin only section",
        });

      const nameAssessmentExists = await db.assessmentBanner.findFirst({
        where: {
          name: name,
        },
      });

      if (nameAssessmentExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There is a banner by the same name",
        });

      return await db.assessmentBanner.create({
        data: {
          name,
          category,
          briefSummary,
          instructions,
          forDemo,
          forPublic,
          numberQuestions: Number(numberQuestions),
          completeTime: Number(completeTime),
          attemptNumbers,
        },
      });
    }),

  adminEditAssessmentBanner: privateProcedure
    .input(
      z.object({
        bannerID: z.string(),
        name: z.string().optional(),
        category: z.string().optional(),
        briefSummary: z.string().optional(),
        instructions: z.string().optional(),
        attemptNumbers: z.string().optional(),
        forDemo: z.boolean().optional(),
        forPublic: z.boolean().optional(),
        numberQuestions: z.string().optional(),
        completeTime: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const {
        bannerID,
        name,
        category,
        briefSummary,
        instructions,
        attemptNumbers,
        numberQuestions,
        completeTime,
        forDemo,
        forPublic,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section. Admin only section",
        });

      const bannerExists = await db.assessmentBanner.findFirst({
        where: {
          id: bannerID,
        },
      });

      if (!bannerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The assessment banner you intend to edit does not exist",
        });
      const data = {
        ...(name && { name }),
        ...(category && { category }),
        ...(instructions && { instructions }),
        ...(briefSummary && { briefSummary }),
        ...(attemptNumbers && { attemptNumbers }),
        ...(forDemo && { forDemo }),
        ...(forPublic && { forPublic }),
        ...(numberQuestions && { numberQuestions: Number(numberQuestions) }),
        ...(completeTime && { completeTime: Number(completeTime) }),
      };
      return await db.assessmentBanner.update({
        where: {
          id: bannerExists.id,
        },
        data,
      });
    }),

  adminDeleteAssessmentBanner: privateProcedure
    .input(
      z.object({
        bannerID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { bannerID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section. Admin only section",
        });

      const bannerExists = await db.assessmentBanner.findFirst({
        where: {
          id: bannerID,
        },
      });

      if (!bannerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The assessment banner you intend to delete does not exist",
        });

      return await db.assessmentBanner.delete({
        where: {
          id: bannerExists.id,
        },
      });
    }),

  adminEditAssessmentQuestion: privateProcedure
    .input(
      z.object({
        questionID: z.string(),
        scenarioExplanation: z.string().optional(),
        scenario: z.string().optional(),
        question: z.string().optional(),
        choice1: z.string().optional(),
        choice2: z.string().optional(),
        choice3: z.string().optional(),
        attemptType: z.string().optional(),
        answer: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const {
        questionID,
        scenario,
        scenarioExplanation,
        question,
        choice1,
        choice2,
        choice3,
        attemptType,
        answer,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section. Admin only section",
        });

      const questionExists = await db.assessment.findFirst({
        where: {
          id: questionID,
        },
      });

      if (!questionExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The assessment banner you are requesting to edit does not exist",
        });

      return await db.assessment.update({
        where: {
          id: questionExists.id,
        },
        data: {
          scenario,
          scenarioExplanation,
          question,
          choice1,
          choice2,
          choice3,
          answer,
          attemptType,
        },
      });
    }),

  adminDeleteAssessmentQuestion: privateProcedure
    .input(
      z.object({
        questionID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { questionID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section. Admin only section",
        });

      const questionExists = await db.assessment.findFirst({
        where: {
          id: questionID,
        },
      });

      if (!questionExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The assessment question you are requesting to delete does not exist",
        });

      return await db.assessment.delete({
        where: {
          id: questionExists.id,
        },
      });
    }),

  workerAcceptAssessment: privateProcedure
    .input(
      z.object({
        testId: z.string(),
        acceptBeTested: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { testId, acceptBeTested } = input;
      const currentDate = new Date();
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is a workers only section.",
        });

      if (acceptBeTested === false)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have not accepted to take the assessment. Ensure acceptance checkbox is checked",
        });
      const bannerExists = await db.assessmentBanner.findFirst({
        where: {
          id: testId,
        },
      });

      if (!bannerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This assessment does not exist. It could have been deleted or changed.",
        });
      const completeTime = addMinutes(currentDate, bannerExists.completeTime);
      const existsNewAcceptances = await db.acceptToBeAssessed.findMany({
        where: {
          userId,
          isWorkerID: isWorker.id,
          new: {
            equals: true,
          },
        },
      });

      const existingAcceptance = await db.acceptToBeAssessed.findFirst({
        where: {
          userId,
          testId: bannerExists.id,
          isWorkerID: isWorker.id,
        },
      });

      if (existingAcceptance) {
        if (existingAcceptance.status === "PASSED")
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You have already passed the test. No further attempts",
          });
        const numberOfAttempts = Number(bannerExists.attemptNumbers);
        if (numberOfAttempts === existingAcceptance.myAttempts)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You have no attempt left. All Your attempts are used up",
          });

        if (existingAcceptance.myAttempts === 1) {
          const secondAttemptTestsExists = await db.assessment.findMany({
            where: {
              bannerID: bannerExists.id,
              attemptType: {
                equals: "secondAttempt",
              },
            },
          });

          if (secondAttemptTestsExists.length < bannerExists.numberQuestions)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Sorry, we haven't uploaded enough test questions for your second attempt. Kindly check later.",
            });
        }

        if (existingAcceptance.myAttempts === 2) {
          const thirdAttemptTestsExists = await db.assessment.findMany({
            where: {
              bannerID: bannerExists.id,
              attemptType: {
                equals: "thirdAttempt",
              },
            },
          });

          if (thirdAttemptTestsExists.length < bannerExists.numberQuestions)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Sorry, we haven't uploaded enough test questions for your third attempt. Kindly check later.",
            });
        }

        if (existsNewAcceptances.length !== 0) {
          await db.acceptToBeAssessed.updateMany({
            where: {
              userId,
              isWorkerID: isWorker.id,
            },
            data: {
              new: false,
            },
          });
        }

        return await db.acceptToBeAssessed.update({
          where: {
            id: existingAcceptance.id,
            testId: bannerExists.id,
            userId,
            isWorkerID: isWorker.id,
          },
          data: {
            isWorkerID: isWorker.id,
            userId,
            fullName: dbUser.name as string,
            testName: bannerExists.name,
            testCategory: bannerExists.category,
            acceptBeTested,
            completeTime,
            testId: bannerExists.id,
            status: "INITIATED",
          },
        });
      }

      const firstAttemptTestsExists = await db.assessment.findMany({
        where: {
          bannerID: bannerExists.id,
          attemptType: {
            equals: "firstAttempt",
          },
        },
      });

      if (firstAttemptTestsExists.length < bannerExists.numberQuestions)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Sorry, we haven't uploaded enough test questions. Kindly check later.",
        });

      if (existsNewAcceptances.length !== 0) {
        await db.acceptToBeAssessed.updateMany({
          where: {
            userId,
            isWorkerID: isWorker.id,
          },
          data: {
            new: false,
          },
        });
      }

      return await db.acceptToBeAssessed.create({
        data: {
          isWorkerID: isWorker.id,
          userId,
          fullName: dbUser.name as string,
          testName: bannerExists.name,
          testCategory: bannerExists.category,
          acceptBeTested,
          completeTime,
          testId: bannerExists.id,
          status: "INITIATED",
        },
      });
    }),

  employerAcceptAssessment: privateProcedure
    .input(
      z.object({
        demoID: z.string(),
        category: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { demoID, category } = input;
      const { userId, email } = ctx;
      const currentDate = new Date();
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is an employer only section.",
        });

      const companyExists = await db.company.findFirst({
        where: {
          userId: dbUser.id,
        },
        select: {
          employerPhone: true,
          company_name: true,
        },
      });
      const demoExists = await db.assessmentBanner.findFirst({
        where: {
          id: demoID,
        },
      });

      if (!demoExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sorry, this assessment demo, is currently unavailable",
        });

      const completeTime = addMinutes(currentDate, demoExists.completeTime);

      const hadRequestedSameDemo = await db.employerRequestAssessment.findFirst(
        {
          where: {
            demoID: demoExists.id,
            userId,
            email,
            isEmployerID: isEmployer.id,
          },
        }
      );

      if (hadRequestedSameDemo) {
        await db.employerRequestAssessment.delete({
          where: {
            id: hadRequestedSameDemo.id,
          },
        });
      }
      return await db.employerRequestAssessment.create({
        data: {
          userId: dbUser.id,
          demoID: demoExists.id,
          isEmployerID: isEmployer.id,
          email: dbUser.email,
          completeTime,
          phoneNumber: companyExists?.employerPhone as string,
          companyName: companyExists?.company_name as string,
          fullName: dbUser.name as string,
          category,
        },
      });
    }),

  assessCandidates: privateProcedure
    .input(
      z.object({
        testID: z.string(),
        category: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, email } = ctx;
      const { testID, category } = input;
      const thirtyDaysAgo = subDays(new Date(), 30);
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login to continue",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: dbUser.email,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is employers only section",
        });

      const company = await db.company.findFirst({
        where: {
          userId: dbUser.id,
          isEmployerID: isEmployer.id,
        },
      });

      if (!company)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have to create company user profile before using this service.",
        });

      const testExists = await db.assessmentBanner.findFirst({
        where: {
          id: testID,
        },
      });

      if (!testExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "There is no test by the selected test ID. It could have been deleted.",
        });
      const samePickExists = await db.pickAssessCandidate.findFirst({
        where: {
          companyID: company.id,
          userId,
          testID: testExists.id,
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      });

      if (samePickExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have similar unexpired test picked. Kindly just use the same test you currently have.",
        });
      const accountBalance = await db.accountBalance.findFirst({
        where: {
          userEmail: dbUser.email,
          isEmployerID: isEmployer.id,
        },
        select: {
          balance: true,
          id: true,
        },
      });

      if (!accountBalance)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not have account balance details",
        });

      if (accountBalance.balance < 10000)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have insufficient account balance. Top up and try again.",
        });

      await db.accountBalance.update({
        where: {
          id: accountBalance.id,
        },
        data: {
          balance: {
            decrement: 10000,
          },
        },
      });

      return await db.pickAssessCandidate.create({
        data: {
          userEmail: dbUser.email,
          userId: dbUser.id,
          isEmployerID: isEmployer.id,
          userName: dbUser.name as string,
          category,
          companyID: company.id,
          testName: testExists.name,
          testID: testExists.id,
        },
      });
    }),

  workerClearNewAccept: privateProcedure
    .input(
      z.object({
        acceptID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { acceptID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are unauthorized. You have to login to continue.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is a workers' only section. You are not authorized.",
        });

      const acceptanceExists = await db.acceptToBeAssessed.findFirst({
        where: {
          id: acceptID,
          userId: dbUser.id,
        },
      });

      if (!acceptanceExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "We did not find an acceptance to be assessed with this ID",
        });

      return await db.acceptToBeAssessed.update({
        where: {
          id: acceptanceExists.id,
        },
        data: {
          new: false,
        },
      });
    }),

  employerDeleteRequestedDemoDetails: privateProcedure
    .input(
      z.object({
        requestID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { requestID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "THis is an employer only section",
        });

      const requestExists = await db.employerRequestAssessment.findFirst({
        where: {
          id: requestID,
          userId: userId,
        },
      });

      if (!requestExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There is no a demo requested by your details",
        });

      return await db.employerRequestAssessment.delete({
        where: {
          id: requestExists.id,
        },
      });
    }),

  adminSortAssessmentReport: privateProcedure
    .input(
      z.object({
        reportID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { reportID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, login to continue.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section. Admin only section.",
        });

      const reportExists = await db.reportAssessmentProblem.findFirst({
        where: {
          id: reportID,
        },
      });

      if (!reportExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "There is no a report by that ID. The report could have been deleted.",
        });

      const initiatedReportExists =
        await db.initiateReportAssessmentProblem.findFirst({
          where: {
            id: reportExists.initiateID,
          },
        });

      if (!initiatedReportExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The user has not initiated a request to report an assessment problem",
        });
      const assessmentQuestionExists = await db.assessment.findFirst({
        where: {
          id: reportExists.questionID,
        },
      });

      if (!assessmentQuestionExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This assessment question being reported, does not exist.",
        });

      return await db.reportAssessmentProblem.update({
        where: {
          id: reportExists.id,
        },
        data: {
          sorted: true,
        },
      });
    }),
  adminDeleteAssessmentReport: privateProcedure
    .input(
      z.object({
        reportID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { reportID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, login to continue.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section. Admin only section.",
        });

      const reportExists = await db.reportAssessmentProblem.findFirst({
        where: {
          id: reportID,
        },
      });

      if (!reportExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "There is no a report by that ID. The report could have been deleted.",
        });

      if (reportExists.sorted === false)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You cannot add the user another attempt without viewing and marking the report as 'sorted'",
        });

      const initiatedReportExists =
        await db.initiateReportAssessmentProblem.findFirst({
          where: {
            id: reportExists.initiateID,
          },
        });

      if (!initiatedReportExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The user has not initiated a request to report an assessment problem",
        });
      const currentDate = new Date();
      const deleteStart = addDays(reportExists.createdAt, 30);

      if (currentDate <= deleteStart)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This report has not reached the minimum stay days (30 days) to be able to delete.",
        });

      return await db.initiateReportAssessmentProblem.delete({
        where: {
          id: initiatedReportExists.id,
        },
      });
    }),
  adminAddAssessmentReportingAttempt: privateProcedure
    .input(
      z.object({
        reportID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { reportID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, login to continue.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section. Admin only section.",
        });

      const reportExists = await db.reportAssessmentProblem.findFirst({
        where: {
          id: reportID,
        },
      });

      if (!reportExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "There is no a report by that ID. The report could have been deleted.",
        });

      if (reportExists.sorted === false)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You cannot add the user another attempt without viewing and marking the report as 'sorted'",
        });

      const initiatedReportExists =
        await db.initiateReportAssessmentProblem.findFirst({
          where: {
            id: reportExists.initiateID,
          },
        });

      if (!initiatedReportExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The user has not initiated a request to report an assessment problem",
        });

      const assessmentQuestionExists = await db.assessment.findFirst({
        where: {
          id: reportExists.questionID,
        },
      });

      if (!assessmentQuestionExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This assessment question being reported, does not exist.",
        });
      const workerAcceptAssessment = await db.acceptToBeAssessed.findFirst({
        where: {
          userId: reportExists.userId,
          isWorkerID: reportExists.isWorkerID,
          testId: assessmentQuestionExists.bannerID,
        },
      });

      if (!workerAcceptAssessment)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This user had not accepted to take assessment containing question in the report.",
        });

      return await db.acceptToBeAssessed.update({
        where: {
          id: workerAcceptAssessment.id,
        },
        data: {
          myAttempts: {
            decrement: 1,
          },
        },
      });
    }),

  workInitiateReportAssessmentProblem: privateProcedure
    .input(
      z.object({
        questionID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { questionID } = input;
      const currentDate = new Date();
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is a workers only section.",
        });

      const questionExists = await db.assessment.findFirst({
        where: {
          id: questionID,
        },
      });

      if (!questionExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The question you are reporting does not exist.",
        });

      const reportByUserSameQuestion =
        await db.reportAssessmentProblem.findFirst({
          where: {
            userId,
            questionID,
            isWorkerID: isWorker.id,
          },
        });

      if (reportByUserSameQuestion)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We are still working on your report about this question. You can only report once.",
        });

      const initiatedReportExists =
        await db.initiateReportAssessmentProblem.findFirst({
          where: {
            questionID: questionExists.id,
            userId,
            isWorkerID: isWorker.id,
          },
        });

      if (initiatedReportExists) {
        return await db.initiateReportAssessmentProblem.update({
          where: {
            id: initiatedReportExists.id,
          },
          data: {
            initiateTime: currentDate,
          },
        });
      }
      return await db.initiateReportAssessmentProblem.create({
        data: {
          questionID: questionExists.id,
          userId,
          isWorkerID: isWorker.id,
          initiateTime: currentDate,
        },
      });
    }),
  workerReportTestProblem: privateProcedure
    .input(
      z.object({
        questionID: z.string(),
        subject: z.string(),
        report: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { questionID, subject, report } = input;
      const currentDate = new Date();
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is a workers only section.",
        });

      const questionExists = await db.assessment.findFirst({
        where: {
          id: questionID,
        },
      });

      if (!questionExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The question you are reporting does not exist.",
        });

      const initiatedReportExists =
        await db.initiateReportAssessmentProblem.findFirst({
          where: {
            questionID: questionExists.id,
            userId,
            isWorkerID: isWorker.id,
          },
        });

      if (!initiatedReportExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have not initiated to report a problem. Click on 'Report Problem'",
        });

      const acceptanceExists = await db.acceptToBeAssessed.findFirst({
        where: {
          testId: questionExists.bannerID,
          userId,
          isWorkerID: isWorker.id,
        },
      });

      if (!acceptanceExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You did not accept to take this assessment",
        });

      const differenceMinutes = differenceInMinutes(
        currentDate,
        initiatedReportExists.initiateTime
      );

      const newCompleteTime = addMinutes(
        acceptanceExists.completeTime,
        differenceMinutes
      );
      await db.acceptToBeAssessed.update({
        where: {
          id: acceptanceExists.id,
          testId: questionExists.bannerID,
          userId,
          isWorkerID: isWorker.id,
        },
        data: {
          completeTime: newCompleteTime,
        },
      });

      return await db.reportAssessmentProblem.create({
        data: {
          userId,
          initiateID: initiatedReportExists.id,
          isWorkerID: isWorker.id,
          questionID: questionExists.id,
          subject,
          report,
          fullName: dbUser.name as string,
          email,
          assessmentName: questionExists.name,
          assessmentCategory: questionExists.category,
        },
      });
    }),

  workerGetVerdict: privateProcedure
    .input(
      z.object({
        bannerID: z.string(),
        acceptanceID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { bannerID, acceptanceID } = input;

      const dbUser = await db.user.findFirst({
        where: { id: userId, email },
      });

      if (!dbUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again.",
        });
      }

      const isWorker = await db.workers.findFirst({
        where: { workerEmail: email },
      });

      if (!isWorker) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is a workers only section.",
        });
      }

      const bannerExists = await db.assessmentBanner.findFirst({
        where: {
          id: bannerID,
        },
      });

      if (!bannerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The assessment details could not be found",
        });

      const acceptanceExists = await db.acceptToBeAssessed.findFirst({
        where: {
          id: acceptanceID,
          isWorkerID: isWorker.id,
          userId,
          testId: bannerExists.id,
          status: {
            equals: "INITIATED",
          },
        },
      });

      if (!acceptanceExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "We could not find your details.",
        });

      const allInitiatedTestsDone = await db.submitTest.findMany({
        where: {
          userId,
          isWorkerID: isWorker.id,
        },
      });

      if (allInitiatedTestsDone.length < bannerExists.numberQuestions) {
        const passed = allInitiatedTestsDone.filter(
          (done) => done.passed === true
        ).length;
        const multiplier = Math.round(100 / bannerExists.numberQuestions);
        const myScore = passed * multiplier;
        await db.acceptToBeAssessed.update({
          where: {
            id: acceptanceExists.id,
          },
          data: {
            status: "INCOMPLETE",
            score: myScore,
            myAttempts: {
              increment: 1,
            },
          },
        });

        return await db.submitTest.deleteMany({
          where: {
            userId,
            bannerID: bannerExists.id,
            isWorkerID: isWorker.id,
          },
        });
      }

      const passed = allInitiatedTestsDone.filter(
        (done) => done.passed === true
      ).length;
      const multiplier = Math.round(100 / bannerExists.numberQuestions);
      const myScore = passed * multiplier;

      const theRealPass = myScore > 80;

      await db.acceptToBeAssessed.update({
        where: {
          id: acceptanceExists.id,
        },
        data: {
          status: theRealPass ? "PASSED" : "FAILED",
          score: myScore,
          myAttempts: {
            increment: 1,
          },
        },
      });

      return await db.submitTest.deleteMany({
        where: {
          userId,
          bannerID: bannerExists.id,
          isWorkerID: isWorker.id,
        },
      });
    }),

  employerGetVerdict: privateProcedure
    .input(
      z.object({
        bannerID: z.string(),
        requestID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { bannerID, requestID } = input;

      const dbUser = await db.user.findFirst({
        where: { id: userId, email },
      });

      if (!dbUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again.",
        });
      }

      const isEmployer = await db.employers.findFirst({
        where: { employerEmail: email },
      });

      if (!isEmployer) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is an employers only section.",
        });
      }

      const bannerExists = await db.assessmentBanner.findFirst({
        where: {
          id: bannerID,
        },
      });

      if (!bannerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The demo details could not be found",
        });

      const requestExists = await db.employerRequestAssessment.findFirst({
        where: {
          id: requestID,
          isEmployerID: isEmployer.id,
          userId,
          demoID: bannerExists.id,
        },
      });

      if (!requestExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "We could not find your dem request details.",
        });

      const allInitiatedTestsDone = await db.submitDemo.findMany({
        where: {
          userId,
          isEmployerID: isEmployer.id,
        },
      });

      if (allInitiatedTestsDone.length < bannerExists.numberQuestions) {
        const passed = allInitiatedTestsDone.filter(
          (done) => done.passed === true
        ).length;
        const multiplier = Math.round(100 / bannerExists.numberQuestions);
        const myScore = passed * multiplier;
        await db.employerRequestAssessment.update({
          where: {
            id: requestExists.id,
          },
          data: {
            status: "INCOMPLETE",
            score: myScore,
          },
        });

        return await db.submitDemo.deleteMany({
          where: {
            userId,
            bannerID: bannerExists.id,
            isEmployerID: isEmployer.id,
          },
        });
      }

      const passed = allInitiatedTestsDone.filter(
        (done) => done.passed === true
      ).length;
      const multiplier = Math.round(100 / bannerExists.numberQuestions);
      const myScore = passed * multiplier;

      const theRealPass = myScore > 80;

      await db.employerRequestAssessment.update({
        where: {
          id: requestExists.id,
        },
        data: {
          status: theRealPass ? "PASSED" : "FAILED",
          score: myScore,
        },
      });

      return await db.submitDemo.deleteMany({
        where: {
          userId,
          bannerID: bannerExists.id,
          isEmployerID: isEmployer.id,
        },
      });
    }),

  workerSubmitAssessmentAnswer: privateProcedure
    .input(
      z.object({
        questionId: z.string(),
        myAnswer: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { questionId, myAnswer } = input;

      const dbUser = await db.user.findFirst({
        where: { id: userId, email },
      });

      if (!dbUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again.",
        });
      }

      const isWorker = await db.workers.findFirst({
        where: { workerEmail: email },
      });

      if (!isWorker) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is a workers only section.",
        });
      }

      const questionExists = await db.assessment.findFirst({
        where: { id: questionId },
      });

      if (!questionExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The assessment question does not exist. It could have been deleted.",
        });
      }

      const verdict = myAnswer === questionExists.answer;

      return await db.submitTest.create({
        data: {
          isWorkerID: isWorker.id,
          userId,
          questionId,
          attemptType: questionExists.attemptType,
          realAnswer: questionExists.answer,
          bannerID: questionExists.bannerID,
          myAnswer,
          passed: verdict,
        },
      });
    }),

  employerSubmitAssessmentAnswer: privateProcedure
    .input(
      z.object({
        questionId: z.string(),
        myAnswer: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { questionId, myAnswer } = input;

      const dbUser = await db.user.findFirst({
        where: { id: userId, email },
      });

      if (!dbUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again.",
        });
      }

      const isEmployer = await db.employers.findFirst({
        where: { employerEmail: email },
      });

      if (!isEmployer) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is an employer only section.",
        });
      }

      const questionExists = await db.assessment.findFirst({
        where: { id: questionId },
      });

      if (!questionExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The demo question does not exist. It could have been deleted.",
        });
      }

      const suchQuestionAnswerExists = await db.submitDemo.findMany({
        where: {
          questionId: questionId,
        },
      });

      if (suchQuestionAnswerExists.length !== 0) {
        await db.submitDemo.deleteMany({
          where: {
            questionId,
          },
        });
      }

      const verdict = myAnswer === questionExists.answer;

      return await db.submitDemo.create({
        data: {
          isEmployerID: isEmployer.id,
          userId,
          questionId,
          attemptType: questionExists.attemptType,
          realAnswer: questionExists.answer,
          bannerID: questionExists.bannerID,
          myAnswer,
          passed: verdict,
        },
      });
    }),

  adminCreateAssessment: privateProcedure
    .input(
      z.object({
        bannerID: z.string(),
        scenarioExplanation: z.string(),
        scenario: z.string(),
        question: z.string(),
        choice1: z.string(),
        choice2: z.string(),
        choice3: z.string(),
        attemptType: z.string(),
        answer: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const {
        bannerID,
        question,
        choice1,
        scenario,
        scenarioExplanation,
        choice2,
        choice3,
        attemptType,
        answer,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section. Admin only section",
        });

      const bannerAssessmentExists = await db.assessmentBanner.findFirst({
        where: {
          id: bannerID,
        },
      });

      if (!bannerAssessmentExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There is no a banner by that ID. Select another name",
        });

      return await db.assessment.create({
        data: {
          name: bannerAssessmentExists.name,
          bannerID: bannerAssessmentExists.id,
          category: bannerAssessmentExists.category,
          question,
          choice1,
          choice2,
          choice3,
          attemptType,
          answer,
          scenario,
          scenarioExplanation,
        },
      });
    }),

  employerCreateProfileView: privateProcedure
    .input(
      z.object({
        bioID: z.string(),
        viewed: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { bioID, viewed } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section",
        });

      const { id: isEmployerID } = isEmployer;

      const bioExists = await db.workerBio.findFirst({
        where: {
          id: bioID,
        },
        select: {
          userId: true,
        },
      });

      if (!bioExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That user's profile does not exist.",
        });

      const { userId: workerUserID } = bioExists;

      const profileViewExists = await db.profileView.findFirst({
        where: {
          bioID,
          isEmployerID,
          userId,
        },
        select: {
          viewed: true,
          id: true,
        },
      });

      if (profileViewExists) {
        const profileView = profileViewExists.viewed;
        if (profileView === false && viewed === true) {
          await db.workerBio.update({
            where: {
              id: bioID,
            },
            data: {
              viewCounts: {
                increment: 1,
              },
            },
          });
          return await db.profileView.update({
            where: {
              id: profileViewExists.id,
            },
            data: {
              viewed,
              views: {
                increment: 1,
              },
            },
          });
        } else {
          await db.workerBio.update({
            where: {
              id: bioID,
            },
            data: {
              viewCounts: {
                increment: 1,
              },
            },
          });

          return await db.profileView.update({
            where: {
              id: profileViewExists.id,
            },
            data: {
              views: {
                increment: 1,
              },
            },
          });
        }
      }

      await db.workerBio.update({
        where: {
          id: bioID,
        },
        data: {
          viewCounts: {
            increment: 1,
          },
        },
      });

      return await db.profileView.create({
        data: {
          bioID,
          viewed,
          userId,
          isEmployerID,
          workerUserID,
          views: 1,
        },
      });
    }),

  employerUpdateJob: privateProcedure
    .input(
      z.object({
        jobID: z.string(),
        job_title: z.string().optional(),
        job_description: z.string().optional(),
        responsibilities: z.string().optional(),
        requirement: z.string().optional(),
        personal_skills: z.array(z.string()).optional(),
        platform: z.string().optional(),

        ownPlatformMethod: z.string().optional(),
        emailPlatform: z.string().optional(),
        linkPlatform: z.string().optional(),
        otherPlatform: z.string().optional(),

        experienceDesired: z.string().optional(),
        experience: z.string().optional(),
        numberOfPositions: z.string().optional(),
        possible_pay: z.string().optional(),
        job_type: z.string().optional(),
        seniority: z.string().optional(),
        subCategory: z.string().optional(),
        category: z.string().optional(),
        county: z.string().optional(),
        address: z.string().optional(),
        academic: z.string().optional(),
        benefits: z.array(z.string()).optional(),
        instructions: z.string().optional(),
        academicDesired: z.string().optional(),
        deadline: z.coerce.date().optional(),
        addAssessment: z.boolean().optional(),
        assessmentOneID: z.string().optional(),
        assessmentTwoID: z.string().optional(),
        companyLogo: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const {
        jobID,
        job_title,
        job_description,
        responsibilities,
        requirement,
        personal_skills,
        platform,
        emailPlatform,
        linkPlatform,
        otherPlatform,
        ownPlatformMethod,
        experienceDesired,
        experience,
        numberOfPositions,
        possible_pay,
        job_type,
        category,
        county,
        address,
        academic,
        benefits,
        instructions,
        deadline,
        addAssessment,
        assessmentOneID,
        assessmentTwoID,
        academicDesired,
        seniority,
        subCategory,
        companyLogo,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must login to continue",
        });

      const isEmployer = await db.user.findFirst({
        where: {
          id: userId,
          role: {
            equals: "employer",
          },
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only employers are allowed",
        });

      const jobExists = await db.job.findFirst({
        where: {
          id: jobID,
          userId,
        },
      });
      if (!jobExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A job by that ID and by your user ID does not exist.",
        });

      const newJobSummary = job_description
        ? shortDescription(job_description)
        : jobExists.summaryDescription;

      if (jobExists.addAssessment === true && addAssessment === false) {
        return await db.job.update({
          where: {
            id: jobID,
            userId,
          },
          data: {
            job_title,
            job_description,
            summaryDescription: newJobSummary,
            responsibilities,
            requirement,
            personal_skills,
            platform,
            emailPlatform,
            linkPlatform,
            otherPlatform,
            ownPlatformMethod,
            experienceDesired,
            experience,
            numberOfPositions,
            possible_pay,
            job_type,
            category,
            county,
            addAssessment,
            assessmentOneID: "",
            assessmentTwoID: "",
            address,
            academic,
            benefits,
            instructions,
            deadline,
            academicDesired,
            seniority,
            subCategory,
            companyLogo,
          },
        });
      }

      if (jobExists.addAssessment === true && assessmentOneID) {
        if (jobExists.assessmentTwoID === assessmentOneID)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The identity of the first assessment is the same as the second",
          });

        const pickedAssessmentExists = await db.pickAssessCandidate.findFirst({
          where: {
            testID: assessmentOneID,
          },
        });

        if (!pickedAssessmentExists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "You haven't ordered the assessment you are requesting to add in the job listing",
          });

        const assessmentExists = await db.assessmentBanner.findFirst({
          where: {
            id: pickedAssessmentExists.testID,
          },
        });

        if (!assessmentExists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "We don't have this assessment in our database. It could be missing",
          });

        let randomBannerId: string | null = null;
        const bonusBanners = await db.assessmentBanner.findMany({
          where: {
            category: {
              in: [
                "Language Test",
                "Reading Test",
                "Comprehension Test",
                "Communication Skills",
              ],
            },
          },
          select: {
            id: true,
          },
        });

        if (bonusBanners.length > 0 && !jobExists.bonusTestID) {
          const randomIndex = Math.floor(Math.random() * bonusBanners.length);
          randomBannerId = bonusBanners[randomIndex].id;
        }

        const updatedJobData: Record<string, any> = {
          job_title,
          job_description,
          summaryDescription: newJobSummary,
          responsibilities,
          requirement,
          personal_skills,
          platform,
          emailPlatform,
          linkPlatform,
          otherPlatform,
          ownPlatformMethod,
          experienceDesired,
          experience,
          numberOfPositions,
          possible_pay,
          job_type,
          category,
          county,
          addAssessment,
          assessmentOneID: assessmentExists.id,
          assessmentTwoID,
          address,
          academic,
          benefits,
          instructions,
          deadline,
          academicDesired,
          seniority,
          subCategory,
          companyLogo,
        };
        if (!jobExists.bonusTestID) {
          updatedJobData.bonusTestID = randomBannerId;
        }

        return await db.job.update({
          where: {
            id: jobID,
            userId,
          },
          data: updatedJobData,
        });
      }

      if (jobExists.addAssessment === true && assessmentTwoID) {
        if (assessmentTwoID === jobExists.assessmentOneID)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The identity of the second assessment is the same as the first",
          });

        const pickedAssessmentExists = await db.pickAssessCandidate.findFirst({
          where: {
            testID: assessmentTwoID,
          },
        });

        if (!pickedAssessmentExists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "You haven't ordered the assessment you are requesting to add in the job listing",
          });

        const assessmentExists = await db.assessmentBanner.findFirst({
          where: {
            id: pickedAssessmentExists.testID,
          },
        });

        if (!assessmentExists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "We don't have this assessment in our database. It could be missing",
          });

        let randomBannerId: string | null = null;
        const bonusBanners = await db.assessmentBanner.findMany({
          where: {
            category: {
              in: [
                "Language Test",
                "Reading Test",
                "Comprehension Test",
                "Communication Skills",
              ],
            },
          },
          select: {
            id: true,
          },
        });

        if (bonusBanners.length > 0 && !jobExists.bonusTestID) {
          const randomIndex = Math.floor(Math.random() * bonusBanners.length);
          randomBannerId = bonusBanners[randomIndex].id;
        }
        const updatedJobData: Record<string, any> = {
          job_title,
          job_description,
          summaryDescription: newJobSummary,
          responsibilities,
          requirement,
          personal_skills,
          platform,
          emailPlatform,
          linkPlatform,
          otherPlatform,
          ownPlatformMethod,
          experienceDesired,
          experience,
          numberOfPositions,
          possible_pay,
          job_type,
          category,
          county,
          addAssessment,
          assessmentOneID,
          assessmentTwoID: assessmentExists.id,
          address,
          academic,
          benefits,
          instructions,
          deadline,
          academicDesired,
          seniority,
          subCategory,
          companyLogo,
        };

        if (!jobExists.bonusTestID && randomBannerId) {
          updatedJobData.bonusTestID = randomBannerId;
        }

        return await db.job.update({
          where: {
            id: jobID,
            userId,
          },
          data: updatedJobData,
        });
      }
      return await db.job.update({
        where: {
          id: jobID,
          userId,
        },
        data: {
          job_title,
          job_description,
          summaryDescription: newJobSummary,
          responsibilities,
          requirement,
          personal_skills,
          platform,
          emailPlatform,
          linkPlatform,
          otherPlatform,
          ownPlatformMethod,
          experienceDesired,
          experience,
          numberOfPositions,
          possible_pay,
          job_type,
          category,
          county,
          addAssessment,
          address,
          academic,
          benefits,
          instructions,
          deadline,
          academicDesired,
          seniority,
          subCategory,
          companyLogo,
        },
      });
    }),

  adminUpdateJob: privateProcedure
    .input(
      z.object({
        jobID: z.string(),
        job_title: z.string().optional(),
        job_description: z.string().optional(),
        responsibilities: z.string().optional(),
        requirement: z.string().optional(),
        personal_skills: z.array(z.string()).optional(),
        platform: z.string().optional(),

        ownPlatformMethod: z.string().optional(),
        emailPlatform: z.string().optional(),
        linkPlatform: z.string().optional(),
        otherPlatform: z.string().optional(),
        jobFormNonRegisteredCompany: z.boolean().optional(),
        company_name: z.string().optional(),
        company_description: z.string().optional(),
        companyCategory: z.string().optional(),
        companyWebsite: z.string().optional(),
        companyEmail: z.string().optional(),
        experienceDesired: z.string().optional(),
        experience: z.string().optional(),
        numberOfPositions: z.string().optional(),
        possible_pay: z.string().optional(),
        job_type: z.string().optional(),
        seniority: z.string().optional(),
        subCategory: z.string().optional(),
        category: z.string().optional(),
        county: z.string().optional(),
        address: z.string().optional(),
        academic: z.string().optional(),
        benefits: z.array(z.string()).optional(),
        instructions: z.string().optional(),
        academicDesired: z.string().optional(),
        deadline: z.coerce.date().optional(),
        addAssessment: z.boolean().optional(),
        assessmentOneID: z.string().optional(),
        assessmentTwoID: z.string().optional(),
        adminCreatingAddLogo: z.string().optional(),
        companyLogo: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const {
        jobID,
        job_title,
        job_description,
        responsibilities,
        requirement,
        personal_skills,
        platform,
        emailPlatform,
        linkPlatform,
        otherPlatform,
        ownPlatformMethod,
        experienceDesired,
        experience,
        numberOfPositions,
        possible_pay,
        job_type,
        category,
        county,
        address,
        academic,
        benefits,
        instructions,
        deadline,
        academicDesired,
        jobFormNonRegisteredCompany,
        addAssessment,
        assessmentOneID,
        assessmentTwoID,
        companyLogo,
        company_name,
        company_description,
        companyCategory,
        companyWebsite,
        companyEmail,
        seniority,
        subCategory,
      } = input;
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must login to continue",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are unauthorized to update this job.",
        });

      const jobExists = await db.job.findFirst({
        where: {
          id: jobID,
        },
      });
      if (!jobExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "A job by that job ID does not exist in our system, it could have been deleted..",
        });

      const newJobSummary = job_description
        ? shortDescription(job_description)
        : jobExists.summaryDescription;

      if (jobExists.addAssessment === true && addAssessment === false) {
        return await db.job.update({
          where: {
            id: jobExists.id,
          },
          data: {
            job_title,
            job_description,
            summaryDescription: newJobSummary,
            responsibilities,
            requirement,
            personal_skills,
            platform,
            emailPlatform,
            linkPlatform,
            otherPlatform,
            ownPlatformMethod,
            experienceDesired,
            experience,
            numberOfPositions,
            possible_pay,
            job_type,
            category,
            county,
            addAssessment,
            assessmentOneID: null,
            assessmentTwoID: null,
            address,
            academic,
            companyLogo,
            company_name,
            company_description,
            companyCategory,
            companyWebsite,
            companyEmail,
            benefits,
            instructions,
            deadline,
            academicDesired,
            seniority,
            subCategory,
          },
        });
      }

      if (jobExists.addAssessment === true && assessmentOneID) {
        if (jobExists.assessmentTwoID === assessmentOneID) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The identity of the first assessment is the same as the second",
          });
        }

        const pickedAssessmentExists = await db.pickAssessCandidate.findFirst({
          where: {
            testID: assessmentOneID,
          },
        });

        if (!pickedAssessmentExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The employer hasn't ordered the assessment you are requesting to add in the job listing",
          });
        }

        const assessmentExists = await db.assessmentBanner.findFirst({
          where: {
            id: pickedAssessmentExists.testID,
          },
        });

        if (!assessmentExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "We don't have this assessment in our database. It could be missing",
          });
        }

        let randomBannerId: string | null = null;
        const bonusBanners = await db.assessmentBanner.findMany({
          where: {
            category: {
              in: [
                "Language Test",
                "Reading Test",
                "Comprehension Test",
                "Communication Skills",
              ],
            },
          },
          select: {
            id: true,
          },
        });

        if (bonusBanners.length > 0 && !jobExists.bonusTestID) {
          const randomIndex = Math.floor(Math.random() * bonusBanners.length);
          randomBannerId = bonusBanners[randomIndex].id;
        }

        const updatedJobData: Record<string, any> = {
          job_title,
          job_description,
          summaryDescription: newJobSummary,
          responsibilities,
          requirement,
          personal_skills,
          platform,
          emailPlatform,
          linkPlatform,
          otherPlatform,
          ownPlatformMethod,
          experienceDesired,
          experience,
          numberOfPositions,
          possible_pay,
          job_type,
          category,
          county,
          addAssessment,
          assessmentOneID: assessmentExists.id,
          assessmentTwoID,
          address,
          academic,
          companyLogo,
          company_name,
          company_description,
          companyCategory,
          companyWebsite,
          companyEmail,
          benefits,
          instructions,
          deadline,
          academicDesired,
          seniority,
          subCategory,
        };

        if (!jobExists.bonusTestID && randomBannerId) {
          updatedJobData.bonusTestID = randomBannerId;
        }

        return await db.job.update({
          where: {
            id: jobExists.id,
          },
          data: updatedJobData,
        });
      }

      if (jobExists.addAssessment === true && assessmentTwoID) {
        if (assessmentTwoID === jobExists.assessmentOneID)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The identity of the second assessment is the same as the first",
          });

        const pickedAssessmentExists = await db.pickAssessCandidate.findFirst({
          where: {
            testID: assessmentTwoID,
          },
        });

        if (!pickedAssessmentExists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The employer hasn't ordered the assessment you are requesting to add in the job listing",
          });

        const assessmentExists = await db.assessmentBanner.findFirst({
          where: {
            id: pickedAssessmentExists.testID,
          },
        });

        if (!assessmentExists)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "We don't have this assessment in our database. It could be missing",
          });
        let randomBannerId: string | null = null;
        const bonusBanners = await db.assessmentBanner.findMany({
          where: {
            category: {
              in: [
                "Language Test",
                "Reading Test",
                "Comprehension Test",
                "Communication Skills",
              ],
            },
          },
          select: {
            id: true,
          },
        });

        if (bonusBanners.length > 0 && !jobExists.bonusTestID) {
          const randomIndex = Math.floor(Math.random() * bonusBanners.length);
          randomBannerId = bonusBanners[randomIndex].id;
        }
        const updatedJobData: Record<string, any> = {
          job_title,
          job_description,
          summaryDescription: newJobSummary,
          responsibilities,
          requirement,
          personal_skills,
          platform,
          emailPlatform,
          linkPlatform,
          otherPlatform,
          ownPlatformMethod,
          experienceDesired,
          experience,
          numberOfPositions,
          possible_pay,
          job_type,
          category,
          county,
          addAssessment,
          assessmentOneID,
          assessmentTwoID: assessmentExists.id,
          address,
          academic,
          companyLogo,
          company_name,
          company_description,
          companyCategory,
          companyWebsite,
          companyEmail,
          benefits,
          instructions,
          deadline,
          academicDesired,
          seniority,
          subCategory,
        };
        if (!jobExists.bonusTestID && randomBannerId) {
          updatedJobData.bonusTestID = randomBannerId;
        }
        return await db.job.update({
          where: {
            id: jobExists.id,
          },
          data: updatedJobData,
        });
      }
      return await db.job.update({
        where: {
          id: jobExists.id,
        },
        data: {
          job_title,
          job_description,
          summaryDescription: newJobSummary,
          jobFormNonRegisteredCompany,
          company_name,
          company_description,
          companyCategory,
          companyWebsite,
          companyEmail,
          responsibilities,
          requirement,
          personal_skills,
          platform,
          emailPlatform,
          linkPlatform,
          otherPlatform,
          ownPlatformMethod,
          experienceDesired,
          experience,
          numberOfPositions,
          possible_pay,
          job_type,
          category,
          county,
          address,
          companyLogo,
          academic,
          addAssessment,
          benefits,
          instructions,
          deadline,
          academicDesired,
          seniority,
          subCategory,
        },
      });
    }),

  adminPublishJob: privateProcedure
    .input(
      z.object({
        jobID: z.string(),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { jobID, published } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must login to continue",
        });

      const jobExists = await db.job.findFirst({
        where: {
          id: jobID,
        },
      });

      if (!jobExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The job does not exist. It could have been deleted",
        });

      return await db.job.update({
        where: {
          id: jobID,
        },
        data: {
          published,
        },
      });
    }),

  adminContactEmployer: privateProcedure
    .input(
      z.object({
        subject: z.string(),
        message: z.string(),
        companyId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { subject, message, companyId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
        select: {
          name: true,
          role: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });
      const role = dbUser.role as string;
      const adminName = dbUser.name as string;

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section.",
        });

      const { id: isAdminID } = isAdmin;

      const companyExists = await db.company.findFirst({
        where: {
          id: companyId,
        },
        select: {
          isEmployerID: true,
          userId: true,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The company or the employer does not exist.",
        });

      const { isEmployerID, userId: employerUserId } = companyExists;

      const employerExists = await db.user.findFirst({
        where: {
          id: employerUserId,
        },
        select: {
          name: true,
        },
      });

      if (!employerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The employer does not exist in our database",
        });
      const { name: employerUserName } = employerExists;

      const isEmployer = await db.employers.findFirst({
        where: {
          id: isEmployerID,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There is no an employer by the provided employer ID.",
        });

      return await db.contactEmployer.create({
        data: {
          adminUserId: userId,
          employerUserId,
          employerUserName,
          isEmployerID,
          isAdminID,
          role,
          companyId,
          adminName,
          subject,
          message,
        },
      });
    }),

  adminContactWorker: privateProcedure
    .input(
      z.object({
        subject: z.string(),
        message: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId: adminUserId, email } = ctx;
      const { subject, message, userId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: adminUserId,
          email,
        },
        select: {
          name: true,
          role: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });
      const role = dbUser.role as string;
      const adminName = dbUser.name as string;

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section.",
        });

      const { id: isAdminID } = isAdmin;

      const workerExists = await db.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          name: true,
          email: true,
          id: true,
        },
      });

      if (!workerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The user or worker does not exist.",
        });

      const isRecipientWorker = await db.workers.findFirst({
        where: {
          workerEmail: workerExists.email,
        },
        select: {
          id: true,
        },
      });

      if (!isRecipientWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The worker does not exist in our database",
        });
      const { id: isWorkerID } = isRecipientWorker;

      return await db.contactWorker.create({
        data: {
          adminUserId: adminUserId,
          workerUserId: workerExists.id,
          workerUserName: workerExists.name as string,
          isWorkerID: isWorkerID,
          isAdminID,
          role,
          adminName,
          subject,
          message,
        },
      });
    }),

  replyEmployerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { message, messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You should login to be able to continue",
        });
      const role = dbUser.role as string;
      const messageExists = await db.contactEmployer.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist. It could have been deleted.",
        });

      return await db.contactEmployer.create({
        data: {
          adminUserId: messageExists.adminUserId,
          employerUserId: messageExists.employerUserId,
          employerUserName: messageExists.employerUserName,
          isEmployerID: messageExists.isEmployerID,
          isAdminID: messageExists.isAdminID,
          role,
          companyId: messageExists.companyId,
          adminName: messageExists.adminName,
          subject: messageExists.subject,
          replyingToID: messageID,
          message,
        },
      });
    }),

  replyWorkerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { message, messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You should login to be able to continue",
        });
      const role = dbUser.role as string;
      const messageExists = await db.contactWorker.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist. It could have been deleted.",
        });

      return await db.contactWorker.create({
        data: {
          adminUserId: messageExists.adminUserId,
          workerUserId: messageExists.workerUserId,
          workerUserName: messageExists.workerUserName,
          isWorkerID: messageExists.isWorkerID,
          isAdminID: messageExists.isAdminID,
          role,
          adminName: messageExists.adminName,
          replyingToID: messageID,
          subject: messageExists.subject,
          message,
        },
      });
    }),

  adminHideEmployerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });

      const messageExists = await db.contactEmployer.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist. It could have been deleted",
        });

      return await db.contactEmployer.update({
        where: {
          id: messageID,
        },
        data: {
          adminHide: true,
        },
      });
    }),

  employerHideAdminMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });

      const messageExists = await db.contactEmployer.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist. It could have been deleted",
        });

      return await db.contactEmployer.update({
        where: {
          id: messageID,
        },
        data: {
          employerHide: true,
        },
      });
    }),

  workerHideAdminMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });

      const messageExists = await db.contactWorker.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist. It could have been deleted",
        });

      return await db.contactWorker.update({
        where: {
          id: messageID,
        },
        data: {
          workerHide: true,
        },
      });
    }),

  adminHideWorkerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section.",
        });

      const messageExists = await db.contactWorker.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This message does not exist. It could have been deleted.",
        });

      return await db.contactWorker.update({
        where: {
          id: messageExists.id,
        },
        data: {
          adminHide: true,
        },
      });
    }),

  employerHideWorkerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again.",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
      });
      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section.",
        });

      const messageExists = await db.employerContactWorker.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This message does not exist. It could have been deleted.",
        });

      return await db.employerContactWorker.update({
        where: {
          id: messageExists.id,
        },
        data: {
          employerHide: true,
        },
      });
    }),

  workerHideEmployerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });
      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in unauthorized section.",
        });

      const messageExists = await db.employerContactWorker.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This message does not exist. It could have been deleted.",
        });

      return await db.employerContactWorker.update({
        where: {
          id: messageExists.id,
          isWorkerID: isWorker.id,
        },
        data: {
          workerHide: true,
        },
      });
    }),

  adminArchiveEmployerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });

      const messageExists = await db.contactEmployer.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist. It could have been deleted",
        });

      return await db.contactEmployer.update({
        where: {
          id: messageID,
        },
        data: {
          adminArchive: true,
        },
      });
    }),

  employerArchiveAdminMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });

      const messageExists = await db.contactEmployer.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist. It could have been deleted",
        });

      return await db.contactEmployer.update({
        where: {
          id: messageID,
        },
        data: {
          employerArchive: true,
        },
      });
    }),

  workerArchiveAdminMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });

      const messageExists = await db.contactWorker.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist. It could have been deleted",
        });

      return await db.contactWorker.update({
        where: {
          id: messageID,
        },
        data: {
          workerArchive: true,
        },
      });
    }),

  adminArchiveWorkerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });

      const messageExists = await db.contactWorker.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist. It could have been deleted",
        });

      return await db.contactWorker.update({
        where: {
          id: messageID,
        },
        data: {
          adminArchive: true,
        },
      });
    }),

  employerArchiveWorkerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });

      const messageExists = await db.employerContactWorker.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist. It could have been deleted",
        });

      return await db.employerContactWorker.update({
        where: {
          id: messageID,
        },
        data: {
          employerArchive: true,
        },
      });
    }),

  workerArchiveEmployerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue.",
        });

      const messageExists = await db.employerContactWorker.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist. It could have been deleted",
        });

      return await db.employerContactWorker.update({
        where: {
          id: messageID,
        },
        data: {
          workerArchive: true,
        },
      });
    }),

  adminUnarchiveMessages: privateProcedure.mutation(async ({ ctx }) => {
    const { userId, email } = ctx;

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
        email,
      },
    });

    if (!dbUser)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are unauthorized. You have to login to continue",
      });

    const isAdmin = await db.admin.findFirst({
      where: {
        adminEmail: email,
      },
      select: {
        id: true,
      },
    });

    if (!isAdmin)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are in an unauthorized section.",
      });

    const { id: isAdminID } = isAdmin;

    const archivedExists = await db.contactEmployer.findMany({
      where: {
        adminUserId: userId,
        isAdminID: isAdminID,
        adminArchive: {
          equals: true,
        },
      },
    });

    if (archivedExists.length === 0)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You currently haven't archived any message.",
      });

    return await db.contactEmployer.updateMany({
      where: {
        adminUserId: userId,
        isAdminID,
        adminArchive: {
          equals: true,
        },
      },
      data: {
        adminArchive: false,
      },
    });
  }),

  employerUnarchiveMessages: privateProcedure.mutation(async ({ ctx }) => {
    const { userId, email } = ctx;

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
        email,
      },
    });

    if (!dbUser)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are unauthorized. You have to login to continue",
      });

    const isEmployer = await db.employers.findFirst({
      where: {
        employerEmail: email,
      },
      select: {
        id: true,
      },
    });

    if (!isEmployer)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are in an unauthorized section.",
      });

    const { id: isEmployerID } = isEmployer;

    const archivedExists = await db.contactEmployer.findMany({
      where: {
        employerUserId: userId,
        isEmployerID: isEmployerID,
        employerArchive: {
          equals: true,
        },
      },
    });

    if (archivedExists.length === 0)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You currently haven't archived any message.",
      });

    return await db.contactEmployer.updateMany({
      where: {
        employerUserId: userId,
        isEmployerID,
        employerArchive: {
          equals: true,
        },
      },
      data: {
        employerArchive: false,
      },
    });
  }),

  workerUnarchiveMessages: privateProcedure.mutation(async ({ ctx }) => {
    const { userId, email } = ctx;

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
        email,
      },
    });

    if (!dbUser)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are unauthorized. You have to login to continue",
      });

    const isWorker = await db.workers.findFirst({
      where: {
        workerEmail: email,
      },
      select: {
        id: true,
      },
    });

    if (!isWorker)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are in an unauthorized section.",
      });

    const { id: isWorkerID } = isWorker;

    const archivedExists = await db.contactWorker.findMany({
      where: {
        workerUserId: userId,
        isWorkerID: isWorkerID,
        workerArchive: {
          equals: true,
        },
      },
    });

    if (archivedExists.length === 0)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You currently haven't archived any message.",
      });

    return await db.contactWorker.updateMany({
      where: {
        workerUserId: userId,
        isWorkerID,
        workerArchive: {
          equals: true,
        },
      },
      data: {
        workerArchive: false,
      },
    });
  }),

  adminUnarchiveWorkersMessages: privateProcedure.mutation(async ({ ctx }) => {
    const { userId, email } = ctx;

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
        email,
      },
    });

    if (!dbUser)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are unauthorized. You have to login to continue",
      });

    const isAdmin = await db.admin.findFirst({
      where: {
        adminEmail: email,
      },
      select: {
        id: true,
      },
    });

    if (!isAdmin)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are in an unauthorized section.",
      });

    const { id: isAdminID } = isAdmin;

    const archivedExists = await db.contactWorker.findMany({
      where: {
        adminUserId: userId,
        isAdminID: isAdminID,
        adminArchive: {
          equals: true,
        },
      },
    });

    if (archivedExists.length === 0)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You currently haven't archived any message.",
      });

    return await db.contactWorker.updateMany({
      where: {
        adminUserId: userId,
        isAdminID,
        adminArchive: {
          equals: true,
        },
      },
      data: {
        adminArchive: false,
      },
    });
  }),

  employerUnarchiveWorkersMessages: privateProcedure.mutation(
    async ({ ctx }) => {
      const { userId, email } = ctx;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section.",
        });

      const { id: isEmployerID } = isEmployer;

      const archivedExists = await db.employerContactWorker.findMany({
        where: {
          employerUserId: userId,
          isEmployerID: isEmployerID,
          employerArchive: {
            equals: true,
          },
        },
      });

      if (archivedExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You currently haven't archived any message.",
        });

      return await db.employerContactWorker.updateMany({
        where: {
          employerUserId: userId,
          isEmployerID,
          employerArchive: {
            equals: true,
          },
        },
        data: {
          employerArchive: false,
        },
      });
    }
  ),

  workerUnarchiveEmployerMessages: privateProcedure.mutation(
    async ({ ctx }) => {
      const { userId, email } = ctx;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section.",
        });

      const { id: isWorkerID } = isWorker;

      const archivedExists = await db.employerContactWorker.findMany({
        where: {
          workerUserId: userId,
          isWorkerID,
          workerArchive: {
            equals: true,
          },
        },
      });

      if (archivedExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You currently haven't archived any message.",
        });

      return await db.employerContactWorker.updateMany({
        where: {
          workerUserId: userId,
          isWorkerID,
          workerArchive: {
            equals: true,
          },
        },
        data: {
          workerArchive: false,
        },
      });
    }
  ),

  adminHideAllMessages: privateProcedure
    .input(
      z.object({
        companyId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { companyId } = input;
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to access this section",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isAdminID } = isAdmin;

      const companyExists = await db.company.findFirst({
        where: {
          id: companyId,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Sorry, that company or employer does not exist in our database",
        });

      const messagesExists = await db.contactEmployer.findMany({
        where: {
          companyId,
          isAdminID,
          adminUserId: userId,
          adminArchive: {
            equals: false,
          },
          adminHide: {
            equals: false,
          },
        },
      });

      if (messagesExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There are no messages under this company or employer.",
        });

      return await db.contactEmployer.updateMany({
        where: {
          companyId,
          isAdminID,
          adminUserId: userId,
          adminArchive: {
            equals: false,
          },
          adminHide: {
            equals: false,
          },
        },
        data: {
          adminHide: true,
        },
      });
    }),

  employerHideAllMessages: privateProcedure
    .input(
      z.object({
        adminUserId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { adminUserId } = input;
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to access this section",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isEmployerID } = isEmployer;

      const adminExists = await db.user.findFirst({
        where: {
          id: adminUserId,
        },
      });

      if (!adminExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sorry, that message sender does not exist in our database",
        });

      const messagesExists = await db.contactEmployer.findMany({
        where: {
          adminUserId,
          isEmployerID,
          employerUserId: userId,
          employerArchive: {
            equals: false,
          },
          employerHide: {
            equals: false,
          },
        },
      });

      if (messagesExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "There are no messages from this admin, could have been deleted..",
        });

      return await db.contactEmployer.updateMany({
        where: {
          adminUserId,
          isEmployerID,
          employerUserId: userId,
          employerArchive: {
            equals: false,
          },
          employerHide: {
            equals: false,
          },
        },
        data: {
          employerHide: true,
        },
      });
    }),

  workerHideAllMessages: privateProcedure
    .input(
      z.object({
        adminUserId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { adminUserId } = input;
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to access this section",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isWorkerID } = isWorker;

      const adminExists = await db.user.findFirst({
        where: {
          id: adminUserId,
        },
      });

      if (!adminExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sorry, that message sender does not exist in our database",
        });

      const messagesExists = await db.contactWorker.findMany({
        where: {
          adminUserId,
          isWorkerID,
          workerUserId: userId,
          workerArchive: {
            equals: false,
          },
          workerHide: {
            equals: false,
          },
        },
      });

      if (messagesExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There are no messages from this admin.",
        });

      return await db.contactWorker.updateMany({
        where: {
          adminUserId,
          isWorkerID,
          workerUserId: userId,
          workerArchive: {
            equals: false,
          },
          workerHide: {
            equals: false,
          },
        },
        data: {
          workerHide: true,
        },
      });
    }),

  adminHideAllWorkersMessages: privateProcedure
    .input(
      z.object({
        workerUserId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { workerUserId } = input;
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to access this section",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isAdminID } = isAdmin;

      const workerExists = await db.user.findFirst({
        where: {
          id: workerUserId,
        },
      });

      if (!workerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sorry, that user or worker does not exist in our database",
        });

      const messagesExists = await db.contactWorker.findMany({
        where: {
          workerUserId,
          isAdminID,
          adminUserId: userId,
          adminArchive: {
            equals: false,
          },
          adminHide: {
            equals: false,
          },
        },
      });

      if (messagesExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There are no messages from this candidate.",
        });

      return await db.contactWorker.updateMany({
        where: {
          workerUserId,
          isAdminID,
          adminUserId: userId,
          adminArchive: {
            equals: false,
          },
          adminHide: {
            equals: false,
          },
        },
        data: {
          adminHide: true,
        },
      });
    }),

  employerHideAllWorkersMessages: privateProcedure
    .input(
      z.object({
        workerUserId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { workerUserId } = input;
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to access this section",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isEmployerID } = isEmployer;

      const workerExists = await db.user.findFirst({
        where: {
          id: workerUserId,
        },
      });

      if (!workerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sorry, that user or worker does not exist in our database",
        });

      const messagesExists = await db.employerContactWorker.findMany({
        where: {
          workerUserId,
          isEmployerID,
          employerUserId: userId,
          employerArchive: {
            equals: false,
          },
          employerHide: {
            equals: false,
          },
        },
      });

      if (messagesExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There are no messages from this candidate.",
        });

      return await db.employerContactWorker.updateMany({
        where: {
          workerUserId,
          isEmployerID,
          employerUserId: userId,
          employerArchive: {
            equals: false,
          },
          employerHide: {
            equals: false,
          },
        },
        data: {
          employerHide: true,
        },
      });
    }),

  workerHideAllEmployerMessages: privateProcedure
    .input(
      z.object({
        companyId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { companyId } = input;
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to access this section",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isWorkerID } = isWorker;

      const companyExists = await db.company.findFirst({
        where: {
          id: companyId,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Sorry, the employer or company with this message does not exist in our database",
        });

      const messagesExists = await db.employerContactWorker.findMany({
        where: {
          workerUserId: dbUser.id,
          isWorkerID,
          companyId: companyExists.id,
          workerArchive: {
            equals: false,
          },
          workerHide: {
            equals: false,
          },
        },
      });

      if (messagesExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There are no messages from this company.",
        });

      return await db.employerContactWorker.updateMany({
        where: {
          workerUserId: dbUser.id,
          isWorkerID,
          companyId: companyExists.id,
          workerArchive: {
            equals: false,
          },
          workerHide: {
            equals: false,
          },
        },
        data: {
          workerHide: true,
        },
      });
    }),

  adminDeleteEmployerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isAdminID } = isAdmin;

      const messageExists = await db.contactEmployer.findFirst({
        where: {
          id: messageID,
          isAdminID,
          adminUserId: userId,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That message does not exist, it could have been deleted.",
        });

      return await db.contactEmployer.delete({
        where: {
          id: messageID,
          isAdminID,
          adminUserId: userId,
        },
      });
    }),

  adminDeleteWorkerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isAdminID } = isAdmin;

      const messageExists = await db.contactWorker.findFirst({
        where: {
          id: messageID,
          isAdminID,
          adminUserId: userId,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That message does not exist, it could have been deleted.",
        });

      return await db.contactWorker.delete({
        where: {
          id: messageID,
          isAdminID,
          adminUserId: userId,
        },
      });
    }),

  employerDeleteWorkerMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isEmployerID } = isEmployer;

      const messageExists = await db.employerContactWorker.findFirst({
        where: {
          id: messageID,
          isEmployerID,
          employerUserId: userId,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That message does not exist, it could have been deleted.",
        });

      return await db.employerContactWorker.delete({
        where: {
          id: messageID,
          isEmployerID,
          employerUserId: userId,
        },
      });
    }),

  adminDeleteAllEmployerMessages: privateProcedure
    .input(
      z.object({
        companyId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { companyId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isAdminID } = isAdmin;

      const companyExists = await db.company.findFirst({
        where: {
          id: companyId,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The employer or company does not exist.",
        });

      const messagesExists = await db.contactEmployer.findMany({
        where: {
          companyId,
          isAdminID,
          adminUserId: userId,
        },
      });

      if (messagesExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This employer or company has no messages",
        });

      return await db.contactEmployer.deleteMany({
        where: {
          companyId,
          isAdminID,
          adminUserId: userId,
        },
      });
    }),

  adminDeleteAllWorkerMessages: privateProcedure
    .input(
      z.object({
        workerUserId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { workerUserId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isAdminID } = isAdmin;

      const workerExists = await db.user.findFirst({
        where: {
          id: workerUserId,
        },
      });

      if (!workerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The candidate or user does not exist.",
        });

      const messagesExists = await db.contactWorker.findMany({
        where: {
          workerUserId,
          isAdminID,
          adminUserId: userId,
        },
      });

      if (messagesExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This candidate or user has no messages",
        });

      return await db.contactWorker.deleteMany({
        where: {
          workerUserId,
          isAdminID,
          adminUserId: userId,
        },
      });
    }),

  employerDeleteAllWorkerMessages: privateProcedure
    .input(
      z.object({
        workerUserId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { workerUserId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isEmployerID } = isEmployer;

      const workerExists = await db.user.findFirst({
        where: {
          id: workerUserId,
        },
      });

      if (!workerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The candidate or user does not exist.",
        });

      const messagesExists = await db.employerContactWorker.findMany({
        where: {
          workerUserId,
          isEmployerID,
          employerUserId: userId,
        },
      });

      if (messagesExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This candidate or user has no messages",
        });

      return await db.employerContactWorker.deleteMany({
        where: {
          workerUserId,
          isEmployerID,
          employerUserId: userId,
        },
      });
    }),

  employerContactWorker: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        subject: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId: employerUserId, email } = ctx;
      const { userId, subject, message } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: employerUserId,
          email,
        },
        select: {
          name: true,
          role: true,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Please login and try again.",
        });
      const role = dbUser.role as string;
      const employerName = dbUser.name as string;
      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });
      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is strictly employers only section.",
        });

      const { id: isEmployerID } = isEmployer;

      const workerExists = await db.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          email: true,
          name: true,
          id: true,
        },
      });
      if (!workerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The user/worker does not exist. Could have deleted the user account.",
        });

      const { name: workerUserName } = workerExists;

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: workerExists.email,
        },
        select: {
          id: true,
        },
      });
      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The recipient is not a worker.",
        });

      const { id: isWorkerID } = isWorker;

      const companyExists = await db.company.findFirst({
        where: {
          userId: employerUserId,
          isEmployerID,
        },
        select: {
          id: true,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This employer has no details about their company in our database",
        });
      const { id: companyId } = companyExists;
      return await db.employerContactWorker.create({
        data: {
          employerUserId,
          employerName,
          workerUserId: workerExists.id,
          workerUserName,
          isWorkerID,
          isEmployerID,
          role,
          companyId,
          subject,
          message,
        },
      });
    }),

  employerWorkerReply: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;
      const { message, messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login to continue",
        });

      const role = dbUser.role as string;

      const messageReplyingToExists = await db.employerContactWorker.findFirst({
        where: {
          id: messageID,
        },
      });

      if (!messageReplyingToExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The message you intend to reply to does not exist, could have been deleted.",
        });
      return await db.employerContactWorker.create({
        data: {
          employerUserId: messageReplyingToExists.employerUserId,
          employerName: messageReplyingToExists.employerName,
          workerUserId: messageReplyingToExists.workerUserId,
          workerUserName: messageReplyingToExists.workerUserName,
          isWorkerID: messageReplyingToExists.isWorkerID,
          isEmployerID: messageReplyingToExists.isEmployerID,
          replyingToID: messageReplyingToExists.id,
          role,
          companyId: messageReplyingToExists.companyId,
          subject: messageReplyingToExists.subject,
          message,
        },
      });
    }),

  employerDeleteJob: privateProcedure
    .input(
      z.object({
        jobID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { jobID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must login to continue",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is employers only section",
        });

      const { id: isEmployerID } = isEmployer;

      const jobExists = await db.job.findFirst({
        where: {
          id: jobID,
          userId,
          isEmployerID,
        },
      });

      if (!jobExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Job does not exist",
        });

      return await db.job.delete({
        where: {
          id: jobID,
          userId,
          isEmployerID,
        },
      });
    }),

  adminDeleteJob: privateProcedure
    .input(
      z.object({
        jobID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { jobID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must login to continue",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not allowed to delete this job.",
        });

      const jobExists = await db.job.findFirst({
        where: {
          id: jobID,
        },
      });

      if (!jobExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Job does not exist, could have been deleted",
        });

      return await db.job.delete({
        where: {
          id: jobID,
        },
      });
    }),

  //Workers Section

  workerCreateBio: privateProcedure
    .input(
      z.object({
        employmentType: z.string().optional(),
        currentJobTitle: z.string().optional(),
        yearOfBirth: z.string().optional(),
        county: z.string().optional(),
        gender: z.string().optional(),
        citizen: z.string().optional(),
        identityNumber: z.string().optional(),
        highestEducation: z.string().optional(),
        profilePic: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, name, email } = ctx;

      const {
        employmentType,
        currentJobTitle,
        yearOfBirth,
        county,
        gender,
        citizen,
        identityNumber,
        highestEducation,
        profilePic,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated, login to create a profile",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Looks like you are in a section you haven't been authorized.",
        });

      const { id: isWorkerID } = isWorker;

      const profileExists = await db.workerBio.findFirst({
        where: {
          userId,
        },
      });

      if (profileExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The user has an existing bio data section",
        });

      return await db.workerBio.create({
        data: {
          userId,
          isWorkerID,
          name,
          employmentType,
          currentJobTitle,
          yearOfBirth,
          county,
          gender,
          citizen,
          identityNumber,
          highestEducation,
          profilePic,
        },
      });
    }),

  employerThumbsBio: privateProcedure
    .input(
      z.object({
        bioID: z.string(),
        liked: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, email } = ctx;
      const { bioID, liked } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must login to continue. Kindly login to continue.",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is employers only section",
        });
      const { id: isEmployerID } = isEmployer;
      const bioExists = await db.workerBio.findFirst({
        where: {
          id: bioID,
        },
      });

      if (!bioExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This profile seems to no longer exist.",
        });

      const thumbsUpExists = await db.thumbsUp.findFirst({
        where: {
          bioID,
          isEmployerID,
          userId,
        },
        select: {
          liked: true,
          id: true,
        },
      });

      if (thumbsUpExists) {
        const originalLikeStatus = thumbsUpExists.liked;
        if (originalLikeStatus === true && liked === false) {
          await db.workerBio.update({
            where: {
              id: bioID,
            },
            data: {
              thumbUp: {
                decrement: 1,
              },
            },
          });
          return await db.thumbsUp.update({
            where: {
              id: thumbsUpExists.id,
              bioID,
            },
            data: {
              liked,
            },
          });
        } else if (originalLikeStatus === false && liked === true) {
          await db.workerBio.update({
            where: {
              id: bioID,
            },
            data: {
              thumbUp: {
                increment: 1,
              },
            },
          });
          return await db.thumbsUp.update({
            where: {
              id: thumbsUpExists.id,
              bioID,
            },
            data: {
              liked,
            },
          });
        }
        return thumbsUpExists;
      }

      await db.workerBio.update({
        where: {
          id: bioID,
        },
        data: {
          thumbUp: {
            increment: 1,
          },
        },
      });

      return await db.thumbsUp.create({
        data: {
          isEmployerID,
          userId,
          bioID,
          liked,
        },
      });
    }),
  adminCheckCandidateProfile: privateProcedure
    .input(
      z.object({
        bioID: z.string(),
        checked: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { bioID, checked } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You are required to login.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is an admin section. You are unauthorized.",
        });

      const bioExists = await db.workerBio.findFirst({
        where: {
          id: bioID,
        },
      });

      if (!bioExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The worker's bio you are requesting to change checked status does not exist.",
        });

      return await db.workerBio.update({
        where: {
          id: bioID,
        },
        data: {
          checked,
        },
      });
    }),

  adminVerifyEmployer: privateProcedure
    .input(
      z.object({
        companyId: z.string(),
        verified: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { companyId, verified } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, kindly login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You seem to be in an unauthorized section",
        });

      const companyExists = await db.company.findFirst({
        where: {
          id: companyId,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This company does not exist. It could have been deleted.",
        });

      return await db.company.update({
        where: {
          id: companyId,
        },
        data: {
          verified,
        },
      });
    }),
  deleteEmployer: privateProcedure
    .input(
      z.object({
        employerUserID: z.string(),
        companyId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { employerUserID, companyId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login to continue",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section",
        });

      const companyExists = await db.company.findFirst({
        where: {
          id: companyId,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This user does not have an existing company yet, could have been deleted.",
        });

      const employerExists = await db.user.findFirst({
        where: {
          id: employerUserID,
        },
      });

      if (!employerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This user does not exist. User could have been deleted.",
        });

      return await db.user.delete({
        where: {
          id: employerUserID,
        },
      });
    }),

  adminDeleteAccount: privateProcedure
    .input(
      z.object({
        accountId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { accountId } = input;
      const { userId, email } = ctx;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is an admin only section",
        });

      const accountExists = await db.user.findFirst({
        where: {
          id: accountId,
        },
      });

      if (!accountExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A user by account details does not exist",
        });

      return await db.user.delete({
        where: {
          id: accountExists.id,
          email: accountExists.email,
        },
      });
    }),

  adminUpdatePendingAccount: privateProcedure
    .input(
      z.object({
        accountId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { accountId } = input;
      const { userId, email } = ctx;
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is an admin only section",
        });

      const accountExists = await db.user.findFirst({
        where: {
          id: accountId,
        },
      });

      if (!accountExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A user by account details does not exist",
        });

      const expiredSignup = await db.user.findFirst({
        where: {
          id: accountExists.id,
          createdAt: {
            lt: twoHoursAgo,
          },
          emailVerified: {
            equals: false
          }
        },
      });

      if (!expiredSignup)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This account is not qualified for res-signup, deletion",
        });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });
      const mailOptions = {
        from: {
          name: "Hired Jobs Team",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: expiredSignup.email,
        subject: "Pending Account Signup",
        html: `
          <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa;'>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
              <p>Dear ${expiredSignup.name as string},</p>
              <p>Your registration on <a href="https://www.hired.co.ke">hired.co.ke</a> is currently pending as your email address has not been confirmed. If you did not receive it including in <b>spam folder</b>, we kindly request you to retry the signup process.</p>
              <p>Please ignore this email if you did not sign up at <a href="https://www.hired.co.ke">hired.co.ke</a></p>
              <p>Follow us on Twitter/X: 
                <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
              </p>
              <hr>
              <p style='text-align:center; font-size:12.5px; line-height:22.22px;'>Copyright © Hired. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };

      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });

      return await db.user.delete({
        where: {
          id: expiredSignup.id,
        },
      });
    }),
  updateWorkerBio: privateProcedure
    .input(
      z.object({
        workerBioDataId: z.string(),
        name: z.string().optional(),
        employmentType: z.string().optional(),
        currentJobTitle: z.string().optional(),
        identityNumber: z.string().optional(),
        county: z.string().optional(),
        highestEducation: z.string().optional(),
        gender: z.string().optional(),
        yearOfBirth: z.string().optional(),
        citizen: z.string().optional(),
        profilePic: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const {
        workerBioDataId,
        employmentType,
        currentJobTitle,
        identityNumber,
        county,
        highestEducation,
        gender,
        name,
        yearOfBirth,
        citizen,
        profilePic,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User has to login to continue",
        });

      const exists = await db.workerBio.findFirst({
        where: {
          id: workerBioDataId,
          userId,
        },
      });

      if (!exists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User has no bio data profile",
        });

      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name: name,
        },
      });
      return await db.workerBio.update({
        where: {
          id: workerBioDataId,
          userId,
        },
        data: {
          employmentType,
          currentJobTitle,
          identityNumber,
          county,
          highestEducation,
          gender,
          yearOfBirth,
          citizen,
          profilePic,
          name,
        },
      });
    }),

  workerCreateDesires: privateProcedure
    .input(
      z.object({
        availability: z.string().optional(),
        currentRemuneration: z.string().optional(),
        currentRemunerationTerms: z.string().optional(),
        desiredRemuneration: z.string().optional(),
        desiredRemunerationTerms: z.string().optional(),
        desiredEmploymentType: z.string().optional(),
        willingToRelocateWithin: z.string().optional(),
        yearsOfExperience: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const {
        availability,
        currentRemuneration,
        currentRemunerationTerms,
        desiredRemuneration,
        desiredRemunerationTerms,
        desiredEmploymentType,
        willingToRelocateWithin,
        yearsOfExperience,
        category,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated, login to create a profile",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Looks like you are in a section you haven't been authorized.",
        });

      const { id: isWorkerID } = isWorker;

      const profileExists = await db.workerDesires.findFirst({
        where: {
          userId,
        },
      });

      if (profileExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The user has an existing desires section",
        });

      return await db.workerDesires.create({
        data: {
          userId,
          isWorkerID,
          availability,
          currentRemuneration,
          currentRemunerationTerms,
          desiredRemuneration,
          desiredRemunerationTerms,
          desiredEmploymentType,
          willingToRelocateWithin,
          yearsOfExperience,
          category,
        },
      });
    }),

  adminEmployerSuspensionUpdate: privateProcedure
    .input(
      z.object({
        companyId: z.string(),
        employerUserId: z.string(),
        suspended: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { employerUserId, suspended, companyId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section",
        });

      const employerExists = await db.user.findFirst({
        where: {
          id: employerUserId,
        },
      });

      if (!employerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This employer does not exist. Could have been deleted.",
        });

      const companyExists = await db.company.findFirst({
        where: {
          id: companyId,
          userId: employerUserId,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This company does not exist. Could have been deleted",
        });
      await db.user.update({
        where: {
          id: employerUserId,
        },
        data: {
          suspended,
        },
      });

      return await db.company.update({
        where: {
          id: companyId,
          userId: employerUserId,
        },
        data: {
          suspended,
        },
      });
    }),
  adminSpecialEmployerUpdate: privateProcedure
    .input(
      z.object({
        companyId: z.string(),
        employerUserId: z.string(),
        special: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { employerUserId, special, companyId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section",
        });

      const employerExists = await db.user.findFirst({
        where: {
          id: employerUserId,
        },
      });

      if (!employerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This employer does not exist. Could have been deleted.",
        });

      const companyExists = await db.company.findFirst({
        where: {
          id: companyId,
          userId: employerUserId,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This company does not exist. Could have been deleted",
        });
      await db.user.update({
        where: {
          id: employerUserId,
        },
        data: {
          special,
        },
      });

      return await db.company.update({
        where: {
          id: companyId,
          userId: employerUserId,
        },
        data: {
          special,
        },
      });
    }),

  adminCreateBlogPost: privateProcedure
    .input(
      z.object({
        category: z.string(),
        heading: z.string(),
        body: z.string(),
        image: z.string(),
        target: z.string(),
        credit: z.string(),
        keywords: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { category, heading, body, image, target, credit, keywords } =
        input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
        select: {
          name: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const fullName = dbUser.name as string;
      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You are in an unauthorized section. This is admin only section.",
        });

      const { id: isAdminID } = isAdmin;

      const publisherProfileExists = await db.adminProfile.findFirst({
        where: {
          userId,
          isAdminID,
        },
        select: {
          role: true,
          briefSummary: true,
          photo: true,
        },
      });

      if (!publisherProfileExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You can't write a blog without admin profile. Create profile to continue.",
        });
      const {
        role: position,
        briefSummary: publisherSummary,
        photo: publisherProfile,
      } = publisherProfileExists;

      return await db.blogs.create({
        data: {
          fullName,
          category,
          heading,
          body,
          image,
          position,
          isAdminID,
          blogDescription: shortDescription(body),
          target,
          credit,
          publisherSummary,
          publisherProfile,
          keywords,
        },
      });
    }),
  adminEditBlogPost: privateProcedure
    .input(
      z.object({
        blogId: z.string(),
        heading: z.string().optional(),
        category: z.string().optional(),
        target: z.string().optional(),
        body: z.string().optional(),
        image: z.string().optional(),
        credit: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { heading, blogId, category, target, body, image, credit } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again.",
        });
      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });

      const { id: isAdminID } = isAdmin;

      const blogExists = await db.blogs.findFirst({
        where: {
          id: blogId,
          isAdminID,
        },
      });

      if (!blogExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This blog does not exist. It could have been deleted.",
        });

      const blogDescription = body
        ? shortDescription(body)
        : blogExists.blogDescription;
      return await db.blogs.update({
        where: {
          id: blogId,
          isAdminID,
        },
        data: {
          heading,
          category,
          target,
          body,
          image,
          blogDescription,
          credit,
        },
      });
    }),

  adminDeleteBlog: privateProcedure
    .input(
      z.object({
        blogId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { blogId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section.",
        });

      const { id: isAdminID } = isAdmin;
      const blogExists = await db.blogs.findFirst({
        where: {
          id: blogId,
          isAdminID,
        },
      });

      if (!blogExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The blog you are requesting to delete seems it does not exist.",
        });

      return await db.blogs.delete({
        where: {
          id: blogId,
          isAdminID,
        },
      });
    }),

  adminPublishBlog: privateProcedure
    .input(
      z.object({
        blogId: z.string(),
        hide: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { blogId, hide } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login and try again.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section.",
        });
      const { id: isAdminID } = isAdmin;

      const blogExists = await db.blogs.findFirst({
        where: {
          id: blogId,
          isAdminID,
        },
      });

      if (!blogExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The blog does not exist. It could have been deleted.",
        });

      return await db.blogs.update({
        where: {
          id: blogId,
          isAdminID,
        },
        data: {
          hide,
        },
      });
    }),
  workerUpdateDesires: privateProcedure
    .input(
      z.object({
        workerDesiredId: z.string(),
        category: z.string().optional(),
        yearsOfExperience: z.string().optional(),
        availability: z.string().optional(),
        willingToRelocateWithin: z.string().optional(),
        currentRemuneration: z.string().optional(),
        currentRemunerationTerms: z.string().optional(),
        desiredRemuneration: z.string().optional(),
        desiredRemunerationTerms: z.string().optional(),
        desiredEmploymentType: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const {
        workerDesiredId,
        category,
        yearsOfExperience,
        availability,
        willingToRelocateWithin,
        currentRemuneration,
        currentRemunerationTerms,
        desiredEmploymentType,
        desiredRemuneration,
        desiredRemunerationTerms,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Login or sign up to continue",
        });

      const exists = await db.workerDesires.findFirst({
        where: {
          id: workerDesiredId,
          userId,
        },
      });

      if (!exists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User has no desirable profile section.",
        });

      return await db.workerDesires.update({
        where: {
          id: workerDesiredId,
          userId,
        },
        data: {
          category,
          yearsOfExperience,
          availability,
          willingToRelocateWithin,
          currentRemuneration,
          currentRemunerationTerms,
          desiredEmploymentType,
          desiredRemuneration,
          desiredRemunerationTerms,
        },
      });
    }),

  workerCreateContact: privateProcedure
    .input(
      z.object({
        phone: z.string().optional(),
        secondaryPhone: z.string().optional(),
        secondaryEmail: z.string().optional(),
        postal: z.string().optional(),
        zip: z.string().optional(),
        town: z.string().optional(),
        county: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const {
        phone,
        secondaryEmail,
        secondaryPhone,
        postal,
        zip,
        town,
        county,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated, login to create a profile",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Looks like you are in a section you haven't been authorized.",
        });

      const { id: isWorkerID } = isWorker;

      const profileExists = await db.workerContact.findFirst({
        where: {
          userId,
        },
      });

      if (profileExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The user has an existing contact section",
        });

      return await db.workerContact.create({
        data: {
          userId,
          isWorkerID,
          email,
          phone,
          secondaryEmail,
          secondaryPhone,
          postal,
          zip,
          town,
          county,
        },
      });
    }),

  workerUpdateContact: privateProcedure
    .input(
      z.object({
        workerContactId: z.string(),
        phone: z.string().optional(),
        secondaryPhone: z.string().optional(),
        secondaryEmail: z.string().optional(),
        postal: z.string().optional(),
        zip: z.string().optional(),
        town: z.string().optional(),
        county: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const {
        phone,
        secondaryEmail,
        secondaryPhone,
        workerContactId,
        postal,
        zip,
        town,
        county,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login or register to continue",
        });

      const exists = await db.workerContact.findFirst({
        where: {
          id: workerContactId,
          userId,
        },
      });

      if (!exists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User has not created contact part of profile",
        });

      return await db.workerContact.update({
        where: {
          id: workerContactId,
          userId,
        },
        data: {
          phone,
          secondaryEmail,
          secondaryPhone,
          postal,
          zip,
          town,
          county,
        },
      });
    }),

  workerCreateAbout: privateProcedure
    .input(
      z.object({
        about: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { about } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User has to login to continue",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Seems you are in a section that you haven't been authorized.",
        });

      const { id: isWorkerID } = isWorker;

      const aboutExists = await db.about.findFirst({
        where: {
          userId,
        },
      });

      if (aboutExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "User has already created this section. Maybe you can do editing.",
        });

      return await db.about.create({
        data: {
          userId,
          isWorkerID,
          about,
        },
      });
    }),

  workerUpdateAbout: privateProcedure
    .input(
      z.object({
        aboutID: z.string(),
        about: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { aboutID, about } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Login and try again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
        });

      const aboutExists = await db.about.findFirst({
        where: {
          id: aboutID,
          userId,
        },
      });

      if (!aboutExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have not created your about section.",
        });

      return await db.about.update({
        where: {
          id: aboutID,
          userId,
        },
        data: {
          about,
        },
      });
    }),

  workerDeleteAbout: privateProcedure
    .input(
      z.object({
        aboutID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { aboutID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authenticated",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
        });

      const { id: isWorkerID } = isWorker;

      const aboutExists = await db.about.findFirst({
        where: {
          id: aboutID,
          userId,
          isWorkerID,
        },
      });

      if (!aboutExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There is no a summary about you found",
        });

      return await db.about.delete({
        where: {
          id: aboutID,
          userId,
          isWorkerID,
        },
      });
    }),

  workerCreateSkills: privateProcedure
    .input(
      z.object({
        skills: z
          .array(z.string())
          .refine(
            (skill) => skill.length >= 5,
            "Kindly select a minimum of 5 skills"
          ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { skills } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is unauthenticated. Login to continue",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Seems you are in a section that you haven't been authorized.",
        });

      const { id: isWorkerID } = isWorker;

      const skillsExists = await db.skills.findFirst({
        where: {
          userId,
        },
      });

      if (skillsExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have created this section already. Maybe try editing.",
        });

      return await db.skills.create({
        data: {
          userId,
          isWorkerID,
          skills,
        },
      });
    }),

  workerUpdateSkills: privateProcedure
    .input(
      z.object({
        skillsID: z.string(),
        skills: z
          .array(z.string())
          .refine(
            (skill) => skill.length >= 5,
            "Kindly ensure you have a minimum of 5 skills"
          ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { skillsID, skills } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Login and try again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
        });

      const skillsExists = await db.skills.findFirst({
        where: {
          id: skillsID,
          userId,
        },
      });

      if (!skillsExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have not created your skills section.",
        });

      return await db.skills.update({
        where: {
          id: skillsID,
          userId,
        },
        data: {
          skills,
        },
      });
    }),

  workerDeleteSkills: privateProcedure
    .input(
      z.object({
        skillsID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { skillsID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authenticated",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
        });

      const { id: isWorkerID } = isWorker;

      const skillsExists = await db.skills.findFirst({
        where: {
          id: skillsID,
          userId,
          isWorkerID,
        },
      });

      if (!skillsExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No skills details found",
        });

      return await db.skills.delete({
        where: {
          id: skillsID,
          userId,
          isWorkerID,
        },
      });
    }),

  workerUploadResume: privateProcedure
    .input(
      z.object({
        resume: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { resume } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated, login and try again",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section.",
        });

      const { id: isWorkerID } = isWorker;

      const resumeExists = await db.resume.findFirst({
        where: {
          userId,
          isWorkerID,
        },
      });

      if (resumeExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You can only upload one CV file. You already have an existing CV.",
        });

      return await db.resume.create({
        data: {
          userId,
          isWorkerID,
          resume,
        },
      });
    }),

  workerUpdateResume: privateProcedure
    .input(
      z.object({
        resumeID: z.string(),
        resume: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { resumeID, resume } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Login to continue",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section.",
        });

      const resumeExists = await db.resume.findFirst({
        where: {
          id: resumeID,
          userId,
        },
      });

      if (!resumeExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have not uploaded your CV. Upload to continue.",
        });

      return await db.resume.update({
        where: {
          id: resumeID,
          userId,
        },
        data: {
          resume,
        },
      });
    }),

  workerDeleteResume: privateProcedure
    .input(
      z.object({
        resumeID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { resumeID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authenticated",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
        });

      const { id: isWorkerID } = isWorker;

      const resumeExists = await db.resume.findFirst({
        where: {
          id: resumeID,
          userId,
          isWorkerID,
        },
      });

      if (!resumeExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "We could not find a resume matching your user details.",
        });

      return await db.resume.delete({
        where: {
          id: resumeID,
          userId,
          isWorkerID,
        },
      });
    }),

  helpMessage: privateProcedure
    .input(
      z.object({
        fullName: z.string(),
        priority: z.string(),
        subject: z.string(),
        message: z
          .string()
          .max(600, { message: "The maximum characters can only be 600" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { fullName, priority, subject, message } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated. Kindly login and try again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section",
        });

      const { id: isWorkerID } = isWorker;

      return await db.helpWorker.create({
        data: {
          userId,
          isWorkerID,
          fullName,
          priority,
          role: dbUser.role as string,
          subject,
          message,
        },
      });
    }),

  homepageContact: contactProcedure
    .input(
      z.object({
        fullName: z.string(),
        email: z.string(),
        subject: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { viewID, ipAddress, location } = ctx;
      const { fullName, email, subject, message } = input;

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Contact Message Delivered",
        html: `
               <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
              <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                  <p>Hello ${fullName},</p>
                  <p>
                  Your contact message about ${subject}, has been delivered. Our team will look at it and get back to you as appropriate.
                  </p>
                  <p style='margin-top:0.5rem; font-size:12.5px'>Note: You are receiving this message because this email was used in contact details on <a href='${productionBASE_URL}'>Hired</a>.</p>
                  <p>Follow us on Twitter/X: 
                    <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                  </p>
                  <hr>
                  <p style='text-align:center; font-size:12.5px; line-height:22.22px;'>Copyright © Hired. All rights reserved.</p>
              </div>
              </div>
              `,
        priority: "high" as const,
      };

      await db.homepageContact.create({
        data: {
          fullName,
          email,
          subject,
          message,
          viewID,
          ipAddress,
          location,
        },
      });

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    }),

  homePageSubscribe: contactProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { ipAddress, location, viewID } = ctx;
      const { email } = input;
      const homepageSubscribeAlready = await db.homepageSubscribe.findFirst({
        where: { email },
      });

      if (homepageSubscribeAlready) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This email has already subscribed to our job alerts",
        });
      }
      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });
      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Subscribed to Hired job alerts",
        html: `
        <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa;'>
          <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
            <p>Hello there,</p>
            <p>Your subscription to Hired job alerts is successful. We will update you on available job vacancies.</p>
            <p style='margin-top:0.5rem; font-size:12.5px'>Note: You are receiving this message because this email was used to subscribe for job alerts on <a href='${process.env.PRODUCTION_BASE_URL}'>Hired</a>.</p>
            <p>Follow us on Twitter/X: 
              <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
            </p>
            <hr>
            <p style='text-align:center; font-size:12.5px; line-height:22.22px;'>Copyright © Hired. All rights reserved.</p>
          </div>
        </div>
      `,
        priority: "high" as const,
      };
      await db.homepageSubscribe.create({
        data: {
          email,
          viewID,
          ipAddress,
          location,
        },
      });

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });
    }),

  adminReplyWorkerHelp: privateProcedure
    .input(
      z.object({
        helpMessageID: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { helpMessageID, message } = input;
      const { userId, email } = ctx;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are in an unauthorized section. Login and try again.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is admin only section. You are unauthorized.",
        });

      const helpMessageExists = await db.helpWorker.findFirst({
        where: {
          id: helpMessageID,
        },
      });

      if (!helpMessageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Sorry, the help message you intent to reply to does not exist.",
        });

      return await db.helpWorker.create({
        data: {
          userId: helpMessageExists.userId,
          isWorkerID: helpMessageExists.isWorkerID,
          role: dbUser.role as string,
          fullName: dbUser.name as string,
          priority: helpMessageExists.priority,
          subject: helpMessageExists.subject,
          message: message,
        },
      });
    }),

  adminReplyEmployerHelp: privateProcedure
    .input(
      z.object({
        helpMessageID: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { helpMessageID, message } = input;
      const { userId, email } = ctx;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are in an unauthorized section. Login and try again.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is admin only section. You are unauthorized.",
        });

      const helpMessageExists = await db.helpEmployer.findFirst({
        where: {
          id: helpMessageID,
        },
      });

      if (!helpMessageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Sorry, the help message you intent to reply to does not exist.",
        });

      return await db.helpEmployer.create({
        data: {
          userId: helpMessageExists.userId,
          isEmployerId: helpMessageExists.isEmployerId,
          role: dbUser.role as string,
          fullName: dbUser.name as string,
          priority: helpMessageExists.priority,
          subject: helpMessageExists.subject,
          message: message,
        },
      });
    }),

  adminDeleteWorkerHelpMessage: privateProcedure
    .input(
      z.object({
        helpMessageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { helpMessageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are in an unauthorized section. Login and try again.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is admin only section. You are unauthorized.",
        });

      const helpMessageExists = await db.helpWorker.findFirst({
        where: {
          id: helpMessageID,
        },
      });

      if (!helpMessageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Sorry, the help message you intent to reply to does not exist.",
        });

      return await db.helpWorker.delete({
        where: {
          id: helpMessageExists.id,
        },
      });
    }),

  adminDeleteAllWorkerHelpMessage: privateProcedure
    .input(
      z.object({
        workerUserID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { workerUserID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are in an unauthorized section. Login and try again.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is admin only section. You are unauthorized.",
        });

      const theWorkerHasHelpMessages = await db.helpWorker.findMany({
        where: {
          userId: workerUserID,
        },
      });

      if (theWorkerHasHelpMessages.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The worker does not have any available help messages.",
        });

      return await db.helpWorker.deleteMany({
        where: {
          userId: workerUserID,
        },
      });
    }),

  adminDeleteAllEmployerHelpMessage: privateProcedure
    .input(
      z.object({
        employerUserID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { employerUserID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are in an unauthorized section. Login and try again.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is admin only section. You are unauthorized.",
        });

      const theEmployerHasHelpMessages = await db.helpEmployer.findMany({
        where: {
          userId: employerUserID,
        },
      });

      if (theEmployerHasHelpMessages.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The employer does not have any available help messages.",
        });

      return await db.helpEmployer.deleteMany({
        where: {
          userId: employerUserID,
        },
      });
    }),

  adminDeleteEmployerHelpMessage: privateProcedure
    .input(
      z.object({
        helpMessageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { helpMessageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are in an unauthorized section. Login and try again.",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is admin only section. You are unauthorized.",
        });

      const helpMessageExists = await db.helpEmployer.findFirst({
        where: {
          id: helpMessageID,
        },
      });

      if (!helpMessageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Sorry, the help message you intent to reply to does not exist.",
        });

      return await db.helpEmployer.delete({
        where: {
          id: helpMessageExists.id,
        },
      });
    }),

  employerHelp: privateProcedure
    .input(
      z.object({
        priority: z.string(),
        subject: z.string(),
        message: z.string(),
        fullName: z
          .string()
          .max(600, { message: "The maximum characters can only be 600" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { priority, subject, message, fullName } = input;
      const { email, userId } = ctx;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Please login and try again",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "It seems you are in an unauthorized section",
        });

      const { id: isEmployerId } = isEmployer;

      return await db.helpEmployer.create({
        data: {
          userId,
          fullName,
          message,
          priority,
          role: dbUser.role as string,
          isEmployerId,
          subject,
        },
      });
    }),

  workerUpdateHelp: privateProcedure
    .input(
      z.object({
        helpID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { helpID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated. Kindly login and try again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section",
        });

      const { id: isWorkerID } = isWorker;
      const helpMessageExists = await db.helpWorker.findFirst({
        where: {
          id: helpID,
          userId,
          isWorkerID,
        },
      });

      if (!helpMessageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist, could have been deleted.",
        });

      return await db.helpWorker.update({
        where: {
          id: helpID,
          userId,
          isWorkerID,
        },
        data: {
          hide: true,
        },
      });
    }),

  employerHideMessage: privateProcedure
    .input(
      z.object({
        messageID: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, email } = ctx;
      const { messageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated. Kindly login and try again.",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section",
        });

      const { id: isEmployerID } = isEmployer;

      const messageExists = await db.employerMessageCandidate.findFirst({
        where: {
          id: messageID,
          isEmployerID,
        },
      });

      if (!messageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Seems the message does not exist. Could have been deleted already",
        });

      return await db.employerMessageCandidate.update({
        where: {
          id: messageID,
          isEmployerID,
        },
        data: {
          hide: true,
        },
      });
    }),

  employerUpdateHelp: privateProcedure
    .input(
      z.object({
        helpID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { helpID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated. Kindly login and try again.",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section",
        });

      const { id: isEmployerId } = isEmployer;

      const helpMessageExists = await db.helpEmployer.findFirst({
        where: {
          id: helpID,
          userId,
          isEmployerId,
        },
      });

      if (!helpMessageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The message does not exist, could have been deleted.",
        });

      return await db.helpEmployer.update({
        where: {
          id: helpID,
          userId,
          isEmployerId,
        },
        data: {
          hide: true,
        },
      });
    }),

  employerHideApplication: privateProcedure
    .input(
      z.object({
        applicationID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { applicationID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Seems you are unauthenticated. Please login and try again.",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section.",
        });

      const { id: isEmployerID } = isEmployer;

      const applicationExists = await db.application.findFirst({
        where: {
          id: applicationID,
          isEmployerID,
        },
      });

      if (!applicationExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The application does not exist. Could have been deleted.",
        });

      return await db.application.update({
        where: {
          id: applicationID,
          isEmployerID,
        },
        data: {
          hide: true,
        },
      });
    }),

  employerUpdateReject: privateProcedure
    .input(
      z.object({
        applicationID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { applicationID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Seems you are unauthenticated. Please login and try again.",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section.",
        });

      const { id: isEmployerID } = isEmployer;

      const applicationExists = await db.application.findFirst({
        where: {
          id: applicationID,
          isEmployerID,
        },
        select: {
          applicantName: true,
          userEmail: true,
          jobTitle: true,
          companyName: true,
          status: true,
        },
      });

      if (!applicationExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The application is not available for that update. Could have been deleted.",
        });

      const {
        applicantName: name,
        userEmail,
        jobTitle,
        companyName,
        status,
      } = applicationExists;

      if (status === "DECLINED" || status === "OFFERED")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "An application that has already been declined or offered cannot be rejected again. Contact help team for any assistance.",
        });
      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: userEmail!,
        subject: "Update on Your Job Application",
        html: `
                 <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
                <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                    <p>Hello ${name},</p>
                    <p>We regret to inform you that your recent job application for the <b>${jobTitle}</b> role at ${companyName} has been declined. We appreciate your effort and interest in joining <b>${companyName}</b> team and wish you the best in your future endeavors</p>
                    <p>Thank you for using Hired. Feel free to submit an application for any other open job meeting your qualification.</p>
                    <p>Please do NOT reply to this email.</p><br/>
                    <p>Note: If you did not apply for a job on <b>Hired</b>- www.hired.co.ke, please ignore this email.</p>
                    <p>Follow us on Twitter/X: 
                      <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                    </p>
                    <hr>
                    <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
                </div>
                </div>
                `,
        priority: "high" as const,
      };

      return new Promise(async (resolve) => {
        await db.application.update({
          where: {
            id: applicationID,
          },
          data: {
            status: "DECLINED",
          },
        });

        try {
          await transporter.sendMail(mailOptions);
          resolve(
            NextResponse.json(
              { msg: "Job application declined" },
              { status: 200 }
            )
          );
        } catch (err: any) {
          resolve(NextResponse.json({ msg: err.toString() }, { status: 500 }));
        }
      });
    }),

  employerUpdateOffered: privateProcedure
    .input(
      z.object({
        applicationID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { applicationID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Seems you are unauthenticated. Please login and try again.",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section.",
        });

      const { id: isEmployerID } = isEmployer;

      const applicationExists = await db.application.findFirst({
        where: {
          id: applicationID,
          isEmployerID,
        },
        select: {
          applicantName: true,
          userEmail: true,
          jobTitle: true,
          companyName: true,
          status: true,
        },
      });

      if (!applicationExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The application is not available for that update. Could have been deleted.",
        });

      const {
        applicantName: name,
        userEmail,
        jobTitle,
        companyName,
        status,
      } = applicationExists;

      if (status === "DECLINED" || status === "OFFERED")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This application has already been marked as declined or offered.",
        });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: userEmail!,
        subject: "Successful Job Application",
        html: `
                 <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
                <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                    <p>Hello ${name},</p>
                    <p>We are pleased to inform you that your recent job application for the <b>${jobTitle}</b> role at ${companyName} has been marked as offered. We appreciate your effort and interest in joining <b>${companyName}</b> team. We wish you the best, you will receive further communication on way forward.</p>
                    <p>Thank you for using Hired. Feel free to recommend Hired.</p>
                    <p>Note: If you did not apply for a job on <b>Hired</b>- www.hired.co.ke, please ignore this email.</p>
                    <p>Follow us on Twitter/X: 
                      <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                    </p>
                    <hr>
                    <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
                </div>
                </div>
                `,
        priority: "high" as const,
      };

      return new Promise(async (resolve) => {
        await db.application.update({
          where: {
            id: applicationID,
          },
          data: {
            status: "OFFERED",
          },
        });

        try {
          await transporter.sendMail(mailOptions);
          resolve(
            NextResponse.json(
              { msg: "Job application accepted and offered" },
              { status: 200 }
            )
          );
        } catch (err: any) {
          resolve(NextResponse.json({ msg: err.toString() }, { status: 500 }));
        }
      });
    }),

  employerUpdateInterview: privateProcedure
    .input(
      z.object({
        applicationID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { applicationID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Seems you are unauthenticated. Please login and try again.",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section.",
        });

      const { id: isEmployerID } = isEmployer;

      const applicationExists = await db.application.findFirst({
        where: {
          id: applicationID,
          isEmployerID,
        },
        select: {
          applicantName: true,
          userEmail: true,
          jobTitle: true,
          companyName: true,
          status: true,
        },
      });

      if (!applicationExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The application is not available for that update. Could have been deleted.",
        });

      const {
        applicantName: name,
        userEmail,
        jobTitle,
        companyName,
        status,
      } = applicationExists;

      if (status === "INTERVIEW")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This job application has already been marked as being on interview stage.",
        });

      if (status === "DECLINED" || status === "OFFERED")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This application has already been marked as declined or offered.",
        });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "smtp.gmail.com",
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to take our message");
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: userEmail!,
        subject: "Interview Update",
        html: `
                   <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
                  <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
                      <p>Hello ${name},</p>
                      <p>We are glad to inform you that your recent job application for the <b>${jobTitle}</b> role at ${companyName} has been marked as on interview stage. We appreciate your effort and interest in joining <b>${companyName}</b> team. We wish you the best, you will receive further communication on way forward.</p>
                      <p>Thank you for using Hired. Feel free to recommend Hired.</p>
                      <p>Note: If you did not apply for a job on <b>Hired</b>- www.hired.co.ke, please ignore this email.</p>
                      <p>Follow us on Twitter/X: 
                        <a href="https://www.x.com/hiredKE">www.x.com/hiredKE</a>
                      </p>
                      <hr>
                      <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
                  </div>
                  </div>
                  `,
        priority: "high" as const,
      };

      return new Promise(async (resolve) => {
        await db.application.update({
          where: {
            id: applicationID,
          },
          data: {
            status: "INTERVIEW",
          },
        });

        try {
          await transporter.sendMail(mailOptions);
          resolve(
            NextResponse.json(
              { msg: "Job application headed to interview stage" },
              { status: 200 }
            )
          );
        } catch (err: any) {
          resolve(NextResponse.json({ msg: err.toString() }, { status: 500 }));
        }
      });
    }),

  employerArchiveJob: privateProcedure
    .input(
      z.object({
        jobId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { jobId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login before you can proceed with this action",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section",
        });

      const { id: isEmployerID } = isEmployer;

      const jobExists = await db.job.findFirst({
        where: {
          id: jobId,
          isEmployerID,
          archived: {
            equals: false,
          },
        },
      });
      if (!jobExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The job you intend to archive does not exist. It could have been deleted.",
        });

      return await db.job.update({
        where: {
          id: jobId,
          isEmployerID,
          archived: {
            equals: false,
          },
        },
        data: {
          archived: true,
        },
      });
    }),

  adminRankTopJob: privateProcedure
    .input(
      z.object({
        rankTop: z.boolean().default(false),
        jobId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, email } = ctx;
      const { rankTop, jobId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, Login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: dbUser.email,
        },
        select: {
          id: true,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is an admin only section",
        });

      const jobExists = await db.job.findFirst({
        where: {
          id: jobId,
        },
      });

      if (!jobExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The job you requesting to rank top, does not exist.",
        });

      return await db.job.update({
        where: {
          id: jobExists.id,
        },
        data: {
          rankTop,
        },
      });
    }),

  employerUnarchiveJobs: privateProcedure.mutation(async ({ ctx }) => {
    const { userId, email } = ctx;

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
        email,
      },
    });

    if (!dbUser)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You have to login before you can proceed with this action",
      });

    const isEmployer = await db.employers.findFirst({
      where: {
        employerEmail: email,
      },
      select: {
        id: true,
      },
    });

    if (!isEmployer)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Seems you are in an unauthorized section",
      });

    const { id: isEmployerID } = isEmployer;

    const archivedExists = await db.job.findMany({
      where: {
        isEmployerID,
        userId,
        archived: {
          equals: true,
        },
      },
    });

    if (archivedExists.length === 0)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Currently, you have no archived jobs",
      });

    return await db.job.updateMany({
      where: {
        isEmployerID,
        userId,
        archived: {
          equals: true,
        },
      },
      data: {
        archived: false,
      },
    });
  }),

  workerReportJob: privateProcedure
    .input(
      z.object({
        jobId: z.string(),
        subject: z.string(),
        report: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { jobId, subject, report } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
        select: {
          name: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have to login and try again.",
        });
      const { name } = dbUser;

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "It seems you are in an unauthorized section.",
          cause: "Not a worker",
        });
      const { id: isWorkerID } = isWorker;

      const jobReportedExists = await db.job.findFirst({
        where: {
          id: jobId,
        },
        select: {
          job_title: true,
          company_name: true,
          companyId: true,
          userId: true,
        },
      });

      if (!jobReportedExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Sorry, this job does not exist. It could have been deleted.",
        });

      const {
        job_title,
        company_name,
        companyId,
        userId: employerUserId,
      } = jobReportedExists;

      const companyExists = await db.company.findFirst({
        where: {
          userId: employerUserId,
          id: companyId,
        },
        select: {
          employerPhone: true,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The company posting this job, does not exist in our system.",
        });

      const companyUserDetails = await db.user.findFirst({
        where: {
          id: employerUserId,
        },
        select: {
          email: true,
        },
      });

      if (!companyUserDetails)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We could not find details of the person who posted this job.",
        });

      const reportByUserForJobExists = await db.reportJob.findFirst({
        where: {
          userId,
          jobId,
        },
      });

      if (reportByUserForJobExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only submit one report for a single job",
        });

      return await db.reportJob.create({
        data: {
          userId,
          jobId,
          companyId,
          isWorkerID,
          companyEmail: companyUserDetails.email,
          companyPhone: companyExists.employerPhone as string,
          subject,
          report,
          userName: name,
          employerName: company_name,
          jobName: job_title,
        },
      });
    }),

  adminSortReport: privateProcedure
    .input(
      z.object({
        reportID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { reportID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is admin only section. You are unauthorized.",
        });

      const reportExists = await db.reportJob.findFirst({
        where: {
          id: reportID,
          sorted: {
            equals: false,
          },
        },
      });

      if (!reportExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The job report does not exist, or could have been worked on.",
        });

      return await db.reportJob.update({
        where: {
          id: reportExists.id,
        },
        data: {
          sorted: true,
        },
      });
    }),

  adminDeleteSingleJobReport: privateProcedure
    .input(
      z.object({
        reportID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { reportID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. You have to login and try again",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is admin only section. You are unauthorized.",
        });

      const reportExists = await db.reportJob.findFirst({
        where: {
          id: reportID,
        },
      });

      if (!reportExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The job report does not exist, or could have been deleted.",
        });

      return await db.reportJob.delete({
        where: {
          id: reportExists.id,
        },
      });
    }),

  workerCheckCareer: privateProcedure
    .input(
      z.object({
        jobId: z.string(),
        useGeneratedResume: z.boolean().default(true),
      })
    )

    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { jobId, useGeneratedResume } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is a workers' only section",
        });

      const jobExists = await db.job.findFirst({
        where: {
          id: jobId,
        },
      });

      if (!jobExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The job you are requesting to check your match does not exist.",
        });

      const ifSameJobExists = await db.careerWizard.findFirst({
        where: {
          jobId: jobId,
          userId,
        },
      });

      if (ifSameJobExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "There still exists a result with same job. Search for a different job.",
        });

      const checkIfUserHasExisting = await db.careerWizard.findMany({
        where: {
          userId,
        },
      });

      if (checkIfUserHasExisting.length !== 0) {
        await db.careerWizard.deleteMany({
          where: {
            userId,
          },
        });
      }

      return await db.careerWizard.create({
        data: {
          userId,
          userName: dbUser.name as string,
          jobId: jobExists.id,
          jobName: jobExists.job_title,
          isWorkerID: isWorker.id,
          vacancies: jobExists.numberOfPositions as string,
          jobCategory: jobExists.category as string,
          useGeneratedResume,
        },
      });
    }),

  workerDeleteCareerResults: privateProcedure
    .input(
      z.object({
        careerID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { careerID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Login and try again",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This is a workers' only section",
        });

      const closeCareerExists = await db.careerWizard.findFirst({
        where: {
          id: careerID,
          userId,
        },
      });

      if (!closeCareerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The requested career details does not exist. could have been deleted.",
        });

      return await db.careerWizard.delete({
        where: {
          id: closeCareerExists.id,
          userId,
        },
      });
    }),

  employerMessageWorker: privateProcedure
    .input(
      z.object({
        applicationID: z.string(),
        subject: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { applicationID, subject, message } = input;
      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
        select: {
          name: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Login and try again.",
        });
      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section.",
        });

      const isEmployerID = isEmployer.id;

      const applicationExists = await db.application.findFirst({
        where: {
          id: applicationID,
          isEmployerID,
        },
        select: {
          jobTitle: true,
          jobId: true,
          applicantName: true,
          userId: true,
          job_id: true,
          companyName: true,
          isWorkerID: true,
          companyId: true,
        },
      });
      if (!applicationExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The application on which you want to write this message does not exist.",
        });

      const {
        jobId,
        jobTitle,
        applicantName,
        userId: receiverUserId,
        companyName,
        isWorkerID,
        companyId,
      } = applicationExists;

      const companyExists = await db.company.findFirst({
        where: {
          id: companyId,
          userId,
          isEmployerID,
        },
        select: {
          employerName: true,
        },
      });

      if (!companyExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Details about this company do not exist.",
        });
      const { employerName: userName } = companyExists;

      const receiver = await db.user.findFirst({
        where: {
          id: receiverUserId,
        },
        select: {
          name: true,
        },
      });
      if (!receiver)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The recipient does not exist. Could have deleted account.",
        });

      const isWorkerExists = await db.workers.findFirst({
        where: {
          id: isWorkerID,
        },
      });
      if (!isWorkerExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The candidate does not exist in our database",
        });

      return await db.employerMessageCandidate.create({
        data: {
          userId,
          userName,
          isEmployerID,
          isWorkerID,
          receiverUserId,
          receiverName: applicantName,
          companyId,
          companyName,
          jobId,
          jobTitle,
          applicationID,
          subject,
          message,
        },
      });
    }),

  workerCreateCertification: privateProcedure
    .input(
      z.object({
        certificateLicenseName: z.string(),
        validForever: z.boolean().default(false).optional(),
        validStartMonth: z.string().optional(),
        validStartYear: z.string().optional(),
        validEndMonth: z.string().optional(),
        validEndYear: z.string().optional(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const {
        certificateLicenseName,
        validEndMonth,
        validEndYear,
        validForever,
        validStartMonth,
        validStartYear,
        description,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Login and try again",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section.",
        });

      const { id: isWorkerID } = isWorker;

      return await db.certificationLicense.create({
        data: {
          userId,
          isWorkerID,
          certificateLicenseName,
          validEndMonth,
          validEndYear,
          validForever,
          validStartMonth,
          validStartYear,
          description,
        },
      });
    }),

  workerUpdateCertification: privateProcedure
    .input(
      z.object({
        certificationID: z.string(),
        certificateLicenseName: z.string().optional(),
        validForever: z.boolean().default(false).optional(),
        validStartMonth: z.string().optional(),
        validStartYear: z.string().optional(),
        validEndMonth: z.string().optional(),
        validEndYear: z.string().optional(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const {
        certificationID,
        certificateLicenseName,
        validForever,
        validStartMonth,
        validStartYear,
        validEndMonth,
        validEndYear,
        description,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are unauthenticated. Could be that you have to login again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section.",
        });

      const { id: isWorkerID } = isWorker;

      const certificationExists = await db.certificationLicense.findFirst({
        where: {
          id: certificationID,
          userId,
          isWorkerID,
        },
      });

      if (!certificationExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have not created certification or license records with your user details",
        });

      return await db.certificationLicense.update({
        where: {
          id: certificationID,
          userId,
          isWorkerID,
        },
        data: {
          certificateLicenseName,
          validForever,
          validStartMonth,
          validStartYear,
          validEndMonth,
          validEndYear,
          description,
        },
      });
    }),

  workerDeleteCertification: privateProcedure
    .input(
      z.object({
        certificationID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { certificationID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are unauthenticated. Could be that you have to login again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section.",
        });

      const { id: isWorkerID } = isWorker;

      const certificationExists = await db.certificationLicense.findFirst({
        where: {
          id: certificationID,
          userId,
          isWorkerID,
        },
      });

      if (!certificationExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have not created certification or license records with your user details",
        });

      return await db.certificationLicense.delete({
        where: {
          id: certificationID,
          userId,
          isWorkerID,
        },
      });
    }),

  workerCreateAward: privateProcedure
    .input(
      z.object({
        title: z.string(),
        awardedMonth: z.string().optional(),
        awardedYear: z.string().optional(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { title, awardedMonth, awardedYear, description } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Login and try again",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section.",
        });

      const { id: isWorkerID } = isWorker;

      return await db.award.create({
        data: {
          userId,
          isWorkerID,
          title,
          awardedMonth,
          awardedYear,
          description,
        },
      });
    }),

  workerUpdateAward: privateProcedure
    .input(
      z.object({
        awardID: z.string(),
        title: z.string().optional(),
        awardedMonth: z.string().optional(),
        awardedYear: z.string().optional(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { awardID, title, awardedMonth, awardedYear, description } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are unauthenticated. Could be that you have to login again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section.",
        });

      const { id: isWorkerID } = isWorker;

      const awardExists = await db.award.findFirst({
        where: {
          id: awardID,
          userId,
          isWorkerID,
        },
      });

      if (!awardExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have not created award records with your user details",
        });

      return await db.award.update({
        where: {
          id: awardID,
          userId,
          isWorkerID,
        },
        data: {
          title,
          awardedMonth,
          awardedYear,
          description,
        },
      });
    }),

  workerDeleteAward: privateProcedure
    .input(
      z.object({
        awardID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { awardID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are unauthenticated. Could be that you have to login again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section.",
        });

      const { id: isWorkerID } = isWorker;

      const awardExists = await db.award.findFirst({
        where: {
          id: awardID,
          userId,
          isWorkerID,
        },
      });

      if (!awardExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have not created award records with your user details",
        });

      return await db.award.delete({
        where: {
          id: awardID,
          userId,
          isWorkerID,
        },
      });
    }),

  workerCreateLanguage: privateProcedure
    .input(
      z.object({
        language: z.string(),
        proficiency: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { language, proficiency } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Login and try again",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section.",
        });

      const { id: isWorkerID } = isWorker;

      const languageExists = await db.language.findFirst({
        where: {
          language,
          userId,
          isWorkerID,
        },
      });

      if (languageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have this language recorded in our system. Choose a different language",
        });

      return await db.language.create({
        data: {
          userId,
          isWorkerID,
          language,
          proficiency,
        },
      });
    }),

  workerUpdateLanguage: privateProcedure
    .input(
      z.object({
        languageID: z.string(),
        language: z.string().optional(),
        proficiency: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { languageID, language, proficiency } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are unauthenticated. Could be that you have to login again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section.",
        });

      const { id: isWorkerID } = isWorker;

      const languageExists = await db.language.findFirst({
        where: {
          id: languageID,
          userId,
          isWorkerID,
        },
      });

      if (!languageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Language record requested for update could not be found",
        });

      const newLanguageExists = await db.language.findFirst({
        where: {
          language,
          userId,
          isWorkerID,
          id: {
            not: {
              equals: languageID,
            },
          },
        },
      });

      if (newLanguageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You already have a language matching the new chosen language. You cannot have one language twice.",
        });

      return await db.language.update({
        where: {
          id: languageID,
          userId,
          isWorkerID,
        },
        data: {
          language,
          proficiency,
        },
      });
    }),

  workerDeleteLanguage: privateProcedure
    .input(
      z.object({
        languageID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { languageID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are unauthenticated. Could be that you have to login again.",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section.",
        });

      const { id: isWorkerID } = isWorker;

      const languageExists = await db.language.findFirst({
        where: {
          id: languageID,
          userId,
          isWorkerID,
        },
      });

      if (!languageExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We couldn't find a language matching details of the language you requested for deletion",
        });

      return await db.language.delete({
        where: {
          id: languageID,
          userId,
          isWorkerID,
        },
      });
    }),

  workerCreateExperience: privateProcedure
    .input(
      z.object({
        position: z.string().optional(),
        employmentType: z.string().optional(),
        nameCompany: z.string().optional(),
        location: z.string().optional(),
        stillWorking: z.boolean().default(false).optional(),
        startMonth: z.string().optional(),
        startYear: z.string().optional(),
        endMonth: z.string().optional(),
        endYear: z.string().optional(),
        description: z.string(),
        contactPersonName: z.string().optional(),
        contactPersonPosition: z.string().optional(),
        contactPersonEmail: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const {
        position,
        employmentType,
        nameCompany,
        location,
        stillWorking,
        startMonth,
        startYear,
        endMonth,
        endYear,
        description,
        contactPersonEmail,
        contactPersonName,
        contactPersonPosition,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User has to login to continue",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Seems you are in a section that you haven't been authorized.",
        });

      const { id: isWorkerID } = isWorker;

      return await db.experience.create({
        data: {
          userId,
          isWorkerID,
          position,
          employmentType,
          nameCompany,
          location,
          stillWorking,
          startMonth,
          startYear,
          endMonth,
          endYear,
          description,
          contactPersonEmail,
          contactPersonName,
          contactPersonPosition,
        },
      });
    }),

  workerUpdateExperience: privateProcedure
    .input(
      z.object({
        experienceID: z.string(),
        position: z.string().optional(),
        employmentType: z.string().optional(),
        nameCompany: z.string().optional(),
        location: z.string().optional(),
        stillWorking: z.boolean().default(false).optional(),
        startMonth: z.string().optional(),
        startYear: z.string().optional(),
        endMonth: z.string().optional(),
        endYear: z.string().optional(),
        description: z.string(),
        contactPersonName: z.string().optional(),
        contactPersonPosition: z.string().optional(),
        contactPersonEmail: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const {
        experienceID,
        position,
        employmentType,
        nameCompany,
        location,
        stillWorking,
        startMonth,
        startYear,
        endMonth,
        endYear,
        description,
        contactPersonName,
        contactPersonEmail,
        contactPersonPosition,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Please login and try again",
          cause: "Not in DB",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section.",
          cause: "Not a worker",
        });

      const experienceExists = await db.experience.findFirst({
        where: {
          id: experienceID,
          userId,
        },
      });

      if (!experienceExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have no experience details with the requested ID.",
          cause: "Requested to update wrong experience details",
        });

      return await db.experience.update({
        where: {
          id: experienceID,
        },
        data: {
          position,
          employmentType,
          nameCompany,
          location,
          stillWorking,
          startMonth,
          startYear,
          endMonth,
          endYear,
          description,
          contactPersonName,
          contactPersonEmail,
          contactPersonPosition,
        },
      });
    }),

  workerDeleteExperience: privateProcedure
    .input(
      z.object({
        experienceID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { experienceID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Please login and try again",
          cause: "Not in DB",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
        });

      const experienceExists = await db.experience.findFirst({
        where: {
          id: experienceID,
          userId,
        },
      });

      if (!experienceExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have no experience detail with the requested ID",
        });

      return await db.experience.delete({
        where: {
          id: experienceID,
          userId,
        },
      });
    }),

  workerCreateSecondaryEducation: privateProcedure
    .input(
      z.object({
        school: z.string().optional(),
        county: z.string().optional(),
        startMonth: z.string().optional(),
        startYear: z.string().optional(),
        endMonth: z.string().optional(),
        endYear: z.string().optional(),
        certificateUpload: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const {
        school,
        startMonth,
        startYear,
        county,
        endMonth,
        endYear,
        certificateUpload,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User has to login to continue",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Seems you are in a section that you haven't been authorized.",
        });

      const { id: isWorkerID } = isWorker;

      const existsSecondaryEducation = await db.secondaryEducation.findFirst({
        where: {
          userId,
          isWorkerID,
        },
      });

      if (existsSecondaryEducation)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Create only one secondary education entry, that showing the year you sat for the final examination",
        });

      await db.secondaryEducation.create({
        data: {
          userId,
          isWorkerID,
          school,
          startMonth,
          startYear,
          county,
          endMonth,
          endYear,
          certificateUpload,
        },
      });
    }),

  workerUpdateSecondaryEducation: privateProcedure
    .input(
      z.object({
        secondaryEducationID: z.string(),
        school: z.string().optional(),
        county: z.string().optional(),
        startMonth: z.string().optional(),
        startYear: z.string().optional(),
        endMonth: z.string().optional(),
        endYear: z.string().optional(),
        certificateUpload: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const {
        secondaryEducationID,
        school,
        county,
        startMonth,
        startYear,
        endMonth,
        endYear,
        certificateUpload,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not in our database.",
          cause: "Not in DB",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
          cause: "Not a worker",
        });

      const { id: isWorkerID } = isWorker;

      const existsSecondaryEducation = await db.secondaryEducation.findFirst({
        where: {
          id: secondaryEducationID,
          isWorkerID,
          userId,
        },
      });

      if (!existsSecondaryEducation)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "We did not find your secondary education details.",
        });

      return await db.secondaryEducation.update({
        where: {
          id: secondaryEducationID,
          isWorkerID,
          userId,
        },
        data: {
          school,
          county,
          startMonth,
          startYear,
          endMonth,
          endYear,
          certificateUpload,
        },
      });
    }),

  workerDeleteSecondaryEducation: privateProcedure
    .input(
      z.object({
        secondaryEducationID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { secondaryEducationID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not in our database.",
          cause: "Not in DB",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
          cause: "Not a worker",
        });

      const { id: isWorkerID } = isWorker;

      const existsSecondaryEducation = await db.secondaryEducation.findFirst({
        where: {
          id: secondaryEducationID,
          userId,
          isWorkerID,
        },
      });

      if (!existsSecondaryEducation)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We did not find secondary education records matching your user details",
        });

      return await db.secondaryEducation.delete({
        where: {
          id: secondaryEducationID,
          userId,
          isWorkerID,
        },
      });
    }),

  workerCreateTertiaryEducation: privateProcedure
    .input(
      z.object({
        institution: z.string().optional(),
        programArea: z.string().optional(),
        county: z.string().optional(),
        field: z.string().optional(),
        grade: z.string().optional(),
        startMonth: z.string().optional(),
        stillStudying: z.boolean().default(false).optional(),
        startYear: z.string().optional(),
        endMonth: z.string().optional(),
        endYear: z.string().optional(),
        activities: z.string(),
        contactPersonName: z.string().optional(),
        contactPersonPosition: z.string().optional(),
        contactPersonEmail: z.string().optional(),
        uploadCertificate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const {
        institution,
        programArea,
        field,
        grade,
        county,
        startMonth,
        startYear,
        endMonth,
        contactPersonEmail,
        contactPersonName,
        contactPersonPosition,
        endYear,
        stillStudying,
        activities,
        uploadCertificate,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must login to continue",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Seems you are in a section that you haven't been authorized.",
        });

      const { id: isWorkerID } = isWorker;

      return await db.tertiaryEducation.create({
        data: {
          userId,
          isWorkerID,
          institution,
          county,
          programArea,
          field,
          grade,
          startMonth,
          startYear,
          endMonth,
          endYear,
          stillStudying,
          contactPersonEmail,
          contactPersonName,
          contactPersonPosition,
          activities,
          uploadCertificate,
        },
      });
    }),

  workerUpdateTertiary: privateProcedure
    .input(
      z.object({
        tertiaryEducationID: z.string(),
        institution: z.string().optional(),
        programArea: z.string().optional(),
        county: z.string().optional(),
        field: z.string().optional(),
        grade: z.string().optional(),
        startMonth: z.string().optional(),
        stillStudying: z.boolean().optional(),
        startYear: z.string().optional(),
        endMonth: z.string().optional(),
        endYear: z.string().optional(),
        activities: z.string(),
        contactPersonName: z.string().optional(),
        contactPersonPosition: z.string().optional(),
        contactPersonEmail: z.string().optional(),
        uploadCertificate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const {
        tertiaryEducationID,
        institution,
        programArea,
        county,
        field,
        grade,
        startMonth,
        stillStudying,
        startYear,
        endMonth,
        endYear,
        activities,
        contactPersonEmail,
        contactPersonName,
        contactPersonPosition,
        uploadCertificate,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not in our database.",
          cause: "Not in DB",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
          cause: "Not a worker",
        });

      const { id: isWorkerID } = isWorker;

      const existsTertiaryEducation = await db.tertiaryEducation.findFirst({
        where: {
          id: tertiaryEducationID,
          userId,
          isWorkerID,
        },
      });

      if (!existsTertiaryEducation)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We did not find tertiary education records matching your user details",
        });

      return await db.tertiaryEducation.update({
        where: {
          id: tertiaryEducationID,
          userId,
          isWorkerID,
        },
        data: {
          institution,
          programArea,
          county,
          field,
          grade,
          startMonth,
          stillStudying,
          startYear,
          endMonth,
          endYear,
          activities,
          contactPersonEmail,
          contactPersonName,
          contactPersonPosition,
          uploadCertificate,
        },
      });
    }),

  workerDeleteTertiaryEducation: privateProcedure
    .input(
      z.object({
        tertiaryEducationID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { tertiaryEducationID } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not in our database.",
          cause: "Not in DB",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
          cause: "Not a worker",
        });

      const { id: isWorkerID } = isWorker;

      const existsTertiaryEducation = await db.tertiaryEducation.findFirst({
        where: {
          id: tertiaryEducationID,
          userId,
          isWorkerID,
        },
      });

      if (!existsTertiaryEducation)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We did not find tertiary education records matching your user details",
        });

      return await db.tertiaryEducation.delete({
        where: {
          id: tertiaryEducationID,
          userId,
          isWorkerID,
        },
      });
    }),

  workerCreateApplication: privateProcedure
    .input(
      z.object({
        whyMostQualified: z.string(),
        useGeneratedResume: z.boolean(),
        useUploadedCover: z.boolean().default(false),
        coverLetterUrl: z.string(),
        jobId: z.string(),
        matchScore: z.number().default(0),
        companyId: z.string(),
        isEmployerID: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const {
        whyMostQualified,
        jobId,
        companyId,
        isEmployerID,
        matchScore,
        useGeneratedResume,
        useUploadedCover,
        coverLetterUrl,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Kindly login and try again.",
        });

      const applicantName = dbUser.name;
      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Seems you are in an unauthorized section Or you have not created a user profile",
          cause: "Not a worker",
        });

      const { id: isWorkerID } = isWorker;
      if (useUploadedCover === true && !coverLetterUrl)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have to upload a cover letter based on your selection of an uploaded one",
        });
      const bioExists = await db.workerBio.findMany({
        where: {
          userId,
          isWorkerID,
        },
      });

      if (bioExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have to add your bio data details in the profile",
        });

      const contactExists = await db.workerContact.findMany({
        where: {
          userId,
          isWorkerID,
        },
      });

      if (contactExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have not added your contact details in your profile",
        });

      const aboutExists = await db.about.findFirst({
        where: {
          userId,
          isWorkerID,
        },
      });

      if (!aboutExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You haven't added your about details",
        });

      const experienceExists = await db.experience.findMany({
        where: {
          userId,
          isWorkerID,
        },
      });
      if (experienceExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Add your experience details in the portfolio",
        });

      const secondaryEducation = await db.secondaryEducation.findMany({
        where: {
          userId,
          isWorkerID,
        },
      });

      if (secondaryEducation.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Add your secondary education details",
        });

      const tertiaryEducation = await db.tertiaryEducation.findMany({
        where: {
          userId,
          isWorkerID,
        },
      });

      const skillsExists = await db.skills.findMany({
        where: {
          userId,
          isWorkerID,
        },
      });

      if (skillsExists.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Add your skills details",
        });

      const awardExists = await db.award.findMany({
        where: {
          userId,
          isWorkerID,
        },
      });

      const certificationExists = await db.certificationLicense.findMany({
        where: {
          userId,
          isWorkerID,
        },
      });

      const languageExists = await db.language.findMany({
        where: {
          userId,
          isWorkerID,
        },
      });

      const company = await db.company.findMany({
        where: {
          id: companyId,
          isEmployerID,
        },
      });

      if (company.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Details of the employer company not found",
        });
      const jobExists = await db.job.findFirst({
        where: {
          id: jobId,
          companyId,
          isEmployerID,
        },
      });

      if (!jobExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The application you submitted seems to be for a job that does not exist or has been deleted.",
        });

      const isSavedJob = await db.savedJobs.findFirst({
        where: {
          userId,
          isWorkerID,
          jobID: jobId,
        },
      });

      if (isSavedJob) {
        await db.savedJobs.delete({
          where: {
            id: isSavedJob.id,
            userId,
            isWorkerID,
            jobID: jobId,
          },
        });
      }

      const jobTitle = jobExists.job_title;
      const job_id = jobExists.job_id;
      const company_name = jobExists.company_name;

      const applicationExists = await db.application.findFirst({
        where: {
          userId,
          isWorkerID,
          jobId,
          companyId,
          isEmployerID,
        },
      });
      if (applicationExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only submit one job application per job.",
        });

      const resumeExists = await db.resume.findFirst({
        where: {
          userId,
          isWorkerID,
        },
      });

      const resume = resumeExists?.resume as string;

      await db.job.update({
        where: {
          id: jobId,
          companyId,
          isEmployerID,
        },
        data: {
          applied: {
            increment: 1,
          },
        },
      });
      return await db.application.create({
        data: {
          isWorkerID,
          userId,
          whyMostQualified,
          matchScore,
          jobId,
          jobTitle,
          job_id,
          applicantName,
          userEmail: email,
          companyName: company_name,
          companyId,
          isEmployerID,
          experience: experienceExists as [],
          tertiaryEducation: tertiaryEducation as [],
          certificateLicense: certificationExists as [],
          award: awardExists as [],
          language: languageExists as [],
          workerBio: bioExists as [],
          workerContact: contactExists as [],
          userSkills: skillsExists as [],
          secondaryEducation: secondaryEducation as [],
          about: aboutExists.about,
          company: company as [],
          uploadedResumeUrl: resume,
          useGeneratedResume,
          useUploadedCover,
          coverLetterUrl,
        },
      });
    }),

  workerSaveJob: privateProcedure
    .input(
      z.object({
        jobID: z.string(),
        saved: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const { jobID, saved } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Kindly login to be able to save a job",
        });

      const isWorker = await db.workers.findFirst({
        where: {
          workerEmail: email,
        },
      });

      if (!isWorker)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Seems you are in an unauthorized section. You can only save a job as a logged in job seeker",
        });

      const { id: isWorkerID } = isWorker;

      const savedAlready = await db.savedJobs.findFirst({
        where: {
          userId,
          isWorkerID,
          jobID,
        },
      });

      if (savedAlready) {
        return await db.savedJobs.delete({
          where: {
            id: savedAlready.id,
          },
        });
      }

      return await db.savedJobs.create({
        data: {
          userId,
          isWorkerID,
          jobID,
          saved,
        },
      });
    }),

  employerDeleteApplication: privateProcedure
    .input(
      z.object({
        applicationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;

      const { applicationId } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthenticated. Please login and try again",
        });

      const isEmployer = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Seems you are in an unauthorized section.",
          cause: "Not a employer",
        });

      const { id: isEmployerID } = isEmployer;

      const applicationExists = await db.application.findFirst({
        where: {
          id: applicationId,
          isEmployerID,
        },
      });

      if (!applicationExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Application you are trying to delete does not exists or might have been deleted.",
        });

      return await db.application.delete({
        where: {
          id: applicationId,
          isEmployerID,
        },
      });
    }),

  // Employer Section
  employerCreateProfile: privateProcedure
    .input(
      z.object({
        employerPhone: z.string(),
        company_name: z.string(),
        county: z.string(),
        established: z.string(),
        category: z.string(),
        secondaryEmail: z.string(),
        secondaryPhone: z.string(),
        company_description: z.string(),
        town: z.string(),
        postal: z.string(),
        zip: z.string(),
        website: z.string(),
        logo: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, name, email } = ctx;

      const {
        employerPhone,
        company_name,
        county,
        category,
        secondaryEmail,
        logo,
        secondaryPhone,
        company_description,
        town,
        postal,
        established,
        zip,
        website,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthenticated, login to create a profile",
        });

      const isEmployerPosting = await db.employers.findFirst({
        where: {
          employerEmail: email,
        },
        select: {
          id: true,
        },
      });

      if (!isEmployerPosting)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Looks like you are in an unauthorized section",
        });

      const { id: isEmployerID } = isEmployerPosting;

      const profileExists = await db.company.findFirst({
        where: {
          userId,
        },
      });

      if (profileExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The user has an existing profile",
        });

      return await db.company.create({
        data: {
          userId,
          isEmployerID,
          employerPhone,
          company_name,
          county,
          category,
          secondaryEmail,
          logo,
          secondaryPhone,
          company_description,
          town,
          zip,
          established,
          postal,
          website,
          employerName: name,
        },
      });
    }),

  adminCreateProfile: privateProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        workEmail: z.string(),
        briefSummary: z.string(),
        photo: z.string(),
        role: z.string(),
        postal: z.string(),
        zip: z.string(),
        town: z.string(),
        county: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const {
        phoneNumber,
        workEmail,
        briefSummary,
        photo,
        role,
        postal,
        zip,
        town,
        county,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
        select: {
          name: true,
        },
      });
      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized. Try to login again",
        });
      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });
      const { id: isAdminID } = isAdmin;

      const profileExists = await db.adminProfile.findFirst({
        where: {
          userId,
          isAdminID,
        },
      });
      if (profileExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You have an existing profile. You can only create one profile.",
        });

      return await db.adminProfile.create({
        data: {
          userId,
          isAdminID,
          phoneNumber,
          workEmail,
          briefSummary,
          photo,
          role,
          postal,
          zip,
          town,
          county,
        },
      });
    }),

  adminUpdateProfile: privateProcedure
    .input(
      z.object({
        profileId: z.string(),
        phoneNumber: z.string().optional(),
        role: z.string().optional(),
        workEmail: z.string().optional(),
        briefSummary: z.string().optional(),
        postal: z.string().optional(),
        photo: z.string().optional(),
        zip: z.string().optional(),
        town: z.string().optional(),
        county: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, email } = ctx;
      const {
        profileId,
        phoneNumber,
        role,
        workEmail,
        briefSummary,
        postal,
        zip,
        photo,
        town,
        county,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized",
        });

      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
        select: {
          id: true,
        },
      });
      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are in an unauthorized section",
        });
      const { id: isAdminID } = isAdmin;

      const profileExists = await db.adminProfile.findFirst({
        where: {
          id: profileId,
          isAdminID,
          userId,
        },
      });

      if (!profileExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The profile does not exist. It could have been deleted.",
        });

      return await db.adminProfile.update({
        where: {
          id: profileId,
          isAdminID,
          userId,
        },
        data: {
          phoneNumber,
          role,
          photo,
          workEmail,
          briefSummary,
          postal,
          zip,
          town,
          county,
        },
      });
    }),

  updateEmployerProfile: privateProcedure
    .input(
      z.object({
        profileId: z.string(),
        company_name: z.string().optional(),
        employerPhone: z.string().optional(),
        employerName: z.string().optional(),
        category: z.string().optional(),
        secondaryEmail: z.string().optional(),
        secondaryPhone: z.string().optional(),
        company_description: z.string().optional(),
        county: z.string().optional(),
        town: z.string().optional(),
        zip: z.string().optional(),
        established: z.string().optional(),
        postal: z.string().optional(),
        website: z.string().optional(),
        logo: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;
      const {
        company_name,
        profileId,
        employerPhone,
        employerName,
        county,
        category,
        secondaryPhone,
        secondaryEmail,
        company_description,
        town,
        postal,
        established,
        zip,
        website,
        logo,
      } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not in our database.",
        });

      const profileExists = await db.company.findFirst({
        where: {
          id: profileId,
          userId,
        },
      });

      if (!profileExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User has no profile.",
        });

      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name: employerName,
        },
      });

      return await db.company.update({
        where: {
          id: profileId,
        },
        data: {
          company_name,
          employerPhone,
          employerName,
          county,
          category,
          secondaryPhone,
          secondaryEmail,
          company_description,
          town,
          postal,
          established,
          zip,
          website,
          logo,
        },
      });
    }),

  deleteUserAccount: privateProcedure
    .input(
      z.object({
        id: z.string(),
        confirmEmail: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const { id, confirmEmail } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          email: true,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized. User does not exist.",
        });

      const { email: dbEmail } = dbUser;

      if (dbEmail !== confirmEmail)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Seems you have entered an incorrect email address. Kindly check the email to ensure it is correct.",
        });

      const userExists = await db.user.findFirst({
        where: {
          id: userId,
          email: confirmEmail,
        },
      });

      if (!userExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This user does not exist, could have already deleted the account",
        });

      return await db.user.delete({
        where: {
          id,
          email: confirmEmail,
        },
      });
    }),

  adminDeleteUser: privateProcedure
    .input(
      z.object({
        id: z.string(),
        confirmEmail: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, email } = ctx;
      const { id, confirmEmail } = input;

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
          email,
        },
      });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are unauthorized, you have to login to continue",
        });
      const isAdmin = await db.admin.findFirst({
        where: {
          adminEmail: email,
        },
      });

      if (!isAdmin)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This is admin only section. You are not allowed in this section",
        });

      const toDeleteUserExists = await db.user.findFirst({
        where: {
          id: id,
          email: confirmEmail,
        },
      });

      if (!toDeleteUserExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "The user to be deleted does not exist. Could have been deleted.",
        });

      return await db.user.delete({
        where: {
          id: toDeleteUserExists.id,
          email: toDeleteUserExists.email,
        },
      });
    }),
});

export type AppRouter = typeof appRouter;
