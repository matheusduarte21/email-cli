import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { getContacts } from './contacts.js';
import {
  getAttachmentPath,
  sendEmail,
  validateAttachment,
  verifyEmailConnection,
} from './email-service.js';

import { parseSelection } from './selection.js';

async function main(): Promise<void> {
  const rl = readline.createInterface({
    input,
    output,
  });

  try {
    const contacts = await getContacts();

    if (contacts.length === 0) {
      console.log('\nNenhum contato ativo encontrado.');
      return;
    }

    console.log('\nEmails cadastrados:\n');

    contacts.forEach((contact:any, index:any) => {
      console.log(
        `[${index + 1}] ${contact.nome} — ${contact.empresa}`
      );

      console.log(`    ${contact.email}`);
      console.log(`    ${contact.assunto}`);
      console.log('');
    });

    console.log(
      'Digite números separados por vírgula, por exemplo: 1,3,5'
    );

    console.log('Ou digite: todos\n');

    const answer = await rl.question(
      'Quem você deseja enviar hoje? > '
    );

    const selectedIndexes = parseSelection(
      answer,
      contacts.length
    );

    const selectedContacts = selectedIndexes.map(
      (index) => contacts[index]
    );

    if (selectedContacts.length === 0) {
      console.log('\nNenhum email selecionado.');
      return;
    }

    console.log('\nValidando anexos...\n');

    for (const contact of selectedContacts) {
      await validateAttachment(contact);
    }

    console.log('Anexos validados ✓');

    console.log('\n────────────────────────────────────────');
    console.log('REVISÃO DO ENVIO');
    console.log('────────────────────────────────────────\n');

    selectedContacts.forEach((contact, index) => {
      console.log(
        `${index + 1}. ${contact.nome} — ${contact.empresa}`
      );

      console.log(`   Para: ${contact.email}`);
      console.log(`   Assunto: ${contact.assunto}`);
      console.log(
        `   Anexo: ${getAttachmentPath(contact)}`
      );

      console.log('');
    });

    console.log(
      `Total: ${selectedContacts.length} email(s).\n`
    );

    const confirmation = await rl.question(
      'Confirmar o envio de TODOS os emails acima? (s/n) > '
    );

    if (
      confirmation.trim().toLowerCase() !== 's'
    ) {
      console.log('\nEnvio cancelado.');
      return;
    }

    process.stdout.write(
      '\nVerificando conexão com o Gmail... '
    );

    await verifyEmailConnection();

    console.log('OK ✓');

    console.log('\nEnviando...\n');

    let successCount = 0;
    let failureCount = 0;

    for (const contact of selectedContacts) {
      process.stdout.write(
        `${contact.empresa} <${contact.email}> ... `
      );

      try {
        const messageId =
          await sendEmail(contact);

        console.log('ENVIADO ✓');

        console.log(
          `  Message-ID: ${messageId}`
        );

        successCount++;
      } catch (error) {
        console.log('FALHOU ✗');

        const message =
          error instanceof Error
            ? error.message
            : String(error);

        console.log(
          `  Motivo: ${message}`
        );

        failureCount++;
      }
    }

    console.log('\n────────────────────────────────────────');
    console.log(`Enviados: ${successCount}`);
    console.log(`Falhas:   ${failureCount}`);
    console.log('────────────────────────────────────────\n');
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    console.error('\nErro fatal:');
    console.error(message);
  } finally {
    rl.close();
  }
}

main();