require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

function loadJSON(file) {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8')); } catch { return []; }
}

const CATEGORIES = [
  { id: 'ai', title: 'Artificial Intelligence', icon: '🤖', desc: 'AI, machine learning, and robotics news' },
  { id: 'tech', title: 'Tech & Gadgets', icon: '💻', desc: 'Latest tech news, gadgets, and software' },
  { id: 'security', title: 'Cybersecurity', icon: '🔒', desc: 'Hacking, breaches, and online privacy' },
  { id: 'business', title: 'Business & Startups', icon: '📈', desc: 'Startups, funding, and business news' },
  { id: 'science', title: 'Science & Space', icon: '🔬', desc: 'Scientific discoveries and space exploration' },
  { id: 'health', title: 'Health & Medicine', icon: '🏥', desc: 'Medical breakthroughs and health news' },
  { id: 'entertainment', title: 'Entertainment', icon: '🎬', desc: 'Movies, TV, music, and celebrity news' },
  { id: 'gaming', title: 'Gaming', icon: '🎮', desc: 'Video games, esports, and gaming culture' },
  { id: 'social', title: 'Social Media', icon: '📱', desc: 'Social platforms, trends, and influencers' },
  { id: 'crypto', title: 'Crypto & Web3', icon: '₿', desc: 'Bitcoin, blockchain, NFTs, and DeFi' },
  { id: 'world', title: 'World News', icon: '🌍', desc: 'Global news, politics, and current events' },
  { id: 'sports', title: 'Sports', icon: '⚽', desc: 'Sports news, scores, and athlete stories' }
];

function categorizeArticle(title, text) {
  const t = (title + ' ' + text).toLowerCase();
  if (t.includes('ai') || t.includes('machine learning') || t.includes('neural') || t.includes('openai') || t.includes('gpt') || t.includes('chatgpt') || t.includes('deepmind') || t.includes('anthropic') || t.includes('llm')) return 'ai';
  if (t.includes('security') || t.includes('hack') || t.includes('breach') || t.includes('malware') || t.includes('cyber') || t.includes('ransomware') || t.includes('phishing')) return 'security';
  if (t.includes('startup') || t.includes('funding') || t.includes('venture') || t.includes('ipo') || t.includes('market') || t.includes('stock') || t.includes('economy') || t.includes('business') || t.includes('trade')) return 'business';
  if (t.includes('health') || t.includes('medical') || t.includes('drug') || t.includes('vaccine') || t.includes('medicine') || t.includes('hospital') || t.includes('fitness') || t.includes('diet')) return 'health';
  if (t.includes('movie') || t.includes('film') || t.includes('music') || t.includes('celebrity') || t.includes('entertainment') || t.includes('hollywood') || t.includes('netflix') || t.includes('streaming')) return 'entertainment';
  if (t.includes('gaming') || t.includes('playstation') || t.includes('xbox') || t.includes('nintendo') || t.includes('game') || t.includes('esports') || t.includes('steam')) return 'gaming';
  if (t.includes('social') || t.includes('twitter') || t.includes('facebook') || t.includes('instagram') || t.includes('tiktok') || t.includes('reddit') || t.includes('influencer')) return 'social';
  if (t.includes('crypto') || t.includes('bitcoin') || t.includes('blockchain') || t.includes('nft') || t.includes('ethereum') || t.includes('web3') || t.includes('defi')) return 'crypto';
  if (t.includes('sport') || t.includes('nba') || t.includes('nfl') || t.includes('soccer') || t.includes('football') || t.includes('tennis') || t.includes('olympic') || t.includes('championship')) return 'sports';
  if (t.includes('politic') || t.includes('election') || t.includes('congress') || t.includes('senate') || t.includes('president') || t.includes('war') || t.includes('russia') || t.includes('china') || t.includes('ukraine') || t.includes('climate') || t.includes('world')) return 'world';
  if (t.includes('science') || t.includes('research') || t.includes('space') || t.includes('nasa') || t.includes('rocket') || t.includes('spacex') || t.includes('biology') || t.includes('physics')) return 'science';
  return 'tech';
}

app.use((req, res, next) => {
  const articles = loadJSON('articles.json') || [];
  res.locals.articles = articles;
  res.locals.adClient = process.env.AD_CLIENT;
  res.locals.siteName = process.env.SITE_NAME || 'TechBite News';
  res.locals.stats = { articles: articles.length, rewritten: articles.filter(a => a.rewritten).length, categories: CATEGORIES.length };
  res.locals.categories = CATEGORIES;
  next();
});

app.get('/', (req, res) => {
  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    articles: (res.locals.articles || []).filter(a => (a.category || '').toLowerCase() === cat.id).slice(0, 5)
  }));
  const featured = (res.locals.articles || []).filter(a => a.rewritten).sort((a, b) => (a.image ? 1 : 0) - (b.image ? 1 : 0)).reverse().slice(0, 6);
  res.render('index', { grouped, featured });
});

app.get('/category/:id', (req, res) => {
  const cat = CATEGORIES.find(c => c.id === req.params.id);
  if (!cat) return res.status(404).send('Category not found');
  const articles = (res.locals.articles || []).filter(a => (a.category || '').toLowerCase() === cat.id);
  res.render('category', { category: cat, articles });
});

app.get('/article/:slug', (req, res) => {
  const article = (res.locals.articles || []).find(a => a.slug === req.params.slug);
  if (!article) return res.status(404).send('Article not found');
  const related = (res.locals.articles || []).filter(a => a.category === article.category && a.slug !== article.slug).slice(0, 4);
  res.render('article', { article, related });
});

app.get('/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const results = (res.locals.articles || []).filter(a => a.title.toLowerCase().includes(q) || (a.summary || '').toLowerCase().includes(q));
  res.render('search', { query: req.query.q, results });
});

app.get('/dmca', (req, res) => {
  res.render('dmca');
});

app.get('/disclaimer', (req, res) => {
  res.render('disclaimer');
});

app.get('/robots.txt', (req, res) => {
  res.type('text').send('User-agent: *\nAllow: /\nSitemap: ' + process.env.SITE_URL + '/sitemap.xml');
});

app.get('/sitemap.xml', (req, res) => {
  const articles = res.locals.articles || [];
  let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  xml += '<url><loc>' + process.env.SITE_URL + '/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>';
  articles.forEach(a => { xml += '<url><loc>' + process.env.SITE_URL + '/article/' + a.slug + '</loc><lastmod>' + a.date + '</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>'; });
  xml += '</urlset>';
  res.type('xml').send(xml);
});

app.get('/ads.txt', (req, res) => {
  res.type('text').send('google.com, ' + process.env.AD_CLIENT + ', DIRECT, f08c47fec0942fa0');
});

cron.schedule('0 */6 * * *', () => {
  try { require('./scripts/generate-content')(); console.log('[Cron] Content generated'); }
  catch (e) { console.error('[Cron] Error:', e.message); }
});

app.listen(PORT, async () => {
  console.log(process.env.SITE_NAME + ' running on http://localhost:' + PORT);
  // Auto-generate content on first start (for fresh deploys)
  const articles = loadJSON('articles.json');
  if (!articles || articles.length === 0) {
    console.log('[Startup] No articles found, generating initial content...');
    try {
      await require('./scripts/generate-content')();
      await require('./scripts/mark-featured')();
      console.log('[Startup] Initial content generated');
    } catch (e) {
      console.error('[Startup] Error:', e.message);
    }
  }
});