import { Leaf, ShoppingBasket } from "lucide-react";

export function Header({ cartCount }) {
  return (
    <header className="header">
      <a className="brand" href="#top" aria-label="HydroFresh">
        <span className="brandIcon">
          <Leaf size={22} />
        </span>
        <span>
          <strong>HydroFresh</strong>
          <small>React Practice</small>
        </span>
      </a>

      <nav className="nav" aria-label="Navigasi utama">
        <a href="#produk">Produk</a>
        <a href="#keranjang">Keranjang</a>
        <a href="#admin">Admin</a>
        <a href="legacy-index.html">HTML lama</a>
      </nav>

      <a className="cartLink" href="#keranjang" aria-label={`${cartCount} item di keranjang`}>
        <ShoppingBasket size={20} />
        <span>{cartCount}</span>
      </a>
    </header>
  );
}
