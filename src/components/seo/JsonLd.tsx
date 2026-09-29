/**
 * Escapa "<" para que texto vindo da API (título, resumo) não consiga fechar
 * a tag <script> e injetar HTML.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
