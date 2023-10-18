export const tokenServiceMock = () => ({
  createAuthTokens: jest.fn(),
  getAll: jest.fn(),
  generateToken: jest.fn(),
  decodeToken: jest.fn(),
  deleteById: jest.fn(),
  deleteRefreshToken: jest.fn(),
  findRefreshToken: jest.fn(),
  validateToken: jest.fn(),
});
