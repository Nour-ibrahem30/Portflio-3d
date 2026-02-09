/**
 * Projects Configuration
 * 
 * This file controls project categorization, ordering, and visibility.
 * GitHub API remains the single source of truth for repository data.
 */

export const projectsConfig = {
  /**
   * Featured Projects
   * - Manually selected and ordered
   * - Always displayed first
   * - Add repository names in desired order
   */
  featured: [
    'Portflio-3d',
    'Elgokh',
    'Creative-child',
    'intiative_Website_Value',
    'SBS-Website-Clone',
    'Green-studio',
    'Family',
    'VivaDecor',
  ],

  /**
   * Archived Projects
   * - Old or experimental repositories
   * - Hidden by default or shown in separate tab
   * - Add repository names to hide from main view
   */
  archived: [
    // Add archived project names here
    // Example: 'old-project', 'test-repo'
  ],

  /**
   * Hidden Projects
   * - Completely hidden from portfolio
   * - Use for private experiments or incomplete work
   */
  hidden: [
    // Add hidden project names here
  ],

  /**
   * Project Metadata Overrides
   * - Override GitHub data with custom information
   * - Useful for adding custom descriptions, images, or links
   */
  overrides: {
    'Portflio-3d': {
      displayName: 'Portfolio Website 3D',
      customDescription: 'Modern 3D portfolio website with interactive animations, built with React, Vite, and Tailwind CSS. Features dynamic GitHub API integration and smooth GSAP animations.',
      featured: true,
      liveUrl: 'https://nour-ibrahem30.github.io/Portflio-3d/',
      tags: ['React', 'Vite', 'Tailwind CSS', 'GSAP', 'Framer Motion'],
      highlight: true,
    },
    'Elgokh': {
      displayName: 'Elgokh',
      customDescription: 'Professional website project showcasing modern web development techniques and responsive design.',
      featured: true,
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
      highlight: true,
    },
    'Creative-child': {
      displayName: 'Creative Child',
      customDescription: 'Creative and colorful website designed for children, featuring interactive elements and engaging UI.',
      featured: true,
      tags: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX'],
      highlight: true,
    },
    'intiative_Website_Value': {
      displayName: 'Initiative Website - Value Marketing',
      customDescription: 'Custom React website built for Value Marketing company. Features modern design, responsive layout, and smooth animations.',
      featured: true,
      tags: ['React', 'JavaScript', 'CSS3', 'Responsive'],
      highlight: true,
    },
    'SBS-Website-Clone': {
      displayName: 'Shabab Betesaed Shabab Website',
      customDescription: 'Complete website clone for Shabab Betesaed Shabab organization. Built with React, TypeScript, and modern web technologies.',
      featured: true,
      tags: ['React', 'TypeScript', 'CSS3', 'Volunteer'],
      highlight: true,
    },
    'Green-studio': {
      displayName: 'Green Studio',
      customDescription: 'Elegant studio website with modern design and smooth animations. Features portfolio showcase and contact forms.',
      featured: true,
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Design'],
      highlight: true,
    },
    'Family': {
      displayName: 'Family',
      customDescription: 'Family-oriented website project with warm design and user-friendly interface.',
      featured: true,
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
      highlight: true,
    },
    'VivaDecor': {
      displayName: 'Viva Decor',
      customDescription: 'Interior design showcase website built during Web Master internship. Features elegant design and image galleries.',
      featured: true,
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Design'],
      highlight: true,
    },
    'jadoo': {
      displayName: 'Jadoo Travel Website',
      customDescription: 'Travel booking website built during Web Master internship. Features responsive design and interactive UI.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
    },
    'Kalaly-Project': {
      displayName: 'Kalaly Project',
      customDescription: 'E-commerce project built during Web Master internship. Includes product listings and shopping cart functionality.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'E-commerce'],
    },
    'Travel': {
      displayName: 'Travel Website',
      customDescription: 'Tourism website built during Web Master internship. Includes destination listings and booking features.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Tourism'],
    },
    // Add more overrides as needed
  },

  /**
   * Category Display Settings
   */
  display: {
    showArchived: false, // Show archived tab - DISABLED
    defaultTab: 'featured', // 'featured', 'other', or 'archived'
    projectsPerPage: 6,
    sortOtherBy: 'created', // 'created', 'updated', 'stars', 'name'
    sortOrder: 'desc', // 'asc' or 'desc'
  },
};

/**
 * Helper function to categorize a project
 */
export function categorizeProject(repoName) {
  if (projectsConfig.hidden.includes(repoName)) {
    return 'hidden';
  }
  if (projectsConfig.featured.includes(repoName)) {
    return 'featured';
  }
  if (projectsConfig.archived.includes(repoName)) {
    return 'archived';
  }
  return 'other';
}

/**
 * Helper function to get project order
 * Returns -1 if not in featured list
 */
export function getFeaturedOrder(repoName) {
  return projectsConfig.featured.indexOf(repoName);
}

/**
 * Helper function to check if project should be highlighted
 */
export function isHighlighted(repoName) {
  return projectsConfig.overrides[repoName]?.highlight || false;
}

/**
 * Helper function to get custom metadata
 */
export function getProjectOverride(repoName) {
  return projectsConfig.overrides[repoName] || null;
}
