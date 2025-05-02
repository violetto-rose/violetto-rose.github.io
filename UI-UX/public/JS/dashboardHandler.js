import { notificationManager } from './notificationHandler.js';

export class DashboardHandler {
    constructor() {
        this.dashboard = null;
        this.isInitialized = false;
    }

    initialize() {
        if (this.isInitialized) return;

        this.dashboard = document.createElement('div');
        this.dashboard.id = 'dashboard';
        this.dashboard.className = 'dashboard glass';

        this.dashboard.innerHTML = `
                <div class="dashboard-header">
                    <h2>Dashboard</h2>
                    <button class="toggle" id="close-dashboard"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="dashboard-bento">
                    <div class="bento-box glass notification-form-section">
                        <div class="notification-form">
                            <h3>Add Notification</h3>
                            <form id="notification-form">
                                <div class="form-group">
                                    <label for="description">Description:</label>
                                    <textarea id="description" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="link">Link:</label>
                                    <input type="text" id="link" required>
                                </div>
                                <div class="form-group">
                                    <label for="linkName">Link Text:</label>
                                    <input type="text" id="linkName" required>
                                </div>
                                <div class="form-group">
                                    <label for="expiryDate">Expiry Date:</label>
                                    <input type="datetime-local" id="expiryDate" required>
                                </div>
                                <div class="form-actions">
                                    <button type="button" class="button cancel-btn">Cancel</button>
                                    <button type="submit" class="button submit-btn">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="bento-box glass notifications-section">
                        <h3>Notifications</h3>
                        <button class="button add-notification-btn"><span class="btn-text">Add New Notification</span><i class="fa-solid fa-plus btn-icon"></i></button>
                        <div class="notifications-list"></div>
                    </div>
                    <div class="bento-box glass stats-section">
                        <h3>Statistics</h3>
                        <div class="stats-content">
                            <p>Active Notifications: <span id="active-notifications">0</span></p>
                            <p>Expired Notifications: <span id="expired-notifications">0</span></p>
                        </div>
                    </div>
                </div>
        `;

        document.body.appendChild(this.dashboard);
        this.setupEventListeners();
        this.setupNotifications();
        this.setupFormListeners();
        this.isInitialized = true;
    }

    setupFormListeners() {
        const form = this.dashboard.querySelector('#notification-form');
        const cancelBtn = form.querySelector('.cancel-btn');

        cancelBtn.addEventListener('click', () => {
            form.reset();
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                description: form.description.value,
                link: form.link.value,
                linkName: form.linkName.value,
                expiryDate: new Date(form.expiryDate.value).toISOString()
            };

            try {
                await notificationManager.createNotification(formData);
                form.reset();
            } catch (error) {
                alert('Error saving notification: ' + error.message);
            }
        });
    }

    showNotificationForm(notification = null) {
        const form = this.dashboard.querySelector('#notification-form');
        const formTitle = form.closest('.notification-form').querySelector('h3');

        formTitle.textContent = notification ? 'Edit Notification' : 'Add Notification';
        form.description.value = notification?.description || '';
        form.link.value = notification?.link || '';
        form.linkName.value = notification?.linkName || '';
        if (notification?.expiryDate) {
            form.expiryDate.value = notification.expiryDate.split('.')[0];
        } else {
            form.expiryDate.value = '';
        }

        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                description: newForm.description.value,
                link: newForm.link.value,
                linkName: newForm.linkName.value,
                expiryDate: new Date(newForm.expiryDate.value).toISOString()
            };

            try {
                if (notification) {
                    await notificationManager.updateNotification(notification.id, formData);
                }
                newForm.reset();
            } catch (error) {
                alert('Error saving notification: ' + error.message);
            }
        });

        newForm.querySelector('.cancel-btn').addEventListener('click', () => {
            if (notification) {
                newForm.description.value = notification.description;
                newForm.link.value = notification.link;
                newForm.linkName.value = notification.linkName;
                newForm.expiryDate.value = notification.expiryDate.split('.')[0];
            } else {
                newForm.reset();
            }
        });
    }

    setupNotifications() {
        const addBtn = this.dashboard.querySelector('.add-notification-btn');
        addBtn.addEventListener('click', () => this.showNotificationForm());

        notificationManager.onNotificationsChange((notifications) => {
            this.renderNotifications(notifications);
            this.updateNotificationStats(notifications);
        });
    }

    updateNotificationStats(notifications) {
        const activeCount = document.getElementById('active-notifications');
        const expiredCount = document.getElementById('expired-notifications');

        if (!notifications) {
            return;
        }

        this.calculateAndUpdateStats(notifications, activeCount, expiredCount);
    }

    calculateAndUpdateStats(notifications, activeCount, expiredCount) {
        const now = new Date();
        const active = notifications.filter(n => new Date(n.expiryDate) > now).length;
        const expired = notifications.filter(n => new Date(n.expiryDate) <= now).length;

        activeCount.textContent = active;
        expiredCount.textContent = expired;
    }

    renderNotifications(notifications) {
        const listContainer = this.dashboard.querySelector('.notifications-list');
        listContainer.innerHTML = notifications.map(notification => `
            <div class="notification-item" data-id="${notification.id}">
                <div class="notification-content">
                    <p>${notification.description}</p>
                    <small>Expires: ${new Date(notification.expiryDate).toLocaleString()}</small>
                </div>
                <div class="notification-actions">
                    <button class="button edit-btn">Edit</button>
                    <button class="button delete-btn">Delete</button>
                </div>
            </div>
        `).join('');

        listContainer.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const notificationId = e.target.closest('.notification-item').dataset.id;
                const notification = notifications.find(n => n.id === notificationId);
                this.showNotificationForm(notification);
            });
        });

        listContainer.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Are you sure you want to delete this notification?')) {
                    const notificationId = e.target.closest('.notification-item').dataset.id;
                    await notificationManager.deleteNotification(notificationId);
                }
            });
        });
    }

    setupEventListeners() {
        const closeDashboard = this.dashboard.querySelector('#close-dashboard');
        closeDashboard.addEventListener('click', () => this.toggle(false));
    }

    toggle(force) {
        if (!this.dashboard) return;

        if (typeof force === 'boolean') {
            this.dashboard.classList.toggle('show', force);
        } else {
            this.dashboard.classList.toggle('show');
        }
    }

    isVisible() {
        return this.dashboard?.classList.contains('show');
    }

    updateContent(content) {
        if (!this.dashboard) return;
        const dashboardBody = this.dashboard.querySelector('.dashboard-body');
        if (dashboardBody) {
            dashboardBody.innerHTML = content;
        }
    }
}

export const dashboardHandler = new DashboardHandler();