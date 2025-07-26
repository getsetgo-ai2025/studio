
import { redirect } from 'next/navigation';

export default function RootPage() {
  // The main entry point now directly redirects to the app's layout,
  // which will handle authentication and show the home page.
  redirect('/home');
}
