import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import type { EmailContact } from './types.js';

const contactsPath = resolve(
  process.cwd(),
  'data',
  'emails.json'
);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function getContacts(): Promise<EmailContact[]> {
  const fileContent = await readFile(
    contactsPath,
    'utf-8'
  );

  const contacts = JSON.parse(
    fileContent
  ) as EmailContact[];

  if (!Array.isArray(contacts)) {
    throw new Error(
      'O arquivo data/emails.json precisa conter uma lista de contatos.'
    );
  }

  const ids = new Set<string>();

  for (const contact of contacts) {
    if (!contact.id) {
      throw new Error(
        'Existe um contato sem "id" no emails.json.'
      );
    }

    if (ids.has(contact.id)) {
      throw new Error(
        `ID duplicado encontrado: ${contact.id}`
      );
    }

    ids.add(contact.id);

    if (!contact.nome) {
      throw new Error(
        `Contato ${contact.id} está sem nome.`
      );
    }

    if (!contact.empresa) {
      throw new Error(
        `Contato ${contact.id} está sem empresa.`
      );
    }

    if (!contact.email) {
      throw new Error(
        `Contato ${contact.id} está sem email.`
      );
    }

    if (!isValidEmail(contact.email)) {
      throw new Error(
        `Email inválido no contato ${contact.id}: ${contact.email}`
      );
    }

    if (!contact.assunto) {
      throw new Error(
        `Contato ${contact.id} está sem assunto.`
      );
    }

    if (!contact.mensagem) {
      throw new Error(
        `Contato ${contact.id} está sem mensagem.`
      );
    }
  }

  return contacts.filter(
    (contact) => contact.ativo !== false
  );
}