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
});

describe("GET /spreadalert", () => {
  it("should return 200", async () => {
    const response = await request(baseURL).get("/spreadalert");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /addalert", () => {
  it("should return 200", async () => {
    const response = await request(baseURL).get("/addalert/marketId/5");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /removealert", () => {
    it("should return 200", async () => {
      const response = await request(baseURL).get("/removealert/marketId");
      expect(response.statusCode).toBe(200);
    });
  });
