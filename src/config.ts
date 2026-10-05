import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Variável obrigatória ausente no .env: ${name}`
    );
  }

  return value;
}

export const config = {
  gmailUser: requireEnv('GMAIL_USER'),

  gmailAppPassword:
    requireEnv('GMAIL_APP_PASSWORD')
      .replace(/\s+/g, ''),

  fromName:
    process.env.GMAIL_FROM_NAME?.trim() ||
    'Matheus Duarte',

  defaultAttachment:
    process.env.DEFAULT_ATTACHMENT?.trim() ||
    './files/curriculo.pdf',
};