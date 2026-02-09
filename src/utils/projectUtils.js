/**
 * Project Utilities
 * 
 * Helper functions for sorting, filtering, and organizing projects
 */

import { 
  categorizeProject, 
  getFeaturedOrder, 
  getProjectOverride,
  projectsConfig 
} from '../config/projectsConfig';

/**
 * Sort projects by creation date (newest first)
 */
export function sortByCreated(projects, order = 'desc') {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * Sort projects by update date
 */
export function sortByUpdated(projects, order = 'desc') {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.updated_at);
    const dateB = new Date(b.updated_at);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * Sort projects by stars
 */
export function sortByStars(projects, order = 'desc') {
  return [...projects].sort((a, b) => {
    return order === 'desc' 
      ? b.stargazers_count - a.stargazers_count 
      : a.stargazers_count - b.stargazers_count;
  });
}

/**
 * Sort projects by name
 */
export function sortByName(projects, order = 'asc') {
  return [...projects].sort((a, b) => {
    return order === 'asc' 
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });
}

/**
 * Categorize and organize all projects
 */
export function organizeProjects(projects) {
  const categorized = {
    featured: [],
    other: [],
    archived: [],
    hidden: [],
  };

  projects.forEach(project => {
    const category = categorizeProject(project.name);
    categorized[category].push(project);
  });

  // Sort featured by configured order
  categorized.featured.sort((a, b) => {
    const orderA = getFeaturedOrder(a.name);
    const orderB = getFeaturedOrder(b.name);
    return orderA - orderB;
  });

  // Sort other projects by configured method
  const sortMethod = projectsConfig.display.sortOtherBy;
  const sortOrder = projectsConfig.display.sortOrder;

  switch (sortMethod) {
    case 'created':
      categorized.other = sortByCreated(categorized.other, sortOrder);
      break;
    case 'updated':
      categorized.other = sortByUpdated(categorized.other, sortOrder);
      break;
    case 'stars':
      categorized.other = sortByStars(categorized.other, sortOrder);
      break;
    case 'name':
      categorized.other = sortByName(categorized.other, sortOrder);
      break;
    default:
      categorized.other = sortByCreated(categorized.other, sortOrder);
  }

  // Sort archived by creation date (oldest first)
  categorized.archived = sortByCreated(categorized.archived, 'asc');

  return categorized;
}

/**
 * Apply custom overrides to project data
 */
export function applyProjectOverrides(project) {
  const override = getProjectOverride(project.name);
  
  if (!override) return project;

  return {
    ...project,
    displayName: override.displayName || project.name,
    readme: override.customDescription || project.readme,
    description: override.customDescription || project.description,
    liveUrl: override.liveUrl || project.homepage,
    tags: override.tags || [],
    isHighlighted: override.highlight || false,
    isFeatured: override.featured || false,
  };
}

/**
 * Check if project is new (created within last 30 days)
 */
export function isNewProject(project) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const createdDate = new Date(project.created_at);
  return createdDate > thirtyDaysAgo;
}

/**
 * Get project age in days
 */
export function getProjectAge(project) {
  const now = new Date();
  const created = new Date(project.created_at);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format project date for display
 */
export function formatProjectDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get project statistics
 */
export function getProjectStats(projects) {
  return {
    total: projects.length,
    featured: projects.filter(p => categorizeProject(p.name) === 'featured').length,
    other: projects.filter(p => categorizeProject(p.name) === 'other').length,
    archived: projects.filter(p => categorizeProject(p.name) === 'archived').length,
    totalStars: projects.reduce((sum, p) => sum + p.stargazers_count, 0),
    totalForks: projects.reduce((sum, p) => sum + p.forks_count, 0),
    languages: [...new Set(projects.map(p => p.language).filter(Boolean))],
  };
}
