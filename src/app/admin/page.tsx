"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

type ProductImage = {
  id: string;
  url: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  category: string | null;
  stock: number;
  imageUrl: string | null;
  isPhysical: boolean;
  isFeatured: boolean;
  description: string | null;
  features: string | null;
  images: ProductImage[];
};

// Rich typing for system Orders
type OrderItemProduct = {
  id: string;
  name: string;
  imageUrl: string | null;
};

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: OrderItemProduct;
};

type OrderUser = {
  name: string | null;
  email: string;
};

type Order = {
  id: string;
  userId: string;
  user: OrderUser;
  status: string;
  total: number;
  phone: string | null;
  shippingAddress: string | null;
  paymentMethod: string | null;
  createdAt: string;
  orderItems: OrderItem[];
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  
  // Product management states
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState = {
    id: "",
    name: "",
    price: "",
    category: "",
    description: "",
    features: "",
    images: "",
    stock: "10",
    isPhysical: true,
    isFeatured: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Order management states
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to fetch products");
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Failed to fetch master orders list");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(editingId ? "Failed to update product" : "Failed to add product");

      setSuccess(true);
      setFormData(initialFormState);
      setEditingId(null);
      fetchProducts(); // Refresh list
    } catch (error) {
      alert(editingId ? "Error updating product" : "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      id: p.id,
      name: p.name,
      price: String(p.price),
      category: p.category || "",
      description: p.description || "",
      features: p.features || "",
      images: p.images ? p.images.map(img => img.url).join(", ") : (p.imageUrl || ""),
      stock: String(p.stock),
      isPhysical: p.isPhysical,
      isFeatured: p.isFeatured || false,
    });
    setSuccess(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setSuccess(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (editingId === id) handleCancelEdit();
        fetchProducts(); // Refresh list
      } else {
        alert("Failed to delete product");
      }
    } catch (e) {
      alert("Error deleting product");
    }
  };

  // Callback handler to execute order status patch update instantly
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        alert(`Order status updated to ${newStatus} successfully!`);
        fetchOrders(); // Reload latest tracking dataset
      } else {
        alert("Failed to update tracking status. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed network request during tracking update.");
    }
  };

  // Dynamic badge colors helper for orders UI
  const getStatusColor = (status: string) => {
    switch(status) {
      case "DELIVERED": return { bg: "rgba(16, 185, 129, 0.1)", text: "#10b981" };
      case "PROCESSING": return { bg: "rgba(245, 158, 11, 0.1)", text: "#f59e0b" };
      case "SHIPPED": return { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6" };
      case "CANCELLED": return { bg: "rgba(239, 68, 68, 0.1)", text: "#ef4444" };
      default: return { bg: "rgba(107, 114, 128, 0.1)", text: "#6b7280" };
    }
  };

  return (
    <div className="container" style={{ padding: "2rem 1rem", maxWidth: "1200px" }}>
      
      {/* 1. Master Control Tab Switcher */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem", gap: "1rem" }}>
        <button 
          onClick={() => setActiveTab("products")}
          style={{
            padding: "1rem 2rem",
            fontSize: "1rem",
            fontWeight: 800,
            borderRadius: "12px",
            background: activeTab === "products" ? "var(--accent)" : "var(--card)",
            color: activeTab === "products" ? "white" : "var(--foreground)",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          🛍️ Manage Store Catalog
        </button>
        <button 
          onClick={() => setActiveTab("orders")}
          style={{
            padding: "1rem 2rem",
            fontSize: "1rem",
            fontWeight: 800,
            borderRadius: "12px",
            background: activeTab === "orders" ? "var(--accent)" : "var(--card)",
            color: activeTab === "orders" ? "white" : "var(--foreground)",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          📦 System Orders Dashboard
        </button>
      </div>

      {/* VIEW A: PRODUCTS MANAGEMENT */}
      {activeTab === "products" && (
        <>
          <div className={styles.adminContainer} style={{ margin: "0 auto", marginBottom: "3rem", maxWidth: "900px" }}>
            <h1 className={styles.title}>
              {editingId ? "Admin Dashboard - Edit Product" : "Admin Dashboard - Add Product"}
            </h1>
            
            {success && (
              <div className={styles.successMessage}>
                Product {editingId ? "updated" : "added"} successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Product ID (Optional)</label>
                <input
                  type="text"
                  disabled={!!editingId}
                  className={styles.input}
                  style={{ background: editingId ? "var(--border)" : "inherit", opacity: editingId ? 0.6 : 1 }}
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g. HEADPHONE-PRO-X (Leave blank to autogenerate)"
                />
                {editingId && <small style={{ display: "block", marginTop: "0.25rem", opacity: 0.6 }}>Product ID cannot be modified after creation</small>}
              </div>

              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Premium Wireless Headphones"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Price (₹)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  className={styles.input}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="299.00"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Image URLs (comma separated)</label>
                <textarea
                  className={styles.input}
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  className={styles.input}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed product description..."
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Features (About this item - one per line)</label>
                <textarea
                  className={styles.input}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Active Noise Cancellation&#10;Up to 30 hours battery life&#10;Bluetooth 5.0"
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Category</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Electronics, Apparel, etc."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Stock Quantity</label>
                <input
                  type="number"
                  required
                  className={styles.input}
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="isPhysical"
                  checked={formData.isPhysical}
                  onChange={(e) => setFormData({ ...formData, isPhysical: e.target.checked })}
                />
                <label htmlFor="isPhysical" style={{ cursor: "pointer" }}>Is this a physical product? (Requires shipping)</label>
              </div>

              <div className={styles.checkboxGroup} style={{ marginTop: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
                <label htmlFor="isFeatured" style={{ color: "var(--accent)", fontWeight: "800", cursor: "pointer" }}>⭐ Feature this product on the Homepage</label>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading} style={{ flex: 1 }}>
                  {loading ? "Saving..." : (editingId ? "Save Changes" : "Add Product to Store")}
                </button>
                {editingId && (
                  <button type="button" className="btn" onClick={handleCancelEdit} style={{ background: "var(--border)", color: "var(--foreground)", border: "none" }}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className={styles.adminContainer} style={{ margin: "0 auto", maxWidth: "1100px" }}>
            <h2 className={styles.title} style={{ fontSize: "1.5rem" }}>Manage Products</h2>
            {products.length === 0 ? (
              <p>No products exist yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <th style={{ padding: "1rem 0.5rem" }}>Image</th>
                      <th style={{ padding: "1rem 0.5rem" }}>Product ID</th>
                      <th style={{ padding: "1rem 0.5rem" }}>Name</th>
                      <th style={{ padding: "1rem 0.5rem" }}>Price</th>
                      <th style={{ padding: "1rem 0.5rem" }}>Stock</th>
                      <th style={{ padding: "1rem 0.5rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid var(--border)", background: editingId === p.id ? "rgba(124, 58, 237, 0.05)" : "transparent" }}>
                        <td style={{ padding: "1rem 0.5rem" }}>
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                          ) : (
                            <div style={{ width: "50px", height: "50px", background: "var(--border)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}>No Img</div>
                          )}
                        </td>
                        <td style={{ padding: "1rem 0.5rem", fontFamily: "monospace", fontSize: "0.8rem" }}>{p.id}</td>
                        <td style={{ padding: "1rem 0.5rem", fontWeight: editingId === p.id ? "600" : "normal" }}>
                          {p.name}
                          {p.isFeatured && <span style={{ display: "inline-block", marginLeft: "0.5rem", background: "rgba(59, 130, 246, 0.1)", color: "var(--accent)", fontSize: "0.7rem", padding: "0.2rem 0.4rem", borderRadius: "4px", fontWeight: "800" }}>⭐ FEATURED</span>}
                        </td>
                        <td style={{ padding: "1rem 0.5rem" }}>₹{p.price.toFixed(2)}</td>
                        <td style={{ padding: "1rem 0.5rem" }}>{p.stock}</td>
                        <td style={{ padding: "1rem 0.5rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button onClick={() => handleEdit(p)} style={{ padding: "0.4rem 0.8rem", background: "var(--border)", border: "none", borderRadius: "4px", cursor: "pointer", color: "var(--foreground)" }}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(p.id)} style={{ padding: "0.4rem 0.8rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "4px", cursor: "pointer" }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* VIEW B: SYSTEM ORDERS DASHBOARD */}
      {activeTab === "orders" && (
        <div className={styles.adminContainer} style={{ margin: "0 auto", maxWidth: "1100px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.02em", margin: 0 }}>Global System Orders</h2>
            <button 
              onClick={fetchOrders} 
              className="btn btn-primary" 
              style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem", background: "var(--secondary)", color: "var(--secondary-foreground)", border: "1px solid var(--border)" }}
            >
              🔄 Refresh Tracking Data
            </button>
          </div>

          {ordersLoading ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <div style={{ display: "inline-block", width: "30px", height: "30px", border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
              <p style={{ marginTop: "1rem", opacity: 0.6 }}>Querying database records...</p>
              <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--secondary)", borderRadius: "16px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>No orders registered</h3>
              <p style={{ opacity: 0.6 }}>Customers' checkout operations will automatically populate this panel real-time.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {orders.map((order) => {
                const colors = getStatusColor(order.status);
                return (
                  <div 
                    key={order.id} 
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "16px",
                      padding: "2rem",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.01)",
                      position: "relative",
                      transition: "transform 0.2s"
                    }}
                  >
                    {/* Header Block */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.6, fontWeight: 700, marginBottom: "0.25rem" }}>Order Identification</div>
                        <div style={{ fontFamily: "monospace", fontWeight: 800, color: "var(--accent)", fontSize: "0.9rem" }}>#{order.id}</div>
                        <div style={{ fontSize: "0.8rem", marginTop: "0.25rem", opacity: 0.8 }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.6, fontWeight: 700, marginBottom: "0.25rem" }}>Customer Profile</div>
                        <div style={{ fontWeight: 700 }}>{order.user.name || "Anonymous Guest"}</div>
                        <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>{order.user.email}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.6, fontWeight: 700, marginBottom: "0.25rem" }}>Aggregate Total</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--foreground)" }}>₹{order.total.toFixed(2)}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 700 }}>Method: {order.paymentMethod || "COD"}</div>
                      </div>
                      
                      {/* Dynamic Status Changer Input Selector */}
                      <div>
                        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.6, fontWeight: 700, marginBottom: "0.5rem" }}>Tracking Lifecycle</div>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.6rem 1rem",
                            borderRadius: "8px",
                            border: `1px solid ${colors.text}`,
                            background: colors.bg,
                            color: colors.text,
                            fontWeight: 800,
                            cursor: "pointer",
                            outline: "none",
                            fontFamily: "inherit",
                            fontSize: "0.85rem"
                          }}
                        >
                          <option value="PENDING">⏳ PENDING</option>
                          <option value="PROCESSING">⚙️ PROCESSING</option>
                          <option value="SHIPPED">🚚 SHIPPED</option>
                          <option value="DELIVERED">✅ DELIVERED</option>
                          <option value="CANCELLED">🛑 CANCELLED</option>
                        </select>
                      </div>
                    </div>

                    {/* Client Details & Address */}
                    {(order.phone || order.shippingAddress) && (
                      <div style={{ background: "var(--secondary)", margin: "1.5rem 0", padding: "1.25rem 1.5rem", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {order.phone && (
                          <div style={{ display: "flex", fontSize: "0.9rem" }}>
                            <span style={{ fontWeight: 700, width: "100px", opacity: 0.75 }}>📞 Phone:</span>
                            <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{order.phone}</span>
                          </div>
                        )}
                        {order.shippingAddress && (
                          <div style={{ display: "flex", fontSize: "0.9rem" }}>
                            <span style={{ fontWeight: 700, width: "100px", opacity: 0.75 }}>📍 Ship To:</span>
                            <span style={{ flex: 1 }}>{order.shippingAddress}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Linked Ordered Items Summary */}
                    <div>
                      <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", opacity: 0.5, letterSpacing: "0.05em", marginBottom: "1rem", marginTop: "1.5rem", fontWeight: 800 }}>Consolidated Order Items</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {order.orderItems.map((item) => (
                          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                            <div style={{ width: "48px", height: "48px", borderRadius: "8px", overflow: "hidden", background: "white", border: "1px solid var(--border)", flexShrink: 0 }}>
                              {item.product.imageUrl ? (
                                <img src={item.product.imageUrl} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.4, fontSize: "0.65rem" }}>📦</div>
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{item.product.name}</div>
                              <div style={{ fontSize: "0.8rem", opacity: 0.6, fontFamily: "monospace" }}>ID: {item.product.id}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontWeight: 800 }}>₹{item.price.toFixed(2)} <span style={{ fontWeight: 500, opacity: 0.6 }}>x {item.quantity}</span></div>
                              <div style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 700 }}>Total: ₹{(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
