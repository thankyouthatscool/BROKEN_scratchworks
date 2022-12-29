import { Prisma } from "@prisma/client";
import sgMail from "@sendgrid/mail";
import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { z } from "zod";

import { prisma } from "@db";
import { generateCode } from "@utils";
import { publicProcedure, router } from "..";

export const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export const signUpInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  application: z.enum(["inertiion"]),
});

const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again later.";
const SECRET = process.env.SECRET!;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;

sgMail.setApiKey(SENDGRID_API_KEY);

const login = publicProcedure
  .input(loginInput)
  .mutation(async ({ input: { email, password } }) => {
    try {
      const targetUser = await prisma.user.findFirstOrThrow({
        where: { email },
      });

      const isPasswordMatch = await compare(password, targetUser.password);

      if (!!isPasswordMatch) {
        const userData = { id: targetUser.id, email: targetUser.email };

        const token = sign(userData, SECRET);

        return { token, userData };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError ||
        err instanceof Error
      ) {
        console.log(err.message);

        return err.message;
      } else {
        console.log(GENERIC_ERROR_MESSAGE);

        return GENERIC_ERROR_MESSAGE;
      }
    }
  });

const signUp = publicProcedure
  .input(signUpInput)
  .mutation(async ({ input: { application, email, password } }) => {
    console.log("INERTiiON sign up...");

    try {
      const existingUser = await prisma.user.findFirst({ where: { email } });

      if (!!existingUser) {
        const userApplications = existingUser.applications;

        if (userApplications.includes(application)) {
          // Already signed up for this application

          throw new Error("Email already is use.");
        } else {
          // User exists in the system, but is not signed up for this application

          const res = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              applications: Array.from(
                new Set([...existingUser.applications, application])
              ),
            },
          });

          const userData = {
            email: res.email,
            id: res.id,
          };

          const token = sign(userData, SECRET, { expiresIn: "999d" });

          return { token, userData };
        }
      } else {
        // User not in the system, OK to sign up.

        const hashedPassword = await hash(password, 12);

        const res = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            applications: [application],
          },
        });

        const userData = {
          email: res.email,
          id: res.id,
        };

        const token = sign(userData, SECRET, { expiresIn: "999d" });

        return { token, userData };
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(err.message);

        return err.message;
      } else if (err instanceof Error) {
        console.log(err.message);

        return err.message;
      } else {
        console.log(GENERIC_ERROR_MESSAGE);

        return GENERIC_ERROR_MESSAGE;
      }
    }
  });

const verifyToken = publicProcedure.input(z.string()).mutation(({ input }) => {
  try {
    const res = verify(input, SECRET);

    return res;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);

      return err.message;
    } else {
      console.log(GENERIC_ERROR_MESSAGE);

      return GENERIC_ERROR_MESSAGE;
    }
  }
});

const sendVerificationCode = publicProcedure
  .input(z.string().email())
  .mutation(async ({ input: email }) => {
    const targetUser = await prisma.user.findFirst({ where: { email } });

    if (!!targetUser) {
      const verificationCode = generateCode(6);

      let newVerificationCodes: number[];

      if (targetUser.verificationCodes.length >= 5) {
        const [_, ...rest] = targetUser.verificationCodes;

        newVerificationCodes = [...rest, verificationCode];
      } else {
        newVerificationCodes = [
          ...targetUser.verificationCodes,
          verificationCode,
        ];
      }

      await sgMail.send({
        to: email,
        from: "cees.zees.n@gmail.com",
        subject: "Change password code",
        text: `${verificationCode}`,
      });

      await prisma.user.update({
        where: { email },
        data: { verificationCodes: newVerificationCodes },
      });
    }

    return "OK";
  });

const verifyCode = publicProcedure
  .input(z.object({ code: z.string(), email: z.string().email() }))
  .mutation(async ({ input: { code, email } }) => {
    const targetUser = await prisma.user.findFirst({ where: { email } });

    if (!!targetUser) {
      const latestVerificationCode = targetUser.verificationCodes.slice(-1)[0];

      if (parseInt(code) === latestVerificationCode) {
        return "OK";
      } else {
        return "Incorrect verification code.";
      }
    } else {
      return "NOT OK";
    }
  });

const changePassword = publicProcedure
  .input(z.object({ email: z.string().email(), password: z.string() }))
  .mutation(async ({ input: { email, password } }) => {
    const targetUser = await prisma.user.findFirst({ where: { email } });

    if (!!targetUser) {
      const newHashedPassword = await hash(password, 12);

      await prisma.user.update({
        data: { password: newHashedPassword },
        where: { email },
      });

      return "OK";
    } else {
      return GENERIC_ERROR_MESSAGE;
    }
  });

const auth = router({
  changePassword,
  login,
  sendVerificationCode,
  signUp,
  verifyCode,
  verifyToken,
});

export const inertiionRouter = router({ auth });
