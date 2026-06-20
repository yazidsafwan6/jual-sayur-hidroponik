import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { Edit3, LogIn, LogOut, Save, Trash2, X } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { formatRupiah } from "../utils/currency.js";

const emptyProduct = {
  name: "",
  category: "Daun",
  price: 0,
  unit: "",
  stock: 0,
  image: "",
};

function getSavedSession() {
  try {
    const raw = localStorage.getItem("hydrofresh-admin-session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function toProductPayload(form) {
  return {
    name: form.name.trim(),
    category: form.category.trim(),
    price: Number(form.price),
    unit: form.unit.trim(),
    stock: Number(form.stock),
    image: form.image.trim(),
  };
}

export function AdminPanel({ dataMode, products }) {
  if (dataMode !== "convex") {
    return (
      <section className="adminPanel" id="admin" aria-labelledby="admin-title">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Admin</p>
            <h2 id="admin-title">Panel Produk</h2>
          </div>
        </div>
        <p className="adminNotice">
          Admin panel aktif saat aplikasi terhubung ke database Convex.
        </p>
      </section>
    );
  }

  return <ConvexAdminPanel products={products} />;
}

function ConvexAdminPanel({ products }) {
  const [session, setSession] = useState(getSavedSession);
  const [loginForm, setLoginForm] = useState({
    email: "yazidsafwan6@gmail.com",
    password: "",
  });
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const login = useMutation(api.auth.login);
  const logout = useMutation(api.auth.logout);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const sessionToken = session?.token;

  function saveSession(nextSession) {
    setSession(nextSession);
    localStorage.setItem("hydrofresh-admin-session", JSON.stringify(nextSession));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");
    setIsBusy(true);

    try {
      const nextSession = await login(loginForm);
      saveSession(nextSession);
      setLoginForm((current) => ({ ...current, password: "" }));
      setMessage("Login admin berhasil.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleLogout() {
    setIsBusy(true);

    try {
      if (sessionToken) {
        await logout({ sessionToken });
      }
    } finally {
      localStorage.removeItem("hydrofresh-admin-session");
      setSession(null);
      setEditingId(null);
      setProductForm(emptyProduct);
      setIsBusy(false);
      setMessage("Session admin ditutup.");
    }
  }

  function handleProductChange(event) {
    const { name, value } = event.target;
    setProductForm((current) => ({
      ...current,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      image: product.image,
    });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setProductForm(emptyProduct);
    setMessage("");
  }

  async function handleSaveProduct(event) {
    event.preventDefault();
    setMessage("");
    setIsBusy(true);

    try {
      const payload = toProductPayload(productForm);

      if (!payload.name || !payload.category || !payload.unit || !payload.image) {
        throw new Error("Semua field produk wajib diisi.");
      }

      if (!sessionToken) {
        throw new Error("Session admin tidak ditemukan. Login ulang.");
      }

      if (editingId) {
        await updateProduct({ sessionToken, id: editingId, ...payload });
        setMessage("Produk berhasil diperbarui.");
      } else {
        await createProduct({ sessionToken, ...payload });
        setMessage("Produk baru berhasil ditambahkan.");
      }

      cancelEdit();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRemoveProduct(productId) {
    setMessage("");
    setIsBusy(true);

    try {
      if (!sessionToken) {
        throw new Error("Session admin tidak ditemukan. Login ulang.");
      }

      await removeProduct({ sessionToken, id: productId });
      if (editingId === productId) {
        cancelEdit();
      }
      setMessage("Produk berhasil dihapus.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section className="adminPanel" id="admin" aria-labelledby="admin-title">
      <div className="sectionHeading">
        <div>
          <p className="eyebrow">Admin</p>
          <h2 id="admin-title">Panel Produk</h2>
        </div>
        {session ? (
          <button type="button" onClick={handleLogout} disabled={isBusy}>
            <LogOut size={18} />
            Logout
          </button>
        ) : null}
      </div>

      {!session ? (
        <form className="adminForm compactForm" onSubmit={handleLogin}>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, email: event.target.value }))
              }
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, password: event.target.value }))
              }
              autoComplete="current-password"
            />
          </label>
          <button type="submit" disabled={isBusy}>
            <LogIn size={18} />
            Login
          </button>
        </form>
      ) : null}

      {session ? (
        <>
          <form className="adminForm productEditor" onSubmit={handleSaveProduct}>
            <label>
              Nama produk
              <input name="name" value={productForm.name} onChange={handleProductChange} />
            </label>
            <label>
              Kategori
              <input
                name="category"
                value={productForm.category}
                onChange={handleProductChange}
              />
            </label>
            <label>
              Harga
              <input
                name="price"
                type="number"
                min="0"
                value={productForm.price}
                onChange={handleProductChange}
              />
            </label>
            <label>
              Stok
              <input
                name="stock"
                type="number"
                min="0"
                value={productForm.stock}
                onChange={handleProductChange}
              />
            </label>
            <label>
              Satuan
              <input name="unit" value={productForm.unit} onChange={handleProductChange} />
            </label>
            <label className="wideField">
              URL gambar
              <input name="image" value={productForm.image} onChange={handleProductChange} />
            </label>
            <div className="adminActions">
              <button type="submit" disabled={isBusy}>
                <Save size={18} />
                {editingId ? "Simpan" : "Tambah"}
              </button>
              {editingId ? (
                <button type="button" className="secondaryButton" onClick={cancelEdit}>
                  <X size={18} />
                  Batal
                </button>
              ) : null}
            </div>
          </form>

          <div className="adminTable" role="table" aria-label="Daftar produk admin">
            <div className="adminTableHead" role="row">
              <span>Produk</span>
              <span>Harga</span>
              <span>Stok</span>
              <span>Aksi</span>
            </div>
            {sortedProducts.map((product) => (
              <div className="adminTableRow" role="row" key={product.id}>
                <span>
                  <strong>{product.name}</strong>
                  <small>{product.category} · {product.unit}</small>
                </span>
                <span>{formatRupiah(product.price)}</span>
                <span>{product.stock}</span>
                <span className="rowActions">
                  <button type="button" onClick={() => startEdit(product)} aria-label="Edit produk">
                    <Edit3 size={16} />
                  </button>
                  <button
                    type="button"
                    className="dangerButton"
                    onClick={() => handleRemoveProduct(product.id)}
                    aria-label="Hapus produk"
                  >
                    <Trash2 size={16} />
                  </button>
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {message ? <p className="adminMessage">{message}</p> : null}
    </section>
  );
}
