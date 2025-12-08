import User from '../models/User.model';
import bcrypt from 'bcryptjs';

export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// amazonq-ignore-next-line
export const updateUserProfile = async (userId: string, data: any) => {
  // If password change is requested, verify current password first
  if (data.currentPassword && data.newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.newPassword, salt);
    
    // Remove password fields from data and add hashed password
    delete data.currentPassword;
    delete data.newPassword;
    data.password = hashedPassword;
  } else {
    // Remove password fields if they exist but aren't complete
    delete data.currentPassword;
    delete data.newPassword;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const deleteUserAccount = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return { message: 'Account deleted successfully' };
};
