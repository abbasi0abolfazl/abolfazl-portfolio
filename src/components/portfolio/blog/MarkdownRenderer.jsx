import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import ImageZoom from './ImageZoom';
import Callout from './Callout';
import remarkGfm from 'remark-gfm';
import CustomTable from './CustomTable';


/* ── Helpers ─────────────────────────────────────────────── */

function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function flatText(children) {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(flatText).join('');
  if (children?.props?.children) return flatText(children.props.children);
  return '';
}

// Parse > [!type] callouts
function parseCallout(node) {
  const raw = node?.children?.[0]?.children?.[0]?.value || '';
  const m = raw.match(/^\[!(info|tip|warning|danger|note|caution)\]\s*(.*)/si);
  return m ? { type: m[1].toLowerCase() === 'note' ? 'info' : m[1].toLowerCase() === 'caution' ? 'warning' : m[1].toLowerCase(), content: m[2] } : null;
}

// Auto-embed YouTube / Vimeo
function EmbedOrLink({ href, children }) {
  const yt = href?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const vm = href?.match(/vimeo\.com\/(\d+)/);
  if (yt) return (
    <div className="relative my-6 rounded-2xl overflow-hidden aspect-video ring-1 ring-border/40 shadow-lg">
      <iframe src={`https://www.youtube.com/embed/${yt[1]}`} className="absolute inset-0 w-full h-full" allowFullScreen title="YouTube" />
    </div>
  );
  if (vm) return (
    <div className="relative my-6 rounded-2xl overflow-hidden aspect-video ring-1 ring-border/40 shadow-lg">
      <iframe src={`https://player.vimeo.com/video/${vm[1]}`} className="absolute inset-0 w-full h-full" allowFullScreen title="Vimeo" />
    </div>
  );
  return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-primary/40 hover:decoration-primary transition-colors underline-offset-2">{children}</a>;
}

/* ── Heading with anchor ─────────────────────────────────── */
function Heading({ level, children }) {
  const text = flatText(children);
  const id = slugify(text);
  const Tag = `h${level}`;
  const sizes = { 1: 'text-2xl mt-8 mb-3', 2: 'text-xl mt-6 mb-2', 3: 'text-lg mt-5 mb-2', 4: 'text-base mt-4 mb-1' };
  const borders = { 2: 'pb-2 border-b border-border/30' };

  return (
    <Tag
      id={id}
      className={`group flex items-center gap-2 font-semibold font-nevera text-foreground scroll-mt-24 ${sizes[level] || ''} ${borders[level] || ''}`}
    >
      {children}
      <a
        href={`#${id}`}
        onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(`${window.location.href.split('#')[0]}#${id}`); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }}
        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-primary text-sm font-normal select-none"
        title="Copy link"
      >#</a>
    </Tag>
  );
}

/* ── Component map ───────────────────────────────────────── */
const components = {
  h1: ({ children }) => <Heading level={1}>{children}</Heading>,
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }) => <Heading level={4}>{children}</Heading>,

  p({ children, node }) {
    // بررسی می‌کنیم که آیا پاراگراف حاوی جدول است یا خیر
    const rawContent = node?.children?.[0]?.value || '';
    if (rawContent.includes('|') && rawContent.includes('---')) {
      return <CustomTable markdown={rawContent} />;
    }
    return <p className="text-[15px] leading-[1.7] text-foreground/80 my-3">{children}</p>;
  },

  strong({ children }) {
    return <strong className="font-semibold text-foreground">{children}</strong>;
  },

  em({ children }) {
    return <em className="italic text-foreground/70">{children}</em>;
  },

  code({ inline, className, children }) {
    const lang = (className || '').replace('language-', '');
    if (inline) return (
      <code className="font-mono text-[13px] text-primary bg-primary/8 bg-primary/10 px-1.5 py-0.5 rounded-md border border-primary/15">{children}</code>
    );
    return <CodeBlock language={lang}>{children}</CodeBlock>;
  },

  img({ src, alt }) {
    return <ImageZoom src={src} alt={alt} />;
  },

  a({ href, children }) {
    return <EmbedOrLink href={href}>{children}</EmbedOrLink>;
  },

  blockquote({ node, children }) {
    const callout = parseCallout(node);
    if (callout) return <Callout type={callout.type}>{callout.content}</Callout>;
    return (
      <blockquote className="relative my-5 pl-5 border-l-[3px] border-primary/50 text-foreground/60 italic bg-primary/[0.03] rounded-r-xl py-3 pr-4">
        {children}
      </blockquote>
    );
  },

  ul({ children }) {
    return <ul className="my-4 space-y-1.5 pl-1">{children}</ul>;
  },

  ol({ children }) {
    return <ol className="my-4 space-y-1.5 pl-5 list-decimal marker:text-primary/60">{children}</ol>;
  },

  li({ children, checked }) {
    if (checked !== null && checked !== undefined) {
      return (
        <li className="flex items-start gap-2.5 list-none">
          <input type="checkbox" defaultChecked={checked} className="mt-1 accent-primary shrink-0" />
          <span className={`text-[15px] leading-relaxed ${checked ? 'line-through text-foreground/40' : 'text-foreground/80'}`}>{children}</span>
        </li>
      );
    }
    return (
      <li className="flex items-start gap-2.5 list-none text-foreground/80 text-[15px] leading-relaxed">
        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
        <span>{children}</span>
      </li>
    );
  },

  // Ordered list items (no custom bullet)
  hr() {
    return <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-border to-transparent" />;
  },

  table({ children }) {
    return (
      <div className="overflow-x-auto my-6 rounded-xl border border-border/50 shadow-sm">
        <table className="min-w-full text-sm">{children}</table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="bg-card text-foreground font-semibold border-b border-border/50">{children}</thead>;
  },
  tbody({ children }) {
    return <tbody className="divide-y divide-border/20">{children}</tbody>;
  },
  tr({ children }) {
    return <tr className="even:bg-primary/[0.03] hover:bg-primary/[0.06] transition-colors">{children}</tr>;
  },
  th({ children }) {
    return <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</th>;
  },
  td({ children }) {
    return <td className="px-4 py-2.5 text-foreground/70">{children}</td>;
  },
};

/* ── Main export ─────────────────────────────────────────── */
export default function MarkdownRenderer({ content }) {
  return (
    <div className="min-w-0 max-w-[680px] font-inter selection:bg-primary/20 mx-auto">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}  // اضافه شود
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}