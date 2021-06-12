const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get('/', (req, res) => {
  res.json({ items });
})

router.post('/', (req, res) => {
  const name = req.body.name;
  const price = req.body.price;

  if (!name || !price)
    throw new ExpressError('Name or price is missing', 400);
  if (items.find(item => item.name === name))
    throw new ExpressError(`${name} already exists on list`, 409);
  if (isNaN(price))
    throw new ExpressError(`${price} is not a number`, 400);

  const newItem = {
    name: name,
    price: price
  }
  items.push(newItem);
  res.status(201).json({ added: newItem });
})

router.get('/:name', (req, res) => {
  const item = items.find(item => item.name === req.params.name);
  if (!item)
    throw new ExpressError('Item not found', 404);
  res.json(item);
})

router.patch('/:name', (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const item = items.find(item => item.name === req.params.name);
  if (!item)
    throw new ExpressError('Item to be updated not found', 404);
  if (!name || !price)
    throw new ExpressError('Name or price is missing', 400);
  if (isNaN(price))
    throw new ExpressError(`${price} is not a number`, 400);
  item.name = name;
  item.price = price;
  res.status(201).json({ updated: item })
})

router.delete('/:name', (req, res) => {
  const item = items.findIndex(item => item.name === req.params.name);
  if (item === -1)
    throw new ExpressError('Item to be deleted not found', 404);
  items.splice(item, 1);
  res.json({ message: 'Deleted' });
})

module.exports = router;