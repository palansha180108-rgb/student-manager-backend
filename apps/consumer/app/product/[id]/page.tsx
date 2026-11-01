'use client';

import { useCart } from '../../../src/context/CartContext'; // Path apne project ke hisaab se check kar lein
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Dummy products database (Jab API banegi toh yeh backend se aayega)
const allProducts = [
  { id: 1, name: 'Cold Coffee', price: 120, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=60', description: 'Refreshing cold coffee blended with rich chocolate syrup and creamy milk.' },
  { id: 2, name: 'Veg Cheese Burger', price: 90, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', description: 'Crispy veggie patty loaded with melted cheese, lettuce, and special sauce.' },
  { id: 3, name: 'White Sauce Pasta', price: 160, image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281298?w=500&auto=format&fit=crop&q=60', description: 'Penne pasta tossed in rich, creamy white garlic sauce with herbs and cheese.' },
  { id: 4, name: 'Peri Peri Fries', price: 100, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60', description: 'Golden crispy french fries tossed in spicy and tangy peri peri seasoning.' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const { addToCart } = useCart();

  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Segoe UI, sans-serif', textAlign: 'center' }}>
        <h2>Product not found!</h2>
        <p style={{ color: '#64748b' }}>The item you are looking for does not exist.</p>
        <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>← Back to Menu</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/" style={{ color: '#4a154b', textDecoration: 'none', fontWeight: '600' }}>← Back to Menu</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '8px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>{product.name}</h1>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#16a34a', margin: '0 0 15px 0' }}>₹{product.price}</p>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>{product.description}</p>
          </div>

          <button
            onClick={() => addToCart(product)}
            style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', width: '100%', marginTop: '20px' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}