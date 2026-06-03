// src/lib/blogUtils.js
import { useEffect, useState } from 'react';

// دریافت همه فایل‌های .md از پوشه content/blog (فقط پوشه posts را مشخص می‌کنیم)
const blogModules = import.meta.glob('/src/content/blog/posts/**/*.md', { 
  query: '?raw', 
  import: 'default',
  eager: false 
});

// تابع تبدیل نام فایل به slug
function getSlugFromPath(filePath) {
  const fileName = filePath.split('/').pop();
  const withoutDate = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  return withoutDate.replace(/\.md$/, '');
}

// تابع استخراج تاریخ از نام فایل
function getDateFromPath(filePath) {
  const fileName = filePath.split('/').pop();
  const match = fileName.match(/^(\d{4}-\d{2}-\d{2})-/);
  if (match) {
    return match[1];
  }
  return new Date().toISOString().split('T')[0];
}

// تابع پارس فرانت‌متر ساده
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content };
  }
  
  const frontmatterStr = match[1];
  const data = {};
  const lines = frontmatterStr.split('\n');
  
  for (const line of lines) {
    if (line.includes(':')) {
      const colonIndex = line.indexOf(':');
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // حذف نقل قول‌ها
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      
      // اگر مقدار با [ شروع می‌شود، آن را به عنوان آرایه پردازش کن
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        if (arrayContent.trim()) {
          data[key] = arrayContent.split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
        } else {
          data[key] = [];
        }
      } else {
        data[key] = value;
      }
    }
  }
  
  const remainingContent = content.slice(match[0].length);
  return { data, content: remainingContent };
}

// تابع محاسبه زمان مطالعه
function calculateReadingTime(content) {
  const wordsPerMinute = 230;
  const text = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return {
    wordCount,
    minutes,
    label: minutes < 1 ? 'Less than 1 min read' : `${minutes} min read`
  };
}

// تابع ساخت excerpt از محتوا
function generateExcerpt(content, maxLength = 160) {
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/#+\s/g, '')
    .replace(/[*_~>|]/g, '')
    .trim();
  
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + '...';
}

// دریافت همه پست‌ها (Promise)
export async function getAllPosts() {
  const posts = [];
  
  for (const [filePath, loadModule] of Object.entries(blogModules)) {
    try {
      const content = await loadModule();
      const { data: frontmatter, content: markdownContent } = parseFrontmatter(content);
      
      const slug = frontmatter.slug || getSlugFromPath(filePath);
      const date = frontmatter.date || getDateFromPath(filePath);
      const title = frontmatter.title || slug.replace(/-/g, ' ');
      const excerpt = frontmatter.excerpt || generateExcerpt(markdownContent);
      
      // اطمینان از اینکه tags همیشه یک آرایه است
      let tags = frontmatter.tags;
      if (!tags) {
        tags = [];
      } else if (!Array.isArray(tags)) {
        // اگر tags یک string بود، آن را به آرایه تبدیل کن
        tags = typeof tags === 'string' ? [tags] : [];
      }
      
      const coverImage = frontmatter.coverImage || null;
      
      posts.push({
        slug,
        title,
        date,
        excerpt,
        tags,
        coverImage,
        content: markdownContent,
      });
    } catch (error) {
      console.error(`Error loading blog post ${filePath}:`, error);
    }
  }
  
  // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// دریافت یک پست با slug
export async function getPostBySlug(slug) {
  const allPosts = await getAllPosts();
  return allPosts.find(post => post.slug === slug);
}

// دریافت زمان مطالعه
export function getReadingTime(content) {
  return calculateReadingTime(content);
}