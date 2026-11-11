import { StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/Buttons';
import { Placeholder } from '@/components/Placeholder';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  return (
    <Placeholder
      kicker="PROFILE"
      title={`Kumusta, ${user?.name ?? 'kaibigan'}!`}
      body="Profile settings are coming soon."
    >
      <PrimaryButton title="MAG-LOG OUT" onPress={signOut} style={styles.button} />
    </Placeholder>
  );
}

const styles = StyleSheet.create({
  button: { marginTop: 28 },
});
