import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as userService from '../services/user.service';
import DashboardLayout, { DEFAULT_WIDGETS, IWidgetConfig } from '../models/DashboardLayout.model';
import User from '../models/User.model';
import VitalSigns from '../models/Vitals.model';
import FitnessActivity from '../models/Fitness.model';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // amazonq-ignore-next-line
    // amazonq-ignore-next-line
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await userService.getUserProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // amazonq-ignore-next-line
    const user = await userService.updateUserProfile(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    await userService.deleteUserAccount(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Dashboard Layout Controllers
export const getDashboardLayout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // Find existing layout or create default
    let layout = await DashboardLayout.findOne({ userId: req.user.id });

    if (!layout) {
      // Create default layout for user
      layout = await DashboardLayout.create({
        userId: req.user.id,
        widgets: DEFAULT_WIDGETS,
        lastModified: new Date()
      });
    }

    res.status(200).json({
      success: true,
      data: {
        widgets: layout.widgets,
        lastModified: layout.lastModified
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateDashboardLayout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { widgets } = req.body as { widgets: IWidgetConfig[] };

    if (!widgets || !Array.isArray(widgets)) {
      res.status(400).json({
        success: false,
        message: 'Invalid widgets configuration',
      });
      return;
    }

    // Update or create layout
    const layout = await DashboardLayout.findOneAndUpdate(
      { userId: req.user.id },
      {
        widgets,
        lastModified: new Date()
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Dashboard layout saved successfully',
      data: {
        widgets: layout.widgets,
        lastModified: layout.lastModified
      }
    });
  } catch (error) {
    next(error);
  }
};

export const resetDashboardLayout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // Reset to default layout
    const layout = await DashboardLayout.findOneAndUpdate(
      { userId: req.user.id },
      {
        widgets: DEFAULT_WIDGETS,
        lastModified: new Date()
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Dashboard layout reset to default',
      data: {
        widgets: layout.widgets,
        lastModified: layout.lastModified
      }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    // Construct the avatar URL
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Update user with new avatar URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatarUrl: user.avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAvatar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Delete the old avatar file if it exists
    if (user.avatarUrl) {
      const oldAvatarPath = path.join(__dirname, '../../', user.avatarUrl);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Remove avatar URL from user
    user.avatarUrl = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate and download a PDF profile report
 */
export const downloadProfilePdf = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // Fetch user data
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Fetch latest vitals (last 5 records)
    const vitals = await VitalSigns.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(5);

    // Fetch fitness activities (last 10 records)
    const fitnessActivities = await FitnessActivity.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(10);

    // Calculate fitness stats
    const totalWorkouts = fitnessActivities.length;
    const totalCalories = fitnessActivities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
    const totalDuration = fitnessActivities.reduce((sum, a) => sum + (a.duration || 0), 0);

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Set response headers
    const fileName = `health_pulse_profile_${user.firstName}_${user.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Helper function to format date
    const formatDate = (date: Date | undefined): string => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Calculate age from date of birth
    const calculateAge = (dob: Date | undefined): string => {
      if (!dob) return 'N/A';
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} years`;
    };

    // Colors
    const primaryColor = '#0D6B5B';
    const textColor = '#333333';

    // Title Section
    doc.fillColor(primaryColor)
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('Health Pulse', { align: 'center' });
    
    doc.fillColor(textColor)
       .fontSize(14)
       .font('Helvetica')
       .text('Personal Health Profile Report', { align: 'center' });
    
    doc.moveDown(0.5);
    doc.fontSize(10)
       .fillColor('#666666')
       .text(`Generated on: ${formatDate(new Date())}`, { align: 'center' });
    
    doc.moveDown(1.5);

    // Horizontal line
    doc.strokeColor(primaryColor)
       .lineWidth(2)
       .moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .stroke();
    
    doc.moveDown(1);

    // Personal Information Section
    doc.fillColor(primaryColor)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('Personal Information');
    
    doc.moveDown(0.5);

    const personalInfo = [
      { label: 'Name', value: `${user.firstName} ${user.lastName}` },
      { label: 'Email', value: user.email },
      { label: 'Age', value: calculateAge(user.dateOfBirth) },
      { label: 'Date of Birth', value: formatDate(user.dateOfBirth) },
      { label: 'Gender', value: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A' },
      { label: 'Blood Group', value: user.bloodGroup || 'N/A' },
      { label: 'Height', value: user.height ? `${user.height} cm` : 'N/A' },
      { label: 'Weight', value: user.weight ? `${user.weight} kg` : 'N/A' },
    ];

    doc.fontSize(11).font('Helvetica');
    personalInfo.forEach(info => {
      doc.fillColor('#666666').text(`${info.label}: `, { continued: true })
         .fillColor(textColor).text(info.value);
    });

    doc.moveDown(1.5);

    // Medical Information Section
    doc.fillColor(primaryColor)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('Medical Information');
    
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');

    doc.fillColor('#666666').text('Medical Conditions: ', { continued: true })
       .fillColor(textColor).text(user.medicalConditions?.length ? user.medicalConditions.join(', ') : 'None listed');
    
    doc.fillColor('#666666').text('Allergies: ', { continued: true })
       .fillColor(textColor).text(user.allergies?.length ? user.allergies.join(', ') : 'None listed');
    
    doc.fillColor('#666666').text('Medications: ', { continued: true })
       .fillColor(textColor).text(user.medications?.length ? user.medications.join(', ') : 'None listed');

    if (user.emergencyContact) {
      doc.moveDown(0.5);
      doc.fillColor('#666666').text('Emergency Contact:');
      doc.fillColor(textColor)
         .text(`  Name: ${user.emergencyContact.name || 'N/A'}`)
         .text(`  Phone: ${user.emergencyContact.phone || 'N/A'}`)
         .text(`  Relationship: ${user.emergencyContact.relationship || 'N/A'}`);
    }

    doc.moveDown(1.5);

    // Latest Vitals Section
    doc.fillColor(primaryColor)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('Latest Vital Signs');
    
    doc.moveDown(0.5);

    if (vitals.length > 0) {
      const latestVital = vitals[0];
      doc.fontSize(11).font('Helvetica');
      
      doc.fillColor('#666666').text(`Recorded on: `, { continued: true })
         .fillColor(textColor).text(formatDate(latestVital.date));
      doc.moveDown(0.3);

      const vitalData = [
        { label: 'Blood Pressure', value: latestVital.bloodPressureSystolic && latestVital.bloodPressureDiastolic 
          ? `${latestVital.bloodPressureSystolic}/${latestVital.bloodPressureDiastolic} mmHg` : 'N/A' },
        { label: 'Heart Rate', value: latestVital.heartRate ? `${latestVital.heartRate} bpm` : 'N/A' },
        { label: 'Weight', value: latestVital.weight ? `${latestVital.weight} kg` : 'N/A' },
        { label: 'Temperature', value: latestVital.temperature ? `${latestVital.temperature}°C` : 'N/A' },
        { label: 'Blood Sugar', value: latestVital.bloodSugar ? `${latestVital.bloodSugar} mg/dL` : 'N/A' },
        { label: 'Oxygen Saturation', value: latestVital.oxygenSaturation ? `${latestVital.oxygenSaturation}%` : 'N/A' },
      ];

      vitalData.forEach(vital => {
        doc.fillColor('#666666').text(`${vital.label}: `, { continued: true })
           .fillColor(textColor).text(vital.value);
      });

      if (latestVital.isAbnormal) {
        doc.moveDown(0.3);
        doc.fillColor('#D32F2F')
           .font('Helvetica-Bold')
           .text('⚠ Some values are outside normal range');
      }
    } else {
      doc.fontSize(11).font('Helvetica').fillColor('#666666')
         .text('No vital signs recorded yet.');
    }

    doc.moveDown(1.5);

    // Fitness Summary Section
    doc.fillColor(primaryColor)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('Fitness Summary');
    
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');

    doc.fillColor('#666666').text('Total Workouts (last 10): ', { continued: true })
       .fillColor(textColor).text(`${totalWorkouts}`);
    doc.fillColor('#666666').text('Total Calories Burned: ', { continued: true })
       .fillColor(textColor).text(`${totalCalories} kcal`);
    doc.fillColor('#666666').text('Total Exercise Duration: ', { continued: true })
       .fillColor(textColor).text(`${totalDuration} minutes`);

    if (fitnessActivities.length > 0) {
      doc.moveDown(0.5);
      doc.fillColor('#666666').text('Recent Activities:');
      
      fitnessActivities.slice(0, 5).forEach(activity => {
        const activityType = activity.type.charAt(0).toUpperCase() + activity.type.slice(1);
        doc.fillColor(textColor)
           .text(`  • ${activityType} - ${activity.duration} min, ${activity.caloriesBurned || 0} kcal (${formatDate(activity.date)})`);
      });
    }

    doc.moveDown(2);

    // Footer
    doc.fontSize(9)
       .fillColor('#999999')
       .text('This report is generated from Health Pulse application.', { align: 'center' })
       .text('The information provided is for personal health tracking purposes only.', { align: 'center' })
       .text('Please consult a healthcare professional for medical advice.', { align: 'center' });

    // Finalize PDF
    doc.end();

  } catch (error) {
    next(error);
  }
};
