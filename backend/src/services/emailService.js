import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sendEmail from './sendEmail.js';

// Custom __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const injectData = (template, data) => {
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || '');
};

const sendOtpEmail = async (email, name, otp) => {
  const templatePath = path.join(__dirname, 'templates', 'otpRegistration.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const htmlContent = injectData(template, { name, otp });
  await sendEmail(email, 'Confirm Your Registration', htmlContent);
};

const sendRegistrationSuccessEmail = async (email, name) => {
  const templatePath = path.join(__dirname, 'templates', 'successRegistration.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const htmlContent = injectData(template, { name });

  await sendEmail(email, 'Registration Confirmed', htmlContent);
};

const sendResetPasswordEmail = async (email, name, otp) => {
  const templatePath = path.join(__dirname, 'templates', 'resetPassword.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const htmlContent = injectData(template, { name, otp });

  await sendEmail(email, 'Reset Your Password', htmlContent);
};

const sendResetPasswordSuccessEmail = async (email, name) => {
  const templatePath = path.join(__dirname, 'templates', 'successResetPassword.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const htmlContent = injectData(template, { name });

  await sendEmail(email, 'Password Reset Successfully', htmlContent);
};

export {
  sendOtpEmail,
  sendRegistrationSuccessEmail,
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
};
