export const userServiceMock = () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findAll: jest.fn(),
  validateUserPassword: jest.fn(),
  verifyUser: jest.fn(),
  isUserExistByEmail: jest.fn(),
});
