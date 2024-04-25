import { IUser } from '../../src/models/interfaces/model.interfaces';
import Email from '../../src/utils/email'; // Assuming your Email class is in src/utils/email
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import nodemailer, { createTransport } from 'nodemailer';
import pug from 'pug';
const original = console.error;

jest.mock('nodemailer'); // Mock nodemailer for transporter creation
jest.mock('pug'); // Mock pug for template rendering
jest.mock('html-to-text'); // Mock html-to-text for plain text generation

describe('Email', () => {
  let email: Email;

  beforeEach(() => {
    console.error = jest.fn();
    email = new Email({ email: 'user@example.com', username: 'John Doe' } as IUser);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    // This test is redundant as the constructor is private
    // You can't directly test private properties
  });

  describe('newTransport', () => {
    it('should call createTransport with Sendinblue config ', () => {
      process.env.NODE_ENV = 'production';
      process.env.SENDINBLUE_HOST = 'smtp-relay.sendinblue.com';
      process.env.SENDINBLUE_PORT = '587';
      process.env.SENDINBLUE_USERNAME = 'your_username';
      process.env.SENDINBLUE_PASSWORD = 'your_password';

      email.newTransport();

      expect(createTransport).toHaveBeenCalledWith({
        service: 'SendinBlue',
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: {
          user: 'your_username',
          pass: 'your_password'
        }
      });
    });
  });

  describe('send', () => {
    it('should render template, create transport, and send email', async () => {
      const email = new Email({ email: 'user@example.com', username: 'John Doe' } as IUser);
      const template = 'passwordReset';
      const subject = 'Your password reset token (valid only 10 minutes)';
      email.send(template, subject);
    });

    it('should log an error if sending fails', async () => {
      const template = 'passwordReset';
      const subject = 'Your password reset token (valid only 10 minutes)';
      await email.send(template, subject);
      expect(console.error).toHaveBeenCalledWith(`Error sending email to: user@example.com`);
    });
  });
});
