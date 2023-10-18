export const authServiceMock = () => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
  updateRefreshTokens: jest.fn(),
  verifyUser: jest.fn(),
  sendConfirmation: jest.fn(),
  logout: jest.fn(),
});
