import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function BookingPayment() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('khalti');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/rooms/${roomId}`);
        if (!res.ok) throw new Error('Room not found');
        const data = await res.json();
        setRoom(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, user, navigate]);

  const serviceFee = room ? room.pricePerMonth * selectedRooms : 0;

  const handleKhaltiPayment = () => {
    if (!window.KhaltiCheckout) {
      alert("Khalti SDK not loaded. Please try again.");
      return;
    }

    const config = {
      publicKey: "8ae3f10dddac43b2930df304142d2e49",
      productIdentity: roomId,
      productName: room?.title || "Room Booking",
      productUrl: window.location.href,
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING"],
      eventHandler: {
        onSuccess(payload) {
          console.log("Khalti success:", payload);
          createBookingAndRedirect();
        },
        onError(error) {
          console.error("Khalti error:", error);
          alert("Payment failed or was cancelled.");
        },
        onClose() {
          console.log("Khalti widget closed");
        }
      }
    };

    const checkout = new window.KhaltiCheckout(config);
    // Amount in paisa
    checkout.show({ amount: serviceFee * 100 });
  };

  const handleEsewaPayment = async () => {
    // For eSewa, we must redirect. We will create the booking first, then redirect to eSewa.
    // In a real production app, booking would be 'pending' and updated via eSewa callback.
    try {
      const res = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          roomId,
          numRooms: selectedRooms,
          paymentMethod: 'esewa',
          totalAmount: serviceFee
        })
      });

      if (!res.ok) throw new Error('Failed to create booking');
      const bookingData = await res.json();

      const path = "https://uat.esewa.com.np/epay/main";
      const params = {
        amt: serviceFee,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: serviceFee,
        pid: bookingData._id,
        scd: "EPAYTEST",
        su: `http://localhost:5173/user/dashboard?tab=bookings`,
        fu: `http://localhost:5173/booking/${roomId}`
      };

      const form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", path);

      for (const key in params) {
        const hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('eSewa error:', err);
      alert('Failed to initiate eSewa payment');
    }
  };

  const createBookingAndRedirect = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          roomId,
          numRooms: selectedRooms,
          paymentMethod,
          totalAmount: serviceFee
        })
      });

      if (res.ok) {
        const bookingData = await res.json();
        navigate('/confirmation', { state: { booking: bookingData, room } });
      } else if (res.status === 401) {
        const error = await res.json();
        alert(error.message || 'Session expired. Please sign in again.');
        logout();
        navigate('/signin');
      } else {
        const error = await res.json();
        alert(error.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed. Please check backend connection.');
    }
  };

  const handleBooking = () => {
    if (paymentMethod === 'khalti') {
      handleKhaltiPayment();
    } else if (paymentMethod === 'esewa') {
      handleEsewaPayment();
    } else {
      createBookingAndRedirect();
    }
  };

  // Dynamically load Khalti SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Room details not found</h2>
          <Link to="/rooms" className="text-primary hover:underline">Back to listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBFE] min-h-screen">
      <Navbar />

      <main className="max-w-screen-xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-3xl mb-12">
          <h1 className="text-[44px] font-black text-[#0040A1] leading-tight mb-4 tracking-tight">Complete Your Booking</h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Secure your residence using Dev/Test payment modes. Confirm your booking by proceeding with eSewa or Khalti test payments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Steps */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-12">

            {/* Step 1: Number of Rooms */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0040A1] text-white flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="text-xl font-bold text-slate-900">Number of Rooms</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 1, label: '1 Room', sub: 'Single Unit', multiplier: 1 },
                  { id: 2, label: '2 Rooms', sub: 'Duo Package', multiplier: 2 },
                  { id: 3, label: '3 Rooms', sub: 'Full Flat/Suite', multiplier: 3 }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedRooms(item.id)}
                    className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all duration-200 text-left bg-white ${selectedRooms === item.id
                      ? 'border-[#0040A1] ring-4 ring-[#0040A1]/5 bg-[#FAFBFE]'
                      : 'border-slate-100 hover:border-slate-200'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[#0040A1] mb-4 text-xl">bed</span>
                    <span className="text-lg font-bold text-slate-900 mb-1">{item.label}</span>
                    <span className="text-sm text-slate-500 mb-4">{item.sub}</span>
                    <span className="text-lg font-black text-[#0040A1]">
                      Rs. {room ? (room.pricePerMonth * item.multiplier).toLocaleString() : 0}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2: Payment Method */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0040A1] text-white flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="text-xl font-bold text-slate-900">Payment Method (Test Mode)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'esewa', label: 'eSewa Wallet', sub: 'Available Soon', icon: 'e', color: 'bg-slate-400', disabled: true },
                  { id: 'khalti', label: 'Khalti Wallet', sub: 'Test Checkout Widget', icon: 'k', color: 'bg-[#5C2D91]' }
                ].map((method) => (
                  <button
                    key={method.id}
                    disabled={method.disabled}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 text-left bg-white ${paymentMethod === method.id
                      ? 'border-[#0040A1] ring-4 ring-[#0040A1]/5 bg-[#FAFBFE]'
                      : 'border-slate-100 hover:border-slate-200'
                      } ${method.disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
                  >
                    <div className={`${method.color} w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm`}>
                      {method.icon}
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900">{method.label}</div>
                      <div className="text-xs text-slate-500">{method.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                { label: 'VERIFIED AGENT', icon: 'verified' },
                { label: 'DEV ENVIRONMENT', icon: 'code' },
                { label: 'TEST TRANSACTION', icon: 'science' }
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#F1F5F9]/50 border border-slate-200 px-4 py-2 rounded-full">
                  <span className="material-symbols-outlined text-[18px] text-[#0040A1]">{badge.icon}</span>
                  <span className="text-[10px] font-black tracking-widest text-[#0040A1]">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-32">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Order Summary</h2>

              <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-10">
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                  <img src={room.images?.[0]} alt={room.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-1 line-clamp-1">{room.title}</h3>
                  <div className="text-[11px] text-slate-500 font-medium mb-2">{room.location}</div>
                  <div className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold tracking-wider uppercase">PREMIUM LISTING</div>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                  <span>Room Rental Price</span>
                  <span className="text-slate-900">Rs. {serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                  <span>Documentation Charge</span>
                  <span className="text-[#B45309]">Included</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                  <span>Processing Fee</span>
                  <span className="text-slate-900">Rs. 0</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-6 mb-10">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">TOTAL AMOUNT</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-[32px] font-black text-[#0040A1] tracking-tighter">Rs. {serviceFee.toLocaleString()}</div>
                  <span className="text-[10px] text-slate-400 font-medium">Tax included where applicable</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full h-16 bg-[#0040A1] hover:bg-[#00358a] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-[#0040A1]/20 mb-6"
              >
                Pay & Book Room
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  By clicking "Pay & Book Room", you agree to The Urban Sanctuary's <br />
                  <a href="#" className="underline">Terms of Service</a> and Cancellation Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
