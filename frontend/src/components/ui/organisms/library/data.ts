import type { Resource } from './ResourceCard';

/**
 * Library Articles Data
 * Shared data used across ArticlesSection and ResourcesTabsCard components
 */
export const libraryArticlesData: Resource[] = [
  {
    id: '1',
    title: 'Heart Health Essentials',
    description: 'Learn the fundamentals of maintaining a healthy heart through proper diet, exercise, and stress management techniques.',
    imageUrl: '/assets/library/1.jpeg',
    dateLabel: 'Today',
    category: 'Cardiology',
    isSaved: false,
    type: 'article',
    url: 'https://www.heart.org/en/healthy-living/healthy-lifestyle/lifes-essential-8',
  },
  {
    id: '2',
    title: 'Fitness for Beginners',
    description: 'A comprehensive guide to starting your fitness journey with beginner-friendly exercises and workout plans.',
    imageUrl: '/assets/library/2.jpeg',
    dateLabel: 'Yesterday',
    category: 'Exercise',
    isSaved: true,
    type: 'article',
    url: 'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/fitness/art-20048269',
  },
  {
    id: '3',
    title: 'Nutrition and Wellness',
    description: 'Discover the best foods and nutrition tips to boost your energy and improve overall wellness and health.',
    imageUrl: '/assets/library/3.jpeg',
    dateLabel: '2 days ago',
    category: 'Nutrition',
    isSaved: true,
    type: 'article',
    url: 'https://www.hsph.harvard.edu/nutritionsource/healthy-eating-plate/',
  },
  {
    id: '4',
    title: 'Mental Health Guide',
    description: 'Understanding mental health, stress management, and techniques for maintaining psychological well-being.',
    imageUrl: '/assets/library/4.jpeg',
    dateLabel: '3 days ago',
    category: 'Mental Health',
    isSaved: false,
    type: 'article',
    url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
  },
];
