import type { Post } from "@/lib/api/types";
import { HREFLANG, type Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { tr } from "@/lib/utils";

/** Schema.org BlogPosting: o que faz o post aparecer como artigo citável. */
export function PostJsonLd({ post, locale }: { post: Post; locale: Locale }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: tr(locale, post.title, post.titleEn),
    description: tr(locale, post.summary, post.summaryEn),
    inLanguage: HREFLANG[locale],
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`, locale),
    author: { "@id": `${SITE_URL}/#person` },
    ...(post.images?.length > 0 && { image: post.images }),
    ...(post.category && {
      articleSection: tr(locale, post.category.name, post.category.nameEn),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
