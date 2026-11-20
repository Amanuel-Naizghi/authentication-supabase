
import { useState } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { supabase } from '../utils/supabase';

export default function SignOut() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignOut = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setErrorMessage(error.message);
      }

      // AuthContext automatically detects session changes.
      // Expo Router handles navigation after sign-out.
    } catch {
      setErrorMessage('Unable to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Sign-Out Button */}
      <Pressable
        style={[styles.button, loading && styles.disabled]}
        onPress={handleSignOut}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Out</Text>
        )}
      </Pressable>

      {/* Display authentication errors */}
      {errorMessage !== '' && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#dc2626',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#dc2626',
    marginTop: 12,
    textAlign: 'center',
  },
});
