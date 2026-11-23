const SITE_URL = 'https://abolfazlabbasi.com';
const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Abolfazl Abbasi',
  url: `${SITE_URL}/`,
  image: OG_IMAGE_URL,
  jobTitle: 'AI Systems Engineer and Quant Developer',
  email: 'contact@abolfazlabbasi.com',
  sameAs: [
    'https://github.com/abbasi0abolfazl',
    'https://www.linkedin.com/in/abbasi-abolfazl/',
  ],
  knowsAbout: [
    'Large Language Models',
    'Retrieval-Augmented Generation',
    'Natural Language Processing',
    'Computer Vision',
    'Quantitative Development',
  ],
};

export function canonicalUrl(pathname = '/') {
  const normalizedPath = pathname === '/' ? '/' : `/${pathname.replace(/^\/+|\/+$/g, '')}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function createSeo({ title, description, pathname = '/', type = 'website', schema }) {
  return {
    title,
    description,
    pathname,
    canonical: canonicalUrl(pathname),
    type,
    image: OG_IMAGE_URL,
    schema,
  };
}

export function homeSeo() {
  return createSeo({
    title: 'Abolfazl Abbasi | AI Systems Engineer & Quant Developer',
    description: 'AI Systems Engineer and Quant Developer building production LLM, RAG, market-data, and algorithmic-trading systems.',
    schema: personSchema,
  });
}

export function blogIndexSeo() {
  return createSeo({
    title: 'AI & Quant Engineering Notes | Abolfazl Abbasi',
    description: 'Technical notes on LLM systems, RAG, Persian NLP, computer vision, and quantitative engineering.',
    pathname: '/blog',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'AI & Quant Engineering Notes',
      url: canonicalUrl('/blog'),
      author: personSchema,
    },
  });
}

export function demosSeo() {
  return createSeo({
    title: 'AI Project Case Studies | Abolfazl Abbasi',
    description: 'Interactive case studies covering LLM/RAG systems, quantitative workflows, and a transparent private YOLO evaluation.',
    pathname: '/demos',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'AI Project Case Studies',
      url: canonicalUrl('/demos'),
      author: personSchema,
    },
  });
}

export function projectSeo(project) {
  const pathname = `/projects/${project.id}`;
  return createSeo({
    title: `${project.title} | Abolfazl Abbasi`,
    description: project.description,
    pathname,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      url: canonicalUrl(pathname),
      author: personSchema,
      ...(project.github ? { codeRepository: project.github } : {}),
      keywords: project.tags?.join(', '),
    },
  });
}

export function postSeo(post) {
  const pathname = `/blog/${post.slug}`;
  return createSeo({
    title: `${post.title} | Abolfazl Abbasi`,
    description: post.excerpt,
    pathname,
    type: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      mainEntityOfPage: canonicalUrl(pathname),
      author: personSchema,
      publisher: personSchema,
      keywords: post.tags?.join(', '),
    },
  });
}

export function contactSeo() {
  return createSeo({
    title: 'Contact Abolfazl Abbasi | AI Systems Engineer & Quant Developer',
    description: 'Get in touch with Abolfazl Abbasi. Available for AI systems engineering, quantitative architectures, consulting, and technical collaboration.',
    pathname: '/contact',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Abolfazl Abbasi',
      url: canonicalUrl('/contact'),
      author: personSchema,
    },
  });
}

export function linksSeo() {
  return createSeo({
    title: 'Links & Socials | Abolfazl Abbasi',
    description: 'Direct links to Abolfazl Abbasi’s engineering portfolio, GitHub, LinkedIn, technical articles, and direct messaging channels.',
    pathname: '/links',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: 'Abolfazl Abbasi Links Hub',
      url: canonicalUrl('/links'),
      author: personSchema,
    },
  });
}
