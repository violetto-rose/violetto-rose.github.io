/**
 * Load quotes from JSON and display a random one
 */

const QUOTES_URL = './public/data/quotes.json';

export async function initializeQuotes() {
  const container = document.getElementById('quote-container');
  if (!container) return;

  try {
    const res = await fetch(QUOTES_URL);
    if (!res.ok) throw new Error('Quotes not found');
    const quotes = await res.json();
    const valid = Array.isArray(quotes) ? quotes.filter((q) => q.text && q.text.trim()) : [];
    if (valid.length === 0) return;

    const quote = valid[Math.floor(Math.random() * valid.length)];
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'about-quote';

    const p = document.createElement('p');
    p.textContent = `${quote.text}`;

    const footer = document.createElement('footer');
    footer.className = 'about-quote-attribution';
    footer.textContent = quote.attribution;

    blockquote.appendChild(p);
    blockquote.appendChild(footer);
    container.appendChild(blockquote);
  } catch (err) {
    console.warn('Could not load quotes:', err);
  }
}
