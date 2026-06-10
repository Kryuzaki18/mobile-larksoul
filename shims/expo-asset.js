// Stub for expo-asset — only used by expo-sqlite's importDatabaseFromAssetAsync,
// which we never call. Metro requires the module to exist to bundle hooks.js.
export const Asset = {
  fromModule: () => ({ downloadAsync: async () => ({}) }),
};
