// Settings Index - Redirects to the main settings layout
import { Redirect } from 'expo-router';

export default function SettingsIndex() {
  return <Redirect href="/settings/_layout" />;
}
