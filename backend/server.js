const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const userRoutes = require('./Routes/userRoutes');
const productRoutes = require('./Routes/productRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const sellerRoutes = require('./Routes/sellerRoutes');

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sellers', sellerRoutes);

app.get('/', (req, res) => res.send('DesignerHub Backend Running!'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});