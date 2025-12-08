import Recommendation from '../models/Recommendation.model';
import User from '../models/User.model';

// Dummy AI-generated recommendations based on user profile
const generateRecommendationsForUser = async (userId: string) => {
  // amazonq-ignore-next-line
  // amazonq-ignore-next-line
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  // amazonq-ignore-next-line
  const recommendations: any[] = [];

  // Fitness recommendations
  recommendations.push({
    userId,
    category: 'fitness',
    priority: 'high',
    title: 'Start with 30 minutes of daily walking',
    description:
      'Walking is a great low-impact exercise that can help improve cardiovascular health and maintain a healthy weight. Start with 30 minutes daily and gradually increase.',
    source: 'ai-generated',
    conflictsWithMedicalHistory: false,
  });

  // Nutrition recommendations
  recommendations.push({
    userId,
    category: 'nutrition',
    priority: 'high',
    title: 'Increase water intake to 8 glasses daily',
    description:
      'Proper hydration is essential for overall health. Aim for at least 8 glasses (2 liters) of water per day to support bodily functions.',
    source: 'ai-generated',
    conflictsWithMedicalHistory: false,
  });

  // Sleep recommendations
  recommendations.push({
    userId,
    category: 'sleep',
    priority: 'medium',
    title: 'Establish a consistent sleep schedule',
    description:
      'Aim for 7-9 hours of sleep each night. Go to bed and wake up at the same time every day to regulate your circadian rhythm.',
    source: 'ai-generated',
    conflictsWithMedicalHistory: false,
  });

  // Mental health recommendations
  recommendations.push({
    userId,
    category: 'mental-health',
    priority: 'medium',
    title: 'Practice 10 minutes of daily meditation',
    description:
      'Regular meditation can help reduce stress, improve focus, and enhance emotional well-being. Start with just 10 minutes a day.',
    source: 'ai-generated',
    conflictsWithMedicalHistory: false,
  });

  // Check for conflicts with medical conditions
  if (user.medicalConditions && user.medicalConditions.length > 0) {
    const medicalConditionsLower = user.medicalConditions.map((c: string) =>
      c.toLowerCase()
    );

    // Check for heart conditions
    if (
      medicalConditionsLower.some((c: string) =>
        c.includes('heart') || c.includes('cardiac')
      )
    ) {
      // amazonq-ignore-next-line
      recommendations[0].conflictsWithMedicalHistory = true;
      recommendations[0].conflictDetails =
        'Please consult with your healthcare provider before starting any new exercise program due to your heart condition.';
      recommendations[0].priority = 'low';
    }

    // Check for diabetes
    if (medicalConditionsLower.some((c: string) => c.includes('diabetes'))) {
      recommendations[1].conflictsWithMedicalHistory = true;
      recommendations[1].conflictDetails =
        'Monitor blood sugar levels closely and consult with your healthcare provider about dietary changes.';
    }
  }

  // Create recommendations in database
  const createdRecommendations = await Recommendation.insertMany(recommendations);
  return createdRecommendations;
};

export const getRecommendations = async (
  userId: string,
  // amazonq-ignore-next-line
  // amazonq-ignore-next-line
  // amazonq-ignore-next-line
  // amazonq-ignore-next-line
  filters?: {
    category?: string;
    status?: string;
    priority?: string;
  }
) => {
  const query: any = { userId };

  if (filters?.category) {
    query.category = filters.category;
  }

  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.priority) {
    query.priority = filters.priority;
  }

  let recommendations: any = await Recommendation.find(query).sort({ priority: -1, createdAt: -1 });

  // If no recommendations exist, generate some
  if (recommendations.length === 0) {
    recommendations = await generateRecommendationsForUser(userId);
  }

  return recommendations;
};

export const updateRecommendationStatus = async (
  userId: string,
  recommendationId: string,
  // amazonq-ignore-next-line
  data: { status: string; progress?: number }
) => {
  const recommendation = await Recommendation.findOne({
    _id: recommendationId,
    userId,
  });

  if (!recommendation) {
    throw new Error('Recommendation not found');
  }

  recommendation.status = data.status as any;
  if (data.progress !== undefined) {
    recommendation.progress = data.progress;
  }

  await recommendation.save();
  return recommendation;
};
