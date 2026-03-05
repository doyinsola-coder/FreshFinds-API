import { connect, disconnect } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app.js";
import request from "supertest";
import Product from "../src/models/product.js";

let mongoServer;
let authToken;
let product;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // create a user and log in to get a token
  const userData = {
    name: "Cart User",
    email: "cartuser@test.com",
    password: "password123",
    phoneNumber: "1234567890",
    address: "123 Cart Street",
  };
  await request(app).post("/api/auth/register").send(userData);
  const loginRes = await request(app).post("/api/auth/login").send({
    emailAddress: userData.email,
    password: userData.password,
  });
  authToken = loginRes.body.token;

  // create a product to add to cart
  product = await Product.create({
    name: "Test Product",
    price: 100,
    description: "Test description",
    images: ["img.jpg"],
    stock: 10,
  });
});

afterAll(async () => {
  await disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Product.deleteMany({});
});

describe("CART API", () => {
  it("should return empty cart initially", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should add an item to the cart", async () => {
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId: product._id.toString(), quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].product).toBe(product._id.toString());
    expect(res.body[0].quantity).toBe(2);
  });

  it("should update quantity of existing item", async () => {
    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId: product._id.toString(), quantity: 1 });

    const res = await request(app)
      .put("/api/cart")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId: product._id.toString(), quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body[0].quantity).toBe(5);
  });

  it("should remove item from cart", async () => {
    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId: product._id.toString(), quantity: 2 });

    const res = await request(app)
      .delete("/api/cart")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId: product._id.toString() });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
