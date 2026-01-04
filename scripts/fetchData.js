import https from 'https';
import fs from 'fs';
import path from 'path';
import { githubConfig } from '../public/config.js';

const CONFIG = {
  github: githubConfig
};

const dataDir = path.join(process.cwd(), 'public', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function parseLinkHeader(linkHeader) {
  if (!linkHeader) return null;
  const links = linkHeader.split(',');
  for (const link of links) {
    const parts = link.split(';');
    const url = parts[0].trim().replace(/^<|>$/g, '');
    const rel = parts[1]?.trim().toLowerCase();
    if (rel && rel.includes('next')) {
      return url;
    }
  }
  return null;
}

async function fetchAllPages(url, token, maxPages = 10) {
  const allItems = [];
  let currentUrl = url;
  let pageCount = 0;

  while (currentUrl && pageCount < maxPages) {
    const response = await new Promise((resolve, reject) => {
      const options = {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'GitHub-Pages-Cache'
        }
      };

      // Only add Authorization header if token is provided
      if (token && token.trim() !== '' && token !== 'YOUR_GITHUB_TOKEN_HERE') {
        options.headers['Authorization'] = `Bearer ${token}`;
      }

      https.get(currentUrl, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, headers: res.headers, data: data });
        });
      }).on('error', reject);
    });

    if (response.statusCode !== 200) {
      console.error(`Error: ${response.statusCode}`);
      break;
    }

    const items = JSON.parse(response.data);
    if (!Array.isArray(items)) break;

    allItems.push(...items);

    const linkHeader = response.headers.link;
    currentUrl = parseLinkHeader(linkHeader);
    pageCount++;

    if (items.length < 100) break;
  }

  return allItems;
}

async function fetchCommits() {
  try {
    const token = CONFIG.github.token;
    const username = CONFIG.github.username || 'violetto-rose';
    const commitsLimit = CONFIG.github.commitsLimit || 5;

    if (!token || token === 'YOUR_GITHUB_TOKEN_HERE' || token.trim() === '') {
      console.log('⚠️ No token provided. Set GH_API_TOKEN environment variable or update CONFIG in script.');
      return;
    }

    console.log('📥 Fetching GitHub commits...');
    console.log(`Username: ${username}`);
    console.log(`Target: ${commitsLimit} commits`);

    // Fetch repositories (includes private repos with token)
    console.log('Fetching repositories...');
    const reposUrl = 'https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner';
    const repos = await fetchAllPages(reposUrl, token, 5);
    console.log(`Found ${repos.length} repositories`);

    // Fetch recent commits from each repository
    const allCommits = [];
    const maxRepos = Math.min(repos.length, 20);

    for (let i = 0; i < maxRepos && allCommits.length < commitsLimit; i++) {
      const repo = repos[i];
      const [owner, repoName] = repo.full_name.split('/');

      try {
        const commitsUrl = `https://api.github.com/repos/${owner}/${repoName}/commits?per_page=10&author=${username}`;
        const repoCommits = await fetchAllPages(commitsUrl, token, 1);

        for (const commit of repoCommits) {
          if (allCommits.length >= commitsLimit) break;

          allCommits.push({
            repo: repo.full_name,
            sha: commit.sha,
            timestamp: commit.commit.author.date || commit.commit.committer.date
          });
        }

        if (repoCommits.length > 0) {
          console.log(`📦 ${repo.full_name}: ${repoCommits.length} commits`);
        }
      } catch (error) {
        // Skip repos that fail
        continue;
      }
    }

    // Sort by timestamp (most recent first) and limit
    allCommits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const commits = allCommits.slice(0, commitsLimit);

    const commitsPath = path.join(dataDir, 'github-commits.json');
    fs.writeFileSync(commitsPath, JSON.stringify(commits, null, 2));

    if (commits.length === 0) {
      console.log(`⚠️ No commits found`);
    } else {
      console.log(`✅ Fetched ${commits.length} commits → ${commitsPath}`);
    }
  } catch (error) {
    console.error('❌ Error fetching commits:', error.message);
  }
}

async function fetchContributions() {
  try {
    const token = CONFIG.github.token;
    const username = CONFIG.github.username || 'violetto-rose';

    if (!token || token === 'YOUR_GITHUB_TOKEN_HERE' || token.trim() === '') {
      console.log('⚠️ Skipping contributions (no token)');
      return;
    }

    console.log('📥 Fetching GitHub contributions...');

    // Fetch repositories (includes private repos with token)
    const reposUrl = 'https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner';
    const repos = await fetchAllPages(reposUrl, token, 10);
    console.log(`Found ${repos.length} repositories`);

    // Calculate date range: from today going back 365 days
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    oneYearAgo.setHours(0, 0, 0, 0); // Start of that day

    console.log(`Date range: ${oneYearAgo.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`);

    const allCommits = [];

    const maxRepos = Math.min(repos.length, 50);
    for (let i = 0; i < maxRepos; i++) {
      const repo = repos[i];
      const [owner, repoName] = repo.full_name.split('/');
      const sinceISO = oneYearAgo.toISOString();
      const commitsUrl = `https://api.github.com/repos/${owner}/${repoName}/commits?since=${sinceISO}&author=${username}&per_page=100`;

      try {
        const commits = await fetchAllPages(commitsUrl, token, 10);
        allCommits.push(...commits);
        console.log(`📦 ${repo.full_name}: ${commits.length} commits`);
      } catch (error) {
        // Skip repos that fail
        continue;
      }
    }

    // Process into contribution map (last 365 days from today)
    const contributionMap = {};
    allCommits.forEach(commit => {
      if (commit.commit && commit.commit.author && commit.commit.author.date) {
        const date = new Date(commit.commit.author.date);
        // Include commits from oneYearAgo to today (inclusive)
        if (date >= oneYearAgo && date <= today) {
          const dateKey = date.toISOString().split('T')[0];
          contributionMap[dateKey] = (contributionMap[dateKey] || 0) + 1;
        }
      }
    });

    const contributions = Object.entries(contributionMap).map(([dateStr, value]) => ({
      date: dateStr + 'T00:00:00',
      value: value
    }));

    const contributionsPath = path.join(dataDir, 'github-contributions.json');
    fs.writeFileSync(contributionsPath, JSON.stringify(contributions, null, 2));
    console.log(`✅ Processed ${contributions.length} days with contributions → ${contributionsPath}`);
  } catch (error) {
    console.error('❌ Error fetching contributions:', error.message);
  }
}

async function main() {
  console.log('Starting data fetch...\n');

  await fetchCommits();
  console.log('');
  await fetchContributions();

  console.log('\nDone! Data saved to public/data/');
}

main().catch(console.error);
