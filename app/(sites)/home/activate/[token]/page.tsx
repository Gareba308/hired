import { redirect } from "next/navigation";
import { db } from "@/db";
import nodemailer from "nodemailer";

interface ActivateProps {
  params: {
    token: string;
  };
}
const EmailVerified = async ({ params }: ActivateProps) => {
  const { token } = params;

  const currentDate = new Date();

  const user = await db.verification.findFirst({
    where: {
      verifyToken: token,
    },
    select: {
      verifyTokenExpiry: true,
      email: true,
      name: true,
      referrerUniqueCode: true,
      referrerUserId: true,
      referrerEmail: true,
      referrerName: true,
    },
  });

  if (!user) redirect("/home/register");

  const { verifyTokenExpiry, email, name } = user;
  const referrerUniqueCode = user.referrerUniqueCode as string;
  const referrerUserId = user.referrerUserId as string;
  const referrerEmail = user.referrerEmail as string;
  const referrerName = user.referrerName as string;

  const dbUser = await db.user.findFirst({
    where: {
      email,
      emailVerified: {
        equals: false,
      },
    },
    select: {
      referred: true,
      id: true,
      name: true,
      role: true,
    },
  });

  if (!dbUser) redirect("/home/register");
  const { referred, role: dbRole } = dbUser;
  const inviteeName = dbUser?.name as string;

  function obfuscateEmail(email: string): string {
    const [localPart, domain] = email.split('@');  
    if (localPart.length < 3) {
      return '*'.repeat(localPart.length) + '@' + domain;
    } else {
      const charsToHide = Math.max(3, Math.floor(localPart.length / 2));
      const visibleChars = localPart.length - charsToHide;
      const obfuscatedLocalPart = localPart.substring(0, visibleChars) + '*'.repeat(charsToHide);
      return obfuscatedLocalPart + '@' + domain;
    }
  }
  if (verifyTokenExpiry <= currentDate) redirect("/home/register");

  if (referred === true) {
    const referralDetailsCreated = await db.userReferrals.findFirst({
      where: {
        inviteeEmail: email,
        uniqueCode: referrerUniqueCode as string,
        userId: referrerUserId,
        redeemed: {
          equals: false,
        },
      },
      select: {
        id: true,
        myRole: true,
      },
    });

    const role = referralDetailsCreated?.myRole as string;

    const activatorAccountDetails = await db.accountBalance.findFirst({
      where: {
        userEmail: email,
      },
      select: {
        id: true,
      },
    });

    if (referralDetailsCreated && role === "employer") {
      await db.userReferrals.update({
        where: {
          id: referralDetailsCreated.id,
        },
        data: {
          joined: true,
          credit: {
            increment: 500,
          },
          inviteeName: inviteeName,
          redeemed: true,
        },
      });
      if (activatorAccountDetails) {
        await db.accountBalance.update({
          where: {
            userEmail: email,
            id: activatorAccountDetails.id,
          },
          data: {
            balance: {
              increment: 500,
            },
          },
        });
      }
      const transporter = nodemailer.createTransport({
        port: 587,
        host: process.env.NEXT_PUBLIC_EMAIL_HOST!,
        auth: {
          user: process.env.NEXT_PUBLIC_USER!,
          pass: process.env.NEXT_PUBLIC_PASSWORD!,
        },
        secure: false,
      });

      const referrerMailOptions = {
        from: {
          name: "Hired",
          address: process.env.NEXT_PUBLIC_USER!,
        },
        replyTo: process.env.NEXT_PUBLIC_REPLY!,
        to: referrerEmail,
        subject: "Referral Confirmation",
        html: `
          <div style='font-size: 14px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; background:#fff;'>
              <img src='https://res.cloudinary.com/dflvibeo6/image/upload/v1684702678/My_project-1_4_zwzqjm.png' alt='logo' width='140px' style='display:block; margin-top:-.5rem;'>
              <hr>
              <p>Hello ${referrerName},</p>
              <p>Congratulations! Your referral (${obfuscateEmail(email)}) has signed up successfully. You have been credited with <b>Ksh.1000</b> to use to post a job.</p>
              <p><a href='https://www.hired.co.ke/manage/referrals/my-referrals'>Visit Hired to view your credit and use your credit to post a job</a></p>
              <p>Thanks!</p>
              <hr>
              <p style='text-align:center; font-size:14px;'>Copyright © Jobs Radar Kenya. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };

      const referredMailOptions = {
        from: {
          name: "Hired",
          address: process.env.NEXT_PUBLIC_USER!,
        },
        replyTo: process.env.NEXT_PUBLIC_REPLY!,
        to: email,
        subject: "Sign up success, you got credit",
        html: `
          <div style='font-size: 14px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; background:#fff;'>
              <img src='https://res.cloudinary.com/dflvibeo6/image/upload/v1684702678/My_project-1_4_zwzqjm.png' alt='logo' width='140px' style='display:block; margin-top:-.5rem;'>
              <hr>
              <p>Hello ${name},</p>
              <p>Your email has been verified successfully and you have received a <b>Ksh.500</b> credit, top up and post a job on the platform.</p>
              <p><a href='https://www.hired.co.ke/manage/transaction'>Visit Hired to view your credit and use your credit to post a job</a></p>
              <p>Thanks!</p>
              <hr>
              <p style='text-align:center; font-size:14px;'>Copyright © Jobs Radar Kenya. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };

      try {
        await Promise.all([
          transporter.sendMail(referrerMailOptions),
          transporter.sendMail(referredMailOptions),
        ]);
      } catch (error) {
        console.error("Error sending emails:", error);
        redirect("/home/login");
      }
    }

    if (referralDetailsCreated && role === "worker") {
      await db.userReferrals.update({
        where: {
          id: referralDetailsCreated.id,
        },
        data: {
          joined: true,
          credit: {
            increment: 10,
          },
          inviteeName: inviteeName,
          redeemed: true,
        },
      });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: process.env.NEXT_PUBLIC_EMAIL_HOST!,
        auth: {
          user: process.env.NEXT_PUBLIC_USER!,
          pass: process.env.NEXT_PUBLIC_PASSWORD!,
        },
        secure: false,
      });

      const referrerMailOptions = {
        from: {
          name: "Hired",
          address: process.env.NEXT_PUBLIC_USER!,
        },
        replyTo: process.env.NEXT_PUBLIC_REPLY!,
        to: referrerEmail,
        subject: "Referral Confirmation",
        html: `
          <div style='font-size: 14px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; background:#fff;'>
              <img src='https://res.cloudinary.com/dflvibeo6/image/upload/v1684702678/My_project-1_4_zwzqjm.png' alt='logo' width='140px' style='display:block; margin-top:-.5rem;'>
              <hr>
              <p>Hello ${referrerName},</p>
              <p>Congratulations! Your referral (${obfuscateEmail(email)}) has signed up successfully. You have been credited with <b>10 credit points</b>. From a minimum of 200 approved credit point, you can redeem the points. <b>1 point</b> is equivalent to <b>Ksh.1</b>.</p>
              <p><a href='https://www.hired.co.ke/site/referrals/my-referrals'>Visit Hired to view your credit and use your credit to post a job</a></p>
              <p>Thanks!</p>
              <hr>
              <p style='text-align:center; font-size:14px;'>Copyright © Jobs Radar Kenya. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };

      const referredMailOptions = {
        from: {
          name: "Hired",
          address: process.env.NEXT_PUBLIC_USER!,
        },
        replyTo: process.env.NEXT_PUBLIC_REPLY!,
        to: email,
        subject: "Sign up success.",
        html: `
          <div style='font-size: 14px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; background:#fff;'>
              <img src='https://res.cloudinary.com/dflvibeo6/image/upload/v1684702678/My_project-1_4_zwzqjm.png' alt='logo' width='140px' style='display:block; margin-top:-.5rem;'>
              <hr>
              <p>Hello ${name},</p>
              <p>Your email has been verified successfully and you are all set to start using the platform to submit job applications.</p>
              <p><a href='https://www.hired.co.ke/site/jobs'>Visit Hired to view all available jobs</a></p>
              <p>Thanks!</p>
              <hr>
              <p style='text-align:center; font-size:14px;'>Copyright © Jobs Radar Kenya. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };

      try {
        await Promise.all([
          transporter.sendMail(referrerMailOptions),
          transporter.sendMail(referredMailOptions),
        ]);
      } catch (error) {
        console.error("Error sending emails:", error);
        redirect("/home/login");
      }
    }
  }

  if (referred === false) {
    const nonReferredAccountDetails = await db.accountBalance.findFirst({
      where: {
        userEmail: email,
      },
    });

    if (dbRole === "employer" && nonReferredAccountDetails) {
      await db.accountBalance.update({
        where: {
          userEmail: email,
          id: nonReferredAccountDetails.id,
        },
        data: {
          balance: {
            increment: 500,
          },
        },
      });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: process.env.NEXT_PUBLIC_EMAIL_HOST!,
        auth: {
          user: process.env.NEXT_PUBLIC_USER!,
          pass: process.env.NEXT_PUBLIC_PASSWORD!,
        },
        secure: false,
      });

      const mailOptions = {
        from: {
          name: "Hired",
          address: process.env.NEXT_PUBLIC_USER!,
        },
        replyTo: process.env.NEXT_PUBLIC_REPLY!,
        to: email,
        subject: "Sign up success, you got credit",
        html: `
          <div style='font-size: 14px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; background:#fff;'>
              <img src='https://res.cloudinary.com/dflvibeo6/image/upload/v1684702678/My_project-1_4_zwzqjm.png' alt='logo' width='140px' style='display:block; margin-top:-.5rem;'>
              <hr>
              <p>Hello ${name},</p>
              <p>Your email has been verified successfully and you have received a <b>Ksh.500</b> credit, top up and post a job on the platform.</p>
              <p><a href='https://www.hired.co.ke/manage/transaction'>Visit Hired to view your credit and use your credit to post a job</a></p>
              <p>Thanks!</p>
              <hr>
              <p style='text-align:center; font-size:14px;'>Copyright © Jobs Radar Kenya. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error("Error sending email:", error);
        redirect("/home/login");
      }
    }

    if (dbRole === "worker") {
      const transporter = nodemailer.createTransport({
        port: 587,
        host: process.env.NEXT_PUBLIC_EMAIL_HOST!,
        auth: {
          user: process.env.NEXT_PUBLIC_USER!,
          pass: process.env.NEXT_PUBLIC_PASSWORD!,
        },
        secure: false,
      });

      const mailOptions = {
        from: {
          name: "Hired",
          address: process.env.NEXT_PUBLIC_USER!,
        },
        replyTo: process.env.NEXT_PUBLIC_REPLY!,
        to: email,
        subject: "Sign up success",
        html: `
          <div style='font-size: 14px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; background:#fff;'>
              <img src='https://res.cloudinary.com/dflvibeo6/image/upload/v1684702678/My_project-1_4_zwzqjm.png' alt='logo' width='140px' style='display:block; margin-top:-.5rem;'>
              <hr>
              <p>Hello ${name},</p>
              <p>Your email has been verified successfully and you are all set to start using the platform to submit job applications.</p>
              <p><a href='https://www.hired.co.ke/site/jobs'>Visit Hired to view all available jobs</a></p>
              <p>Thanks!</p>
              <hr>
              <p style='text-align:center; font-size:14px;'>Copyright © Jobs Radar Kenya. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error("Error sending email:", error);
        redirect("/home/login");
      }
    }
  }

  await db.user.update({
    where: {
      email,
    },
    data: {
      emailVerified: true,
    },
  });

  await db.verification.delete({
    where: {
      verifyToken: token,
      email,
    },
  });
  redirect("/home/login");
};

export default EmailVerified;