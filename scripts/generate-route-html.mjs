import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const outputDirectory = path.join(projectDirectory, 'dist');
const postsDirectory = path.join(projectDirectory, 'src', 'content', 'blog', 'posts');

const { projects } = await import(pathToFileURL(path.join(projectDirectory, 'src', 'data', 'projectsData.js')).href);
const {
  homeSeo,
  blogIndexSeo,
  demosSeo,
  projectSeo,
  postSeo,
} = await import(pathToFileURL(path.join(projectDirectory, 'src', 'lib', 'seoData.js')).href);

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function parseFrontmatter(markdown, fallbackSlug) {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  const values = Object.fromEntries(
    (match?.[1] || '')
      .split('\n')
      .map((line) => line.match(/^([A-Za-z][\w-]*):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, rawValue]) => {
        const value = rawValue.trim().replace(/^['"]|['"]$/g, '');
        if (key === 'tags') {
          return [key, value.replace(/^\[|\]$/g, '').split(',').map((tag) => tag.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)];
        }
        return [key, value];
      }),
  );

  return {
    slug: values.slug || fallbackSlug,
    title: values.title || fallbackSlug.replace(/-/g, ' '),
    date: values.date || '',
    excerpt: values.excerpt || 'Technical notes by Abolfazl Abbasi.',
    tags: values.tags || [],
  };
}

async function getPosts() {
  const files = (await readdir(postsDirectory)).filter((file) => file.endsWith('.md'));
  return Promise.all(files.map(async (file) => {
    const content = await readFile(path.join(postsDirectory, file), 'utf8');
    return parseFrontmatter(content, file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''));
  }));
}

function renderSeo(metadata) {
  const schema = JSON.stringify(metadata.schema || {}).replace(/</g, '\\u003c');
  return `    <title data-seo="title">${escapeHtml(metadata.title)}</title>
    <meta data-seo="description" name="description" content="${escapeHtml(metadata.description)}" />
    <link data-seo="canonical" rel="canonical" href="${escapeHtml(metadata.canonical)}" />

    <!-- Open Graph -->
    <meta data-seo="og:title" property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta data-seo="og:description" property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta data-seo="og:type" property="og:type" content="${escapeHtml(metadata.type || 'website')}" />
    <meta data-seo="og:site_name" property="og:site_name" content="Abolfazl Abbasi" />
    <meta data-seo="og:url" property="og:url" content="${escapeHtml(metadata.canonical)}" />
    <meta data-seo="og:image" property="og:image" content="${escapeHtml(metadata.image)}" />

    <!-- Twitter -->
    <meta data-seo="twitter:card" name="twitter:card" content="summary_large_image" />
    <meta data-seo="twitter:title" name="twitter:title" content="${escapeHtml(metadata.title)}" />
    <meta data-seo="twitter:description" name="twitter:description" content="${escapeHtml(metadata.description)}" />
    <meta data-seo="twitter:image" name="twitter:image" content="${escapeHtml(metadata.image)}" />
    <script data-seo="structured-data" type="application/ld+json">${schema}</script>`;
}

function injectSeo(template, metadata) {
  const pattern = /<!-- seo:meta:start -->[\s\S]*?<!-- seo:meta:end -->/;
  return template.replace(pattern, `<!-- seo:meta:start -->\n${renderSeo(metadata)}\n    <!-- seo:meta:end -->`);
}

async function writeRoute(template, pathname, metadata) {
  const relativeDirectory = pathname === '/' ? '' : pathname.replace(/^\//, '');
  const destination = path.join(outputDirectory, relativeDirectory, 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, injectSeo(template, metadata));
}

const template = await readFile(path.join(outputDirectory, 'index.html'), 'utf8');
const posts = await getPosts();

await writeRoute(template, '/', homeSeo());
await writeRoute(template, '/blog', blogIndexSeo());
await writeRoute(template, '/demos', demosSeo());

await Promise.all(projects.map((project) => writeRoute(template, `/projects/${project.id}`, projectSeo(project))));
await Promise.all(posts.map((post) => writeRoute(template, `/blog/${post.slug}`, postSeo(post))));

console.log(`Generated static SEO metadata for ${projects.length} project routes and ${posts.length} blog routes.`);
