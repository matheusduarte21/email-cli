import { access } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import nodemailer from 'nodemailer';

import { config } from './config.js';
import type { EmailContact } from './types.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPassword,
  },
});

export function getAttachmentPath(
  contact: EmailContact
): string {

  return resolve(
    process.cwd(),
    contact.anexo || config.defaultAttachment
  );
}

export async function validateAttachment(
  contact: EmailContact
): Promise<void> {

  const attachmentPath =
    getAttachmentPath(contact);

  try {
    await access(attachmentPath);
  } catch {
    throw new Error(
      `Anexo não encontrado para ${contact.email}: ${attachmentPath}`
    );
  }
}

export async function verifyEmailConnection():
  Promise<void> {

  await transporter.verify();
}

export async function sendEmail(
  contact: EmailContact
): Promise<string> {

  const attachmentPath =
    getAttachmentPath(contact);

  const info = await transporter.sendMail({

    from: {
      name: config.fromName,
      address: config.gmailUser,
    },

    to: contact.email,

    subject: contact.assunto,

    text: contact.mensagem,

    attachments: [
      {
        filename: basename(attachmentPath),
        path: attachmentPath,
      },
    ],
  });

  if (!info.messageId) {
    throw new Error(
      'O Gmail/Nodemailer não retornou o Message-ID.'
    );
  }

  return info.messageId;
}