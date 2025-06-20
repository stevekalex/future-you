import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Webhook signature validation (simplified for now)
const validateWebhook = (req: NextRequest) => {
  const signature = req.headers.get('x-twilio-signature');
  
  // For development, you might want to skip validation
  // In production, implement proper Twilio signature validation
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  if (!signature) {
    return false;
  }

  // TODO: Implement proper Twilio signature validation
  // return twilio.validateRequest(authToken, signature, url, body);
  return true;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    // Validate webhook signature for security
    if (!validateWebhook(request)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the form data from Twilio
    const formData = new URLSearchParams(body);
    const messageSid = formData.get('MessageSid');
    const from = formData.get('From'); // User's WhatsApp number
    const to = formData.get('To'); // Your Twilio WhatsApp number
    const bodyText = formData.get('Body'); // Message content
    const mediaUrl = formData.get('MediaUrl0'); // If media was sent
    const numMedia = formData.get('NumMedia');

    console.log('Incoming WhatsApp message:', {
      messageSid,
      from,
      to,
      body: bodyText,
      mediaUrl,
      numMedia
    });

    // Process the incoming message
    await processIncomingMessage({
      messageSid,
      from,
      to,
      body: bodyText,
      mediaUrl,
      numMedia: numMedia ? parseInt(numMedia) : 0
    });

    // Return TwiML response (required by Twilio)
    const twiml = new twilio.twiml.MessagingResponse();
    
    // You can optionally send an immediate response here
    // twiml.message('Thanks for your message! I\'ll process it and get back to you.');
    
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface IncomingMessage {
  messageSid: string | null;
  from: string | null;
  to: string | null;
  body: string | null;
  mediaUrl: string | null;
  numMedia: number;
}

async function processIncomingMessage(message: IncomingMessage) {
  // TODO: Implement your message processing logic here
  // This is where you'll:
  // 1. Store the message in your database
  // 2. Analyze the content for goals, habits, reflections
  // 3. Update user context
  // 4. Trigger appropriate coaching responses
  
  console.log('Processing message from:', message.from);
  console.log('Message content:', message.body);
  
  // Example: Store message in database
  // await storeMessage(message);
  
  // Example: Analyze message for coaching opportunities
  // await analyzeMessageForCoaching(message);
  
  // Example: Update user's context/goals
  // await updateUserContext(message.from, message.body);
} 