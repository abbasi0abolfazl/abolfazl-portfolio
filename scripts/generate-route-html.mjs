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
  const rawBody = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '').trim();
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
    body: rawBody,
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

function injectSeoAndBody(template, metadata, bodyHtml) {
  const seoPattern = /<!-- seo:meta:start -->[\s\S]*?<!-- seo:meta:end -->/;
  let output = template.replace(seoPattern, `<!-- seo:meta:start -->\n${renderSeo(metadata)}\n    <!-- seo:meta:end -->`);
  
  if (bodyHtml) {
    // Replace <div id="root"></div> with crawler-friendly pre-rendered semantic HTML
    output = output.replace(
      /<div id="root">\s*<\/div>/,
      `<div id="root">${bodyHtml}</div>`
    );
  }
  return output;
}

// Semantic fallback HTML builders for search engines and crawlers
function buildHomeBody(allProjects, allPosts) {
  return `
    <header style="padding: 2rem 1rem; max-width: 1200px; margin: auto;">
      <h1>Abolfazl Abbasi | AI Systems Engineer &amp; Quant Developer</h1>
      <p>Building production LLM, RAG, market-data research infrastructure, and algorithmic trading systems.</p>
      <nav>
        <a href="/#about">About</a> | <a href="/#projects">Projects</a> | <a href="/blog">Blog</a> | <a href="/demos">Demos</a> | <a href="/#contact">Contact</a>
      </nav>
    </header>
    <main style="max-width: 1200px; margin: auto; padding: 1rem;">
      <section id="featured-projects">
        <h2>Featured Engineering Projects</h2>
        <ul>
          ${allProjects.map((p) => `
            <li>
              <h3><a href="/projects/${p.id}">${escapeHtml(p.title)}</a></h3>
              <p>${escapeHtml(p.description)}</p>
              <small>Tech: ${escapeHtml(p.tags?.join(', ') || '')}</small>
            </li>
          `).join('')}
        </ul>
      </section>
      <section id="recent-articles">
        <h2>Recent Technical Notes &amp; Articles</h2>
        <ul>
          ${allPosts.slice(0, 6).map((post) => `
            <li>
              <h3><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a></h3>
              <time datetime="${post.date}">${post.date}</time>
              <p>${escapeHtml(post.excerpt)}</p>
            </li>
          `).join('')}
        </ul>
      </section>
    </main>
  `;
}

function buildBlogIndexBody(allPosts) {
  return `
    <header style="padding: 2rem 1rem; max-width: 1000px; margin: auto;">
      <h1>Technical Notes &amp; Blog | Abolfazl Abbasi</h1>
      <p>In-depth technical articles on AI engineering, LLM systems, Persian NLP, audio AI, and quant systems.</p>
      <nav><a href="/">Home</a> | <a href="/blog">Blog</a> | <a href="/demos">Demos</a></nav>
    </header>
    <main style="max-width: 1000px; margin: auto; padding: 1rem;">
      <section>
        <ul>
          ${allPosts.map((post) => `
            <li style="margin-bottom: 2rem;">
              <h2><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a></h2>
              <time datetime="${post.date}">${post.date}</time>
              <p>${escapeHtml(post.excerpt)}</p>
              <small>Tags: ${escapeHtml(post.tags?.join(', ') || '')}</small>
            </li>
          `).join('')}
        </ul>
      </section>
    </main>
  `;
}

function buildPostDetailBody(post) {
  return `
    <article style="max-width: 800px; margin: auto; padding: 2rem 1rem;">
      <header>
        <p><a href="/blog">&larr; Back to all articles</a></p>
        <h1>${escapeHtml(post.title)}</h1>
        <p>Published: <time datetime="${post.date}">${post.date}</time> by Abolfazl Abbasi</p>
        <p>Tags: ${escapeHtml(post.tags?.join(', ') || '')}</p>
      </header>
      <div class="article-content">
        <p><strong>${escapeHtml(post.excerpt)}</strong></p>
        <hr />
        <div style="white-space: pre-wrap; font-family: inherit;">
          ${escapeHtml(post.body.slice(0, 3000))}...
        </div>
      </div>
    </article>
  `;
}

function buildProjectDetailBody(project) {
  return `
    <article style="max-width: 900px; margin: auto; padding: 2rem 1rem;">
      <header>
        <p><a href="/#projects">&larr; Back to all projects</a></p>
        <h1>${escapeHtml(project.title)}</h1>
        <p>Category: ${escapeHtml(project.tech?.join(', ') || '')} | Year: ${project.year || '2026'}</p>
      </header>
      <main>
        <section>
          <h2>Overview</h2>
          <p>${escapeHtml(project.overview || project.description)}</p>
        </section>
        ${project.challenge ? `<section><h2>Engineering Challenge</h2><p>${escapeHtml(project.challenge)}</p></section>` : ''}
        ${project.solution ? `<section><h2>Architecture &amp; Solution</h2><p>${escapeHtml(project.solution)}</p></section>` : ''}
        ${project.role ? `<section><h2>Role &amp; Contribution</h2><p>${escapeHtml(project.role)}</p></section>` : ''}
        <section>
          <h2>Technologies Used</h2>
          <p>${escapeHtml(project.tags?.join(' • ') || '')}</p>
        </section>
        ${project.github ? `<p><a href="${project.github}" target="_blank" rel="noopener">View Source on GitHub</a></p>` : ''}
        ${project.demo ? `<p><a href="${project.demo}" target="_blank" rel="noopener">Live Demo</a></p>` : ''}
      </main>
    </article>
  `;
}

async function writeRoute(template, pathname, metadata, bodyHtml) {
  const relativeDirectory = pathname === '/' ? '' : pathname.replace(/^\//, '');
  const destination = path.join(outputDirectory, relativeDirectory, 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, injectSeoAndBody(template, metadata, bodyHtml));
}

// Generate comprehensive sitemap.xml
async function generateSitemap(allPosts, allProjects) {
  const baseUrl = 'https://abolfazlabbasi.com';
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly', lastmod: today },
    { loc: `${baseUrl}/blog/`, priority: '0.9', changefreq: 'weekly', lastmod: today },
    { loc: `${baseUrl}/demos/`, priority: '0.7', changefreq: 'monthly', lastmod: today },
  ];

  for (const post of allPosts) {
    urls.push({
      loc: `${baseUrl}/blog/${post.slug}/`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: post.date || today,
    });
  }

  for (const project of allProjects) {
    urls.push({
      loc: `${baseUrl}/projects/${project.id}/`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: today,
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  await writeFile(path.join(outputDirectory, 'sitemap.xml'), xml, 'utf8');
  await writeFile(path.join(projectDirectory, 'public', 'sitemap.xml'), xml, 'utf8');
  console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
}

const template = await readFile(path.join(outputDirectory, 'index.html'), 'utf8');
const posts = await getPosts();

await writeRoute(template, '/', homeSeo(), buildHomeBody(projects, posts));
await writeRoute(template, '/blog', blogIndexSeo(), buildBlogIndexBody(posts));
await writeRoute(template, '/demos', demosSeo(), '');

await Promise.all(projects.map((project) => writeRoute(template, `/projects/${project.id}`, projectSeo(project), buildProjectDetailBody(project))));
await Promise.all(posts.map((post) => writeRoute(template, `/blog/${post.slug}`, postSeo(post), buildPostDetailBody(post))));

await generateSitemap(posts, projects);

console.log(`Generated static SEO metadata & semantic body content for ${projects.length} project routes and ${posts.length} blog routes.`);
