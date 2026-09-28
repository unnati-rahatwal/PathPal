// Real Twilio Emergency SMS Dispatch Service

const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN || '';
const TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER || '';

export const isTwilioConfigured = Boolean(
  TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER
);

/**
 * Sends a real emergency SOS SMS message using Twilio REST API
 */
export async function sendEmergencySMS({ recipientPhone, lat, lng, messageText }) {
  const mapLink = `https://maps.google.com/?q=${lat},${lng}`;
  const fullBody = `🚨 EMERGENCY SOS ALERT! ${messageText || 'Commuter needs urgent assistance!'}\nLive Location: ${mapLink}`;

  if (isTwilioConfigured) {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const authHeader = 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    const params = new URLSearchParams();
    params.append('From', TWILIO_PHONE_NUMBER);
    params.append('To', recipientPhone);
    params.append('Body', fullBody);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Twilio error ${response.status}`);
      }

      const result = await response.json();
      return { success: true, sid: result.sid };
    } catch (err) {
      console.warn('Twilio API Dispatch error:', err.message);
      // Fallback to native device SMS protocol
      triggerNativeSMS(recipientPhone, fullBody);
      return { success: false, fallbackUsed: true, error: err.message };
    }
  } else {
    // If Twilio keys are not set, use native phone SMS handler
    triggerNativeSMS(recipientPhone, fullBody);
    return { success: true, nativeSmsUsed: true };
  }
}

/**
 * Triggers native mobile SMS app (sms:phone?body=...)
 */
function triggerNativeSMS(phone, body) {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(body)}`;
  window.open(smsUrl, '_blank');
}
