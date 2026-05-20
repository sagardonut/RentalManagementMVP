import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [status, setStatus] = useState('Verifying your payment...');

  useEffect(() => {
    if (!user) return;

    const verifyPayment = async () => {
      try {
        const isEsewa = location.pathname.includes('esewa-success');
        const isKhalti = location.pathname.includes('khalti-success');
        
        let endpoint = '';
        let payload = {};

        if (isEsewa) {
          const data = searchParams.get('data');
          if (!data) throw new Error('Missing eSewa payload');
          endpoint = '/api/payment/esewa/verify';
          payload = { data };
        } else if (isKhalti) {
          const pidx = searchParams.get('pidx');
          if (!pidx) throw new Error('Missing Khalti payload');
          endpoint = '/api/payment/khalti/verify';
          payload = { pidx };
        } else {
          throw new Error('Invalid payment gateway');
        }

        const res = await fetch(`http://localhost:5001${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(payload)
        });

        const result = await res.json();
        
        if (res.ok && result.success) {
          setStatus('Payment verified successfully! Redirecting...');
          setTimeout(() => navigate('/confirmation', { state: { booking: result.booking } }), 1500);
        } else {
          throw new Error(result.message || 'Payment verification failed');
        }
      } catch (err) {
        console.error(err);
        setStatus(`Error: ${err.message}. Please contact support.`);
        setTimeout(() => navigate('/rooms'), 3000);
      }
    };

    verifyPayment();
  }, [user, location, searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Processing Payment</h2>
        <p className="text-slate-500 dark:text-slate-400">{status}</p>
      </div>
    </div>
  );
}
