import { Minus, Plus, Trash2 } from "lucide-react";
import { formatRupiah } from "../utils/currency.js";

export function Cart({ items, onIncrease, onDecrease, onRemove }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="cartPanel" id="keranjang" aria-labelledby="cart-title">
      <div className="sectionHeading">
        <p className="eyebrow">Checkout</p>
        <h2 id="cart-title">Keranjang</h2>
      </div>

      {items.length === 0 ? (
        <p className="emptyCart">Belum ada produk. Klik tombol tambah di katalog.</p>
      ) : (
        <div className="cartList">
          {items.map((item) => (
            <div className="cartItem" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>{formatRupiah(item.price)}</span>
              </div>
              <div className="quantityControl" aria-label={`Jumlah ${item.name}`}>
                <button type="button" onClick={() => onDecrease(item.id)} aria-label="Kurangi">
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => onIncrease(item.id)} aria-label="Tambah">
                  <Plus size={16} />
                </button>
                <button type="button" onClick={() => onRemove(item.id)} aria-label="Hapus">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cartTotal">
        <span>Total</span>
        <strong>{formatRupiah(total)}</strong>
      </div>
    </section>
  );
}
