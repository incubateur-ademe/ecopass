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
  if (process.env.MAIL_HOST) {
    const mail = {
      to: toEmail.map((email) => email.toLowerCase()).join(","),
      from: process.env.NEXT_PUBLIC_SUPPORT_MAIL,
      subject,
      html,
      text: html.replace(/<(?:.|\n)*?>/gm, ""),
      headers: { "X-Mailjet-TrackOpen": "0", "X-Mailjet-TrackClick": "0" },
    }

    return mailTransport.sendMail(mail)
  }
}

export const sendUploadSuccessEmail = async (toEmail: string, name: string | null, date: Date) => {
  return send(
    [toEmail],
    "Votre déclaration a été validée ✅",
    await getHtml("upload-success", {
      name,
      date: date.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }),
      time: date.toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" }),
      link: `${process.env.NEXTAUTH_URL}/produits`,
    }),
  )
}

export const sendUploadErrorEmail = async (
  toEmail: string,
  name: string | null,
  date: Date,
  total: number,
  success: number,
) => {
  return send(
    [toEmail],
    "Votre déclaration comporte des erreurs à corriger ❌",
    await getHtml("upload-error", {
      name,
      date: date.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }),
      time: date.toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" }),
      total,
      success,
      error: total - success,
      link: `${process.env.NEXTAUTH_URL}/declarations`,
      support: process.env.NEXT_PUBLIC_SUPPORT_MAIL,
    }),
  )
}
