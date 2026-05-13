"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
};

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: Product;
};

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  orderItems: OrderItem[];
};

export default function OrdersPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingOpenId, setTrackingOpenId] = useState<string | null>(null);
  const [submittingReturnId, setSubmittingReturnId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    } else if (sessionStatus === "authenticated") {
      fetchOrders();
    }
  }, [sessionStatus]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTracking = (orderId: string) => {
    setTrackingOpenId(trackingOpenId === orderId ? null : orderId);
  };

  const handleRequestReturn = async (orderId: string) => {
    if (!confirm("Are you sure you want to request a return for this order?")) return;
    
    setSubmittingReturnId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/return`, {
        method: "POST",
      });

      if (res.ok) {
        // Optimistically update order status locally
        setOrders(prev => 
          prev.map(o => o.id === orderId ? { ...o, status: "RETURN_REQUESTED" } : o)
        );
        alert("Return request has been submitted successfully. We will email you your pre-paid shipping label!");
      } else {
        alert("Failed to submit return request. Please contact support.");
      }
    } catch (e) {
      alert("An error occurred submitting your request.");
    } finally {
      setSubmittingReturnId(null);
    }
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <div className={styles.container} style={{ display: "flex", justifyContent: "center", padding: "10rem 0" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(124,58,237,0.1)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <style jsx>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Mock timeline generation helper based on order date
  const getTimeline = (orderDateStr: string, status: string) => {
    const date = new Date(orderDateStr);
    
    const addDays = (d: Date, days: number) => {
      const result = new Date(d);
      result.setDate(result.getDate() + Math.floor(days));
      return result.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const events = [
      { desc: "Order placed & payment authorized", date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), active: true }
    ];

    if (status === "CANCELLED") {
      events.unshift({ desc: "🛑 Order has been cancelled", date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), active: true });
      return events;
    }

    if (status === "PROCESSING") {
      events.unshift({ desc: "⚙️ Preparing unit & executing quality verification", date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), active: true });
    }

    if (status === "SHIPPED" || status === "DELIVERED" || status === "RETURN_REQUESTED") {
      events.unshift({ desc: "📦 Package sorted & departed Aura logistics node", date: addDays(date, 1), active: true });
      events.unshift({ desc: "🚚 Consignment handed to local delivery agent", date: addDays(date, 2), active: true });
      
      if (status === "DELIVERED" || status === "RETURN_REQUESTED") {
        events.unshift({ desc: "📍 Out for delivery on route", date: addDays(date, 3), active: true });
        events.unshift({ desc: "✅ Handed to resident at destination", date: addDays(date, 3), active: true });
      }
    }

    if (status === "RETURN_REQUESTED") {
      events.unshift({ desc: "↩️ Return sequence requested by buyer", date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), active: true });
    }

    return events;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Your Orders</h1>
        <p>View your lifetime purchase history, track ongoing shipments, and manage returns.</p>
      </header>

      {orders.length === 0 ? (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>🛍️</div>
          <h2 className={styles.emptyTitle}>No orders found</h2>
          <p className={styles.emptyDesc}>You haven't placed any orders with your account yet. Visit our store to find your next favorite product!</p>
          <Link href="/products" className="btn btn-primary" style={{ display: "inline-block", padding: "0.9rem 2rem", fontWeight: "600" }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orders.map(order => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const currentStatus = order.status;
            
            const timeline = getTimeline(order.createdAt, currentStatus);

            return (
              <div key={order.id} className={styles.orderCard}>
                {/* Top Metadata strip */}
                <div className={styles.orderHeader}>
                  <div>
                    <div className={styles.headerLabel}>Order Placed</div>
                    <div className={styles.headerValue}>{formattedDate}</div>
                  </div>
                  <div>
                    <div className={styles.headerLabel}>Total</div>
                    <div className={styles.headerValue}>₹{order.total.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className={styles.headerLabel}>Ship To</div>
                    <div className={styles.headerValue}>{session?.user?.name || "Guest Buyer"}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className={styles.headerLabel}>Order #</div>
                    <div className={styles.headerValue} style={{ fontFamily: "monospace", fontSize: "0.85rem", opacity: 0.8 }}>
                      {order.id.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Card Main Content */}
                <div className={styles.orderContent}>
                  <div className={styles.deliveryStatusBanner}>
                    <div className={styles.deliveryTitle}>
                      {currentStatus === "DELIVERED" && "✅ Delivered Successfully"}
                      {currentStatus === "SHIPPED" && "🚚 En Route (In Transit)"}
                      {currentStatus === "PROCESSING" && "⚙️ Processing & Quality Verify"}
                      {currentStatus === "RETURN_REQUESTED" && "↩️ Return Requested by Buyer"}
                      {currentStatus === "CANCELLED" && "🛑 Order Cancelled"}
                      {currentStatus === "PENDING" && "⏳ Awaiting Shipment Sorting"}
                    </div>
                    <span className={`${styles.statusBadge} ${styles['status' + currentStatus]}`}>
                      {currentStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className={styles.bodyGrid}>
                    {/* Products in this order */}
                    <div className={styles.itemsList}>
                      {order.orderItems.map(item => (
                        <div key={item.id} className={styles.itemRow}>
                          {item.product.imageUrl ? (
                            <img src={item.product.imageUrl} alt={item.product.name} className={styles.itemThumb} />
                          ) : (
                            <div className={styles.thumbPlaceholder}>No Img</div>
                          )}
                          <div className={styles.itemInfo}>
                            <h4>{item.product.name}</h4>
                            <div className={styles.itemMeta}>
                              <span>Quantity: {item.quantity}</span>
                              <span style={{ margin: "0 0.5rem" }}>|</span>
                              <span>Price: ₹{item.price.toFixed(2)}</span>
                            </div>
                            <Link href={`/products/${item.product.id}`} className={styles.buyAgainBtn}>
                              🔁 Buy this item again
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Contextual Action buttons */}
                    <div className={styles.actionSidebar}>
                      <button 
                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                        onClick={() => toggleTracking(order.id)}
                      >
                        {trackingOpenId === order.id ? "Hide Tracking" : "Track Package"}
                      </button>
                      
                      {currentStatus !== "RETURN_REQUESTED" ? (
                        <button 
                          className={`${styles.actionBtn} ${styles.actionBtnWarn}`}
                          onClick={() => handleRequestReturn(order.id)}
                          disabled={submittingReturnId === order.id}
                        >
                          {submittingReturnId === order.id ? "Submitting..." : "Request Return"}
                        </button>
                      ) : (
                        <div style={{ fontSize: "0.8rem", textAlign: "center", padding: "0.5rem", border: "1px dashed #f97316", borderRadius: "8px", color: "#ea580c", fontWeight: "600" }}>
                          Return Pending Approval
                        </div>
                      )}

                      <Link href="/contact" className={styles.actionBtn} style={{ textDecoration: "none" }}>
                        Get Support
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Collapsible Real-time Tracking timeline */}
                {trackingOpenId === order.id && (
                  <div className={styles.trackingSection}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: "800" }}>
                        Carrier: FedEx Express
                      </h4>
                      <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        Tracking ID: <strong style={{ color: "var(--foreground)" }}>FX-{order.id.substring(0, 8).toUpperCase()}</strong>
                      </div>
                    </div>
                    
                    <div className={styles.trackingTimeline}>
                      {timeline.map((event, index) => (
                        <div key={index} className={styles.timelineEvent}>
                          <div className={`${styles.timelineDot} ${index === 0 ? styles.timelineDotActive : ""}`}></div>
                          <div className={styles.timelineDate}>{event.date}</div>
                          <div className={styles.timelineDesc}>{event.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
