import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import AnimatedSection from "@/components/AnimatedSection";
import ReadingProgress from "@/components/ReadingProgress";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artículo no encontrado" };

  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      type: "article",
      publishedTime: post.meta.date,
      images: post.meta.cover ? [{ url: post.meta.cover }] : [],
    },
  };
}

function markdownToHtml(md: string): string {
  let html = md;

  // Headings
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/gim,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Ordered lists — collect consecutive `N. ` lines and wrap in <ol>
  html = html.replace(/((?:^\d+\. .+$\n?)+)/gim, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^\d+\. /, "")}</li>`)
      .join("\n");
    return `<ol>${items}</ol>`;
  });

  // Unordered lists — collect consecutive `- ` lines and wrap in <ul>
  html = html.replace(/((?:^- .+$\n?)+)/gim, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^- /, "")}</li>`)
      .join("\n");
    return `<ul>${items}</ul>`;
  });

  // Paragraphs
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<li")
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");

  return html;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const contentHtml = markdownToHtml(post.content);
  const allPosts = getAllPosts();
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <ReadingProgress />

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-16 overflow-hidden min-h-[420px] flex items-end">
        {/* Cover image or fallback gradient */}
        {post.meta.cover ? (
          <>
            <Image
              src={post.meta.cover}
              alt={post.meta.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071f17]/95 via-[#0B3D2E]/65 to-[#0B3D2E]/30" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, #071f17 0%, #0B3D2E 40%, #1A5C3A 100%)",
            }}
          />
        )}

        <div
          aria-hidden
          className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-[var(--dorado)] opacity-[0.05] blur-[80px] pointer-events-none"
        />

        <div className="section-container relative z-10 max-w-3xl mx-auto w-full pb-2">
          <AnimatedSection>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
            >
              ← Volver a noticias
            </Link>

            <div className="flex gap-2 flex-wrap mb-4">
              {post.meta.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-white/12 text-[var(--dorado-suave)] border border-white/15 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="!text-white !text-3xl sm:!text-4xl mb-6 leading-tight">
              {post.meta.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-white/50">
              {post.meta.author && (
                <span className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[var(--verde-hoja)] flex items-center justify-center text-xs text-white font-bold">
                    {post.meta.author.charAt(0)}
                  </span>
                  {post.meta.author}
                </span>
              )}
              <time>
                {new Date(post.meta.date).toLocaleDateString("es-AR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="bg-white">
        <div className="section-container max-w-3xl mx-auto">
          <AnimatedSection>
            <article
              className="prose"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </AnimatedSection>

          <div className="mt-14 pt-8 border-t border-[var(--border)]">
            <Link href="/blog" className="btn-secondary text-sm py-2.5 px-5">
              ← Ver todas las noticias
            </Link>
          </div>
        </div>
      </section>

      {/* ─── RELATED POSTS ─── */}
      {related.length > 0 && (
        <section className="bg-[var(--crema)]">
          <div className="section-container !pt-12 !pb-16">
            <AnimatedSection>
              <h2 className="text-xl mb-8">Seguí leyendo</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((p, i) => {
                const cover =
                  p.meta.cover ??
                  ["/hero-bg.png", "/education-bg.png", "/research-bg.png"][
                    i % 3
                  ];
                return (
                  <AnimatedSection key={p.slug} delay={i * 80}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group block relative overflow-hidden rounded-xl"
                      style={{ minHeight: 220 }}
                    >
                      <Image
                        src={cover}
                        alt={p.meta.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={70}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071f17]/88 via-[#0B3D2E]/30 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <div className="flex gap-1.5 flex-wrap mb-2">
                          {p.meta.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/85 border border-white/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="!text-white text-sm font-bold leading-snug line-clamp-2 mb-1">
                          {p.meta.title}
                        </h3>
                        <span className="text-[11px] font-semibold text-[var(--dorado)] group-hover:translate-x-0.5 transition-transform duration-300">
                          Leer →
                        </span>
                      </div>
                    </Link>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
