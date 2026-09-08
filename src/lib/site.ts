/**
 * URL pública do site: alimenta metadataBase, canonical, hreflang, sitemap,
 * robots e a OG image.
 *
 * Só é lida em código de servidor, então o fallback pode usar a variável de
 * sistema da Vercel: se NEXT_PUBLIC_SITE_URL não estiver configurada, o site
 * ainda se resolve sozinho em produção em vez de assinar tudo como localhost
 * — que é o tipo de erro que só aparece semanas depois, no Search Console.
 */
const configured = process.env.NEXT_PUBLIC_SITE_URL;
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

const resolved =
  configured || (vercel && `https://${vercel}`) || "http://localhost:3000";

// Barra no fim vinda de valor digitado à mão viraria `//projects` nas URLs.
export const SITE_URL = resolved.replace(/\/+$/, "");
