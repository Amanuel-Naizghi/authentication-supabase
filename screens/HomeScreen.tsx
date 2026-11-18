
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

interface DemoItem {
  id: number;
  name: string;
  age: number;
}

export default function HomeScreen() {
  const { user } = useAuth();

  const [items, setItems] = useState<DemoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        // Fetching data from a protected Supabase table. The user must be signed in to access this data.
        const { data, error } = await supabase
          .from('demo')
          .select('id, name, age')
          .order('id');

        if (error) throw error;

        if (active) {
          setItems(data ?? []);
        }
      } catch {
        if (active) {
          setError('Unable to load protected data.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    setError('');

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setError(error.message);
      }

      // AuthContext detects successful sign-out.
      // Navigation switches automatically.
    } catch {
      setError('Unable to sign out. Please try again.');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      <Text style={styles.email}>
        {user?.user_metadata?.name || user?.email}
      </Text>

      <Text style={styles.sectionTitle}>
        Protected Supabase Data
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Age: {item.age}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text>No records available.</Text>
          }
        />
      )}

      {error !== '' && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Pressable
        style={styles.button}
        onPress={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Out</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  error: {
    color: '#dc2626',
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#dc2626',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
