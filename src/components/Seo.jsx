import { useEffect } from 'react';
import { homeSeo } from '@/lib/seoData';

const selectors = {
  title: 'title[data-seo="title"]',
  description: 'meta[data-seo="description"]',
  canonical: 'link[data-seo="canonical"]',
  ogTitle: 'meta[data-seo="og:title"]',
  ogDescription: 'meta[data-seo="og:description"]',
  ogType: 'meta[data-seo="og:type"]',
  ogUrl: 'meta[data-seo="og:url"]',
  ogImage: 'meta[data-seo="og:image"]',
  twitterTitle: 'meta[data-seo="twitter:title"]',
  twitterDescription: 'meta[data-seo="twitter:description"]',
  twitterImage: 'meta[data-seo="twitter:image"]',
  schema: 'script[data-seo="structured-data"]',
};

function setContent(selector, content) {
  const element = document.head.querySelector(selector);
  if (element && content) element.setAttribute('content', content);
}

export default function Seo({ metadata = homeSeo() }) {
  useEffect(() => {
    document.title = metadata.title;
    const title = document.head.querySelector(selectors.title);
    if (title) title.textContent = metadata.title;

    setContent(selectors.description, metadata.description);
    setContent(selectors.ogTitle, metadata.title);
    setContent(selectors.ogDescription, metadata.description);
    setContent(selectors.ogType, metadata.type || 'website');
    setContent(selectors.ogUrl, metadata.canonical);
    setContent(selectors.ogImage, metadata.image);
    setContent(selectors.twitterTitle, metadata.title);
    setContent(selectors.twitterDescription, metadata.description);
    setContent(selectors.twitterImage, metadata.image);

    const canonical = document.head.querySelector(selectors.canonical);
    if (canonical) canonical.setAttribute('href', metadata.canonical);

    const schema = document.head.querySelector(selectors.schema);
    if (schema && metadata.schema) {
      schema.textContent = JSON.stringify(metadata.schema).replace(/</g, '\\u003c');
    }
  }, [metadata]);

  return null;
}
