// cart.test.js
const { calculateTotal } = require('./cart'); // ✅ Match the actual file path

test('calculates total price correctly', () => {
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 3 },
  ];

  expect(calculateTotal(items)).toBe(100 * 2 + 50 * 3); // 350
});
