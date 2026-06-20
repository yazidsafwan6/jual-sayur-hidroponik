import { Plus } from "lucide-react";
import { formatRupiah } from "../utils/currency.js";

export function ProductCard({ product, onAddToCart }) {
  return (
    <article className="productCard">
      <img src={product.image} alt={product.name} />
      <div className="productBody">
        <div>
          <p className="eyebrow">{product.category}</p>
          <h3>{product.name}</h3>
          <p className="muted">{product.unit} · stok {product.stock}</p>
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
