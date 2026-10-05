export interface EmailContact {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  assunto: string;
  mensagem: string;
  ativo?: boolean;
  anexo?: string;
}