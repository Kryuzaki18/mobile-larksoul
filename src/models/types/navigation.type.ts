export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: { returnDate?: string } | undefined;
  Insights: undefined;
  Settings: undefined;
  Security: undefined;
  AddEntry: { date?: string; entryId?: string } | undefined;
};
