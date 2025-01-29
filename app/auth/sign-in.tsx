import React, { useState, useCallback, useContext } from 'react';
import ApplicationContext from '@/context/ApplicationContext';
import { Stack, useRouter } from 'expo-router';
import {
  Alert,
  StyleSheet,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { login } from '@/services/auth';
import { TResponse } from '@/@types';

export default function SignInScreen() {
  const router = useRouter();
  
  const { appState, setAppState } = useContext(ApplicationContext);

  const [email, setEmail] = useState<string>('morgan.thornton@bison.howard.edu');
  const [password, setPassword] = useState<string>('123123');

  const handleSignIn = useCallback(async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setAppState({
      ...appState,
      lockScreen: true
    });

    login(email, password)
      .then(async (res: TResponse) => {
        if (res.success) {
          setAppState({
            ...appState,
            lockScreen: false,
            authenticated: true,
            user: res.data
          });

          await new Promise(resolve => setTimeout(() => resolve(1), 100));

          router.replace('/(tabs)');
        } else {
          console.log(res.message);
        }
      });
  }, [email, password]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/auth/sign-up')}>
        <Text style={styles.link}>Already have an account? Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007bff',
    fontSize: 14,
    marginTop: 10,
  },
});