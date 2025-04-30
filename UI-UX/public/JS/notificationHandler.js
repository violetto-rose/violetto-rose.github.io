export function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-notification-text">
          <p>The lab manual has been updated!</p>
          <a href="#about-course.md">View updates</a>
        </div>
        <button class="close-notification">&times;</button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    const removeNotification = () => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    };

    setTimeout(removeNotification, 5000);

    notification.querySelector('.close-notification').addEventListener('click', removeNotification);
}