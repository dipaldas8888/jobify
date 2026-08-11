import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  console.log(`\n==================================================`);
  console.log(`[EMAIL SENDING MOCK]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${text}`);
  console.log(`==================================================\n`);

  // Support SMTP/Gmail config with EMAIL_USER and EMAIL_PASS env variables
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const host = process.env.SMTP_HOST || (process.env.EMAIL_USER ? "smtp.gmail.com" : null);
  const port = process.env.SMTP_PORT || 465;
  const secure = process.env.SMTP_SECURE ? (process.env.SMTP_SECURE === "true") : true;

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure,
        auth: {
          user,
          pass,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Jobify" <${user}>`,
        to,
        subject,
        text,
        html,
      });
      console.log(`[EMAIL] Actual email successfully sent to ${to}`);
    } catch (error) {
      console.error(`[EMAIL ERROR] Failed to send actual email: ${error.message}`);
    }
  }
};
