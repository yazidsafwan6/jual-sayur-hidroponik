import { MapPin, Plus, Star } from "lucide-react";
import { formatRupiah } from "../utils/currency.js";

export function ProductCard({ product, onAddToCart }) {
  return (
    <article className="productCard">
      <img src={product.image} alt={product.name} />
      <div className="productBody">
        <div>
          <p className="productBadge">{product.category}</p>
          <h3>{product.name}</h3>
          <p className="muted">{product.unit} - stok {product.stock}</p>
          <p className="sellerLine">
            <MapPin size={14} />
            Kebun Makassar
          </p>
          <p className="ratingLine">
            <Star size={14} />
            4.9 - Terjual 120+
          </p>
        </div>
        <div className="productFooter">
          <strong>{formatRupiah(product.price)}</strong>
          <button type="button" onClick={() => onAddToCart(product)}>
            <Plus size={18} />
            Tambah
          </button>
        </div>
      </div>
    </article>
  );
}
