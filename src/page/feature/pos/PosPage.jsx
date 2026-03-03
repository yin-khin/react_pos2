/* eslint-disable react-hooks/purity */
import React, { useMemo, useRef, useState } from "react";
import { showAlert } from "../../../utils/alert";
import QrPayModal from "./QrPayModal";
import "./pos.css";

const mockProducts = [
  { prd_id: "P001", prd_name: "Classic White Tee", category: "All Items", unit_cost: 25, qty: 30, emoji: "👕", status: "In Stock" },
  { prd_id: "P002", prd_name: "Denim Jacket", category: "All Items", unit_cost: 85, qty: 12, emoji: "🧥", status: "12 Left" },
  { prd_id: "P003", prd_name: "Leather Belt", category: "All Items", unit_cost: 40, qty: 24, emoji: "🧷", status: "In Stock" },
  { prd_id: "P004", prd_name: "Cargo Pants", category: "All Items", unit_cost: 65, qty: 18, emoji: "👖", status: "In Stock" },
  { prd_id: "P005", prd_name: "Running Shoes", category: "Favorites", unit_cost: 110, qty: 6, emoji: "👟", status: "Low Stock" },
  { prd_id: "P006", prd_name: "Silk Scarf", category: "Favorites", unit_cost: 55, qty: 28, emoji: "🧣", status: "In Stock" },
];

const money = (n) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");

function calcDiscount(promoCode, subtotal) {
  const code = String(promoCode || "").trim().toUpperCase();
  if (!code) return { value: 0, label: "—" };

  if (code === "DEMO10") return { value: subtotal * 0.1, label: "10% OFF" };
  if (code === "SAVE5") return { value: Math.min(5, subtotal), label: "$5 OFF" };

  return { value: 0, label: "Invalid" };
}

export default function PosPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [cartItems, setCartItems] = useState([]);
  const [cashReceived, setCashReceived] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // ✅ QR modal state
  const [qrOpen, setQrOpen] = useState(false);

  // stable order number
  const orderSeed = useRef(77420 + Math.floor(Math.random() * 1000));
  const orderNo = `#${orderSeed.current}`;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockProducts.map((p) => p.category)));
    return ["All Items", ...cats];
  }, []);

  const visibleProducts = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    return mockProducts.filter((p) => {
      const matchCategory = selectedCategory === "All Items" || p.category === selectedCategory;
      const matchSearch =
        kw.length === 0 ||
        p.prd_id.toLowerCase().includes(kw) ||
        p.prd_name.toLowerCase().includes(kw);
      return matchCategory && matchSearch;
    });
  }, [searchKeyword, selectedCategory]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const found = prev.find((x) => x.prd_id === product.prd_id);

      if (found) {
        if (found.qty >= product.qty) {
          showAlert("warning", `Out of stock: only ${product.qty} available`);
          return prev;
        }
        return prev.map((x) =>
          x.prd_id === product.prd_id ? { ...x, qty: x.qty + 1 } : x
        );
      }

      if (product.qty <= 0) {
        showAlert("warning", "This item is out of stock");
        return prev;
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateCartQty = (prdId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.prd_id !== prdId) return item;
          const product = mockProducts.find((p) => p.prd_id === prdId);
          const maxQty = product?.qty ?? item.qty;

          const nextQty = Math.min(maxQty, Math.max(0, item.qty + delta));

          if (nextQty === item.qty && delta > 0 && item.qty >= maxQty) {
            showAlert("warning", `Max stock reached (${maxQty})`);
          }

          return { ...item, qty: nextQty };
        })
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (prdId) =>
    setCartItems((prev) => prev.filter((x) => x.prd_id !== prdId));

  const clearCart = () => {
    setCartItems([]);
    setCashReceived("");
    setPromoCode("");
    setQrOpen(false);
    showAlert("info", "Cart cleared");
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, x) => sum + x.qty * x.unit_cost, 0),
    [cartItems]
  );

  const tax = useMemo(() => subtotal * 0.08, [subtotal]);

  const promo = useMemo(() => calcDiscount(promoCode, subtotal), [promoCode, subtotal]);
  const discount = promo.value;

  const grandTotal = useMemo(
    () => Math.max(0, subtotal + tax - discount),
    [subtotal, tax, discount]
  );

  const paidAmount = Number.parseFloat(cashReceived || "0") || 0;
  const change = Math.max(0, paidAmount - grandTotal);

  const canCheckout = useMemo(() => {
    if (cartItems.length === 0) return false;
    if (paymentMethod === "cash") return paidAmount >= grandTotal && grandTotal > 0;
    return grandTotal > 0;
  }, [cartItems.length, paymentMethod, paidAmount, grandTotal]);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return showAlert("warning", "Enter promo code");

    const p = calcDiscount(promoCode, subtotal);
    if (p.label === "Invalid") showAlert("warning", "Invalid promo code");
    else showAlert("success", `Promo applied: ${p.label}`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return showAlert("warning", "Cart is empty");
    if (grandTotal <= 0) return showAlert("warning", "Total must be greater than 0");

    if (paymentMethod === "cash" && paidAmount < grandTotal) {
      return showAlert("warning", "Cash received is not enough");
    }

    showAlert("success", `Sale completed ✅ (${paymentMethod.toUpperCase()})`);

    setCartItems([]);
    setCashReceived("");
    setPromoCode("");
    setQrOpen(false);

    orderSeed.current = 77420 + Math.floor(Math.random() * 1000);
  };

  return (
    <div className="pos-screen">
      <div className="pos-main-grid">
        {/* PRODUCTS */}
        <section className="panel products-panel">
          <div className="panel-head">
            <div>
              <h2>All Products</h2>
              <div className="pos-tabs">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={selectedCategory === c ? "active" : ""}
                    onClick={() => setSelectedCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <div className="products-grid">
            {visibleProducts.map((p) => {
              const isLow = p.qty <= 6;
              return (
                <article
                  key={p.prd_id}
                  className={`product-card ${isLow ? "low-stock" : ""}`}
                  onClick={() => addToCart(p)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="product-thumb">{p.emoji}</div>
                  <h3>{p.prd_name}</h3>
                  <div className="product-meta">
                    <strong>${money(p.unit_cost)}</strong>
                    <span>{p.qty <= 0 ? "Out of Stock" : p.status}</span>
                  </div>
                </article>
              );
            })}

            <button
              type="button"
              className="add-card-btn"
              onClick={() => showAlert("info", "Add new product (coming soon)")}
            >
              +
            </button>
          </div>
        </section>

        {/* CART */}
        <section className="panel cart-panel">
          <div className="panel-head middle-head">
            <div>
              <h2>Active Cart</h2>
              <p>Order {orderNo} • Walk-in Customer</p>
            </div>

            <button type="button" className="icon-clear" onClick={clearCart} title="Clear cart">
              🗑
            </button>
          </div>

          <div className="cart-scroll">
            {cartItems.length === 0 ? (
              <p className="pos-empty">No products selected.</p>
            ) : (
              cartItems.map((item) => (
                <article key={item.prd_id} className="cart-item-card">
                  <div className="cart-item-left">
                    <div className="cart-avatar">{item.emoji}</div>
                    <div>
                      <h4>{item.prd_name}</h4>
                      <p>{item.prd_id}</p>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <div className="qty-box">
                      <button type="button" onClick={() => updateCartQty(item.prd_id, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateCartQty(item.prd_id, 1)}>+</button>
                    </div>

                    <strong>${money(item.qty * item.unit_cost)}</strong>

                    <button type="button" className="remove-x" onClick={() => removeItem(item.prd_id)}>
                      ×
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="promo-row">
            <input
              type="text"
              placeholder="Promo code (DEMO10 / SAVE5)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button type="button" onClick={handleApplyPromo}>Apply</button>
          </div>
        </section>

        {/* PAYMENT */}
        <aside className="panel payment-panel">
          <h2>Payment Details</h2>

          <div className="amount-list">
            <div><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
            <div><span>Tax (8%)</span><strong>${money(tax)}</strong></div>
            <div>
              <span>Discount {promo.label !== "—" ? `(${promo.label})` : ""}</span>
              <strong>-${money(discount)}</strong>
            </div>
          </div>

          <div className="total-row">
            <span>Total Payable</span>
            <strong>${money(grandTotal)}</strong>
          </div>

          {/* ✅ CLICK QR PAY => OPEN MODAL */}
          <div className="payment-methods">
            {[
              { id: "cash", label: "Cash", icon: "💵" },
              { id: "card", label: "Card", icon: "💳" },
              { id: "qr", label: "QR Pay", icon: "🔳" },
              { id: "coupon", label: "Coupon", icon: "🎟" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                className={paymentMethod === m.id ? "active" : ""}
                onClick={() => {
                  setPaymentMethod(m.id);
                  if (m.id === "qr") setQrOpen(true);
                  else setQrOpen(false);
                }}
              >
                <span>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>

          <div className="cash-box">
            <label>{paymentMethod === "cash" ? "Cash Received" : "Cash Received (disabled)"}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              placeholder="0.00"
              disabled={paymentMethod !== "cash"}
            />
            <div className="change-row">
              <span>Change</span>
              <strong>${money(change)}</strong>
            </div>
          </div>

          <div className="customer-box">
            <div>
              <span>Customer</span>
              <strong>Guest Customer</strong>
            </div>
            <button type="button" onClick={() => showAlert("info", "Customer select (coming soon)")}>✎</button>
          </div>

          <button
            type="button"
            className={`checkout-btn ${canCheckout ? "" : "disabled"}`}
            onClick={handleCheckout}
            disabled={!canCheckout}
          >
            Checkout
          </button>

          <div className="bottom-actions">
            <button type="button" onClick={() => showAlert("info", "Print bill soon")}>Print Bill</button>
            <button type="button" onClick={() => showAlert("info", "Order placed on hold")}>Hold Order</button>
          </div>
        </aside>
      </div>

      {/* ✅ MODAL RENDER */}
      <QrPayModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        amount={grandTotal}
        orderNo={orderNo}
      />
    </div>
  );
}