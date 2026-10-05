export function parseSelection(
  input: string,
  totalContacts: number
): number[] {
  const value = input.trim().toLowerCase();

  if (!value) {
    return [];
  }

  if (value === 'todos') {
    return Array.from(
      { length: totalContacts },
      (_, index) => index
    );
  }

  const parts = value.split(',');

  const indexes: number[] = [];

  for (const part of parts) {
    const parsed = Number(part.trim());

    if (!Number.isInteger(parsed)) {
      throw new Error(
        `Seleção inválida: "${part}". Use números como 1,2,3 ou "todos".`
      );
    }

    if (parsed < 1 || parsed > totalContacts) {
      throw new Error(
        `Opção ${parsed} inválida. Escolha entre 1 e ${totalContacts}.`
      );
    }

    const index = parsed - 1;

    if (!indexes.includes(index)) {
      indexes.push(index);
    }
  }

  return indexes;
}