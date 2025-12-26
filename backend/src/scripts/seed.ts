import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resource from '../models/Resource.model';
import Provider from '../models/Provider.model';
import CommunityPost from '../models/CommunityPost.model';
import CommunityComment from '../models/CommunityComment.model';
import User from '../models/User.model';
import Reminder from '../models/Reminder.model';
import VitalSigns from '../models/Vitals.model';
import FitnessActivity from '../models/Fitness.model';

dotenv.config();

const seedResources = [
  // 8 Articles with images from assets/library
  {
    type: 'article',
    title: 'Understanding Heart Health: A Comprehensive Guide',
    description:
      'Learn about maintaining a healthy heart through diet, exercise, and lifestyle changes. This guide covers everything from cholesterol management to stress reduction techniques that can help prevent cardiovascular disease.',
    url: 'https://example.com/heart-health-guide',
    imageUrl: '/assets/library/1.jpeg',
    category: 'Cardiovascular Health',
    tags: ['heart', 'cardiovascular', 'prevention', 'diet', 'exercise'],
    author: 'Dr. Sarah Johnson',
    publishedDate: new Date('2025-12-03'),
  },
  {
    type: 'article',
    title: 'Fitness for Beginners: Your Complete Guide',
    description:
      'A comprehensive guide to starting your fitness journey with beginner-friendly exercises and workout plans. Learn proper form, create sustainable habits, and build a foundation for long-term health.',
    url: 'https://example.com/fitness-beginners',
    imageUrl: '/assets/library/2.jpeg',
    category: 'Fitness',
    tags: ['fitness', 'beginner', 'workout', 'exercise', 'health'],
    author: 'Coach Mike Thompson',
    publishedDate: new Date('2025-12-02'),
  },
  {
    type: 'article',
    title: 'Nutrition and Wellness: Eating for Energy',
    description:
      'Discover the best foods and nutrition tips to boost your energy and improve overall wellness. Learn about macronutrients, meal timing, and how to fuel your body for optimal performance.',
    url: 'https://example.com/nutrition-wellness',
    imageUrl: '/assets/library/3.jpeg',
    category: 'Nutrition',
    tags: ['nutrition', 'diet', 'wellness', 'healthy-eating', 'energy'],
    author: 'Nutritionist Emily Chen',
    publishedDate: new Date('2025-12-01'),
  },
  {
    type: 'article',
    title: 'Mental Health Guide: Finding Your Balance',
    description:
      'Understanding mental health, stress management, and techniques for maintaining psychological well-being. Explore mindfulness, therapy options, and daily practices for a healthier mind.',
    url: 'https://example.com/mental-health-guide',
    imageUrl: '/assets/library/4.jpeg',
    category: 'Mental Health',
    tags: ['mental-health', 'wellness', 'stress-management', 'mindfulness', 'balance'],
    author: 'Dr. Jennifer Taylor',
    publishedDate: new Date('2025-11-30'),
  },
  {
    type: 'article',
    title: 'Sleep and Recovery: The Ultimate Guide',
    description:
      'Improve sleep quality with evidence-based tips and create a healthy sleep schedule for better rest. Learn about sleep hygiene, the science of sleep cycles, and how to wake up refreshed.',
    url: 'https://example.com/sleep-recovery',
    imageUrl: '/assets/library/5.jpeg',
    category: 'Sleep Health',
    tags: ['sleep', 'rest', 'recovery', 'health', 'wellness'],
    author: 'Sleep Science Institute',
    publishedDate: new Date('2025-11-29'),
  },
  {
    type: 'article',
    title: 'Healthy Aging: Tips for Vitality',
    description:
      'A guide to maintaining vitality and health as you age with proper lifestyle and preventive care. Discover exercise routines, dietary choices, and habits that promote longevity.',
    url: 'https://example.com/healthy-aging',
    imageUrl: '/assets/library/6.jpeg',
    category: 'Wellness',
    tags: ['aging', 'longevity', 'vitality', 'prevention', 'health'],
    author: 'Dr. Robert Williams',
    publishedDate: new Date('2025-11-28'),
  },
  {
    type: 'article',
    title: 'Chronic Disease Management Strategies',
    description:
      'Learn how to effectively manage chronic conditions through lifestyle changes, medication adherence, and regular monitoring. This guide helps you take control of your health journey.',
    url: 'https://example.com/chronic-disease',
    imageUrl: '/assets/library/7.jpeg',
    category: 'Health Management',
    tags: ['chronic-disease', 'management', 'lifestyle', 'health', 'prevention'],
    author: 'Dr. David Martinez',
    publishedDate: new Date('2025-11-27'),
  },
  {
    type: 'article',
    title: 'Immune System Boost: Natural Defense',
    description:
      'Strengthen your immune system naturally with proper nutrition, exercise, and healthy lifestyle habits. Discover foods, supplements, and practices that support your body\'s natural defenses.',
    url: 'https://example.com/immune-boost',
    imageUrl: '/assets/library/8.jpeg',
    category: 'Immunity',
    tags: ['immune-system', 'health', 'nutrition', 'prevention', 'wellness'],
    author: 'Dr. Amanda Foster',
    publishedDate: new Date('2025-11-26'),
  },
  
  // 8 Videos (no images needed)
  {
    type: 'video',
    title: '30-Minute Full Body Workout for Beginners',
    description:
      'A complete beginner-friendly workout routine that requires no equipment. Perfect for starting your fitness journey at home with guided exercises and modifications for all fitness levels.',
    url: 'https://example.com/beginner-workout',
    category: 'Fitness',
    tags: ['workout', 'fitness', 'beginner', 'home-exercise', 'full-body'],
    author: 'FitLife Channel',
    publishedDate: new Date('2025-12-03'),
    duration: 30,
  },
  {
    type: 'video',
    title: 'Sleep Better: 10 Science-Backed Tips',
    description:
      'Learn evidence-based strategies to improve your sleep quality and establish healthy sleep habits. This video covers sleep hygiene, bedtime routines, and environment optimization.',
    url: 'https://example.com/sleep-tips-video',
    category: 'Sleep Health',
    tags: ['sleep', 'health', 'rest', 'tips', 'science'],
    author: 'Sleep Science Institute',
    publishedDate: new Date('2025-12-02'),
    duration: 15,
  },
  {
    type: 'video',
    title: 'Yoga for Stress Relief: 20-Minute Flow',
    description:
      'A calming yoga sequence designed to reduce stress and promote relaxation. Perfect for beginners and experienced practitioners looking to unwind after a long day.',
    url: 'https://example.com/yoga-stress-relief',
    category: 'Mental Health',
    tags: ['yoga', 'stress-relief', 'relaxation', 'mindfulness', 'wellness'],
    author: 'Zen Yoga Studio',
    publishedDate: new Date('2025-12-01'),
    duration: 20,
  },
  {
    type: 'video',
    title: 'Healthy Meal Prep: Weekly Guide',
    description:
      'Learn how to prepare a week\'s worth of healthy meals in just a few hours. Includes shopping tips, storage advice, and delicious recipes for busy professionals.',
    url: 'https://example.com/meal-prep-guide',
    category: 'Nutrition',
    tags: ['meal-prep', 'nutrition', 'cooking', 'healthy-eating', 'planning'],
    author: 'Clean Eating Kitchen',
    publishedDate: new Date('2025-11-30'),
    duration: 25,
  },
  {
    type: 'video',
    title: 'HIIT Cardio Blast: 15-Minute Fat Burner',
    description:
      'High-intensity interval training session designed to maximize calorie burn in minimal time. No equipment needed, suitable for intermediate fitness levels.',
    url: 'https://example.com/hiit-cardio',
    category: 'Fitness',
    tags: ['hiit', 'cardio', 'workout', 'fat-burn', 'exercise'],
    author: 'FitLife Channel',
    publishedDate: new Date('2025-11-29'),
    duration: 15,
  },
  {
    type: 'video',
    title: 'Understanding Blood Pressure: What You Need to Know',
    description:
      'A comprehensive overview of blood pressure, including how to measure it correctly, what the numbers mean, and lifestyle changes to maintain healthy levels.',
    url: 'https://example.com/blood-pressure-explained',
    category: 'Cardiovascular Health',
    tags: ['blood-pressure', 'heart-health', 'education', 'vitals', 'prevention'],
    author: 'Heart Health Network',
    publishedDate: new Date('2025-11-28'),
    duration: 18,
  },
  {
    type: 'video',
    title: 'Meditation for Beginners: First Steps',
    description:
      'Start your meditation practice with this beginner-friendly guide. Learn breathing techniques, posture tips, and simple exercises to calm your mind.',
    url: 'https://example.com/meditation-beginners',
    category: 'Mental Health',
    tags: ['meditation', 'mindfulness', 'beginner', 'relaxation', 'mental-health'],
    author: 'Mindful Living',
    publishedDate: new Date('2025-11-27'),
    duration: 12,
  },
  {
    type: 'video',
    title: 'Strength Training Fundamentals',
    description:
      'Master the basics of strength training with proper form demonstrations and progressive workout plans. Build muscle, increase strength, and improve overall fitness.',
    url: 'https://example.com/strength-training',
    category: 'Fitness',
    tags: ['strength-training', 'muscle', 'workout', 'fitness', 'exercise'],
    author: 'Gym Warriors',
    publishedDate: new Date('2025-11-26'),
    duration: 35,
  },
  
  // 8 Podcasts (no images needed)
  {
    type: 'podcast',
    title: 'Mental Wellness in the Modern Age',
    description:
      'Discussing strategies for maintaining mental health, managing stress, and building resilience in today\'s fast-paced world. Expert insights and practical tips for everyday life.',
    url: 'https://example.com/mental-wellness-podcast',
    category: 'Mental Health',
    tags: ['mental-health', 'wellness', 'stress-management', 'mindfulness', 'modern-life'],
    author: 'Wellness Matters Podcast',
    publishedDate: new Date('2025-12-03'),
    duration: 45,
  },
  {
    type: 'podcast',
    title: 'The Science of Nutrition',
    description:
      'Deep dive into nutritional science with leading researchers and dietitians. Learn about the latest studies on diet, metabolism, and how food affects your health.',
    url: 'https://example.com/nutrition-science-podcast',
    category: 'Nutrition',
    tags: ['nutrition', 'science', 'diet', 'health', 'research'],
    author: 'Health Talk Radio',
    publishedDate: new Date('2025-12-02'),
    duration: 52,
  },
  {
    type: 'podcast',
    title: 'Fitness Motivation: Staying on Track',
    description:
      'Real stories from people who transformed their lives through fitness. Learn their secrets to staying motivated and overcoming obstacles on the journey to health.',
    url: 'https://example.com/fitness-motivation-podcast',
    category: 'Fitness',
    tags: ['fitness', 'motivation', 'inspiration', 'transformation', 'health'],
    author: 'The Fitness Show',
    publishedDate: new Date('2025-12-01'),
    duration: 38,
  },
  {
    type: 'podcast',
    title: 'Sleep Science: Understanding Your Rest',
    description:
      'Exploring the fascinating science of sleep with sleep researchers and doctors. Discover why we sleep, how to improve sleep quality, and the impact on overall health.',
    url: 'https://example.com/sleep-science-podcast',
    category: 'Sleep Health',
    tags: ['sleep', 'science', 'rest', 'health', 'research'],
    author: 'Night Owl Podcast',
    publishedDate: new Date('2025-11-30'),
    duration: 48,
  },
  {
    type: 'podcast',
    title: 'Heart Health Conversations',
    description:
      'Cardiologists and heart health experts discuss prevention, treatment, and the latest advances in cardiovascular medicine. Essential listening for heart-conscious individuals.',
    url: 'https://example.com/heart-health-podcast',
    category: 'Cardiovascular Health',
    tags: ['heart', 'cardiovascular', 'health', 'prevention', 'medicine'],
    author: 'Heart Health Today',
    publishedDate: new Date('2025-11-29'),
    duration: 55,
  },
  {
    type: 'podcast',
    title: 'Mindfulness Daily',
    description:
      'Short daily episodes with guided mindfulness exercises and meditation practices. Perfect for busy people looking to incorporate mindfulness into their routine.',
    url: 'https://example.com/mindfulness-daily-podcast',
    category: 'Mental Health',
    tags: ['mindfulness', 'meditation', 'daily', 'wellness', 'mental-health'],
    author: 'Calm Mind Studios',
    publishedDate: new Date('2025-11-28'),
    duration: 15,
  },
  {
    type: 'podcast',
    title: 'The Longevity Project',
    description:
      'Exploring the science of aging and longevity with researchers studying how to live longer, healthier lives. Learn about diet, exercise, and lifestyle factors that matter.',
    url: 'https://example.com/longevity-podcast',
    category: 'Wellness',
    tags: ['longevity', 'aging', 'health', 'science', 'lifestyle'],
    author: 'Age Well Network',
    publishedDate: new Date('2025-11-27'),
    duration: 60,
  },
  {
    type: 'podcast',
    title: 'Diabetes Management Stories',
    description:
      'Real people share their experiences managing diabetes, with expert advice from endocrinologists and nutritionists. Practical tips and emotional support for the diabetes community.',
    url: 'https://example.com/diabetes-podcast',
    category: 'Health Management',
    tags: ['diabetes', 'management', 'health', 'community', 'support'],
    author: 'Living Well with Diabetes',
    publishedDate: new Date('2025-11-26'),
    duration: 42,
  },
];

const seedProviders = [
  {
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    description: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology and heart failure management.',
    location: {
      address: '123 Medical Plaza',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    phone: '(212) 555-0101',
    email: 'dr.johnson@healthpulse.com',
    acceptsInsurance: ['Blue Cross', 'Aetna', 'United Healthcare', 'Cigna'],
    rating: 4.8,
    reviewCount: 156,
    availability: [
      { day: 'Monday', slots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '11:00 AM', '02:00 PM'] },
      { day: 'Friday', slots: ['09:00 AM', '10:00 AM', '01:00 PM'] },
    ],
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'General Practitioner',
    description: 'Dr. Michael Chen is a compassionate family physician dedicated to providing comprehensive primary care for patients of all ages. He focuses on preventive medicine and chronic disease management.',
    location: {
      address: '456 Health Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    phone: '(310) 555-0202',
    email: 'dr.chen@healthpulse.com',
    acceptsInsurance: ['Kaiser Permanente', 'Blue Shield', 'United Healthcare'],
    rating: 4.9,
    reviewCount: 203,
    availability: [
      { day: 'Monday', slots: ['08:00 AM', '09:00 AM', '02:00 PM', '04:00 PM'] },
      { day: 'Tuesday', slots: ['09:00 AM', '10:00 AM', '03:00 PM'] },
      { day: 'Thursday', slots: ['08:00 AM', '11:00 AM', '02:00 PM'] },
    ],
  },
  {
    name: 'Dr. Emily Rodriguez',
    specialty: 'Endocrinology',
    description: 'Dr. Emily Rodriguez specializes in diabetes management and thyroid disorders. She takes a holistic approach to endocrine health, combining medication management with lifestyle modifications.',
    location: {
      address: '789 Wellness Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    phone: '(312) 555-0303',
    email: 'dr.rodriguez@healthpulse.com',
    acceptsInsurance: ['Humana', 'Aetna', 'Blue Cross Blue Shield'],
    rating: 4.7,
    reviewCount: 128,
    availability: [
      { day: 'Tuesday', slots: ['09:00 AM', '10:00 AM', '01:00 PM'] },
      { day: 'Wednesday', slots: ['08:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Friday', slots: ['09:00 AM', '11:00 AM'] },
    ],
  },
  {
    name: 'Dr. James Thompson',
    specialty: 'Neurology',
    description: 'Dr. James Thompson is an expert in treating neurological conditions including migraines, epilepsy, and movement disorders. He utilizes the latest diagnostic techniques and treatments.',
    location: {
      address: '321 Brain Health Center',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'USA',
    },
    phone: '(617) 555-0404',
    email: 'dr.thompson@healthpulse.com',
    acceptsInsurance: ['Tufts Health Plan', 'Harvard Pilgrim', 'Blue Cross'],
    rating: 4.6,
    reviewCount: 142,
    availability: [
      { day: 'Monday', slots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '01:00 PM', '04:00 PM'] },
      { day: 'Thursday', slots: ['10:00 AM', '02:00 PM'] },
    ],
  },
  {
    name: 'Dr. Lisa Park',
    specialty: 'Dermatology',
    description: 'Dr. Lisa Park provides comprehensive dermatological care for conditions ranging from acne to skin cancer. She is known for her patient-centered approach and expertise in cosmetic dermatology.',
    location: {
      address: '654 Skin Care Center',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
    },
    phone: '(713) 555-0505',
    email: 'dr.park@healthpulse.com',
    acceptsInsurance: ['United Healthcare', 'Cigna', 'Aetna', 'Humana'],
    rating: 4.9,
    reviewCount: 187,
    availability: [
      { day: 'Monday', slots: ['08:00 AM', '09:00 AM', '01:00 PM'] },
      { day: 'Tuesday', slots: ['10:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Friday', slots: ['08:00 AM', '11:00 AM', '02:00 PM'] },
    ],
  },
  {
    name: 'Dr. Robert Williams',
    specialty: 'Orthopedics',
    description: 'Dr. Robert Williams specializes in sports medicine and joint replacement surgery. He has helped numerous athletes recover from injuries and return to peak performance.',
    location: {
      address: '987 Sports Medicine Lane',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA',
    },
    phone: '(303) 555-0606',
    email: 'dr.williams@healthpulse.com',
    acceptsInsurance: ['Blue Cross', 'Aetna', 'United Healthcare'],
    rating: 4.8,
    reviewCount: 165,
    availability: [
      { day: 'Monday', slots: ['09:00 AM', '10:00 AM', '02:00 PM'] },
      { day: 'Wednesday', slots: ['08:00 AM', '11:00 AM', '03:00 PM'] },
      { day: 'Thursday', slots: ['09:00 AM', '01:00 PM', '04:00 PM'] },
    ],
  },
  {
    name: 'Dr. Jennifer Taylor',
    specialty: 'Psychiatry',
    description: 'Dr. Jennifer Taylor is a compassionate psychiatrist specializing in anxiety, depression, and stress management. She combines medication management with therapeutic approaches for comprehensive mental health care.',
    location: {
      address: '321 Mental Health Center',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
    },
    phone: '(206) 555-0707',
    email: 'dr.taylor@healthpulse.com',
    acceptsInsurance: ['Premera Blue Cross', 'Regence', 'United Healthcare'],
    rating: 4.9,
    reviewCount: 198,
    availability: [
      { day: 'Tuesday', slots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '01:00 PM', '04:00 PM'] },
      { day: 'Friday', slots: ['10:00 AM', '02:00 PM'] },
    ],
  },
  {
    name: 'Dr. David Martinez',
    specialty: 'Gastroenterology',
    description: 'Dr. David Martinez is an experienced gastroenterologist specializing in digestive disorders, liver diseases, and endoscopic procedures. He is committed to providing personalized care for complex GI conditions.',
    location: {
      address: '555 Digestive Health Center',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA',
    },
    phone: '(305) 555-0808',
    email: 'dr.martinez@healthpulse.com',
    acceptsInsurance: ['Florida Blue', 'Aetna', 'Cigna', 'Humana'],
    rating: 4.7,
    reviewCount: 134,
    availability: [
      { day: 'Monday', slots: ['08:00 AM', '09:00 AM', '02:00 PM'] },
      { day: 'Tuesday', slots: ['10:00 AM', '11:00 AM', '03:00 PM'] },
      { day: 'Thursday', slots: ['09:00 AM', '01:00 PM'] },
    ],
  },
  {
    name: 'Dr. Amanda Foster',
    specialty: 'Pediatrics',
    description: 'Dr. Amanda Foster is a caring pediatrician dedicated to the health and well-being of children from infancy through adolescence. She emphasizes preventive care and developmental milestones.',
    location: {
      address: '888 Children\'s Health Plaza',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA',
    },
    phone: '(602) 555-0909',
    email: 'dr.foster@healthpulse.com',
    acceptsInsurance: ['Blue Cross Blue Shield', 'United Healthcare', 'Cigna'],
    rating: 4.9,
    reviewCount: 221,
    availability: [
      { day: 'Monday', slots: ['08:00 AM', '09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'] },
      { day: 'Friday', slots: ['08:00 AM', '09:00 AM', '01:00 PM'] },
    ],
  },
  {
    name: 'Dr. Kevin Wilson',
    specialty: 'Pulmonology',
    description: 'Dr. Kevin Wilson is a pulmonologist specializing in respiratory diseases, sleep disorders, and critical care medicine. He is known for his expertise in treating asthma, COPD, and lung infections.',
    location: {
      address: '777 Respiratory Care Center',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301',
      country: 'USA',
    },
    phone: '(404) 555-1010',
    email: 'dr.wilson@healthpulse.com',
    acceptsInsurance: ['Anthem', 'Blue Cross Blue Shield', 'Aetna'],
    rating: 4.6,
    reviewCount: 112,
    availability: [
      { day: 'Tuesday', slots: ['09:00 AM', '10:00 AM', '02:00 PM'] },
      { day: 'Wednesday', slots: ['08:00 AM', '11:00 AM', '03:00 PM'] },
      { day: 'Friday', slots: ['09:00 AM', '10:00 AM', '01:00 PM'] },
    ],
  },
];

// Seed reminders function - will be called after users are created
const createSeedReminders = (userId: mongoose.Types.ObjectId) => [
  {
    userId,
    name: 'Morning Medication',
    description: 'Take your blood pressure medication with breakfast',
    time: '08:00',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'medication',
  },
  {
    userId,
    name: 'Blood Pressure Check',
    description: 'Record your morning blood pressure reading',
    time: '09:00',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'vitals',
  },
  {
    userId,
    name: 'Evening Walk',
    description: 'Take a 30-minute walk around the neighborhood',
    time: '18:00',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'exercise',
  },
  {
    userId,
    name: 'Dr. Smith Appointment',
    description: 'Quarterly checkup with Dr. Sarah Johnson',
    time: '10:00',
    frequency: 'once',
    pushNotification: true,
    isActive: true,
    category: 'appointment',
  },
  {
    userId,
    name: 'Drink Water',
    description: 'Stay hydrated - drink a glass of water',
    time: '12:00',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'water',
  },
  {
    userId,
    name: 'Evening Medication',
    description: 'Take your evening supplements',
    time: '20:00',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'medication',
  },
];

// Helper function to get date X days ago from reference date (Dec 5, 2025)
const getDateDaysAgo = (daysAgo: number): Date => {
  const referenceDate = new Date('2025-12-05T10:00:00');
  const date = new Date(referenceDate);
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// Generate 30 days of vitals data for Sahaji user
const createSahajiVitals = (userId: mongoose.Types.ObjectId) => {
  const vitalsData = [];
  const notes = [
    'Feeling great today!',
    'Morning reading after coffee',
    'Relaxed morning',
    'Slight headache in morning',
    'After morning walk',
    'Feeling energetic',
    'Good sleep last night',
    'After workout',
    'Stressed from work',
    'Calm and relaxed',
    'Post meditation reading',
    'Feeling a bit tired',
    'After healthy breakfast',
    'Good hydration today',
    'Feeling strong',
    'Light exercise day',
    'Well rested',
    'Busy day ahead',
    'Feeling refreshed',
    'Post yoga session',
    'Steady energy levels',
    'Feeling balanced',
    'Morning jog completed',
    'Calm start to day',
    'Productive mood',
    'Healthy eating day',
    'Good recovery',
    'Feeling motivated',
    'Rest day vitals',
    'Starting the week strong',
  ];
  
  for (let i = 0; i < 30; i++) {
    // Generate realistic varying vitals with slight trends
    const dayVariation = Math.sin(i * 0.3) * 3; // Creates natural wave pattern
    const systolic = Math.round(118 + dayVariation + Math.floor(Math.random() * 10)); // 115-130
    const diastolic = Math.round(75 + dayVariation * 0.5 + Math.floor(Math.random() * 8)); // 72-85
    const heartRate = Math.round(70 + dayVariation + Math.floor(Math.random() * 12)); // 65-85
    const weight = 73.5 + Math.sin(i * 0.2) * 0.5 + (Math.random() * 0.6 - 0.3); // Gradual fluctuation
    const temperature = 36.5 + Math.random() * 0.4; // 36.5-36.9
    const bloodSugar = Math.round(92 + dayVariation * 2 + Math.floor(Math.random() * 15)); // 85-115
    const oxygenSaturation = 97 + Math.floor(Math.random() * 3); // 97-100

    vitalsData.push({
      userId,
      bloodPressureSystolic: systolic,
      bloodPressureDiastolic: diastolic,
      heartRate,
      weight: parseFloat(weight.toFixed(1)),
      temperature: parseFloat(temperature.toFixed(1)),
      bloodSugar,
      oxygenSaturation,
      notes: i < notes.length ? notes[i] : '',
      date: getDateDaysAgo(i),
      isAbnormal: false,
    });
  }
  return vitalsData;
};

// Generate 30 days of fitness activities for Sahaji user
const createSahajiFitnessActivities = (userId: mongoose.Types.ObjectId) => {
  const activityTypes: Array<'running' | 'cycling' | 'gym' | 'swimming' | 'walking' | 'yoga' | 'other'> = [
    'running', 'cycling', 'gym', 'walking', 'yoga', 'swimming'
  ];
  const intensities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
  
  const activityNotes: Record<string, string[]> = {
    running: ['Morning run in the park', 'Evening jog around neighborhood', 'Trail running session', 'Interval training run', '5K practice run'],
    cycling: ['Cycling through city', 'Mountain bike trail', 'Stationary bike workout', 'Leisurely bike ride', 'Cycling with friends'],
    gym: ['Upper body workout', 'Leg day at gym', 'Full body strength training', 'Cardio and weights combo', 'Core focused session'],
    walking: ['Morning walk with dog', 'Evening stroll', 'Brisk walk during lunch', 'Nature walk in park', 'Walking meditation'],
    yoga: ['Morning yoga flow', 'Power yoga session', 'Relaxing evening yoga', 'Yoga for flexibility', 'Sunrise yoga practice'],
    swimming: ['Lap swimming', 'Pool workout', 'Swimming for cardio', 'Relaxing swim session', 'Aqua aerobics'],
  };
  
  // Rest days - more realistic pattern (rest every 3-4 days)
  const restDays = [2, 5, 9, 12, 16, 19, 23, 26];
  
  const fitnessData = [];
  for (let i = 0; i < 30; i++) {
    // Skip rest days
    if (restDays.includes(i)) {
      continue;
    }
    
    const type = activityTypes[i % activityTypes.length];
    const intensityIndex = i % 7 < 2 ? 2 : i % 7 < 5 ? 1 : 0; // Vary intensity through week
    const intensity = intensities[intensityIndex];
    const baseDuration = intensity === 'high' ? 45 : intensity === 'medium' ? 35 : 25;
    const duration = baseDuration + Math.floor(Math.random() * 20); // Add some variation
    const caloriesBurned = Math.floor(duration * (intensity === 'high' ? 12 : intensity === 'medium' ? 8 : 5));
    const distance = type === 'running' || type === 'cycling' || type === 'walking' || type === 'swimming'
      ? parseFloat((duration / (type === 'cycling' ? 3 : type === 'swimming' ? 15 : 8)).toFixed(2))
      : undefined;

    const typeNotes = activityNotes[type] || ['Great workout'];
    const noteIndex = Math.floor(i / 6) % typeNotes.length;

    fitnessData.push({
      userId,
      type,
      duration,
      distance,
      caloriesBurned,
      intensity,
      notes: typeNotes[noteIndex],
      date: getDateDaysAgo(i),
      goals: {
        targetDuration: 45,
        targetCalories: 400,
      },
    });
  }
  return fitnessData;
};

// Generate reminders for Sahaji user
const createSahajiReminders = (userId: mongoose.Types.ObjectId) => [
  {
    userId,
    name: 'Morning Vitamins',
    description: 'Take multivitamin and vitamin D supplements',
    time: '08:30',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'medication',
  },
  {
    userId,
    name: 'Morning Blood Pressure',
    description: 'Check and record morning blood pressure',
    time: '09:00',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'vitals',
  },
  {
    userId,
    name: 'Workout Time',
    description: 'Time for daily exercise - running or gym',
    time: '06:30',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'exercise',
  },
  {
    userId,
    name: 'Hydration Reminder',
    description: 'Drink at least 2 glasses of water',
    time: '11:00',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'water',
  },
  {
    userId,
    name: 'Afternoon Hydration',
    description: 'Stay hydrated - drink water',
    time: '15:00',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'water',
  },
  {
    userId,
    name: 'Evening Walk',
    description: 'Take a 20-30 minute evening walk',
    time: '18:30',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'exercise',
  },
  {
    userId,
    name: 'Log Daily Vitals',
    description: 'Record evening weight and heart rate',
    time: '21:00',
    frequency: 'daily',
    pushNotification: true,
    isActive: true,
    category: 'vitals',
  },
  {
    userId,
    name: 'Dr. Chen Checkup',
    description: 'Quarterly health checkup with Dr. Michael Chen',
    time: '10:00',
    frequency: 'once',
    pushNotification: true,
    isActive: true,
    category: 'appointment',
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    // amazonq-ignore-next-line
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data including users
    await Resource.deleteMany({});
    await Provider.deleteMany({});
    await CommunityPost.deleteMany({});
    await CommunityComment.deleteMany({});
    await Reminder.deleteMany({});
    await VitalSigns.deleteMany({});
    await FitnessActivity.deleteMany({});
    // await User.deleteMany({});
    console.log('Cleared existing data (including all users)');

    // Insert resources
    await Resource.insertMany(seedResources);
    console.log(`Inserted ${seedResources.length} resources`);

    // Insert providers
    await Provider.insertMany(seedProviders);
    console.log(`Inserted ${seedProviders.length} providers`);

    // Create or find seed users for community posts
    const seedUsers = [
      { email: 'elmer@example.com', firstName: 'Elmer', lastName: 'Smith', password: 'password123' },
      { email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Johnson', password: 'password123' },
      { email: 'michael@example.com', firstName: 'Michael', lastName: 'Brown', password: 'password123' },
      { email: 'jane@example.com', firstName: 'Jane', lastName: 'Williams', password: 'password123' },
      { email: 'john@example.com', firstName: 'John', lastName: 'Davis', password: 'password123' },
    ];

    const userIds: mongoose.Types.ObjectId[] = [];
    for (const userData of seedUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        // Don't hash password manually - User model pre-save hook handles it
        user = await User.create({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
      }
      userIds.push(user._id as mongoose.Types.ObjectId);
    }
    console.log(`Created/found ${userIds.length} seed users for community`);

    // Create Sahaji user with full profile data
    let sahajiUser = await User.findOne({ email: 'sahaji@gmail.com' });
    if (!sahajiUser) {
      // Don't hash password manually - User model pre-save hook handles it
      sahajiUser = await User.create({
        email: 'sahaji@gmail.com',
        password: 'Mataji77',
        firstName: 'Sahaji',
        lastName: 'Chaurasia',
        gender: 'male',
        bloodGroup: 'B+',
        height: 72, // cm
        weight: 74, // kg
        dateOfBirth: new Date('2002-01-15'), // Age 23
        medicalConditions: ['fit and fine'],
      });
      console.log('Created Sahaji user with full profile');
    }
    const sahajiUserId = sahajiUser._id as mongoose.Types.ObjectId;

    // Seed vitals for Sahaji user (30 days of data)
    const sahajiVitals = createSahajiVitals(sahajiUserId);
    await VitalSigns.insertMany(sahajiVitals);
    console.log(`Inserted ${sahajiVitals.length} vitals records for Sahaji user (30 days)`);

    // Seed fitness activities for Sahaji user (22 activities over 30 days with rest days)
    const sahajiFitness = createSahajiFitnessActivities(sahajiUserId);
    await FitnessActivity.insertMany(sahajiFitness);
    console.log(`Inserted ${sahajiFitness.length} fitness activities for Sahaji user (30 days)`);

    // Seed vitals for first seed user (15 days of data for variety)
    const user1Vitals = [];
    for (let i = 0; i < 15; i++) {
      user1Vitals.push({
        userId: userIds[0],
        bloodPressureSystolic: 120 + Math.floor(Math.random() * 15),
        bloodPressureDiastolic: 78 + Math.floor(Math.random() * 8),
        heartRate: 72 + Math.floor(Math.random() * 10),
        weight: parseFloat((68 + Math.random() * 2).toFixed(1)),
        temperature: parseFloat((36.5 + Math.random() * 0.4).toFixed(1)),
        bloodSugar: 90 + Math.floor(Math.random() * 20),
        oxygenSaturation: 97 + Math.floor(Math.random() * 3),
        notes: '',
        date: getDateDaysAgo(i),
        isAbnormal: false,
      });
    }
    await VitalSigns.insertMany(user1Vitals);
    console.log(`Inserted ${user1Vitals.length} vitals records for seed user`);

    // Seed reminders for Sahaji user
    const sahajiReminders = createSahajiReminders(sahajiUserId);
    await Reminder.insertMany(sahajiReminders);
    console.log(`Inserted ${sahajiReminders.length} reminders for Sahaji user`);

    // Seed reminders for first user
    const seedReminders = createSeedReminders(userIds[0]);
    await Reminder.insertMany(seedReminders);
    console.log(`Inserted ${seedReminders.length} reminders for first user`);

    // Seed community posts
    const seedPosts = [
      {
        userId: userIds[0],
        title: 'How to book an appointment?',
        content: 'I\'m new to the app and was wondering how to book an appointment with a doctor. Can anyone guide me through the process?',
        likes: 24,
        likedBy: [userIds[1], userIds[2], userIds[3]],
        commentsCount: 3,
      },
      {
        userId: userIds[1],
        title: 'Tips for managing diabetes',
        content: 'I\'ve been living with Type 2 diabetes for 5 years now. Here are some tips that have helped me maintain healthy blood sugar levels: regular exercise, balanced diet, and consistent medication schedule.',
        likes: 45,
        likedBy: [userIds[0], userIds[2], userIds[3], userIds[4]],
        commentsCount: 2,
      },
      {
        userId: userIds[2],
        title: 'Best exercises for heart health?',
        content: 'My doctor recommended I start exercising more for my heart health. What are some good exercises for beginners that are easy on the joints?',
        likes: 67,
        likedBy: [userIds[0], userIds[1], userIds[3], userIds[4]],
        commentsCount: 4,
      },
      {
        userId: userIds[3],
        title: 'Sharing my weight loss journey',
        content: 'After 6 months of consistent effort, I\'ve lost 30 pounds! The key was tracking my meals and staying active. Happy to answer any questions about my experience.',
        likes: 89,
        likedBy: [userIds[0], userIds[1], userIds[2], userIds[4]],
        commentsCount: 5,
      },
      {
        userId: userIds[4],
        title: 'Mental health resources',
        content: 'I wanted to share some great mental health resources I found in the app. The meditation podcasts and stress management articles have been really helpful for my anxiety.',
        likes: 34,
        likedBy: [userIds[0], userIds[2]],
        commentsCount: 2,
      },
      {
        userId: userIds[0],
        title: 'Sleep tracking results',
        content: 'Been using the sleep tracking feature for a month now. Interesting to see how my sleep quality improves when I avoid screens before bed. Anyone else tracking their sleep?',
        likes: 28,
        likedBy: [userIds[1], userIds[3]],
        commentsCount: 3,
      },
    ];

    const createdPosts = await CommunityPost.insertMany(seedPosts);
    console.log(`Inserted ${createdPosts.length} community posts`);

    // Seed comments for posts
    const seedComments = [
      // Comments for first post (How to book an appointment)
      {
        postId: createdPosts[0]._id,
        userId: userIds[1],
        content: 'You can go to the Providers section and search for doctors by specialty. Then click on their profile to see available slots and book!',
        likes: 5,
        likedBy: [userIds[0]],
      },
      {
        postId: createdPosts[0]._id,
        userId: userIds[2],
        content: 'The video call feature is also really convenient if you can\'t make it in person. I use it for follow-ups.',
        likes: 3,
        likedBy: [],
      },
      {
        postId: createdPosts[0]._id,
        userId: userIds[3],
        content: 'Make sure to check which insurance they accept before booking. It\'s listed on their profile.',
        likes: 8,
        likedBy: [userIds[0], userIds[1]],
      },
      // Comments for second post (Tips for managing diabetes)
      {
        postId: createdPosts[1]._id,
        userId: userIds[2],
        content: 'Great tips! I\'d add that monitoring blood sugar regularly is crucial. The vitals tracking in this app makes it so easy.',
        likes: 12,
        likedBy: [userIds[0], userIds[1]],
      },
      {
        postId: createdPosts[1]._id,
        userId: userIds[4],
        content: 'How do you stay motivated with the exercise routine? I find it hard to be consistent.',
        likes: 4,
        likedBy: [],
      },
      // Comments for third post (Best exercises for heart health)
      {
        postId: createdPosts[2]._id,
        userId: userIds[0],
        content: 'Walking is a great start! I began with 15-minute walks and gradually increased. Swimming is also excellent for low-impact cardio.',
        likes: 15,
        likedBy: [userIds[2], userIds[3]],
      },
      {
        postId: createdPosts[2]._id,
        userId: userIds[1],
        content: 'Yoga can be really good too - it\'s gentle and helps with both physical fitness and stress reduction.',
        likes: 9,
        likedBy: [userIds[2]],
      },
      {
        postId: createdPosts[2]._id,
        userId: userIds[3],
        content: 'Check out the fitness section in the library - there are some great beginner workout videos!',
        likes: 6,
        likedBy: [],
      },
      {
        postId: createdPosts[2]._id,
        userId: userIds[4],
        content: 'I\'d recommend cycling too. You can start slow and it\'s easy on the knees.',
        likes: 7,
        likedBy: [userIds[2]],
      },
      // Comments for fourth post (Weight loss journey)
      {
        postId: createdPosts[3]._id,
        userId: userIds[0],
        content: 'Congratulations! That\'s an amazing achievement. What app or method did you use to track your meals?',
        likes: 10,
        likedBy: [userIds[3]],
      },
      {
        postId: createdPosts[3]._id,
        userId: userIds[1],
        content: 'So inspiring! I\'m just starting my journey. Did you find it hard in the beginning?',
        likes: 6,
        likedBy: [],
      },
      {
        postId: createdPosts[3]._id,
        userId: userIds[2],
        content: 'The first few weeks are the hardest but it gets easier! You\'ve got this!',
        likes: 8,
        likedBy: [userIds[1]],
      },
      {
        postId: createdPosts[3]._id,
        userId: userIds[4],
        content: 'Did you follow any specific diet plan or just focused on portion control?',
        likes: 4,
        likedBy: [],
      },
      {
        postId: createdPosts[3]._id,
        userId: userIds[3],
        content: 'Thanks everyone! I mostly focused on balanced meals and avoided processed foods. The nutrition articles in the library were super helpful.',
        likes: 12,
        likedBy: [userIds[0], userIds[1], userIds[2]],
      },
      // Comments for fifth post (Mental health resources)
      {
        postId: createdPosts[4]._id,
        userId: userIds[1],
        content: 'Thanks for sharing! I\'ll check out those podcasts. Mental health is so important.',
        likes: 7,
        likedBy: [userIds[4]],
      },
      {
        postId: createdPosts[4]._id,
        userId: userIds[3],
        content: 'The mindfulness exercises have really helped me too. Glad to see others finding them useful!',
        likes: 5,
        likedBy: [],
      },
      // Comments for sixth post (Sleep tracking)
      {
        postId: createdPosts[5]._id,
        userId: userIds[2],
        content: 'Yes! I noticed the same thing. Blue light before bed really does affect sleep quality.',
        likes: 4,
        likedBy: [userIds[0]],
      },
      {
        postId: createdPosts[5]._id,
        userId: userIds[4],
        content: 'I\'ve been tracking my sleep too. Found that keeping a consistent bedtime helps a lot.',
        likes: 6,
        likedBy: [userIds[0], userIds[2]],
      },
      {
        postId: createdPosts[5]._id,
        userId: userIds[1],
        content: 'Great observation! I should try the no-screens rule. Currently average only 6 hours a night.',
        likes: 3,
        likedBy: [],
      },
    ];

    await CommunityComment.insertMany(seedComments);
    console.log(`Inserted ${seedComments.length} community comments`);

    console.log('Database seeded successfully!');
    // amazonq-ignore-next-line
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
