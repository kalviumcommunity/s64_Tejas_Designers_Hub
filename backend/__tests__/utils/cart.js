// cart.js
function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

module.exports = { calculateTotal }; // ✅ CommonJS export
