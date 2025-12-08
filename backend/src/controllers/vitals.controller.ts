import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import VitalSigns from '../models/Vitals.model';
import Notification, { NotificationSeverity } from '../models/Notification.model';

/**
 * Vital limits for determining severity levels
 */
interface VitalLimitConfig {
  warningMin?: number;
  warningMax?: number;
  criticalMin?: number;
  criticalMax?: number;
  label: string;
  unit: string;
}

const vitalLimits: Record<string, VitalLimitConfig> = {
  bloodPressureSystolic: {
    warningMin: 90,
    warningMax: 140,
    criticalMin: 80,
    criticalMax: 180,
    label: 'Blood Pressure (Systolic)',
    unit: 'mmHg',
  },
  bloodPressureDiastolic: {
    warningMin: 60,
    warningMax: 90,
    criticalMin: 50,
    criticalMax: 110,
    label: 'Blood Pressure (Diastolic)',
    unit: 'mmHg',
  },
  heartRate: {
    warningMin: 60,
    warningMax: 100,
    criticalMin: 40,
    criticalMax: 150,
    label: 'Heart Rate',
    unit: 'bpm',
  },
  bloodSugar: {
    warningMin: 70,
    warningMax: 140,
    criticalMin: 50,
    criticalMax: 200,
    label: 'Blood Sugar',
    unit: 'mg/dL',
  },
  weight: {
    warningMin: 40,
    warningMax: 150,
    criticalMin: 30,
    criticalMax: 200,
    label: 'Weight',
    unit: 'kg',
  },
};

/**
 * Check vital value and return severity if abnormal
 */
const checkVitalSeverity = (
  vitalName: string,
  value: number | undefined
): { severity: NotificationSeverity; isLow: boolean } | null => {
  if (value === undefined || value === null) return null;
  
  const limits = vitalLimits[vitalName];
  if (!limits) return null;
  
  // Check critical limits
  if (limits.criticalMin !== undefined && value < limits.criticalMin) {
    return { severity: 'critical', isLow: true };
  }
  if (limits.criticalMax !== undefined && value > limits.criticalMax) {
    return { severity: 'critical', isLow: false };
  }
  
  // Check warning limits
  if (limits.warningMin !== undefined && value < limits.warningMin) {
    return { severity: 'warning', isLow: true };
  }
  if (limits.warningMax !== undefined && value > limits.warningMax) {
    return { severity: 'warning', isLow: false };
  }
  
  return null;
};

/**
 * Create notifications for abnormal vital readings
 */
const createVitalNotifications = async (
  userId: string,
  vitalId: string,
  vitalsData: Record<string, number | undefined>
): Promise<void> => {
  const notifications: Array<{
    userId: string;
    title: string;
    message: string;
    type: 'vital_alert';
    severity: NotificationSeverity;
    relatedVitalId: string;
    metadata: Record<string, unknown>;
  }> = [];

  for (const [vitalName, value] of Object.entries(vitalsData)) {
    if (value === undefined) continue;
    
    const result = checkVitalSeverity(vitalName, value);
    if (!result) continue;
    
    const limits = vitalLimits[vitalName];
    if (!limits) continue;
    
    const { severity, isLow } = result;
    const direction = isLow ? 'low' : 'high';
    const severityText = severity === 'critical' ? 'CRITICAL' : 'Warning';
    
    notifications.push({
      userId,
      title: `${severityText}: ${limits.label} is ${direction}`,
      message: `Your ${limits.label} reading of ${value} ${limits.unit} is ${direction === 'low' ? 'below' : 'above'} the ${severity === 'critical' ? 'critical' : 'normal'} threshold. ${
        severity === 'critical' 
          ? 'Please seek medical attention immediately.' 
          : 'Please monitor your health and consult a doctor if this persists.'
      }`,
      type: 'vital_alert',
      severity,
      relatedVitalId: vitalId,
      metadata: {
        vitalName,
        value,
        unit: limits.unit,
        direction,
        normalRange: `${limits.warningMin || 'N/A'} - ${limits.warningMax || 'N/A'}`,
      },
    });
  }

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }
};

export const getVitalSigns = async (
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
    // amazonq-ignore-next-line
    const { startDate, endDate, isAbnormal, page = '1', limit = '10' } = req.query;

    // amazonq-ignore-next-line
    // amazonq-ignore-next-line
    const query: any = { userId: req.user.id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        // amazonq-ignore-next-line
        // amazonq-ignore-next-line
        // amazonq-ignore-next-line
        // amazonq-ignore-next-line
        // amazonq-ignore-next-line
        // amazonq-ignore-next-line
        query.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate as string);
      }
    }

    if (isAbnormal !== undefined) {
      query.isAbnormal = isAbnormal === 'true';
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const vitals = await VitalSigns.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await VitalSigns.countDocuments(query);

    res.status(200).json({
      success: true,
      data: vitals,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createVitalSigns = async (
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

    const vital = await VitalSigns.create({
      ...req.body,
      userId: req.user.id,
    });

    // Create notifications for abnormal vital readings
    await createVitalNotifications(
      req.user.id,
      vital._id.toString(),
      {
        bloodPressureSystolic: vital.bloodPressureSystolic,
        bloodPressureDiastolic: vital.bloodPressureDiastolic,
        heartRate: vital.heartRate,
        bloodSugar: vital.bloodSugar,
        weight: vital.weight,
      }
    );

    res.status(201).json({
      success: true,
      message: 'Vital signs recorded successfully',
      data: vital,
    });
  } catch (error) {
    next(error);
  }
};

export const updateVitalSigns = async (
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

    const { id } = req.params;

    const vital = await VitalSigns.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!vital) {
      res.status(404).json({
        success: false,
        message: 'Vital signs not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Vital signs updated successfully',
      data: vital,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVitalSigns = async (
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

    const { id } = req.params;

    const vital = await VitalSigns.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!vital) {
      res.status(404).json({
        success: false,
        message: 'Vital signs not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Vital signs deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getVitalsStats = async (
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

    const { period = 'week' } = req.query;
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const vitals = await VitalSigns.find({
      userId: req.user.id,
      date: { $gte: startDate },
    }).sort({ date: -1 });

    const abnormalVitals = await VitalSigns.countDocuments({
      userId: req.user.id,
      isAbnormal: true,
      date: { $gte: startDate },
    });

    // Calculate averages
    const heartRates = vitals.filter(v => v.heartRate).map(v => v.heartRate!);
    const systolicBPs = vitals.filter(v => v.bloodPressureSystolic).map(v => v.bloodPressureSystolic!);
    const diastolicBPs = vitals.filter(v => v.bloodPressureDiastolic).map(v => v.bloodPressureDiastolic!);
    const weights = vitals.filter(v => v.weight).map(v => v.weight!);
    const bloodSugars = vitals.filter(v => v.bloodSugar).map(v => v.bloodSugar!);

    const averageHeartRate = heartRates.length > 0 
      ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
      : 0;

    const averageBloodPressure = {
      systolic: systolicBPs.length > 0 
        ? Math.round(systolicBPs.reduce((a, b) => a + b, 0) / systolicBPs.length)
        : 0,
      diastolic: diastolicBPs.length > 0 
        ? Math.round(diastolicBPs.reduce((a, b) => a + b, 0) / diastolicBPs.length)
        : 0,
    };

    const weightTrend = weights.slice(0, 7).reverse(); // Last 7 weight readings

    // Get latest blood sugar with date info
    const latestBloodSugarVital = vitals.find(v => v.bloodSugar);
    let latestBloodSugar = null;
    if (latestBloodSugarVital && latestBloodSugarVital.bloodSugar) {
      const vitalDate = new Date(latestBloodSugarVital.date);
      const diffTime = Math.abs(now.getTime() - vitalDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      latestBloodSugar = {
        value: latestBloodSugarVital.bloodSugar,
        date: latestBloodSugarVital.date,
        daysAgo: diffDays,
      };
    }

    const averageBloodSugar = bloodSugars.length > 0
      ? Math.round(bloodSugars.reduce((a, b) => a + b, 0) / bloodSugars.length)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        averageHeartRate,
        averageBloodPressure,
        averageBloodSugar,
        latestBloodSugar,
        weightTrend,
        alertsCount: abnormalVitals,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getVitalsHistory = async (
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

    const { vitalType, startDate, endDate, page = '1', limit = '10' } = req.query;

    const query: any = { userId: req.user.id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate as string);
      }
    }

    // Filter by vital type if specified
    if (vitalType) {
      switch (vitalType) {
        case 'heart_rate':
          query.heartRate = { $exists: true, $ne: null };
          break;
        case 'blood_pressure':
          query.$or = [
            { bloodPressureSystolic: { $exists: true, $ne: null } },
            { bloodPressureDiastolic: { $exists: true, $ne: null } }
          ];
          break;
        case 'temperature':
          query.temperature = { $exists: true, $ne: null };
          break;
        case 'oxygen_saturation':
          query.oxygenSaturation = { $exists: true, $ne: null };
          break;
        case 'weight':
          query.weight = { $exists: true, $ne: null };
          break;
        case 'blood_sugar':
          query.bloodSugar = { $exists: true, $ne: null };
          break;
      }
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const vitals = await VitalSigns.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await VitalSigns.countDocuments(query);

    // Transform data for frontend consumption
    const transformedData = vitals.map(vital => {
      let value: number | string = 0;
      let unit = '';
      
      switch (vitalType) {
        case 'heart_rate':
          value = vital.heartRate || 0;
          unit = 'bpm';
          break;
        case 'blood_pressure':
          value = vital.bloodPressureSystolic && vital.bloodPressureDiastolic 
            ? `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}`
            : '0/0';
          unit = 'mmHg';
          break;
        case 'temperature':
          value = vital.temperature || 0;
          unit = '°C';
          break;
        case 'oxygen_saturation':
          value = vital.oxygenSaturation || 0;
          unit = '%';
          break;
        case 'weight':
          value = vital.weight || 0;
          unit = 'kg';
          break;
        case 'blood_sugar':
          value = vital.bloodSugar || 0;
          unit = 'mg/dL';
          break;
        default:
          value = vital.heartRate || 0;
          unit = 'bpm';
      }

      return {
        id: vital._id,
        date: vital.date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        value,
        unit,
        isAbnormal: vital.isAbnormal,
        notes: vital.notes
      };
    });

    res.status(200).json({
      success: true,
      data: transformedData,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};
