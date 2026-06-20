import { Search, ShoppingBasket, Store } from "lucide-react";

export function Header({ cartCount, query, onQueryChange }) {
  return (
    <header className="header">
      <a className="brand" href="#top" aria-label="HydroMart">
        <span className="brandIcon">
          <Store size={22} />
        </span>
        <span>
          <strong>HydroMart</strong>
          <small>Fresh daily market</small>
        </span>
      </a>

      <label className="topSearch">
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Cari sayur, herbal, atau paket sehat"
        />
      </label>

      <nav className="nav" aria-label="Navigasi utama">
        <a href="#produk">Produk</a>
        <a href="#keranjang">Keranjang</a>
        <a href="#admin">Admin</a>
      </nav>

      <a className="cartLink" href="#keranjang" aria-label={`${cartCount} item di keranjang`}>
        <ShoppingBasket size={20} />
        <span>{cartCount}</span>
      </a>
    </header>
  );
}
