/**
 * Navigation Manager Module
 * Handles sidebar menu and footer scroll behavior
 */

export class NavigationManager {
  constructor() {
    this.setupFooterScrollBehavior();
    this.setupSidebarMenu();
  }

  /**
   * Footer hide/show functionality based on scroll
   */
  setupFooterScrollBehavior() {
    let lastScrollTop = 0;
    let ticking = false;
    const footer = document.getElementById('footer');

    if (!footer) return;

    const updateFooter = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const isTabletOrSmaller = window.innerWidth <= 1024; // lg breakpoint in Tailwind

      if (isTabletOrSmaller) {
        if (scrollTop <= 10) {
          // At the very top (with small tolerance) - show footer
          footer.style.transform = 'translateY(0)';
        } else {
          // Not at the top - hide footer
          footer.style.transform = 'translateY(100%)';
        }
      } else {
        // Desktop - always show footer
        footer.style.transform = 'translateY(0)';
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateFooter);
        ticking = true;
      }
    };

    // Scroll event listener
    window.addEventListener('scroll', requestTick, { passive: true });

    // Resize event listener to handle orientation changes
    window.addEventListener(
      'resize',
      () => {
        requestTick();
      },
      { passive: true }
    );
  }

  /**
   * Sidebar menu functionality
   */
  setupSidebarMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const closeSidebar = document.getElementById('closeSidebar');

    if (!menuToggle || !sidebarMenu) return;

    const openSidebar = () => {
      sidebarMenu.classList.remove('opacity-0', 'pointer-events-none');
      sidebarMenu.classList.add('opacity-100');
      const sidebarContent = sidebarMenu.querySelector('div');
      if (sidebarContent) {
        sidebarContent.classList.remove('translate-x-full');
        sidebarContent.classList.add('-translate-x-5');
      }
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    };

    const closeSidebarMenu = () => {
      const sidebarContent = sidebarMenu.querySelector('div');
      if (sidebarContent) {
        sidebarContent.classList.remove('-translate-x-5');
        sidebarContent.classList.add('translate-x-full');
      }

      // Wait for animation, then hide overlay
      setTimeout(() => {
        sidebarMenu.classList.remove('opacity-100');
        sidebarMenu.classList.add('opacity-0', 'pointer-events-none');
        // Restore body scroll
        document.body.style.overflow = '';
      }, 300);
    };

    // Toggle sidebar
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      openSidebar();
    });

    // Close sidebar
    if (closeSidebar) {
      closeSidebar.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSidebarMenu();
      });
    }

    // Close on background click
    sidebarMenu.addEventListener('click', (e) => {
      if (e.target === sidebarMenu) {
        closeSidebarMenu();
      }
    });

    // Prevent clicks inside sidebar from closing it
    const sidebarContent = sidebarMenu.querySelector('div');
    if (sidebarContent) {
      sidebarContent.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !sidebarMenu.classList.contains('opacity-0')) {
        closeSidebarMenu();
      }
    });
  }
}
