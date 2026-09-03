// constants/api.ts
// Central API base URL used by services/api.ts and services/invoice.ts.
//
// Local development default points to the backend running with:
//   node C:\Users\bharg\Downloads\super-tenthouse-backend\server.js
//
// For production or another machine, override with:
//   EXPO_PUBLIC_API_BASE_URL=https://your-domain.com/api
//
// Note: For a physical Android/iOS device, localhost means the device itself.
// Use your computer LAN IP instead, for example: http://192.168.1.10:5000/api

// const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

const DEFAULT_API_BASE_URL = 'https://tenthouse.iiiqbets.com:5000/api';

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
).replace(/\/+$/, '');
