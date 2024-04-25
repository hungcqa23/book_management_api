import { Transporter, createTransport } from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import { IUser, SendinblueConfig } from '../models/interfaces/model.interfaces';

export default class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private from: string;

  constructor(user?: IUser, url?: string, email?: string) {
    this.to = user?.email || (email ? email : '');
    this.firstName = user?.username || 'My Friend';
    this.url = url || 'http://localhost:3000';
    this.from = `${process.env.EMAIL_FROM}`;
  }

  private renderTemplate(template: string, options: Record<string, unknown>): string {
    const templatePath = `${__dirname}/../views/email/${template}.pug`;
    return pug.renderFile(templatePath, options);
  }

  public newTransport(): Transporter {
    let config: SendinblueConfig;

    // if (process.env.NODE_ENV === 'production') {
    config = {
      service: 'SendinBlue',
      host: process.env.SENDINBLUE_HOST,
      port: Number(process.env.SENDINBLUE_PORT),
      auth: {
        user: process.env.SENDINBLUE_USERNAME,
        pass: process.env.SENDINBLUE_PASSWORD
      }
    };
    return createTransport(config);
    // }

    // Check development
    // config = {
    //   service: 'MailTrap',
    //   host: process.env.EMAIL_HOST,
    //   port: Number(process.env.EMAIL_PORT),
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD
    //   }
    // };
    // return createTransport(config);
  }

  // Send the actual email
  public async send(template: string, subject: string): Promise<void> {
    // 1) Render HTML based on a pug template
    const html = this.renderTemplate(template, {
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
    try {
      await this.newTransport().sendMail(mailOptions);
      console.log(`Email sent to ${this.to} successfully`);
    } catch (err) {
      console.error(`Error sending email to: ${this.to}`);
    }
  }

  public async sendWelcome(): Promise<void> {
    await this.send('welcome', 'Welcome to Book Library Management!');
  }

  public async sendPasswordReset(): Promise<void> {
    await this.send('passwordReset', 'Your password reset token (valid only 10 minutes)');
  }
}
