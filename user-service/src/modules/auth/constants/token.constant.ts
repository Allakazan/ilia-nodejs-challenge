/**
 * Authentication token configuration constants
 * Centralized configuration for token expiration times
 */

export const TOKEN_CONFIG = {
  // Access token configuration
  ACCESS_TOKEN: {
    EXPIRES_IN: '1h', // 1 hour
    EXPIRES_IN_SECONDS: 60 * 60,
  },
} as const;
