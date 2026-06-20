import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AdminPanel } from "./components/AdminPanel.jsx";
import { Cart } from "./components/Cart.jsx";
import { Header } from "./components/Header.jsx";
import { ProductCard } from "./components/ProductCard.jsx";
import { products } from "./data/products.js";
import { formatRupiah } from "./utils/currency.js";

export function App({ dataMode = "local" }) {
  if (dataMode === "convex") {
    return <ConvexStore />;
  }

  return <Storefront dataMode="local" storeProducts={products} />;
}

function ConvexStore() {
  const remoteProducts = useQuery(api.products.list);
  const seedDefaults = useMutation(api.products.seedDefaults);
  const [hasSeeded, setHasSeeded] = useState(false);

  useEffect(() => {
    if (remoteProducts && !hasSeeded) {
      void seedDefaults();
      setHasSeeded(true);
    }
  }, [hasSeeded, remoteProducts, seedDefaults]);

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
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cart, setCart] = useState([]);

  const categories = useMemo(() => {
    return ["Semua", ...new Set(storeProducts.map((product) => product.category))];
  }, [storeProducts]);

  const filteredProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return storeProducts.filter((product) =>
      (selectedCategory === "Semua" || product.category === selectedCategory) &&
      (!keyword ||
        `${product.name} ${product.category}`.toLowerCase().includes(keyword)),
    );
  }, [query, selectedCategory, storeProducts]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
      <Header cartCount={cartCount} query={query} onQueryChange={setQuery} />

      <section className="hero" aria-labelledby="page-title">
        <div className="heroCopy">
          <p className="eyebrow">Marketplace sayur hidroponik</p>
          <h1 id="page-title">Belanja segar dari kebun lokal</h1>
          <p>
            Pilih sayur, herbal, dan produk premium yang dipanen harian. Semua
            produk bisa dikelola langsung dari admin panel.
          </p>
          <div className="heroActions">
            <a href="#produk">Mulai belanja</a>
            <a href="#admin">Kelola produk</a>
          </div>
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

      <section className="marketStrip" aria-label="Fitur marketplace">
        <div>
          <strong>Gratis packing</strong>
          <span>Setiap order di atas {formatRupiah(50000)}</span>
        </div>
        <div>
          <strong>Panen pagi</strong>
          <span>Produk diproses di hari yang sama</span>
        </div>
        <div>
          <strong>Admin ready</strong>
          <span>CRUD produk dari dashboard toko</span>
        </div>
      </section>

      <section className="catalogSection" id="produk" aria-labelledby="catalog-title">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Katalog</p>
            <h2 id="catalog-title">Rekomendasi untuk kamu</h2>
          </div>
          <div className="cartSummary">
            <span>{cartCount} item</span>
            <strong>{formatRupiah(cartTotal)}</strong>
          </div>
        </div>

        <div className="categoryRail" aria-label="Kategori produk">
          {categories.map((category) => (
            <button
              className={selectedCategory === category ? "activeCategory" : ""}
              type="button"
              key={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

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
