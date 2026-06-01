const WORDS_PER_MINUTE = 230;

export function getReadingTime(content = '') {
  const text = content
    .replace(/```[\s\S]*?```/g, '')   // strip code blocks
    .replace(/`[^`]*`/g, '')          // strip inline code
    .replace(/#+\s/g, '')             // strip headings
    .replace(/[*_~>|]/g, '')          // strip markdown symbols
    .trim();

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  return {
    wordCount,
    minutes,
    label: minutes < 1 ? 'Less than 1 min read' : `${minutes} min read`,
  };
}