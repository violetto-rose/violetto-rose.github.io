export const notifications = [
    {
        description: "The lab manual has been updated!",
        link: "#about-course.md",
        linkName: "View updates",
        expiryDate: new Date("2025-05-06T00:00:00")
    },
];

export function showUpdateNotification() {
    const activeNotifications = notifications.filter(notification => {
        const currentDate = new Date();
        return currentDate < notification.expiryDate;
    });

    if (activeNotifications.length === 0) return;

    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    activeNotifications.forEach((notificationData, index) => {
        setTimeout(() => {
            const notification = document.createElement('div');
            notification.className = 'update-notification';
            notification.innerHTML = `
                <p>${notificationData.description} <a href="${notificationData.link}">${notificationData.linkName}</a></p>
                <button class="close-notification">&times;</button>
            `;

            notificationContainer.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            const removeNotification = () => {
                notification.classList.add('hide');
                setTimeout(() => {
                    notification.remove();
                    const remainingNotifications = notificationContainer.querySelectorAll('.update-notification');
                    remainingNotifications.forEach((notification, idx) => {
                        notification.style.transform = idx === 0 ? 'translateY(0)' : `translateY(-${100}%)`;
                    });
                }, 5000);
            };

            setTimeout(removeNotification, 5000);

            notification.querySelector('.close-notification').addEventListener('click', removeNotification);
        }, index * 1000);
    });
}