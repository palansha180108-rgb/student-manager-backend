'use client';

import { useCart } from '../src/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    roomNo: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Naya order object banakar localStorage mein save kar rahe hain (Backend API aane par API se replace ho jayega)
    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      items: cart,
      total: totalAmount,
      customer: formData,
      status: 'Preparing',
      date: new Date().toLocaleTimeString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem('cafe_orders') || '[]');
    localStorage.setItem('cafe_orders', JSON.stringify([newOrder, ...existingOrders]));

    clearCart();
    router.push(`/orders/${newOrder.id}`);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h1 style={{ color: '#4a154b', marginBottom: '20px' }}>⚡ Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Customer Details Form */}
        <form onSubmit={handlePlaceOrder} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Delivery Details</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Full Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              value={formData.name} 
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              placeholder="Enter your name"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Hostel / Room No.</label>
            <input 
              type="text" 
              name="roomNo" 
              required 
              value={formData.roomNo} 
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              placeholder="e.g. Block A, Room 204"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              required 
              value={formData.phone} 
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              placeholder="9876543210"
            />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
          >
            Place Order (₹{totalAmount})
          </button>
        </form>

        {/* Order Summary */}
        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Order Summary</h3>
          {cart.length === 0 ? (
            <p style={{ color: '#64748b' }}>No items in cart.</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span>{item.name} x {item.quantity}</span>
                  <span style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                <span>Total Amount:</span>
                <span style={{ color: '#16a34a' }}>₹{totalAmount}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}