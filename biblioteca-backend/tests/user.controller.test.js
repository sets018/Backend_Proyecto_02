const userController = require('../src/controllers/user.controller');
const User = require('../src/models/User');
const httpMocks = require('node-mocks-http');

jest.mock('../src/models/User');
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashed_password')
}));

let req, res;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe('User Controller', () => {
  
  // --- REGISTER ---
  describe('register', () => {
    it('Éxito: Debe registrar usuario (201)', async () => {
      req.body = { nombre: "Test", email: "ok@test.com", password: "123" };
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue();
      await userController.register(req, res);
      expect(res.statusCode).toBe(201);
    });

    it('Fallo: Usuario ya existe (400)', async () => {
      req.body = { email: "dup@test.com" };
      User.findOne.mockResolvedValue({ email: "dup@test.com" });
      await userController.register(req, res);
      expect(res.statusCode).toBe(400);
    });
  });

  // --- GET USER ---
  describe('getUser', () => {
    it('Éxito: Retorna usuario (200)', async () => {
      req.params.id = "uid";
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue({ name: "Juan" }) });
      await userController.getUser(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('Fallo: Usuario no encontrado (404)', async () => {
      req.params.id = "uid";
      User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
      await userController.getUser(req, res);
      expect(res.statusCode).toBe(404);
    });
  });

  // --- UPDATE USER ---
  describe('updateUser', () => {
    it('Éxito: Actualiza datos propios (200)', async () => {
      req.params.id = "uid";
      req.user = { id: "uid" }; // Mismo usuario
      req.body = { nombre: "Nuevo" };
      User.findOneAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: "uid" }) });
      await userController.updateUser(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('Fallo: Sin permiso (403)', async () => {
      req.params.id = "uid";
      req.user = { id: "otro", permisos: [] }; // Otro usuario sin permisos
      await userController.updateUser(req, res);
      expect(res.statusCode).toBe(403);
    });
  });

  // --- DELETE USER ---
  describe('deleteUser', () => {
    it('Éxito: Inhabilita usuario (200)', async () => {
      req.params.id = "uid";
      req.user = { id: "uid" };
      User.findByIdAndUpdate.mockResolvedValue({ _id: "uid" });
      await userController.deleteUser(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('Fallo: Usuario no encontrado al borrar (404)', async () => {
      req.params.id = "uid";
      req.user = { id: "uid" };
      User.findByIdAndUpdate.mockResolvedValue(null);
      await userController.deleteUser(req, res);
      expect(res.statusCode).toBe(404);
    });
  });
});