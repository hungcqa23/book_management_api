import nodemailer from 'nodemailer';
import pug from 'pug';
import { IUser } from '../models/userModel';
import { convert } from 'html-to-text';

interface SendinblueAuth {
  user: string;
  pass: string;
}

interface SendinblueConfig {
  service: string;
  host: string;
  port: number;
  auth: SendinblueAuth;
}

export default class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private from: string;

  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.firstName = user.username.split(' ')[0] || 'My Friend';
    this.url = url;
    this.from = `${process.env.EMAIL_FROM}`;
  }

  public newTransport(): nodemailer.Transporter | undefined {
    if (process.env.NODE_ENV === 'production') {
      const config: SendinblueConfig = {
        service: 'SendinBlue',
        host: process.env.SENDINBLUE_HOST ?? '',
        port: Number(process.env.SENDINBLUE_PORT),
        auth: {
          user: process.env.SENDINBLUE_USERNAME ?? '',
          pass: process.env.SENDINBLUE_PASSWORD ?? ''
        }
      };
      return nodemailer.createTransport(config);
    }

    return nodemailer.createTransport({
      service: 'MailTrap',
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template: string, subject: string): Promise<void> {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email.${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, {
        wordwrap: false
      })
    };

    // 3) Create a transport and send mail
    await this.newTransport()?.sendMail(mailOptions);
  }

  async sendWelcome(): Promise<void> {
    await this.send('welcome', 'Welcome to Book Library Management!');
  }

  async sendPasswordReset(): Promise<void> {
    await this.send('passwordReset', 'Your password reset token (valid only 10 minutes)');
  }
}
