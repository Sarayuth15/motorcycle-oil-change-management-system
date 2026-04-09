import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Oil Tracker — Vehicle Service Reminder',
  description: 'Track your vehicle oil change intervals and receive email reminders when service is due.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
