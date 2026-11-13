import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AuthShell } from '@/components/AuthShell';
import { PrimaryButton } from '@/components/Buttons';
import { InlineLink } from '@/components/FormBits';
import { TextField, type TextInputHandle } from '@/components/TextField';
import { useAuth } from '@/context/AuthContext';
import { ds, fonts } from '@/theme';
import { isEmailOrUsername } from '@/utils/validation';

type Errors = { identifier?: string; password?: string };

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInputHandle>(null);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/welcome'));

  const validate = (): Errors => {
    const next: Errors = {};
    if (!identifier.trim()) next.identifier = 'Ilagay ang iyong email o username.';
    else if (!isEmailOrUsername(identifier)) next.identifier = 'Hindi mukhang tamang email o username.';
    if (!password) next.password = 'Ilagay ang iyong password.';
    return next;
  };

  const handleLogin = async () => {
    if (loading) return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await signIn(identifier, password);
      // The protected-route guard in _layout.tsx moves us to /home.
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell topPlate="chicken" bottomPlate="adobo" onBack={goBack}>
      <View style={styles.field}>
        <TextField
          label="Email or username"
          placeholder="name@email.com"
          value={identifier}
          onChangeText={(t) => {
            setIdentifier(t);
            if (errors.identifier) setErrors((e) => ({ ...e, identifier: undefined }));
          }}
          error={errors.identifier}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          textContentType="username"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          submitBehavior="submit"
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <TextField
          label="Password"
          placeholder="Your password"
          password
          inputRef={passwordRef}
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
          }}
          error={errors.password}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleLogin}
          editable={!loading}
          labelAccessory={
            <Pressable
              hitSlop={8}
              accessibilityRole="link"
              accessibilityLabel="Forgot password?"
              onPress={() =>
                // TODO(backend): password reset flow.
                Alert.alert('Forgot password?', 'Password reset will be available once accounts are connected.')
              }
            >
              <Text style={styles.forgot}>Forgot password?</Text>
            </Pressable>
          }
        />
      </View>

      <PrimaryButton title="Log in" onPress={handleLogin} loading={loading} style={styles.primary} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Wala ka pang account? </Text>
        <InlineLink onPress={() => router.replace('/signup')}>Mag-sign up</InlineLink>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 22 },
  forgot: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: ds.mutedForeground,
  },
  primary: { marginTop: 14 },
  footer: {
    marginTop: 26,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { fontFamily: fonts.sans, fontSize: 14, color: ds.mutedForeground },
});
