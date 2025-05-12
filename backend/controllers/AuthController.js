const Seller = require('../Models/Seller');
const jwt = require('jsonwebtoken');

const generateToken = (seller) => {
  return jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.registerSeller = async (req, res) => {
  const { shopName, ownerName, email, phone, password } = req.body;

  try {
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) return res.status(400).json({ message: 'Email already in use' });

    const seller = new Seller({ shopName, ownerName, email, phone, password });
    await seller.save();

    const token = generateToken(seller);

    res.status(201).json({
      token,
      seller: {
        id: seller._id,
        shopName: seller.shopName,
        ownerName: seller.ownerName,
        email: seller.email,
        phone: seller.phone,
        isVerified: seller.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginSeller = async (req, res) => {
  const { email, password } = req.body;

  try {
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await seller.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(seller);

    res.status(200).json({
      token,
      seller: {
        id: seller._id,
        shopName: seller.shopName,
        ownerName: seller.ownerName,
        email: seller.email,
        phone: seller.phone,
        isVerified: seller.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
