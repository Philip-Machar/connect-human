// src/server/sms.ts
import { createServerFn } from '@tanstack/react-start';
import AfricasTalking from 'africastalking';

// Initialize the Africa's Talking SDK for the sandbox environment
const credentials = {
  apiKey: process.env.AT_SANDBOX_API_KEY as string,
  username: 'sandbox', 
};

const africastalking = AfricasTalking(credentials);
const sms = africastalking.SMS;

// Define and export the server function
export const sendBulkSMS = createServerFn({ method: 'POST' })
  .validator((data: { phoneNumbers: string[]; message: string }) => data)
  .handler(async ({ data }) => {
    try {
      const options = {
        to: data.phoneNumbers,
        message: data.message,
        enqueue: true, 
      };

      // Execute the broadcast
      const response = await sms.send(options);
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Africa\'s Talking API Error:', error);
      return { success: false, error: 'Failed to broadcast message.' };
    }
  });