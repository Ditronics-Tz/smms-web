export function openSidebar() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
    document.documentElement.style.setProperty('--SideNavigation-open', 'var(--Sidebar-width)');
    localStorage.setItem('sidebarOpen', 'true'); // Store state
  }
}

export function closeSidebar() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn');
    document.documentElement.style.removeProperty('--SideNavigation-open');
    localStorage.removeItem('sidebarOpen'); // Remove state
  }
}

export function toggleSidebar() {
  if (typeof window !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--SideNavigation-slideIn');
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

// Ensure sidebar remains open on page refresh
export function initializeSidebar() {
  if (typeof window !== 'undefined' && localStorage.getItem('sidebarOpen') === 'true') {
    openSidebar();
  }
}

