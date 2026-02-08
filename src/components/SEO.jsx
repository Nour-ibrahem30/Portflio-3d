import { useEffect } from 'react';

export default function SEO({
  title = 'Nour Ibrahem Mohamed - Front-End Developer',
  description = 'Front-End Developer passionate about building clean, responsive, and user-friendly web interfaces. Skilled in HTML5, CSS3, JavaScript (ES6+), SCSS, and React.',
  image = '/og-image.jpg',
  url = 'https://nour-ibrahem.com',
  type = 'website'
}) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`) ||
                   document.querySelector(`meta[name="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    
    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Additional SEO tags
    updateMetaTag('author', 'Nour Ibrahem Mohamed');
    updateMetaTag('keywords', 'Front-End Developer, React, JavaScript, HTML5, CSS3, SCSS, TypeScript, Web Development, Portfolio, Nour Ibrahem, Cairo Egypt');
  }, [title, description, image, url, type]);

  return null;
}
