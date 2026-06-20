import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AdminPanel } from "./components/AdminPanel.jsx";
import { Cart } from "./components/Cart.jsx";
import { Header } from "./components/Header.jsx";
import { ProductCard } from "./components/ProductCard.jsx";
import { products } from "./data/products.js";

export function App({ dataMode = "local" }) {
  if (dataMode === "convex") {
    return <ConvexStore />;
  }

  return <Storefront dataMode="local" storeProducts={products} />;
}

function ConvexStore() {
  const remoteProducts = useQuery(api.products.list);
  const seedDefaults = useMutation(api.products.seedDefaults);

  useEffect(() => {
    if (remoteProducts && remoteProducts.length === 0) {
      void seedDefaults();
    }
  }, [remoteProducts, seedDefaults]);

  const normalizedProducts = useMemo(() => {
    return (remoteProducts ?? products).map((product) => ({
      ...product,
      id: product._id ?? product.id,
    }));
  }, [remoteProducts]);

  return (
    <Storefront
      dataMode={remoteProducts ? "convex" : "loading"}
      storeProducts={normalizedProducts}
    />
  );
}

function Storefront({ dataMode, storeProducts }) {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);

  const filteredProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return storeProducts;
    }

    return storeProducts.filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(keyword),
    );
  }, [query, storeProducts]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  function increaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function decreaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(productId) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  }

  return (
    <main id="top">
      <Header cartCount={cartCount} />

      <section className="hero" aria-labelledby="page-title">
        <div className="heroCopy">
          <p className="eyebrow">Belajar React dari aplikasi nyata</p>
          <h1 id="page-title">Jual Sayur Hidroponik</h1>
          <p>
            Starter ini memecah halaman HTML lama menjadi komponen React, state
            keranjang, data produk, utility formatter, dan styling terpisah.
          </p>
        </div>
        <div className="heroStats" aria-label="Ringkasan toko">
          <span>
            <strong>{storeProducts.length}</strong>
            Produk
          </span>
          <span>
            <strong>{cartCount}</strong>
            Item
          </span>
          <span>
            <strong>{dataMode === "convex" ? "DB" : "JS"}</strong>
            Data
          </span>
        </div>
      </section>

      <section className="catalogSection" id="produk" aria-labelledby="catalog-title">
        <div className="sectionHeading">
          <p className="eyebrow">Component practice</p>
          <h2 id="catalog-title">Katalog Produk</h2>
        </div>

        <label className="searchBox">
          <span>Cari produk</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Contoh: pakcoy"
          />
        </label>

        <div className="productGrid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      <Cart
        items={cart}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeFromCart}
      />

      <AdminPanel dataMode={dataMode} products={storeProducts} />
    </main>
  );
}
