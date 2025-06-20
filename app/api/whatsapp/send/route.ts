import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

interface SendMessageRequest {
  to: string; // User's WhatsApp number (format: whatsapp:+1234567890)
  message?: string; // Text message
  mediaUrl?: string; // URL to media file (image, audio, video)
  voiceMemoUrl?: string; // URL to voice memo audio file
}

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json();
    
    // Validate required fields
    if (!body.to) {
      return NextResponse.json(
        { error: 'Recipient number is required' },
        { status: 400 }
      );
    }

    if (!body.message && !body.mediaUrl && !body.voiceMemoUrl) {
      return NextResponse.json(
        { error: 'Message content, media URL, or voice memo URL is required' },
        { status: 400 }
      );
    }

    // Ensure the 'to' number has the whatsapp: prefix
    const toNumber = body.to.startsWith('whatsapp:') ? body.to : `whatsapp:${body.to}`;
    
    // Your Twilio WhatsApp number
    const fromNumber = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

    const messageOptions: {
      from: string;
      to: string;
      body?: string;
      mediaUrl?: string[];
    } = {
      from: fromNumber,
      to: toNumber,
    };

    // Send text message
    if (body.message) {
      messageOptions.body = body.message;
    }

    // Send media (image, video, document)
    if (body.mediaUrl) {
      messageOptions.mediaUrl = [body.mediaUrl];
    }

    // Send voice memo (audio file)
    if (body.voiceMemoUrl) {
      messageOptions.mediaUrl = [body.voiceMemoUrl];
    }

    console.log('Sending WhatsApp message:', {
      to: toNumber,
      from: fromNumber,
      hasText: !!body.message,
      hasMedia: !!body.mediaUrl,
      hasVoiceMemo: !!body.voiceMemoUrl
    });

    // Send the message via Twilio
    const message = await twilioClient.messages.create(messageOptions);

    console.log('Message sent successfully:', {
      messageSid: message.sid,
      status: message.status,
      to: message.to,
      from: message.from
    });

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
      status: message.status,
      to: message.to,
      from: message.from
    });

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    
    // Handle specific Twilio errors
    if (error instanceof Error) {
      if (error.message.includes('not a valid phone number')) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('not authorized')) {
        return NextResponse.json(
          { error: 'Twilio authentication failed' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 