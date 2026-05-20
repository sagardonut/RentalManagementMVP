const crypto = require('crypto');
const Booking = require('../models/Booking.model');

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || 'ab2f9712acdc4f6da6eab27cc7852e6c'; // Default dummy/test key if none provided

exports.initiateEsewa = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    
    const transaction_uuid = `${bookingId}-${Date.now()}`;
    const product_code = ESEWA_MERCHANT_CODE;
    
    const signatureString = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = crypto.createHmac('sha256', ESEWA_SECRET_KEY).update(signatureString).digest('base64');
    
    await Booking.findByIdAndUpdate(bookingId, { 
      transactionId: transaction_uuid,
      paymentStatus: 'pending'
    });
    
    res.json({
      amount: amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: transaction_uuid,
      product_code: product_code,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${FRONTEND_URL}/payment/esewa-success`,
      failure_url: `${FRONTEND_URL}/payment/failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: hash,
      epay_url: "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyEsewa = async (req, res) => {
  try {
    const { data } = req.body;
    const decodedStr = Buffer.from(data, 'base64').toString('utf-8');
    const decodedData = JSON.parse(decodedStr);
    
    if (decodedData.status !== 'COMPLETE') {
      return res.status(400).json({ message: 'Payment not completed' });
    }
    
    const booking = await Booking.findOne({ transactionId: decodedData.transaction_uuid });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    booking.paymentStatus = 'completed';
    await booking.save();
    
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.initiateKhalti = async (req, res) => {
  try {
    const { bookingId, amount, name, email, phone } = req.body;
    
    const payload = {
      return_url: `${FRONTEND_URL}/payment/khalti-success`,
      website_url: FRONTEND_URL,
      amount: amount * 100, // Khalti needs amount in paisa
      purchase_order_id: bookingId,
      purchase_order_name: "Room Booking Service Fee",
      customer_info: {
        name: name || "Customer",
        email: email || "test@test.com",
        phone: phone || "9800000000"
      }
    };
    
    const response = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
      method: 'POST',
      headers: {
        'Authorization': `key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      await Booking.findByIdAndUpdate(bookingId, { 
        transactionId: data.pidx,
        paymentStatus: 'pending'
      });
      res.json({ payment_url: data.payment_url });
    } else {
      res.status(400).json({ error: data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyKhalti = async (req, res) => {
  try {
    const { pidx } = req.body;
    
    const response = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
      method: 'POST',
      headers: {
        'Authorization': `key ${KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pidx })
    });
    
    const data = await response.json();
    
    if (data.status === 'Completed') {
      const booking = await Booking.findOne({ transactionId: pidx });
      if (booking) {
        booking.paymentStatus = 'completed';
        await booking.save();
        res.json({ success: true, booking });
      } else {
        res.status(404).json({ message: 'Booking not found' });
      }
    } else {
      res.status(400).json({ message: 'Payment not verified', data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
