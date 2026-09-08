/**
 * URL pública do site. Sem isso as imagens de OG e o canonical apontam para
 * localhost e nenhum crawler consegue resolvê-las.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
