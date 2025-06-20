# WhatsApp Integration Setup Guide

This guide will help you set up the WhatsApp integration for your "Future You Coach" app using Twilio.

## Prerequisites

1. A Twilio account (sign up at [twilio.com](https://twilio.com))
2. A Twilio phone number with WhatsApp capabilities
3. Node.js and npm installed

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_NUMBER=+1234567890

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (for storing user context, messages, etc.)
# DATABASE_URL=your_database_url_here

# AI/LLM Configuration (for generating coaching responses)
# OPENAI_API_KEY=your_openai_api_key_here
# ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Voice/Audio Processing (for voice memos)
# ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Analytics and Monitoring
# SENTRY_DSN=your_sentry_dsn_here
```

## Twilio Setup

### 1. Get Your Twilio Credentials

1. Log into your Twilio Console
2. Go to the [Console Dashboard](https://console.twilio.com/)
3. Copy your Account SID and Auth Token
4. Add them to your `.env.local` file

### 2. Set Up WhatsApp Sandbox (Development)

1. Go to [Twilio WhatsApp Sandbox](https://console.twilio.com/us1/develop/sms/manage/whatsapp-sandbox)
2. Follow the instructions to join your sandbox
3. Note your sandbox number (format: `+1234567890`)
4. Add it to `TWILIO_WHATSAPP_NUMBER` in your `.env.local`

### 3. Configure Webhook URL

1. In your Twilio Console, go to Messaging → Settings → WhatsApp Senders
2. Set the webhook URL to: `https://your-domain.com/api/whatsapp/webhook`
3. For local development, use ngrok: `ngrok http 3000`
4. Set the webhook URL to: `https://your-ngrok-url.ngrok.io/api/whatsapp/webhook`

## API Endpoints

### 1. Webhook Endpoint: `POST /api/whatsapp/webhook`

Handles incoming messages from users via Twilio webhooks.

**Features:**
- Validates webhook signatures (in production)
- Parses incoming messages
- Processes user context and coaching opportunities
- Returns TwiML response

**Example webhook payload:**
```json
{
  "MessageSid": "SM1234567890",
  "From": "whatsapp:+1234567890",
  "To": "whatsapp:+0987654321",
  "Body": "I want to work on my fitness goals",
  "NumMedia": "0"
}
```

### 2. Send Endpoint: `POST /api/whatsapp/send`

Sends messages or voice memos to users.

**Request body:**
```json
{
  "to": "+1234567890",
  "message": "Hey! How's your progress on your fitness goals?",
  "voiceMemoUrl": "https://example.com/audio.mp3" // optional
}
```

**Response:**
```json
{
  "success": true,
  "messageSid": "SM1234567890",
  "status": "queued",
  "to": "whatsapp:+1234567890",
  "from": "whatsapp:+0987654321"
}
```

## Usage Examples

### Sending a Text Message

```typescript
import { sendWhatsAppMessage } from '@/app/lib/whatsapp';

await sendWhatsAppMessage({
  to: '+1234567890',
  message: 'Hey! How are you feeling today?'
});
```

### Sending a Voice Memo

```typescript
import { sendVoiceMemo } from '@/app/lib/whatsapp';

await sendVoiceMemo(
  '+1234567890',
  'https://your-domain.com/audio/coaching-message.mp3'
);
```

### Sending a Coaching Message

```typescript
import { sendCoachingMessage } from '@/app/lib/whatsapp';

const context = {
  userId: 'user123',
  goals: ['Run a marathon', 'Learn Spanish'],
  habits: ['Daily exercise', 'Meditation'],
  currentStreak: 7,
  lastReflection: 'Feeling motivated today!',
  preferredTime: '09:00',
  timezone: 'America/New_York'
};

await sendCoachingMessage(
  '+1234567890',
  context,
  'daily_checkin'
);
```

## Development Workflow

### 1. Start Local Development

```bash
npm run dev
```

### 2. Expose Local Server (for webhook testing)

```bash
npx ngrok http 3000
```

### 3. Update Twilio Webhook URL

Use the ngrok URL in your Twilio console webhook configuration.

### 4. Test the Integration

1. Send a message to your Twilio WhatsApp number
2. Check your server logs for incoming webhook data
3. Test sending messages via the `/api/whatsapp/send` endpoint

## Production Deployment

### 1. Environment Variables

Ensure all environment variables are set in your production environment.

### 2. Webhook URL

Update the webhook URL in Twilio console to your production domain.

### 3. SSL Certificate

Ensure your domain has a valid SSL certificate (required by Twilio).

### 4. Rate Limiting

Consider implementing rate limiting for the webhook endpoint.

## Security Considerations

### 1. Webhook Validation

The webhook endpoint validates Twilio signatures in production to prevent spoofing.

### 2. Environment Variables

Never commit sensitive credentials to version control.

### 3. Input Validation

All incoming messages are validated and sanitized.

### 4. Error Handling

Comprehensive error handling prevents information leakage.

## Troubleshooting

### Common Issues

1. **Webhook not receiving messages**
   - Check webhook URL configuration in Twilio console
   - Verify ngrok is running (for local development)
   - Check server logs for errors

2. **Messages not sending**
   - Verify Twilio credentials
   - Check phone number format (must include country code)
   - Ensure WhatsApp sandbox is properly configured

3. **Authentication errors**
   - Verify Account SID and Auth Token
   - Check environment variable names

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Next Steps

1. Implement user context storage (database)
2. Add AI/LLM integration for coaching responses
3. Implement voice memo generation
4. Add analytics and tracking
5. Set up scheduled message delivery
6. Implement user onboarding flow

## Support

For Twilio-specific issues, refer to the [Twilio WhatsApp API documentation](https://www.twilio.com/docs/whatsapp). 