export function initializeApps(apps) {
  const appsGrid = document.getElementById('apps-grid');

  if (!appsGrid) return;

  apps.forEach((app, index) => {
    const appElement = createAppElement(app, index);
    appsGrid.appendChild(appElement);
  });
}

function createAppElement(app, index) {
  const appItem = document.createElement('a');
  appItem.className = 'app-item';
  appItem.href = app.link;
  appItem.dataset.index = index;

  appItem.innerHTML = `
    <div class="app-icon">${app.icon}</div>
    <h3 class="app-title">${app.name}</h3>
    <p class="app-description">${app.description}</p>
  `;

  return appItem;
}
