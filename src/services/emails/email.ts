import ejs, { Data } from "ejs"
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

const mailTransport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
} as SMTPTransport.Options)

const getHtml = (file: string, data?: Data) => ejs.renderFile(`./src/services/emails/views/${file}.ejs`, data)

const send = (toEmail: string[], subject: string, html: string) => {
  const mail = {
    to: toEmail.join(","),
    from: process.env.NEXT_PUBLIC_SUPPORT_MAIL,
    subject,
    html,
    text: html.replace(/<(?:.|\n)*?>/gm, ""),
    headers: { "X-Mailjet-TrackOpen": "0", "X-Mailjet-TrackClick": "0" },
  }

  return mailTransport.sendMail(mail)
}

export const sendWelcomeEmail = async (toEmail: string, token: string) => {
  return send(
    [toEmail],
    "Bienvenue sur Écopass",
    await getHtml("welcome", {
      resetLink: `${process.env.NEXTAUTH_URL}/reset-password/${token}`,
    }),
  )
}

export const sendResetEmail = async (toEmail: string, token: string) => {
  return send(
    [toEmail],
    "Changez votre mot de passe",
    await getHtml("reset", {
      resetLink: `${process.env.NEXTAUTH_URL}/reset-password/${token}`,
    }),
  )
}
