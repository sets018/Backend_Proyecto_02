const bookController = require('../src/controllers/book.controller');
const Book = require('../src/models/Book');
const httpMocks = require('node-mocks-http');

jest.mock('../src/models/Book');

let req, res;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe('Book Controller', () => {

  // --- CREATE ---
  describe('createBook', () => {
    it('Éxito: Crea libro (201)', async () => {
      req.body = { nombre: "Libro 1" };
      Book.prototype.save = jest.fn().mockResolvedValue();
      await bookController.createBook(req, res);
      expect(res.statusCode).toBe(201);
    });

    it('Fallo: Error de validación Mongoose (400)', async () => {
      // Simulamos error al guardar
      Book.prototype.save = jest.fn().mockRejectedValue(new Error("Validation Error"));
      await bookController.createBook(req, res);
      expect(res.statusCode).toBe(400);
    });
  });

  // --- GET BOOKS (Complejo) ---
  describe('getBooks', () => {
    it('Éxito: Retorna lista con paginación (200)', async () => {
      req.query = { page: 1, limit: 10 };
      
      // Mock encadenado para find().select().skip().limit()
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([{ nombre: "L1" }])
      };
      Book.find.mockReturnValue(mockChain);
      Book.countDocuments.mockResolvedValue(1);

      await bookController.getBooks(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('Fallo: Error de base de datos (500)', async () => {
      Book.find.mockImplementation(() => { throw new Error("DB Error") });
      await bookController.getBooks(req, res);
      expect(res.statusCode).toBe(500);
    });
  });

  // --- GET BY ID ---
  describe('getBookById', () => {
    it('Éxito: Retorna un libro (200)', async () => {
      req.params.id = "bid";
      Book.findOne.mockResolvedValue({ nombre: "L1" });
      await bookController.getBookById(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('Fallo: Libro no encontrado (404)', async () => {
      req.params.id = "bid";
      Book.findOne.mockResolvedValue(null);
      await bookController.getBookById(req, res);
      expect(res.statusCode).toBe(404);
    });
  });

  // --- UPDATE ---
  describe('updateBook', () => {
    it('Éxito: Actualiza libro (200)', async () => {
      req.params.id = "bid";
      Book.findOneAndUpdate.mockResolvedValue({ nombre: "Updated" });
      await bookController.updateBook(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('Fallo: Libro no encontrado (404)', async () => {
      req.params.id = "bid";
      Book.findOneAndUpdate.mockResolvedValue(null);
      await bookController.updateBook(req, res);
      expect(res.statusCode).toBe(404);
    });
  });

  // --- DELETE ---
  describe('deleteBook', () => {
    it('Éxito: Inhabilita libro (200)', async () => {
      req.params.id = "bid";
      Book.findByIdAndUpdate.mockResolvedValue({ _id: "bid" });
      await bookController.deleteBook(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('Fallo: Libro no encontrado (404)', async () => {
      req.params.id = "bid";
      Book.findByIdAndUpdate.mockResolvedValue(null);
      await bookController.deleteBook(req, res);
      expect(res.statusCode).toBe(404);
    });
  });
});