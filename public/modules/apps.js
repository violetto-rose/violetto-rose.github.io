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
  appItem.className = 'app-item' + (app.starred ? ' app-item--starred' : '');
  appItem.href = app.link;
  appItem.dataset.index = index;

  const starMarkup = app.starred
    ? '<img src="./public/assets/pixelated-golden-star-icon.png" alt="" class="app-item-star" />'
    : '';

  appItem.innerHTML = `
    <div class="app-icon">${app.icon}</div>
    <div class="app-item-text">
      <div class="app-item-heading">
        ${starMarkup}
        <h3 class="app-title">${app.name}</h3>
      </div>
      <p class="app-description">${app.description}</p>
    </div>
  `;

  return appItem;
}
