const reservationController = require('../src/controllers/reservation.controller');
const Reservation = require('../src/models/Reservation');
const Book = require('../src/models/Book');
const httpMocks = require('node-mocks-http');

jest.mock('../src/models/Reservation');
jest.mock('../src/models/Book');

let req, res;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe('Reservation Controller', () => {

  // --- CREATE ---
  describe('createReservation', () => {
    it('Éxito: Crea reserva (201)', async () => {
      req.body = { bookId: "bid" };
      req.user = { id: "uid" };
      
      // Libro existe y disponible
      const mockBook = { disponible: true, save: jest.fn() };
      Book.findById.mockResolvedValue(mockBook);
      Reservation.prototype.save = jest.fn().mockResolvedValue();

      await reservationController.createReservation(req, res);
      expect(res.statusCode).toBe(201);
    });

    it('Fallo: Libro no encontrado (404)', async () => {
      req.body = { bookId: "bid" };
      req.user = { id: "uid" };
      Book.findById.mockResolvedValue(null);

      await reservationController.createReservation(req, res);
      expect(res.statusCode).toBe(404);
    });

    it('Fallo: Libro no disponible (400)', async () => {
      req.body = { bookId: "bid" };
      req.user = { id: "uid" };
      // Libro existe pero NO disponible
      Book.findById.mockResolvedValue({ disponible: false });

      await reservationController.createReservation(req, res);
      expect(res.statusCode).toBe(400);
    });
  });

  // --- HISTORIALES ---
  describe('Historiales', () => {
    it('getBookHistory: Éxito (200)', async () => {
      req.params.bookId = "bid";
      // Mock encadenado populate().sort()
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      };
      Reservation.find.mockReturnValue(mockChain);

      await reservationController.getBookHistory(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('getUserHistory: Éxito (200)', async () => {
      req.params.userId = "uid";
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      };
      Reservation.find.mockReturnValue(mockChain);

      await reservationController.getUserHistory(req, res);
      expect(res.statusCode).toBe(200);
    });
  });
});