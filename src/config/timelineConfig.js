/**
 * Timeline Configuration
 * 
 * Links timeline experiences with actual GitHub projects
 * Each experience can have associated projects and live URLs
 */

export const timelineConfig = [
  {
    id: 'gdg-banha-2026',
    year: '2026',
    title: 'Technical Contributor',
    company: 'GDG Banha Event',
    location: 'Benha University',
    period: 'June 2026',
    description: 'Fully guided 50+ participants through the Front-End track (HTML, CSS). Assisted attendees in debugging projects and implementing responsive layouts. Explained front-end concepts and best practices in a practical environment.',
    skills: ['HTML5', 'CSS3', 'Teaching', 'Mentoring', 'Debugging'],
    type: 'event',
    projects: [],
    liveUrls: [],
    // Event photos
    eventPhotos: [
      '/GDG_Photos/1.jpeg',
      '/GDG_Photos/2.jpeg',
      '/GDG_Photos/3.jpeg',
      '/GDG_Photos/4.jpeg',
      '/GDG_Photos/5.jpeg',
      '/GDG_Photos/6 (2).jpeg',
      '/GDG_Photos/7.jpeg',
      '/GDG_Photos/7 (2).jpeg',
      '/GDG_Photos/8 (2).jpeg',
      '/GDG_Photos/9 (2).jpeg',
      '/GDG_Photos/10 (2).jpeg',
      '/GDG_Photos/11 (2).jpeg',
      '/GDG_Photos/12.jpeg',
      '/GDG_Photos/13.jpeg',
      '/GDG_Photos/14.jpeg',
      '/GDG_Photos/15.jpeg',
      '/GDG_Photos/16.jpeg',
    ].map(path => {
      const parts = path.split('/');
      const filename = parts[parts.length - 1];
      const directory = parts.slice(0, -1).join('/');
      return `${directory}/${encodeURIComponent(filename)}`;
    }),
    // Event videos
    eventVideos: [
      '/GDG_Photos/Video-1.mp4',
    ].map(path => {
      const parts = path.split('/');
      const filename = parts[parts.length - 1];
      const directory = parts.slice(0, -1).join('/');
      return `${directory}/${encodeURIComponent(filename)}`;
    }),
    stats: {
      participants: 50,
      projectsCompleted: 0,
      duration: '1 day',
    },
  },
  {
    id: 'value-marketing-2025',
    year: '2025',
    title: 'Front-End Developer',
    company: 'Value Marketing',
    location: 'Cairo, Egypt',
    period: 'Sep 2025 – Present',
    description: 'Develop and maintain responsive web interfaces using HTML, CSS, JavaScript and React. Customize and manage WordPress themes for content and layout requirements. Built 3 WordPress websites and 1 custom React application.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'WordPress'],
    type: 'work',
    // Projects from this company
    projects: [
      'intiative_Website_Value',
    ],
    liveUrls: [
      // Add live URLs when available
      // { name: 'Initiative Website', url: 'https://...' }
    ],
    stats: {
      projectsCompleted: 4, // 1 React + 3 WordPress
      duration: '5+ months',
      technologies: 5,
      wordpressSites: 3,
    },
  },
  {
    id: 'freelance-2024',
    year: '2024',
    title: 'Freelance Front-End Developer',
    company: 'Remote',
    location: 'Remote',
    period: '2024 – Present',
    description: 'Built 20+ responsive websites using semantic HTML, SCSS, JavaScript, and React. Developed interactive, user-friendly interfaces with a focus on performance and usability.',
    skills: ['HTML5', 'SCSS', 'JavaScript', 'React', 'Mobile-First'],
    type: 'work',
    // Freelance projects
    projects: [
      'Portflio-3d',
      'Kasper-Template',
      'Leon-Template',
      // Add more freelance project names
    ],
    liveUrls: [
      { name: 'Portfolio 3D', url: 'https://nour-ibrahem30.github.io/Portflio-3d/' },
      // Add more live URLs
    ],
    stats: {
      projectsCompleted: 20,
      duration: '1+ year',
      clients: 15,
    },
  },
  {
    id: 'green-studio-2025',
    year: '2025',
    title: 'Front-End Developer',
    company: 'Green Studio Project',
    location: 'Cairo, Egypt',
    period: '2025',
    description: 'Developed an elegant studio website with modern design and smooth animations. Features portfolio showcase, contact forms, and responsive layouts. Built with HTML5, CSS3, and JavaScript.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Design', 'Animations'],
    type: 'work',
    projects: [
      'Green-studio',
    ],
    liveUrls: [],
    // Project photos
    eventPhotos: [
      '/GreenStudio_Photos/1.jpeg',
      '/GreenStudio_Photos/2.jpeg',
    ].map(path => {
      const parts = path.split('/');
      const filename = parts[parts.length - 1];
      const directory = parts.slice(0, -1).join('/');
      return `${directory}/${encodeURIComponent(filename)}`;
    }),
    // Project videos
    eventVideos: [
      '/GreenStudio_Photos/Video-1.mp4',
      '/GreenStudio_Photos/Video-2.mp4',
    ].map(path => {
      const parts = path.split('/');
      const filename = parts[parts.length - 1];
      const directory = parts.slice(0, -1).join('/');
      return `${directory}/${encodeURIComponent(filename)}`;
    }),
    stats: {
      projectsCompleted: 1,
      duration: '2 months',
      technologies: 3,
    },
  },
  {
    id: 'webmaster-intern-2025',
    year: '2025',
    title: 'Front-End Development Intern',
    company: 'Web Master Company',
    location: 'Cairo, Egypt',
    period: '2025',
    description: 'Completed hands-on training in front-end development using HTML, CSS, JavaScript, and React fundamentals. Collaborated with team members to build and deliver responsive layouts. Built 4 complete projects during internship.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    type: 'internship',
    projects: [
      'jadoo',
      'Kalaly-Project',
      'VivaDecor',
      'Travel',
    ],
    liveUrls: [
      // Add live URLs when available
    ],
    stats: {
      projectsCompleted: 4,
      duration: '3 months',
      technologies: 4,
    },
  },
  {
    id: 'yly-2025',
    year: '2025',
    title: 'Core Team Member',
    company: 'Ministry of Youth and Sports (YLY Initiative)',
    location: 'Cairo, Egypt',
    period: '2025 – Present',
    description: 'Contribute to planning and executing youth-focused initiatives and events. Coordinate with team members to ensure smooth implementation and successful outcomes.',
    skills: ['Team Coordination', 'Event Planning', 'Communication'],
    type: 'volunteer',
    projects: [],
    liveUrls: [],
    // Event photos
    eventPhotos: [
      '/YLY_Photos/1.jpeg',
      '/YLY_Photos/2.jpeg',
      '/YLY_Photos/3.jpg',
      '/YLY_Photos/4.jpg',
      '/YLY_Photos/5.jpeg',
      '/YLY_Photos/6.jpg',
      '/YLY_Photos/7.jpeg',
      '/YLY_Photos/8.jpg',
    ].map(path => {
      const parts = path.split('/');
      const filename = parts[parts.length - 1];
      const directory = parts.slice(0, -1).join('/');
      return `${directory}/${encodeURIComponent(filename)}`;
    }),
    // Event videos
    eventVideos: [
      '/YLY_Photos/Video-1.mp4',
    ].map(path => {
      const parts = path.split('/');
      const filename = parts[parts.length - 1];
      const directory = parts.slice(0, -1).join('/');
      return `${directory}/${encodeURIComponent(filename)}`;
    }),
    stats: {
      eventsOrganized: 5,
      duration: '6+ months',
    },
  },
  {
    id: 'shabab-volunteer-2025',
    year: '2025',
    title: 'Volunteer Front-End Developer',
    company: 'Shabab Betesaed Shabab',
    location: 'Remote',
    period: '2025',
    description: 'Contributed to front-end development using HTML, CSS, JavaScript, TypeScript and React. Assisted in designing and improving web solutions for community initiatives. Built complete website clone for the organization.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React'],
    type: 'volunteer',
    projects: [
      'SBS-Website-Clone',
    ],
    liveUrls: [
      // Add live URL when available
    ],
    stats: {
      projectsCompleted: 1,
      duration: '4 months',
    },
  },
];

/**
 * Type colors for visual consistency
 */
export const typeColors = {
  work: 'from-blue-500 to-cyan-500',
  event: 'from-purple-500 to-pink-500',
  internship: 'from-green-500 to-emerald-500',
  volunteer: 'from-orange-500 to-yellow-500',
};

/**
 * Helper function to get timeline entry by ID
 */
export function getTimelineEntry(id) {
  return timelineConfig.find(entry => entry.id === id);
}

/**
 * Helper function to get all projects from timeline
 */
export function getAllTimelineProjects() {
  return timelineConfig.reduce((acc, entry) => {
    return [...acc, ...entry.projects];
  }, []);
}

/**
 * Helper function to find which timeline entry a project belongs to
 */
export function getProjectTimeline(projectName) {
  return timelineConfig.find(entry => 
    entry.projects.includes(projectName)
  );
}

/**
 * Helper function to get projects count by timeline entry
 */
export function getProjectsCountByEntry(entryId) {
  const entry = getTimelineEntry(entryId);
  return entry ? entry.projects.length : 0;
}
