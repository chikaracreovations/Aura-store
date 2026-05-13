"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import styles from "./page.module.css";

// Definition interface for stored Indian address assets
interface SavedAddress {
  id: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
}

// Helper to dynamically inject the Razorpay Checkout script to the body
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD or RAZORPAY
  const [deliveryType, setDeliveryType] = useState("STANDARD"); // STANDARD or EXPRESS

  // Saved Addresses Storage
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("NEW");

  // Coupon / Promo Code state
  const [couponInput, setCouponInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccessMsg, setCouponSuccessMsg] = useState("");

  // 🇮🇳 Standard Indian Shipping Address State
  const [formData, setFormData] = useState({
    email: "",
    countryCode: "+91",
    phone: "",
    firstName: "",
    lastName: "",
    addressLine1: "", // Flat, House no., Building, Apartment
    addressLine2: "", // Area, Street, Sector, Village
    landmark: "",     // Landmark (Optional)
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Indian States/UTs
  const INDIAN_STATES = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", 
    "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", 
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", 
    "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  // Hydrate saved addresses from local storage partitioned by active account
  useEffect(() => {
    if (typeof window !== "undefined" && session?.user?.email) {
      const ledgerKey = `aura_addresses_${session.user.email}`;
      const saved = localStorage.getItem(ledgerKey);
      if (saved) {
        try {
          setSavedAddresses(JSON.parse(saved));
        } catch (e) {
          console.error("Failed deserializing address ledger:", e);
        }
      }
    }
  }, [session]);

  // Prepopulate active user credentials
  useEffect(() => {
    if (session?.user?.email) {
      setFormData(prev => ({ ...prev, email: session?.user?.email || "" }));
    }
  }, [session]);

  // Route Security
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [sessionStatus]);

  // Boot empty carts
  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      const timer = setTimeout(() => {
        if (cart.length === 0) router.push("/products");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [cart]);

  if (sessionStatus === "loading") {
    return (
      <main style={{ background: "var(--background)", display: "flex", justifyContent: "center", alignItems: "center", height: "85vh" }}>
        <div style={{ width: "35px", height: "35px", border: "3px solid rgba(255,255,255,0.05)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  // Handle Quick Select selection event
  const handleSavedAddressSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedAddressId(val);

    if (val === "NEW") {
      // Flush the form fields while maintaining identity email
      setFormData({
        email: session?.user?.email || "",
        countryCode: "+91",
        phone: "",
        firstName: "",
        lastName: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      });
      return;
    }

    const found = savedAddresses.find(addr => addr.id === val);
    if (found) {
      // Instantly auto-hydrate form payloads!
      setFormData({
        email: found.email || session?.user?.email || "",
        countryCode: "+91",
        phone: found.phone,
        firstName: found.firstName,
        lastName: found.lastName,
        addressLine1: found.addressLine1,
        addressLine2: found.addressLine2,
        landmark: found.landmark,
        city: found.city,
        state: found.state,
        pincode: found.pincode,
        country: "India",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // If editing, unset quick select highlight to prevent synchronization mismatch
    if (selectedAddressId !== "NEW") {
      setSelectedAddressId("NEW");
    }
  };

  // Apply Promo Codes
  const applyPromoCode = () => {
    setCouponError("");
    setCouponSuccessMsg("");
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a promo code.");
      return;
    }

    if (code === "WELCOME10") {
      const disc = cartTotal * 0.10;
      setAppliedDiscount(disc);
      setCouponSuccessMsg("WELCOME10 applied: 10% Discount granted!");
    } else if (code === "FESTIVE20" || code === "AURA20") {
      const disc = cartTotal * 0.20;
      setAppliedDiscount(disc);
      setCouponSuccessMsg(`${code} applied: 20% Festive Discount granted!`);
    } else {
      setCouponError("Invalid or expired promo code.");
      setAppliedDiscount(0);
    }
  };

  // SMART HOOK: Prompts user to save their address to localStorage if new
  const requestAddressPersistence = () => {
    if (!session?.user?.email) return;

    // Check if a structurally identical address already exists in savedAddresses array
    const isDuplicate = savedAddresses.some(addr => 
      addr.pincode === formData.pincode &&
      addr.addressLine1.toLowerCase().trim() === formData.addressLine1.toLowerCase().trim() &&
      addr.firstName.toLowerCase().trim() === formData.firstName.toLowerCase().trim()
    );

    if (isDuplicate) return; // Already saved

    // Smooth native confirm overlay
    const confirmSave = window.confirm(
      "📦 SAVE ADDRESS FOR FUTURE ORDERS?\n\nWould you like to save this delivery address securely to your account book for instant 1-click future checkouts?"
    );

    if (confirmSave) {
      const newSavedAddress: SavedAddress = {
        id: "addr_" + Math.random().toString(36).substring(2, 10),
        firstName: formData.firstName,
        lastName: formData.lastName,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone,
        email: formData.email || session.user.email
      };

      const updatedList = [...savedAddresses, newSavedAddress];
      const ledgerKey = `aura_addresses_${session.user.email}`;
      localStorage.setItem(ledgerKey, JSON.stringify(updatedList));
      
      // Local React sync
      setSavedAddresses(updatedList);
    }
  };

  // FINAL TRANSACTION HANDLER - Registers order to Prisma Database
  const executePrismaOrderSubmission = async (paymentReference: string = "N/A") => {
    const fullAddress = `${formData.firstName} ${formData.lastName}\n${formData.addressLine1},\n${formData.addressLine2},\n${formData.landmark ? 'Landmark: ' + formData.landmark + ',\n' : ''}${formData.city}, ${formData.state} - ${formData.pincode},\n${formData.country}`;

    try {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          total: finalTotal,
          phone: `${formData.countryCode} ${formData.phone}`,
          shippingAddress: fullAddress,
          paymentMethod: paymentMethod === "COD" ? "COD" : `RAZORPAY (${paymentReference})`,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // 🚀 COMPONENT ADVANCEMENT: Trigger prompt to save address
        requestAddressPersistence();
        
        clearCart();
        alert("🎉 Thank you! Your order has been placed successfully!");
        router.push("/orders");
      } else {
        alert(result.error || "Failed to save order on servers. Please try again.");
      }
    } catch (error) {
      console.error("Backend submission error:", error);
      alert("Server transmission failure. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // INITIATE TRANSACTION SEQUENCE
  const handleSubmitOrder = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validation checks
    if (!formData.phone || !formData.addressLine1 || !formData.addressLine2 || !formData.city || !formData.pincode || !formData.state || !formData.firstName) {
      alert("Please fill out all required shipping fields to continue.");
      return;
    }

    setIsProcessing(true);

    // 💸 BRANCH A: Cash on Delivery (COD) -> Direct processing
    if (paymentMethod === "COD") {
      await executePrismaOrderSubmission("COD_PENDING");
      return;
    }

    // 💳 BRANCH B: Razorpay Payment Protocol
    try {
      // 1. Inject Razorpay client SDK script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Check connection.");
        setIsProcessing(false);
        return;
      }

      // 2. Contact our local backend to create the Razorpay Order instance
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      });

      const rzpData = await response.json();

      // Smart Fallback: If keys are placeholder
      if (!response.ok || !rzpData.orderId) {
        console.warn("Razorpay Server Error (likely placeholder keys):", rzpData.error);
        const confirmSimulation = window.confirm(
          "⚠️ RAZORPAY NOTICE:\nYour .env keys are placeholder ('rzp_test_placeholder').\n\nWould you like to SIMULATE a successful Razorpay Online Transaction for testing purposes?"
        );

        if (confirmSimulation) {
          const mockPaymentId = "pay_simulated_" + Math.random().toString(36).substring(5);
          await executePrismaOrderSubmission(mockPaymentId);
        } else {
          setIsProcessing(false);
        }
        return;
      }

      // 3. Instantiate Razorpay Web Checkout Modal
      const options = {
        key: rzpData.keyId, 
        amount: finalTotal * 100, 
        currency: "INR",
        name: "AURA Store",
        description: "Online Purchase Payment",
        image: "/favicon.ico", 
        order_id: rzpData.orderId, 
        handler: async function (rzpSuccessResponse: any) {
          await executePrismaOrderSubmission(rzpSuccessResponse.razorpay_payment_id);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: `${formData.countryCode}${formData.phone}`
        },
        theme: {
          color: "#09090b" 
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false); 
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Fatal Razorpay initiation failure:", error);
      alert("Failure opening payment gateway modal.");
      setIsProcessing(false);
    }
  };

  // Calculations
  const shippingCost = deliveryType === "EXPRESS" ? 250.00 : 0.00;
  const taxCost = (cartTotal - appliedDiscount) * 0.05; 
  const finalTotal = (cartTotal - appliedDiscount) + shippingCost + taxCost;

  return (
    <main style={{ background: "var(--background)", minHeight: "90vh" }}>
      <div className={styles.container}>
        
        {/* Breadcrumbs */}
        <header style={{ marginBottom: "3.5rem" }}>
          <Link 
            href="/cart" 
            style={{ 
              color: "#3b82f6", 
              fontWeight: 800, 
              fontSize: "0.8rem", 
              textTransform: "uppercase", 
              letterSpacing: "0.05em", 
              textDecoration: "none", 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.4rem",
              marginBottom: "1rem"
            }}
          >
            ← Back to Cart
          </Link>
          <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: 900, 
            letterSpacing: "-0.04em", 
            background: "linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent" 
          }}>
            Checkout
          </h1>
        </header>

        <div className={styles.splitLayout}>
          
          {/* Left: Checkout Forms */}
          <form className={styles.checkoutForm} onSubmit={(e) => e.preventDefault()}>
            
            {/* 1. Identity */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionHeader}>
                <span className={styles.stepNumber}>1</span>
                Contact Details
              </h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Phone Number *</label>
                  <div className={styles.phoneInputGroup}>
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className={styles.countrySelect}
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Mobile number"
                      className={styles.input}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Indian Address Form with Smart Quick-Select Banner */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionHeader}>
                <span className={styles.stepNumber}>2</span>
                Shipping Address
              </h2>

              {/* 🏠 QUICK SELECT RIBBON: Triggers if user has saved items */}
              {savedAddresses.length > 0 && (
                <div className={styles.savedAddressRibbon}>
                  <label className={styles.savedAddressLabel}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Select a Saved Address
                  </label>
                  <select 
                    className={styles.savedAddressSelect}
                    value={selectedAddressId}
                    onChange={handleSavedAddressSelection}
                  >
                    <option value="NEW">➕ Enter a New Delivery Address...</option>
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        🏡 {addr.firstName} {addr.lastName} — {addr.addressLine1}, {addr.city} ({addr.pincode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Jane"
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullRow}`}>
                  <label>Flat, House no., Building, Company, Apartment *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="e.g. 402, Sunrise Heights"
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullRow}`}>
                  <label>Area, Street, Sector, Village *</label>
                  <input
                    type="text"
                    name="addressLine2"
                    required
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="e.g. Bandra West, Linking Road"
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullRow}`}>
                  <label>Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="e.g. Near City Mall"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit ZIP code"
                    maxLength={6}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Town / City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullRow}`}>
                  <label>State *</label>
                  <select
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className={styles.input}
                    style={{ width: "100%" }}
                  >
                    <option value="">Select State / UT</option>
                    {INDIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* 3. Delivery Method */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionHeader}>
                <span className={styles.stepNumber}>3</span>
                Delivery Type
              </h2>
              <div className={styles.deliveryGrid}>
                
                <div 
                  className={`${styles.deliveryOptionCard} ${deliveryType === "STANDARD" ? styles.selectedDelivery : ""}`}
                  onClick={() => setDeliveryType("STANDARD")}
                >
                  <div className={`${styles.radioDot} ${deliveryType === "STANDARD" ? styles.radioDotSelected : ""}`}>
                    {deliveryType === "STANDARD" && <div className={styles.radioInner}></div>}
                  </div>
                  <div className={styles.paymentText}>
                    <span className={styles.paymentTitle}>🚚 Standard Delivery</span>
                    <span className={styles.paymentDesc}>Delivered within 3 to 5 business days.</span>
                    <span style={{ color: "#10b981", fontWeight: 800, fontSize: "0.8rem", marginTop: "0.25rem" }}>Free</span>
                  </div>
                </div>

                <div 
                  className={`${styles.deliveryOptionCard} ${deliveryType === "EXPRESS" ? styles.selectedDelivery : ""}`}
                  onClick={() => setDeliveryType("EXPRESS")}
                >
                  <div className={`${styles.radioDot} ${deliveryType === "EXPRESS" ? styles.radioDotSelected : ""}`}>
                    {deliveryType === "EXPRESS" && <div className={styles.radioInner}></div>}
                  </div>
                  <div className={styles.paymentText}>
                    <span className={styles.paymentTitle}>⚡ Express Delivery</span>
                    <span className={styles.paymentDesc}>Guaranteed delivery within 1 to 2 days.</span>
                    <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.8rem", marginTop: "0.25rem" }}>₹250</span>
                  </div>
                </div>

              </div>
            </section>

            {/* 4. Payments */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionHeader}>
                <span className={styles.stepNumber}>4</span>
                Payment Method
              </h2>
              <div className={styles.paymentGrid}>
                
                <div 
                  className={`${styles.paymentOptionCard} ${paymentMethod === "COD" ? styles.selectedPayment : ""}`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <div className={`${styles.radioDot} ${paymentMethod === "COD" ? styles.radioDotSelected : ""}`}>
                    {paymentMethod === "COD" && <div className={styles.radioInner}></div>}
                  </div>
                  <div className={styles.paymentText}>
                    <span className={styles.paymentTitle}>💴 Cash on Delivery (COD)</span>
                    <span className={styles.paymentDesc}>Pay physically using cash or QR code when your package arrives.</span>
                  </div>
                </div>

                <div 
                  className={`${styles.paymentOptionCard} ${paymentMethod === "RAZORPAY" ? styles.selectedPayment : ""}`}
                  onClick={() => setPaymentMethod("RAZORPAY")}
                >
                  <div className={`${styles.radioDot} ${paymentMethod === "RAZORPAY" ? styles.radioDotSelected : ""}`}>
                    {paymentMethod === "RAZORPAY" && <div className={styles.radioInner}></div>}
                  </div>
                  <div className={styles.paymentText}>
                    <span className={styles.paymentTitle}>💳 Online Payment (Razorpay)</span>
                    <span className={styles.paymentDesc}>Complete your payment securely via live Razorpay Web Checkout.</span>
                  </div>
                </div>

              </div>
            </section>

          </form>

          {/* Right sidebar summary */}
          <aside className={styles.summarySidebar}>
            <h3 className={styles.sidebarHeader}>Order Summary</h3>
            
            <div className={styles.checkoutItemsList}>
              {cart.map(item => (
                <article key={item.id} className={styles.itemRow}>
                  <div className={styles.thumbWrapper}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className={styles.thumbImg} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.02)", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", fontWeight: 800 }}>NONE</div>
                    )}
                    <span className={styles.qtyBadge}>{item.quantity}</span>
                  </div>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                </article>
              ))}
            </div>

            <div className={styles.priceSummary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className={styles.summaryRow}>
                  <span style={{ color: "#10b981" }}>Discount Applied</span>
                  <span style={{ color: "#10b981" }}>- ₹{appliedDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              
              <div className={styles.summaryRow}>
                <span>Delivery ({deliveryType === "STANDARD" ? "Standard" : "Express"})</span>
                {shippingCost === 0 ? (
                  <span style={{ color: "#10b981", fontWeight: 800, textTransform: "uppercase", fontSize: "0.75rem" }}>Free</span>
                ) : (
                  <span>₹{shippingCost.toLocaleString("en-IN")}</span>
                )}
              </div>

              <div className={styles.summaryRow}>
                <span>GST (5%)</span>
                <span>₹{taxCost.toLocaleString("en-IN")}</span>
              </div>

              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Promo Grid */}
            <div className={styles.promoSection}>
              <label className={styles.promoLabel}>Have a discount code?</label>
              <div className={styles.promoInputGroup}>
                <input 
                  type="text" 
                  className={styles.promoInput}
                  placeholder="WELCOME10, FESTIVE20..."
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button 
                  type="button" 
                  className={styles.promoBtn}
                  onClick={applyPromoCode}
                >
                  Apply
                </button>
              </div>
              {couponError && <div className={`${styles.promoMessage} ${styles.promoError}`}>{couponError}</div>}
              {couponSuccessMsg && <div className={`${styles.promoMessage} ${styles.promoSuccess}`}>✓ {couponSuccessMsg}</div>}
            </div>

            {/* Action submission CTA */}
            <div style={{ marginTop: "2rem" }}>
              <button 
                type="button" 
                onClick={handleSubmitOrder} 
                disabled={isProcessing || cart.length === 0}
                className={styles.submitOrderBtn}
              >
                {isProcessing ? (
                  "Processing Transaction..." 
                ) : (
                  paymentMethod === "RAZORPAY" 
                  ? `💳 Pay Online • ₹${finalTotal.toLocaleString("en-IN")}`
                  : `📦 Complete Order • ₹${finalTotal.toLocaleString("en-IN")}`
                )}
              </button>
            </div>

            <div className={styles.secureFooter}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Secure Razorpay Checkout
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
