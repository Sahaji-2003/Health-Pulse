import User from '../models/User.model';
import { generateToken } from '../utils/jwt';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age?: string | number;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  height?: string | number;
  weight?: string | number;
  medicalConditions?: string;
}

interface LoginData {
  email: string;
  password: string;
}

// amazonq-ignore-next-line
export const registerUser = async (data: RegisterData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: data.email });
  
  if (existingUser) {
    // amazonq-ignore-next-line
    // amazonq-ignore-next-line
    throw new Error('User with this email already exists');
  }

  // Process medical conditions - convert comma-separated string to array
  const medicalConditionsArray = data.medicalConditions
    ? data.medicalConditions.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0)
    : [];

  // Calculate date of birth from age if provided
  let dateOfBirth: Date | undefined;
  if (data.age) {
    const age = typeof data.age === 'string' ? parseInt(data.age, 10) : data.age;
    if (!isNaN(age) && age > 0 && age <= 120) {
      const today = new Date();
      dateOfBirth = new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
    }
  }

  // Prepare user data with all fields
  const userData = {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender || undefined,
    height: data.height ? (typeof data.height === 'string' ? parseFloat(data.height) : data.height) : undefined,
    weight: data.weight ? (typeof data.weight === 'string' ? parseFloat(data.weight) : data.weight) : undefined,
    medicalConditions: medicalConditionsArray.length > 0 ? medicalConditionsArray : undefined,
    dateOfBirth,
  };

  // Create new user
  const user = await User.create(userData);

  // Generate token
  const accessToken = generateToken({
    id: user._id.toString(),
    email: user.email,
  });

  return {
    // amazonq-ignore-next-line
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      medicalConditions: user.medicalConditions,
      dateOfBirth: user.dateOfBirth,
    },
    tokens: {
      accessToken,
    },
  };
};

export const loginUser = async (data: LoginData) => {
  // Find user with password field
  const user = await User.findOne({ email: data.email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(data.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const accessToken = generateToken({
    id: user._id.toString(),
    email: user.email,
  });

  return {
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      medicalConditions: user.medicalConditions,
      dateOfBirth: user.dateOfBirth,
    },
    tokens: {
      accessToken,
    },
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
