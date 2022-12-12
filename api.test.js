const request = require("supertest");
const baseURL = "http://localhost:3000";
jest.setTimeout(15000);

describe("GET /allspread", () => {
  it("should return 200", async () => {
    const response = await request(baseURL).get("/allspread");
    expect(response.statusCode).toBe(200);
  });
  it("should return more than one spread", async () => {
    const response = await request(baseURL).get("/allspread");
    expect(Object.keys(response.body).length > 1).toBe(true);
  });
});

describe("GET /onespread", () => {
  it("should return 200", async () => {
    const response = await request(baseURL).get("/onespread/BTC-COP");
    expect(response.statusCode).toBe(200);
  });
  it("should return more than one spread", async () => {
    const response = await request(baseURL).get("/onespread/BTC-COP");
    expect(Object.keys(response.body).length === 1).toBe(true);
  });
  it("should return 404, marketId not found", async () => {
    const response = await request(baseURL).get("/onespread/BTCCOP");
    expect(Object.keys(response.body).length === 1).toBe(true);
  });
});

describe("GET /spreadalert", () => {
  it("should return 200", async () => {
    const response = await request(baseURL).get("/spreadalert");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /addalert", () => {
  it("should return 200", async () => {
    const response = await request(baseURL).get("/addalert/BTC-CLP/1");
    expect(response.statusCode).toBe(201);
  });
  it("should return 404, marketId not found", async () => {
    const response = await request(baseURL).get("/addalert/USDCCLP/1");
    expect(response.statusCode).toBe(404);
  });
  it("should return 400, spread must be a number", async () => {
    const response = await request(baseURL).get("/addalert/USDC-CLP/string");
    expect(response.statusCode).toBe(404);
  });
});

describe("GET /removealert", () => {
    it("should return 200", async () => {
      const response = await request(baseURL).get("/removealert/BTC-CLP");
      expect(response.statusCode).toBe(202);
    });
    it("should return 404", async () => {
      const response = await request(baseURL).get("/removealert/USDC-CLP");
      expect(response.statusCode).toBe(404);
    });
  });
