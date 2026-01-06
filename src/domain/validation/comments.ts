export const COMMENT_MAX_LENGTH = 120;

export function normalizeCommentBody(value: string): string {
  return value.trim();
}

export function validateCommentBody(value: string): { valid: boolean; error?: string; normalized: string } {
  const normalized = normalizeCommentBody(value);
  if (!normalized) {
    return { valid: false, error: "Comentário não pode ser vazio.", normalized };
  }
  if (normalized.length > COMMENT_MAX_LENGTH) {
    return {
      valid: false,
      error: `Comentário deve ter no máximo ${COMMENT_MAX_LENGTH} caracteres.`,
      normalized
    };
  }
  return { valid: true, normalized };
}
