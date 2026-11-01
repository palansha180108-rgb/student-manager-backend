'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  items: Array<{ id: number; name: string; price: number; quantity: number }>;
  total: number;
  customer: { name: string; roomNo: string; phone: string };
  status: string;
  date: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const savedOrders = JSON.parse(localStorage.getItem('cafe_orders') || '[]');
      const found = savedOrders.find((o: Order) => o.id === orderId);
      setOrder(found || null);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Segoe UI, sans-serif', textAlign: 'center' }}>
        <h2>Order not found!</h2>
        <p style={{ color: '#64748b' }}>Could not find details for order ID: {orderId}</p>
        <Link href="/orders" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>← Back to Orders</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
        <h1 style={{ color: '#4a154b', margin: 0 }}>📄 Order Details</h1>
        <Link href="/orders" style={{ color: '#4a154b', textDecoration: 'none', fontWeight: '600' }}>← Back to Orders</Link>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>{order.id}</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Placed at: {order.date}</p>
          </div>
          <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
            {order.status}
          </span>
        </div>

        <div style={{ marginBottom: '25px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Delivery Information</h4>
          <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Name:</strong> {order.customer?.name}</p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Room / Hostel:</strong> {order.customer?.roomNo}</p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Phone:</strong> {order.customer?.phone}</p>
        </div>

        <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>Ordered Items</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span>{item.name} (x{item.quantity})</span>
              <span style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #e2e8f0', paddingTop: '15px', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
          <span>Total Amount:</span>
          <span style={{ color: '#16a34a' }}>₹{order.total}</span>
        </div>
      </div>
    </div>
  );
}