process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('../app');
let items = require('../fakeDb');

let item1 = {
  name: 'candy',
  price: 1.99
}

let item2 = {
  name: 'medicine',
  price: 99.99
}

beforeEach(function () {
  items.push(item1, item2);
})

afterEach(function () {
  items.length = 0;
})

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [item1, item2] })
  })
})

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${item2.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(item2);
  })
  test("Get non-existent item", async () => {
    const res = await request(app).get('/items/apple');
    expect(res.statusCode).toBe(404);
  })
})

describe("POST /items", () => {
  test("Add new item", async () => {
    let newItem = {
      name: 'cat',
      price: 1999.99
    }
    const res = await request(app).post('/items').send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: newItem });
  })
  test("Add duplicate item", async () => {
    const res = await request(app).post('/items').send(item1);
    expect(res.statusCode).toBe(409);
  })
})

describe("PATCH /items/:name", () => {
  test("Update existing item", async () => {
    let updatedItem = {
      name: 'blue medicine',
      price: 199.99
    }
    const res = await request(app).patch(`/items/${item2.name}`).send(updatedItem);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ updated: updatedItem });
  })
})

describe("DELETE /items/:name", () => {
  test("Delete non existent item", async () => {
    const res = await request(app).delete('/items/cookie');
    expect(res.statusCode).toEqual(404);
    expect(items.length).toEqual(2);
  })
  test("Delete an existing item", async () => {
    const res = await request(app).delete(`/items/${item2.name}`);
    expect(res.body).toEqual({ message: 'Deleted' });
    expect(items.length).toEqual(1);
  })

})