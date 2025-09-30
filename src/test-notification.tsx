import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

export function TestNotification() {
  useEffect(() => {
    // Test the toast notification system
    toast({
      title: "Test Notification",
      description: "The notification system is working correctly!",
    });

    // Also test Sonner notification
    sonnerToast.success('Sonner notification is also working!');

    console.log("✅ Notification test triggered");
  }, []);

  return null;
}