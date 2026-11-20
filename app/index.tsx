
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { session } = useAuth();

  // The root route selects the appropriate screen for the restored session.
  if (session) {
    return <Redirect href="/profile" />;
  }

  return <Redirect href="/sign-in" />;
}


