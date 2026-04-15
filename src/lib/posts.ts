import fs from "fs";
import path from "path";

export interface PostMeta {
  title: string;
  date: string;
  excerpt: string;
  cover?: string;
  author?: string;
  tags?: string[];
}

export interface Post {
  slug: string;
  meta: PostMeta;
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

function parseFrontmatter(raw: string): { meta: PostMeta; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return {
      meta: {
        title: "Sin título",
        date: new Date().toISOString().split("T")[0],
        excerpt: "",
      },
      content: raw,
    };
  }

  const frontmatter = match[1];
  const content = match[2];

  const meta: Record<string, string | string[]> = {};
  let currentKey = "";

  for (const line of frontmatter.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Array item
    if (trimmed.startsWith("- ") && currentKey) {
      const val = trimmed.slice(2).trim().replace(/^["']|["']$/g, "");
      const existing = meta[currentKey];
      if (Array.isArray(existing)) {
        existing.push(val);
      } else {
        meta[currentKey] = [val];
      }
      continue;
    }

    const kvMatch = trimmed.match(/^(\w+)\s*:\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim().replace(/^["']|["']$/g, "");
      if (value) {
        meta[currentKey] = value;
      } else {
        meta[currentKey] = [];
      }
    }
  }

  return {
    meta: {
      title: (meta.title as string) || "Sin título",
      date: (meta.date as string) || new Date().toISOString().split("T")[0],
      excerpt: (meta.excerpt as string) || "",
      cover: meta.cover as string | undefined,
      author: meta.author as string | undefined,
      tags: Array.isArray(meta.tags) ? meta.tags : undefined,
    },
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { meta, content } = parseFrontmatter(raw);
    return { slug, meta, content };
  });

  // Sort by date descending
  return posts.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { meta, content } = parseFrontmatter(raw);
  return { slug, meta, content };
}
