import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const apiConfig = readFileSync(new URL('../constants/api.ts', import.meta.url), 'utf8');
const apiService = readFileSync(new URL('../services/api.ts', import.meta.url), 'utf8');
const profileScreen = readFileSync(new URL('../app/(tabs)/profile.tsx', import.meta.url), 'utf8');

const withoutCommentOnlyLines = (source) => source
  .split('\n')
  .filter((line) => !line.trimStart().startsWith('//'))
  .join('\n');

test('local API configuration does not depend on a temporary Cloudflare tunnel', () => {
  const activeConfig = withoutCommentOnlyLines(apiConfig);

  assert.doesNotMatch(activeConfig, /trycloudflare\.com/i);
  assert.match(activeConfig, /http:\/\/localhost:5000\/api/);
});

test('API service shares the central API base URL', () => {
  const activeService = withoutCommentOnlyLines(apiService);

  assert.match(activeService, /import \{ API_BASE_URL \} from '@\/constants\/api';/);
  assert.doesNotMatch(activeService, /export const API_BASE_URL\s*=\s*['"]/);
});

test('API URL supports an Expo public environment override', () => {
  assert.match(apiConfig, /process\.env\.EXPO_PUBLIC_API_BASE_URL/);
});

test('profile logout uses a web confirmation path that executes logout', () => {
  assert.match(profileScreen, /Platform\.OS === 'web'/);
  assert.match(profileScreen, /setShowLogoutConfirm\(true\)/);
  assert.match(profileScreen, /visible=\{showLogoutConfirm\}/);
  assert.match(profileScreen, /Are you sure you want to logout\?/);
  assert.match(profileScreen, /await logout\(\);\s*router\.replace\('\/\(auth\)\/login'\);/s);
});
