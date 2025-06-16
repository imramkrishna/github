import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { EmailOptions } from '../types';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const mailOptions = {
      from: `"Github Clone" <${process.env.GMAIL_USER}>`,
      ...options,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export function generateOtp():number{
    const otp=Math.floor(100000 + Math.random() * 900000);
    return otp;
}