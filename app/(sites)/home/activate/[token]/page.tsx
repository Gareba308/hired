import { redirect } from "next/navigation";
import { db } from "@/db";
import nodemailer from "nodemailer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activate User Account",
  robots: {
    index: false,
    follow: true,
  }
}

interface ActivateProps {
  params: {
    token: string;
  };
}

const EmailVerified = async ({ params }: ActivateProps) => {
  const { token } = params;

  const currentDate = new Date();
  const emailPassword= process.env.NEXT_PUBLIC_PASSWORD
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
      role: true,
    },
  });

  if (!user) redirect("/");

  const { verifyTokenExpiry, email, name } = user;
  const referrerUniqueCode = user.referrerUniqueCode as string;
  const referrerUserId = user.referrerUserId as string;
  const referrerEmail = user.referrerEmail as string;
  const referrerName = user.referrerName as string;
  const obtainedRole = user.role;

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

  if (!dbUser) redirect("/");
  const { referred, role: dbRole } = dbUser;
  const inviteeName = dbUser?.name as string;

  function obfuscateEmail(email: string): string {
    const [localPart, domain] = email.split("@");
    if (localPart.length < 3) {
      return "*".repeat(localPart.length) + "@" + domain;
    } else {
      const charsToHide = Math.max(3, Math.floor(localPart.length / 2));
      const visibleChars = localPart.length - charsToHide;
      const obfuscatedLocalPart =
        localPart.substring(0, visibleChars) + "*".repeat(charsToHide);
      return obfuscatedLocalPart + "@" + domain;
    }
  }
  if (verifyTokenExpiry <= currentDate) redirect("/");

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
        host: 'smtp.gmail.com',
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      const referrerMailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: referrerEmail,
        subject: "Referral Confirmation",
        html: `
          <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
              <p>Hello ${referrerName},</p>
              <p>Congratulations! Your referral (${obfuscateEmail(
                email
              )}) has signed up successfully. You have been credited with <b>Ksh.500</b> to use to post a job.</p>
              <p><a href='https://www.hired.co.ke/manage/referrals/my-referrals'>Visit Hired to view your credit and use your credit to post a job</a></p>
              <hr>
              <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };

      const referredMailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Sign up success, you got credit",
        html: `
          <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
              <p>Hello ${name},</p>
              <p>Your email has been verified successfully and you have received a <b>Ksh.500</b> credit, top up and post a job on the platform.</p>
              <p><a href='https://www.hired.co.ke/manage/transaction'>Visit Hired to view your credit and use your credit to post a job</a></p>
              <hr>
              <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
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

        return redirect("/home/login/enterprises");
      } catch (error) {
        console.error("Error sending emails:", error);
        redirect("/home/login/enterprises");
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
        host: 'smtp.gmail.com',
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      const referrerMailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: referrerEmail,
        subject: "Referral Confirmation",
        html: `
          <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
              <p>Hello ${referrerName},</p>
              <p>Congratulations! Your referral (${obfuscateEmail(
                email
              )}) has signed up successfully. You have been credited with <b>10 credit points</b>. From a minimum of 200 approved credit point, you can redeem the points. <b>1 point</b> is equivalent to <b>Ksh.1</b>.</p>
              <p><a href='https://www.hired.co.ke/site/referrals/my-referrals'>Visit Hired to view your credit and use your credit to post a job</a></p>
              <hr>
              <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };

      const referredMailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Sign up success.",
        html: `
          <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
              <p>Hello ${name},</p>
              <p>Your email has been verified successfully and you are all set to start using the platform to submit job applications.</p>
              <p><a href='https://www.hired.co.ke/site/jobs'>Visit Hired to view all available jobs</a></p>
              <hr>
              <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
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

        return redirect("/home/login");
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
        host: 'smtp.gmail.com',
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Sign up success, you got credit",
        html: `
          <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
              <p>Hello ${name},</p>
              <p>Your email has been verified successfully and you have received a <b>Ksh.500</b> credit, top up and post a job on the platform.</p>
              <p><a href='https://www.hired.co.ke/manage/transaction'>Visit Hired to view your credit and use your credit to post a job</a></p>
              <hr>
              <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };

      try {
        await new Promise((resolve, reject)=> {
          transporter.sendMail(mailOptions, (err, info)=> {
            if(err){
              console.error(err);
              reject(err);
            }else{
              console.log(info)
              resolve(info)
            }
          })
        })

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
        return redirect("/home/login/enterprises");
      } catch (error) {
        console.error("Error sending email:", error);
        redirect("/home/login/enterprises");
      }
    }

    if (dbRole === "worker") {
      const transporter = nodemailer.createTransport({
        port: 587,
        host: 'smtp.gmail.com',
        auth: {
          user: "gethiredinkenya@gmail.com",
          pass: emailPassword,
        },
        secure: false,
      });

      const mailOptions = {
        from: {
          name: "Hired Jobs",
          address: "gethiredinkenya@gmail.com",
        },
        replyTo: "gethiredinkenya@gmail.com",
        to: email,
        subject: "Sign up success",
        html: `
          <div style='font-size: 14px; line-height:22.22px; display:flex; justify-content:center; align-items:center;width:100%; background:#f7fafa; '>
            <div style='justify-content:center; margin:1.5rem auto; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); padding: 1rem 1rem; max-width:900px; line-height:22.22px; background:#fff;'>
              <p>Hello ${name},</p>
              <p>Your email has been verified successfully and you are all set to start using the platform to submit job applications.</p>
              <p><a href='https://www.hired.co.ke/site/jobs'>Visit Hired to view all available jobs</a></p>
              <hr>
              <p style='text-align:center; font-size:14px; line-height:22.22px;'>Copyright © Hired Jobs Kenya. All rights reserved.</p>
            </div>
          </div>
        `,
        priority: "high" as const,
      };

      try {
        await new Promise((resolve, reject)=> {
          transporter.sendMail(mailOptions, (err, info)=> {
            if(err){
              console.error(err);
              reject(err);
            }else{
              console.log(info)
              resolve(info)
            }
          })
        })

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
        return redirect("/home/login");
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

  const roleRedirectMap: { [key: string]: string } = {
    employer: "/home/login/enterprises",
    worker: "/home/login",
  };
  
  return redirect(roleRedirectMap[obtainedRole] || "/home/login");
  
};

export default EmailVerified;
