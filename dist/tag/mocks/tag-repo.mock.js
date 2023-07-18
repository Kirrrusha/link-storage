"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagRepositoryMock = void 0;
const tagRepositoryMock = () => ({
    findAll: jest.fn(),
    create: jest.fn(),
    edit: jest.fn(),
    remove: jest.fn(),
    findOne: jest.fn(),
});
exports.tagRepositoryMock = tagRepositoryMock;
//# sourceMappingURL=tag-repo.mock.js.map