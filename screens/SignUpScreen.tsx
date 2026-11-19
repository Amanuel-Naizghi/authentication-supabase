
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { supabase } from '../utils/supabase';
import { signUpSchema, SignUpFormData } from '../schemas/authSchema';

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigation = useNavigation<
    NativeStackNavigationProp<{
      SignIn: undefined;
      SignUp: undefined;
    }>
  >();

  // Retrieve publicly accessible data from Supabase.
  useEffect(() => {
    const fetchColors = async () => {
      const { data, error } = await supabase
        .from('colors')
        .select('color');

      if (error) {
        console.error('Error fetching colors:', error.message);
        return;
      }

      setColors(data.map((item) => item.color));
    };

    fetchColors();
  }, []);

  // Register a new user with Supabase Authentication.
  const onSignUp = async (formData: SignUpFormData) => {
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            name: formData.name.trim(),
          },
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session) {
        setMessage('Account created successfully!');
      } else {
        setMessage('Account created. Check your email to confirm your account.');
      }
    } catch {
      setMessage('Something went wrong. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="words"
          />
        )}
      />
      {errors.name && (
        <Text style={styles.error}>{errors.name.message}</Text>
      )}

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        )}
      />
      {errors.email && (
        <Text style={styles.error}>{errors.email.message}</Text>
      )}

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {/* Confirm Password */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>
          {errors.confirmPassword.message}
        </Text>
      )}

      {/* Submit */}
      <Pressable
        style={[styles.button, loading && styles.disabled]}
        onPress={() => handleSubmit(onSignUp)()}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('SignIn')}
        style={{ marginTop: 20, alignItems: 'center' }}
      >
        <Text style={{ color: '#2563eb' }}>
          Already have an account? Sign In
        </Text>
      </Pressable>

      {message !== '' && <Text style={styles.message}>{message}</Text>}

      {/* Public Supabase Data */}
      <View style={styles.dataSection}>
        <Text style={styles.sectionTitle}>Available Colors</Text>

        {colors.map((color, index) => (
          <Text key={index} style={styles.colorItem}>
            {color}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  error: {
    color: '#dc2626',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563eb',
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
  dataSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  colorItem: {
    fontSize: 16,
    paddingVertical: 6,
  },
});
