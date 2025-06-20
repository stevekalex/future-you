import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Types
export interface WhatsAppMessage {
  messageSid: string;
  from: string;
  to: string;
  body: string | null;
  mediaUrl: string | null;
  numMedia: number;
  timestamp: Date;
}

export interface SendMessageOptions {
  to: string;
  message?: string;
  mediaUrl?: string;
  voiceMemoUrl?: string;
  scheduledTime?: Date;
}

export interface CoachingContext {
  userId: string;
  goals: string[];
  habits: string[];
  currentStreak: number;
  lastReflection: string;
  preferredTime: string;
  timezone: string;
}

// Helper functions
export function formatWhatsAppNumber(phoneNumber: string): string {
  // Remove any non-digit characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }
  
  return cleaned;
}

export function addWhatsAppPrefix(phoneNumber: string): string {
  const formatted = formatWhatsAppNumber(phoneNumber);
  return formatted.startsWith('whatsapp:') ? formatted : `whatsapp:${formatted}`;
}

export function removeWhatsAppPrefix(phoneNumber: string): string {
  return phoneNumber.replace('whatsapp:', '');
}

// Message sending functions
export async function sendWhatsAppMessage(options: SendMessageOptions) {
  const toNumber = addWhatsAppPrefix(options.to);
  const fromNumber = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

  const messageOptions: {
    from: string;
    to: string;
    body?: string;
    mediaUrl?: string[];
    sendAt?: Date;
  } = {
    from: fromNumber,
    to: toNumber,
  };

  if (options.message) {
    messageOptions.body = options.message;
  }

  if (options.mediaUrl) {
    messageOptions.mediaUrl = [options.mediaUrl];
  }

  if (options.voiceMemoUrl) {
    messageOptions.mediaUrl = [options.voiceMemoUrl];
  }

  if (options.scheduledTime) {
    messageOptions.sendAt = options.scheduledTime;
  }

  const message = await twilioClient.messages.create(messageOptions);
  
  return {
    success: true,
    messageSid: message.sid,
    status: message.status,
    to: message.to,
    from: message.from
  };
}

// Coaching-specific message functions
export async function sendCoachingMessage(
  phoneNumber: string,
  context: CoachingContext,
  messageType: 'daily_checkin' | 'goal_reminder' | 'habit_reminder' | 'reflection_prompt'
) {
  const messages = {
    daily_checkin: `Hey there! 👋 How are you feeling today? Take a moment to check in with yourself. Remember your goals: ${context.goals.join(', ')}`,
    
    goal_reminder: `🎯 Future You reminder: You're working towards ${context.goals.join(' and ')}. What's one small step you can take today to move closer?`,
    
    habit_reminder: `💪 Habit check! You're on a ${context.currentStreak}-day streak with ${context.habits.join(', ')}. Keep it up!`,
    
    reflection_prompt: `🤔 Time for reflection: How did today align with your future self? What went well? What could you improve tomorrow?`
  };

  return sendWhatsAppMessage({
    to: phoneNumber,
    message: messages[messageType]
  });
}

export async function sendVoiceMemo(
  phoneNumber: string,
  audioUrl: string
) {
  // You can add context-aware voice memo logic here
  // For example, generate different voice memos based on user's goals and progress
  
  return sendWhatsAppMessage({
    to: phoneNumber,
    voiceMemoUrl: audioUrl
  });
}

// Message processing functions
export function parseIncomingMessage(formData: URLSearchParams): WhatsAppMessage {
  return {
    messageSid: formData.get('MessageSid') || '',
    from: formData.get('From') || '',
    to: formData.get('To') || '',
    body: formData.get('Body'),
    mediaUrl: formData.get('MediaUrl0'),
    numMedia: parseInt(formData.get('NumMedia') || '0'),
    timestamp: new Date()
  };
}

// Analytics and tracking
export function trackMessageEvent(
  messageSid: string,
  event: 'sent' | 'delivered' | 'read' | 'failed',
  metadata?: Record<string, unknown>
) {
  console.log('Message event:', {
    messageSid,
    event,
    timestamp: new Date().toISOString(),
    metadata
  });
  
  // TODO: Store in your analytics database
  // await analyticsService.track('whatsapp_message_event', {
  //   messageSid,
  //   event,
  //   metadata
  // });
}

// Error handling
export class WhatsAppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'WhatsAppError';
  }
}

export function handleTwilioError(error: unknown): WhatsAppError {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const twilioError = error as { code: number };
    
    if (twilioError.code === 21211) {
      return new WhatsAppError('Invalid phone number format', 'INVALID_PHONE', 400);
    }
    
    if (twilioError.code === 20003) {
      return new WhatsAppError('Twilio authentication failed', 'AUTH_ERROR', 401);
    }
    
    if (twilioError.code === 21608) {
      return new WhatsAppError('Message quota exceeded', 'QUOTA_EXCEEDED', 429);
    }
  }
  
  return new WhatsAppError('Failed to send message', 'SEND_ERROR', 500);
}

// Helper function to send scheduled messages
export async function sendScheduledMessage(
  to: string,
  message: string,
  scheduledTime?: Date
) {
  try {
    const toNumber = addWhatsAppPrefix(to);
    const fromNumber = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

    const messageOptions: {
      from: string;
      to: string;
      body: string;
      sendAt?: Date;
    } = {
      from: fromNumber,
      to: toNumber,
      body: message,
    };

    // If scheduled time is provided, schedule the message
    if (scheduledTime) {
      messageOptions.sendAt = scheduledTime;
    }

    const twilioMessage = await twilioClient.messages.create(messageOptions);

    console.log('Scheduled message created:', {
      messageSid: twilioMessage.sid,
      scheduledTime,
      to: toNumber
    });

    return {
      success: true,
      messageSid: twilioMessage.sid,
      status: twilioMessage.status
    };

  } catch (error) {
    console.error('Error sending scheduled message:', error);
    throw error;
  }
} 