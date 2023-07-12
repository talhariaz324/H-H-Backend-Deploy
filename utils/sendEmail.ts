/* eslint-disable @typescript-eslint/no-explicit-any */
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface optionProps {
  email: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: optionProps) => {
  const msg = {
    to: options.email, // Change to your recipient
    from: 'info@holdinghandscommunitynetwork.org', // Change to your verified sender
    subject: options.subject,
    text: options.text,
    html: options.html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error: any) => {
      console.error(error.message);
    });
};
