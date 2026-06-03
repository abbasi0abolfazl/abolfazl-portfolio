// سرویس ساده محلی برای ذخیره Comments و Likes در localStorage

const STORAGE_KEYS = {
  COMMENTS: 'blog_comments',
  LIKES: 'blog_likes'
};

// کامنت‌ها
export function getComments(postSlug) {
  const allComments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
  return (allComments[postSlug] || []).filter(c => c.published).sort((a, b) => 
    new Date(b.created_date) - new Date(a.created_date)
  );
}

export function addComment(postSlug, comment) {
  const allComments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
  const postComments = allComments[postSlug] || [];
  
  const newComment = {
    id: Date.now().toString(),
    ...comment,
    post_slug: postSlug,
    published: false, // نیاز به تأیید
    created_date: new Date().toISOString()
  };
  
  allComments[postSlug] = [...postComments, newComment];
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
  
  return newComment;
}

// لایک‌ها
export function getLikeCount(postSlug) {
  const likes = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || '{}');
  return likes[postSlug] || 0;
}

export function hasUserLiked(postSlug) {
  const userLikes = JSON.parse(localStorage.getItem(`user_likes_${postSlug}`) || 'false');
  return userLikes;
}

export function toggleLike(postSlug) {
  const userLiked = hasUserLiked(postSlug);
  
  if (userLiked) {
    // unlike
    localStorage.setItem(`user_likes_${postSlug}`, 'false');
    const likes = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || '{}');
    likes[postSlug] = Math.max(0, (likes[postSlug] || 0) - 1);
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes));
    return { liked: false, count: likes[postSlug] };
  } else {
    // like
    localStorage.setItem(`user_likes_${postSlug}`, 'true');
    const likes = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || '{}');
    likes[postSlug] = (likes[postSlug] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes));
    return { liked: true, count: likes[postSlug] };
  }
}