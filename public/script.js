// Import configuration
import { githubConfig, lastfmConfig } from './config.js';
import { apps } from './appList.js';

// Import modules
import { initializeApps } from './modules/apps.js';
import { fetchLastFmTracks } from './modules/lastfm.js';
import { initializeGitHubHeatmap } from './modules/github.js';
import { createBackgroundPattern } from './modules/background.js';
import { initializeContactDropdown } from './modules/contactDropdown.js';

// Configuration
const CONFIG = {
  lastfm: lastfmConfig,
  github: githubConfig,
  apps: apps
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  createBackgroundPattern();
  initializeContactDropdown();
  initializeApps(CONFIG.apps);
  fetchLastFmTracks(CONFIG.lastfm);
  initializeGitHubHeatmap(CONFIG.github);
});
