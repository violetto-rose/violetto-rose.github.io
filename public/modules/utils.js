export function getTimeAgo(timestamp) {
  if (!timestamp) return 'Recently';

  const seconds = Math.floor(Date.now() / 1000 - timestamp);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function parseLinkHeader(linkHeader) {
  if (!linkHeader) return null;

  const links = linkHeader.split(',');
  for (const link of links) {
    const parts = link.split(';');
    const url = parts[0].trim().replace(/^<|>$/g, '');
    const rel = parts[1]?.trim().toLowerCase();

    if (rel && (rel === 'rel="next"' || rel === 'rel=next' || rel.includes('next'))) {
      return url;
    }
  }
  return null;
}

export { parseLinkHeader };
