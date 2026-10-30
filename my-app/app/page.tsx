'use client';

import { useState } from 'react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'cart' | 'orders' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Menu Items with Verified Working Direct Image URLs
  const [menuItems] = useState([
    // Coffee
    { id: 1, name: 'Americano', category: 'Coffee', price: 110, status: 'Available', waitTime: '5 mins', featured: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop' },
    { id: 2, name: 'Filter Coffee', category: 'Coffee', price: 80, status: 'Available', waitTime: '5 mins', featured: true, image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&auto=format&fit=crop' },
    { id: 3, name: 'Cafe Frappe', category: 'Coffee', price: 180, status: 'Available', waitTime: '8 mins', featured: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&auto=format&fit=crop' },
    { id: 4, name: 'Iced Americano', category: 'Coffee', price: 140, status: 'Available', waitTime: '5 mins', featured: false, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop' },
    { id: 5, name: 'Vanilla Latte', category: 'Coffee', price: 180, status: 'Available', waitTime: '8 mins', featured: false, image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&auto=format&fit=crop' },
    { id: 6, name: 'Caramel Latte', category: 'Coffee', price: 190, status: 'Available', waitTime: '8 mins', featured: true, image: 'https://images.unsplash.com/photo-1599398054066-846f28917f38?w=300&auto=format&fit=crop' },

    // Beverages and Tea
    { id: 7, name: 'Hot Chocolate', category: 'Beverages and Tea', price: 160, status: 'Available', waitTime: '6 mins', featured: true, image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=300&auto=format&fit=crop' },
    { id: 8, name: 'Masala Tea', category: 'Beverages and Tea', price: 60, status: 'Available', waitTime: '4 mins', featured: false, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop' },
    { id: 9, name: 'Green Tea', category: 'Beverages and Tea', price: 70, status: 'Available', waitTime: '4 mins', featured: false, image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=300&auto=format&fit=crop' },
    { id: 10, name: 'Lemon Iced Tea', category: 'Beverages and Tea', price: 120, status: 'Available', waitTime: '5 mins', featured: true, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&auto=format&fit=crop' },

    // Bakery
    { id: 11, name: 'Chocolate Muffin', category: 'Bakery', price: 90, status: 'Low Stock', waitTime: '2 mins', featured: true, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300&auto=format&fit=crop' },
    { id: 12, name: 'Blueberry Muffin', category: 'Bakery', price: 110, status: 'Available', waitTime: '2 mins', featured: false, image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&auto=format&fit=crop' },
    { id: 13, name: 'Chocolate Brownie', category: 'Bakery', price: 120, status: 'Available', waitTime: '3 mins', featured: true, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop' },
    { id: 14, name: 'Chocolate Cake', category: 'Bakery', price: 150, status: 'Available', waitTime: '3 mins', featured: false, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop' },

    // Food
    { id: 15, name: 'Veg Burger', category: 'Food', price: 160, status: 'Available', waitTime: '12 mins', featured: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop' },
    { id: 16, name: 'Cheese Sandwich', category: 'Food', price: 170, status: 'Available', waitTime: '10 mins', featured: false, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop' },
    { id: 17, name: 'Garlic Bread', category: 'Food', price: 130, status: 'Available', waitTime: '8 mins', featured: false, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Garlic_bread_01.jpg/640px-Garlic_bread_01.jpg' },
    { id: 18, name: 'French Fries', category: 'Food', price: 100, status: 'Available', waitTime: '7 mins', featured: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop' },
  ]);

  const categories = ['All', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  // Cart State
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);

  // Orders State
  const [orders, setOrders] = useState([
    { id: '#1024', item: 'Caramel Latte (x1)', total: 190, status: 'Preparing', waitTime: '8 mins', time: '11:45 AM' },
  ]);

  // Add to Cart
  const addToCart = (item: any) => {
    if (item.status === 'Out of Stock') return;
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prevCart, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  // Update Quantity
  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean) as any;
    });
  };

  // Automatic Total Bill Calculation
  const totalBill = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const itemSummary = cart.map(i => `${i.name} (x${i.qty})`).join(', ');
    
    const newOrder = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      item: itemSummary,
      total: totalBill,
      status: 'Confirmed',
      waitTime: '12 mins',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setActiveTab('orders');
    alert(`Order placed successfully! Total Paid: ₹${totalBill}`);
  };

  const filteredMenu = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', color: '#1e293b' }}>
      
      {/* Header */}
      <header style={{ backgroundColor: '#4a154b', color: '#fff', padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px' }}>CCD PREDICT-A-LATTE</h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#e2e8f0' }}>Student Portal</p>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Palansha</span>
          <button 
            onClick={() => alert('Signed out successfully!')}
            style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 40px', display: 'flex', gap: '20px' }}>
        {[
          { key: 'home', label: '🏠 Home' },
          { key: 'menu', label: '📋 Menu' },
          { key: 'cart', label: `🛒 Cart (${cart.reduce((sum, i) => sum + i.qty, 0)})` },
          { key: 'orders', label: `📦 My Orders (${orders.length})` },
          { key: 'profile', label: '👤 Profile' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '14px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              color: activeTab === tab.key ? '#4a154b' : '#64748b',
              borderBottom: activeTab === tab.key ? '3px solid #4a154b' : '3px solid transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div>
            <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#4a154b' }}>Welcome back, Palansha!</h2>
              <p style={{ color: '#64748b', margin: 0 }}>Explore campus cafe items with full pictures, live wait times, and instant bill calculation.</p>
              <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                <button onClick={() => setActiveTab('menu')} style={{ backgroundColor: '#4a154b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Browse Menu</button>
                <button onClick={() => setActiveTab('cart')} style={{ backgroundColor: '#e2e8f0', color: '#1e293b', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>View Cart (₹{totalBill})</button>
              </div>
            </div>

            <h3 style={{ marginBottom: '15px' }}>🔥 Featured Items</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {menuItems.filter(i => i.featured).map(item => (
                <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 4px 0' }}>{item.name}</h4>
                    <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px' }}>₹{item.price} • {item.waitTime} wait</p>
                    <button onClick={() => addToCart(item)} style={{ width: '100%', backgroundColor: '#4a154b', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
              <input 
                type="text" 
                placeholder="Search menu items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '12px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', maxWidth: '400px', fontSize: '14px' }}
              />

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '20px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: '600',
                      backgroundColor: selectedCategory === cat ? '#4a154b' : '#fff',
                      color: selectedCategory === cat ? '#fff' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {filteredMenu.map((item) => (
                <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', opacity: item.status === 'Out of Stock' ? 0.6 : 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                  <div>
                    {/* Item Image */}
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }} 
                    />
                    <div style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px' }}>{item.name}</h4>
                        <span style={{ fontWeight: 'bold', color: '#4a154b', fontSize: '16px' }}>₹{item.price}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.category}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px' }}>
                        <span style={{ color: '#64748b' }}>⏱️ {item.waitTime}</span>
                        <strong style={{ color: item.status === 'Available' ? '#16a34a' : item.status === 'Low Stock' ? '#d97706' : '#dc2626' }}>{item.status}</strong>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '0 15px 15px 15px' }}>
                    <button
                      disabled={item.status === 'Out of Stock'}
                      onClick={() => addToCart(item)}
                      style={{
                        width: '100%',
                        backgroundColor: item.status === 'Out of Stock' ? '#cbd5e1' : '#4a154b',
                        color: '#fff',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '6px',
                        cursor: item.status === 'Out of Stock' ? 'not-allowed' : 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      {item.status === 'Out of Stock' ? 'Unavailable' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CART TAB */}
        {activeTab === 'cart' && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2>Your Shopping Cart & Bill Summary</h2>
            {cart.length === 0 ? (
              <p style={{ color: '#64748b', marginTop: '15px' }}>Your cart is empty. Go to Menu to add items.</p>
            ) : (
              <div style={{ marginTop: '20px' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{item.name}</h4>
                      <span style={{ color: '#64748b', fontSize: '13px' }}>₹{item.price} each</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                      </div>
                      <span style={{ fontWeight: 'bold', width: '70px', textAlign: 'right' }}>₹{item.price * item.qty}</span>
                    </div>
                  </div>
                ))}

                {/* Bill Summary Box */}
                <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '15px', color: '#64748b' }}>
                    <span>Items Count:</span>
                    <span>{cart.reduce((sum, i) => sum + i.qty, 0)} items</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: '#4a154b' }}>
                    <span>Total Bill:</span>
                    <span>₹{totalBill}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  style={{ marginTop: '20px', width: '100%', backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '14px', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Confirm and Pay ₹{totalBill}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2>Order Tracking & History</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px' }}>Order ID</th>
                  <th style={{ padding: '12px' }}>Items</th>
                  <th style={{ padding: '12px' }}>Total Bill</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Wait Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{ord.id}</td>
                    <td style={{ padding: '12px' }}>{ord.item}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#4a154b' }}>₹{ord.total}</td>
                    <td style={{ padding: '12px'}}><span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{ord.status}</span></td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{ord.waitTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2>Student Profile</h2>
            <p><strong>Name:</strong> Palansha</p>
            <p><strong>Role:</strong> Campus Student</p>
            <p><strong>Access Level:</strong> Student Dashboard Only</p>
          </div>
        )}

      </main>
    </div>
  );
}