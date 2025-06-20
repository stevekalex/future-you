import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Future You Coach
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI accountability partner that guides you back into alignment with your future self through personalized WhatsApp coaching.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Goal Tracking</h3>
            <p className="text-gray-600">
              Set and track your personal goals with AI-powered accountability and progress monitoring.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">💪</div>
            <h3 className="text-xl font-semibold mb-2">Habit Building</h3>
            <p className="text-gray-600">
              Build lasting habits through daily check-ins and personalized coaching messages.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Coaching</h3>
            <p className="text-gray-600">
              Receive intelligent coaching responses and voice memos tailored to your journey.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Get Started</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Development Tools</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• WhatsApp Integration Test</li>
                <li>• API Endpoint Testing</li>
                <li>• Message Sending Demo</li>
                <li>• Webhook Testing</li>
              </ul>
              <Link 
                href="/test-whatsapp"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test WhatsApp Integration
              </Link>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Setup Required</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Twilio Account Setup</li>
                <li>• Environment Variables</li>
                <li>• WhatsApp Sandbox</li>
                <li>• Webhook Configuration</li>
              </ul>
              <a 
                href="/WHATSAPP_SETUP.md"
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                View Setup Guide
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">API Endpoints</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><code className="bg-gray-200 px-2 py-1 rounded">POST /api/whatsapp/webhook</code> - Handle incoming messages</p>
              <p><code className="bg-gray-200 px-2 py-1 rounded">POST /api/whatsapp/send</code> - Send messages to users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
