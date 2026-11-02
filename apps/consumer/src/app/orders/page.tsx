'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  items: Array<{ id: number; name: string; price: number; quantity: number }>;
  total: number;
  status: string;
  date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('cafe_orders') || '[]');
    setOrders(savedOrders);
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
        <h1 style={{ color: '#4a154b', margin: 0 }}>📦 My Orders</h1>
        <Link href="/" style={{ color: '#4a154b', textDecoration: 'none', fontWeight: '600' }}>← Back to Menu</Link>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <h3>No orders placed yet!</h3>
          <p>Your active orders will appear here once you checkout.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>Order ID: {order.id}</span>
                <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                  {order.status}
                </span>
              </div>
              <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>Placed at: {order.date}</p>
              <div style={{ margin: '10px 0' }}>
                {order.items.map((item, idx) => (
                  <span key={idx} style={{ display: 'inline-block', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', marginRight: '8px', fontSize: '13px', marginBottom: '5px' }}>
                    {item.name} (x{item.quantity})
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>Total: ₹{order.total}</span>
                <Link href={`/orders/${order.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}