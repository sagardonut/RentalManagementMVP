import React from 'react';

const RecentPayments = ({ bookings, loading }) => {
  if (loading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 animate-pulse">
        <div className="h-8 w-40 bg-surface-container rounded mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-surface-container rounded"></div>
                  <div className="h-3 w-20 bg-surface-container rounded"></div>
                </div>
              </div>
              <div className="h-4 w-16 bg-surface-container rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-on-surface">Recent Payments</h3>
        <button className="text-primary font-bold text-sm hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {bookings.length > 0 ? bookings.slice(0, 5).map((booking) => (
          <div key={booking._id} className="flex justify-between items-center p-3 rounded-xl hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">{booking.user?.fullName || 'Guest User'}</p>
                <p className="text-xs text-on-surface-variant">
                  {new Date(booking.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-on-surface text-sm">
                ${booking.totalPrice?.toLocaleString() || '0'}
              </p>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${
                booking.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {booking.paymentStatus || 'Pending'}
              </p>
            </div>
          </div>
        )) : (
          <div className="py-10 text-center text-on-surface-variant font-medium">
            No recent payments tracked yet.
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-surface-container rounded-xl border border-outline-variant/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xl">trending_up</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest leading-none mb-1">Weekly Profit</p>
            <p className="text-lg font-bold text-on-surface">$12,480.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentPayments;
