import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Provider from '../models/Provider.model';
import Appointment from '../models/Appointment.model';
import Conversation from '../models/Conversation.model';
import Message from '../models/Message.model';

export const getProviders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { specialty, city, search, page = '1', limit = '10' } = req.query;

    // amazonq-ignore-next-line
    const query: any = {};

    if (specialty) {
      query.specialty = specialty;
    }

    if (city) {
      query['location.city'] = city;
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    // amazonq-ignore-next-line
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const providers = await Provider.find(query)
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Provider.countDocuments(query);

    res.status(200).json({
      success: true,
      data: providers,
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

export const getProviderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id);

    if (!provider) {
      res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (
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

    const { providerId, dateTime, type, notes } = req.body;

    // Check if provider exists
    const provider = await Provider.findById(providerId);

    if (!provider) {
      res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
      return;
    }

    // Generate meeting link for video appointments
    let meetingLink;
    if (type === 'video') {
      // amazonq-ignore-next-line
      meetingLink = `https://meet.google.com/${Math.random().toString(36).substring(7)}`;
    }

    const appointment = await Appointment.create({
      userId: req.user.id,
      providerId,
      dateTime,
      type,
      notes,
      meetingLink,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (
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

    const { status, page = '1', limit = '10' } = req.query;

    const query: any = { userId: req.user.id };

    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const appointments = await Appointment.find(query)
      .populate('providerId')
      .sort({ dateTime: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: appointments,
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

export const updateAppointment = async (
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

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      // amazonq-ignore-next-line
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('providerId');

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (
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
    const { cancelReason } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        $set: {
          status: 'cancelled',
          cancelReason,
        },
      },
      { new: true }
    ).populate('providerId');

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== MESSAGING ENDPOINTS ====================

export const getConversations = async (
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

    const conversations = await Conversation.find({ userId: req.user.id })
      .populate('providerId')
      .sort({ lastMessageTime: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrCreateConversation = async (
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

    const { providerId } = req.body;

    // Check if provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
      return;
    }

    // Find existing conversation or create new one
    let conversation = await Conversation.findOne({
      userId: req.user.id,
      providerId,
    }).populate('providerId');

    if (!conversation) {
      conversation = await Conversation.create({
        userId: req.user.id,
        providerId,
        unreadCount: 0,
      });
      conversation = await conversation.populate('providerId');
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
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

    const { conversationId } = req.params;
    const { page = '1', limit = '50' } = req.query;

    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.id,
    });

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
      return;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Message.countDocuments({ conversationId });

    res.status(200).json({
      success: true,
      data: messages.reverse(), // Return messages in chronological order
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

export const sendMessage = async (
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

    const { conversationId } = req.params;
    const { content, type = 'text', imageUrl, linkTitle, linkDescription } = req.body;

    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.id,
    }).populate('providerId');

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
      return;
    }

    // Create user message
    const userMessage = await Message.create({
      conversationId,
      senderId: req.user.id,
      senderType: 'user',
      content,
      type,
      imageUrl,
      linkTitle,
      linkDescription,
      isRead: true, // User's own messages are read
    });

    // Generate auto-reply from provider using basic NLP
    const replyContent = getAutoReply(content, conversation.providerId);
    
    // Create provider auto-reply message immediately
    const providerReply = await Message.create({
      conversationId,
      senderId: conversation.providerId,
      senderType: 'provider',
      content: replyContent,
      type: 'text',
      isRead: false,
    });

    // Update conversation with last message info
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: replyContent.substring(0, 500),
      lastMessageTime: new Date(),
      $inc: { unreadCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        userMessage,
        providerReply,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const markMessagesAsRead = async (
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

    const { conversationId } = req.params;

    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.id,
    });

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
      return;
    }

    // Mark all messages from provider as read
    await Message.updateMany(
      { conversationId, senderType: 'provider', isRead: false },
      { isRead: true }
    );

    // Reset unread count
    await Conversation.findByIdAndUpdate(conversationId, { unreadCount: 0 });

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate auto-replies using basic NLP pattern matching
function getAutoReply(userMessage: string, provider: any): string {
  const lowerMessage = userMessage.toLowerCase().trim();
  const providerName = provider?.name || 'Dr. Smith';
  const specialty = provider?.specialty || 'General Medicine';
  
  // Greeting patterns
  const greetingPatterns = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
  if (greetingPatterns.some(pattern => lowerMessage.includes(pattern))) {
    const responses = [
      `Hello! This is ${providerName}. How can I help you today?`,
      `Hi there! Thank you for reaching out. What can I assist you with?`,
      `Good day! I'm ${providerName}, your ${specialty} specialist. How may I help you?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Appointment related
  const appointmentPatterns = ['appointment', 'schedule', 'book', 'visit', 'meet', 'available', 'slot'];
  if (appointmentPatterns.some(pattern => lowerMessage.includes(pattern))) {
    const responses = [
      `I have availability this week. You can use the appointment scheduling feature to book a convenient time slot. Would you prefer an in-person visit or a video consultation?`,
      `Thank you for wanting to schedule an appointment. Please check my availability calendar and select a time that works best for you.`,
      `I'd be happy to see you! My next available slots are shown in the scheduling section. Feel free to book what works for you.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Test results / reports
  const testPatterns = ['result', 'test', 'report', 'lab', 'blood', 'scan', 'x-ray', 'mri'];
  if (testPatterns.some(pattern => lowerMessage.includes(pattern))) {
    const responses = [
      `I've reviewed your recent test results. Everything appears to be within normal range. We can discuss the details during our next appointment if you have any concerns.`,
      `Your lab results look good overall. I'll provide a detailed explanation during our consultation. Any specific concerns you'd like me to address?`,
      `I have your test results ready. Would you like to schedule a follow-up appointment to discuss them in detail?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Medication related
  const medicationPatterns = ['medication', 'medicine', 'prescription', 'drug', 'pill', 'dose', 'refill'];
  if (medicationPatterns.some(pattern => lowerMessage.includes(pattern))) {
    const responses = [
      `Regarding your medication, please continue taking it as prescribed. If you're experiencing any side effects, let me know and we can discuss alternatives.`,
      `I can help with your prescription needs. For refills, please use the prescription request feature or schedule a brief consultation.`,
      `Your medication inquiry is noted. It's important to take your medicines as directed. Any issues with the current prescription?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Pain / symptoms
  const symptomPatterns = ['pain', 'hurt', 'ache', 'symptom', 'feeling', 'sick', 'fever', 'headache', 'nausea'];
  if (symptomPatterns.some(pattern => lowerMessage.includes(pattern))) {
    const responses = [
      `I'm sorry to hear you're not feeling well. Can you describe your symptoms in more detail? If it's severe, please consider urgent care or scheduling an immediate appointment.`,
      `Thank you for sharing your symptoms. For a proper assessment, I recommend scheduling an appointment soon. If symptoms worsen, please seek immediate medical attention.`,
      `Your health concerns are important. Based on what you've described, I'd like to see you for an examination. Please book an appointment at your earliest convenience.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Thank you patterns
  const thankPatterns = ['thank', 'thanks', 'appreciate', 'grateful'];
  if (thankPatterns.some(pattern => lowerMessage.includes(pattern))) {
    const responses = [
      `You're welcome! Don't hesitate to reach out if you have any more questions. Take care!`,
      `My pleasure! I'm here whenever you need assistance. Stay healthy!`,
      `Happy to help! Feel free to message me anytime. Wishing you good health!`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Questions about the doctor
  const doctorPatterns = ['experience', 'qualification', 'specializ', 'expertise', 'background'];
  if (doctorPatterns.some(pattern => lowerMessage.includes(pattern))) {
    return `I'm ${providerName}, specializing in ${specialty}. I've been practicing for several years and am committed to providing the best care for my patients. Feel free to ask any specific questions about my practice.`;
  }
  
  // Emergency
  const emergencyPatterns = ['emergency', 'urgent', 'serious', 'critical', 'immediately'];
  if (emergencyPatterns.some(pattern => lowerMessage.includes(pattern))) {
    return `If this is a medical emergency, please call 911 or go to the nearest emergency room immediately. For urgent but non-emergency matters, you can use our video call feature for a quick consultation.`;
  }
  
  // Insurance
  const insurancePatterns = ['insurance', 'coverage', 'payment', 'cost', 'fee', 'price'];
  if (insurancePatterns.some(pattern => lowerMessage.includes(pattern))) {
    return `I accept most major insurance plans. For specific coverage questions, please contact our front desk or check your insurance provider. We also offer flexible payment options for uninsured patients.`;
  }
  
  // Default responses
  const defaultResponses = [
    `Thank you for your message. I'll review this and respond appropriately. If you need immediate assistance, please use the video call feature or schedule an appointment.`,
    `I've received your message. Is there anything specific you'd like to discuss? Feel free to share more details or schedule an appointment for a thorough consultation.`,
    `Thanks for reaching out! I'm here to help with your healthcare needs. Would you like to schedule an appointment to discuss this further?`,
    `I appreciate your message. For personalized medical advice, I recommend scheduling a consultation where we can discuss your concerns in detail.`,
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
