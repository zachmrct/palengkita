import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AuthHero } from '@/components/AuthHero';
import { AuthScreen } from '@/components/AuthScreen';
import { PrimaryButton } from '@/components/Buttons';
import { Checkbox, InlineLink, RequirementRow } from '@/components/FormBits';
import { Heading } from '@/components/Heading';
import { TextField, type TextInputHandle } from '@/components/TextField';
import { useAuth } from '@/context/AuthContext';
import { colors, fonts } from '@/theme';
import { checkPassword, EMAIL_RE, isPasswordValid } from '@/utils/validation';

const HERO = require('../../assets/images/signup-hero.jpg');

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
};

const INPUT_HEIGHT = 48;

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInputHandle>(null);
  const passwordRef = useRef<TextInputHandle>(null);
  const confirmRef = useRef<TextInputHandle>(null);

  const checks = checkPassword(password);

  const clear = (key: keyof Errors) =>
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/login'));

  const validate = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Ilagay ang iyong buong pangalan.';
    if (!email.trim()) next.email = 'Ilagay ang iyong email address.';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Hindi mukhang tamang email address.';
    if (!password) next.password = 'Gumawa ng password.';
    else if (!isPasswordValid(password)) next.password = 'Hindi pa naaabot ang lahat ng requirements sa ibaba.';
    if (!confirm) next.confirm = 'Ilagay muli ang iyong password.';
    else if (confirm !== password) next.confirm = 'Hindi magkapareho ang mga password.';
    if (!agreed) next.terms = 'Kailangan mong sumang-ayon para magpatuloy.';
    return next;
  };

  const handleCreate = async () => {
    if (loading) return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await signUp(name, email, password);
      // The protected-route guard in _layout.tsx moves us to /home.
    } finally {
      setLoading(false);
    }
  };

  // TODO: point these at the real Terms / Privacy pages once they exist.
  const openLegal = (title: string) =>
    Alert.alert(title, 'This page will be available soon.');

  return (
    <AuthScreen
      hero={
        <AuthHero
          variant="signup"
          photo={HERO}
          photoDescription="Hands choosing talong and sitaw at a palengke stall in warm daylight"
          photoFocusY={55}
          onBack={goBack}
        />
      }
    >
      <View style={styles.headingBlock}>
        <Heading lead="Tara," accent="magluto tayo." />
        <Text style={styles.subtitle}>
          Create an account to get meal ideas that fit your budget and your nearest palengke.
        </Text>
      </View>

      <View style={styles.field}>
        <TextField
          label="Full name"
          placeholder="Ana Reyes"
          height={INPUT_HEIGHT}
          value={name}
          onChangeText={(t) => {
            setName(t);
            clear('name');
          }}
          error={errors.name}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          submitBehavior="submit"
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <TextField
          label="Email address"
          placeholder="name@email.com"
          height={INPUT_HEIGHT}
          inputRef={emailRef}
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            clear('email');
          }}
          error={errors.email}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          submitBehavior="submit"
          editable={!loading}
        />
      </View>

      <View>
        <TextField
          label="Password"
          placeholder="At least 8 characters"
          height={INPUT_HEIGHT}
          password
          inputRef={passwordRef}
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            clear('password');
          }}
          error={errors.password}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          submitBehavior="submit"
          editable={!loading}
        />
        <View style={styles.requirements}>
          <RequirementRow met={checks.length}>At least 8 characters</RequirementRow>
          <RequirementRow met={checks.number}>At least 1 number</RequirementRow>
          <RequirementRow met={checks.letter}>At least 1 letter</RequirementRow>
        </View>
      </View>

      <View style={styles.confirm}>
        <TextField
          label="Confirm password"
          placeholder="Type it again"
          height={INPUT_HEIGHT}
          password
          inputRef={confirmRef}
          value={confirm}
          onChangeText={(t) => {
            setConfirm(t);
            clear('confirm');
          }}
          error={errors.confirm}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={handleCreate}
          editable={!loading}
        />
      </View>

      <View style={styles.terms}>
        <Checkbox
          checked={agreed}
          onToggle={() => {
            setAgreed((a) => !a);
            clear('terms');
          }}
          error={errors.terms}
        >
          I agree to the{' '}
          <InlineLink size={14.5} onPress={() => openLegal('Terms of Use')}>
            Terms of Use
          </InlineLink>{' '}
          and{' '}
          <InlineLink size={14.5} onPress={() => openLegal('Privacy Policy')}>
            Privacy Policy
          </InlineLink>
          , including how Palengkita uses my location.
        </Checkbox>
      </View>

      <PrimaryButton
        title="CREATE ACCOUNT"
        onPress={handleCreate}
        loading={loading}
        style={styles.primary}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>May account ka na? </Text>
        <InlineLink onPress={goBack}>Mag-log in</InlineLink>
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
    marginTop: 10,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.forest,
  },
  field: {
    marginBottom: 20,
  },
  requirements: {
    marginTop: 18,
    gap: 8,
  },
  confirm: {
    marginTop: 26,
  },
  terms: {
    marginTop: 26,
    marginBottom: 26,
  },
  primary: {
    height: 53,
  },
  footer: {
    marginTop: 34,
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
