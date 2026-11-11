import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AuthHero } from '@/components/AuthHero';
import { AuthScreen } from '@/components/AuthScreen';
import { GoogleButton, OrDivider, PrimaryButton } from '@/components/Buttons';
import { InlineLink } from '@/components/FormBits';
import { Heading } from '@/components/Heading';
import { TextField, type TextInputHandle } from '@/components/TextField';
import { useAuth } from '@/context/AuthContext';
import { colors, fonts } from '@/theme';
import { isEmailOrUsername } from '@/utils/validation';

const HERO = require('../../assets/images/login-hero.jpg');

type Errors = { identifier?: string; password?: string };

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInputHandle>(null);

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
    <AuthScreen
      hero={
        <AuthHero
          variant="login"
          photo={HERO}
          photoDescription="Kamatis, sitaw, kalabasa and malunggay on a bilao, overhead, in natural morning light"
          photoFocusY={55}
        />
      }
    >
      <View style={styles.headingBlock}>
        <Heading lead="Maligayang" accent="pagbabalik." stacked />
        <Text style={styles.subtitle}>Log in to see what's cheap and fresh near you.</Text>
      </View>

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

      <PrimaryButton title="LOG IN" onPress={handleLogin} loading={loading} style={styles.primary} />

      <View style={styles.divider}>
        <OrDivider />
      </View>

      <GoogleButton
        disabled={loading}
        onPress={() =>
          // TODO(backend): Google sign-in (expo-auth-session + OAuth client IDs).
          Alert.alert('Continue with Google', 'Google sign-in will be connected once the backend is ready.')
        }
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Bago ka rito? </Text>
        <InlineLink onPress={() => router.push('/signup')}>Gumawa ng account</InlineLink>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  headingBlock: {
    marginTop: 28,
    marginBottom: 26,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.forest,
  },
  field: {
    marginBottom: 18,
  },
  forgot: {
    fontFamily: fonts.bodyBold,
    fontSize: 14.5,
    color: colors.link,
    textDecorationLine: 'underline',
    textDecorationColor: colors.link,
  },
  primary: {
    marginTop: 7,
  },
  divider: {
    marginTop: 28,
    marginBottom: 22,
  },
  footer: {
    marginTop: 36,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.forest,
  },
});
