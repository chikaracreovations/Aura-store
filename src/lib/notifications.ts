import nodemailer from "nodemailer";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

// ⚙️ Lazy-Initialize SMTP Transporter
async function getTransporter() {
  // Check for explicit production environment variables
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      transporter: nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      }),
      isProduction: true
    };
  }
  
  // ⚡ Zero-Config Automation Fallback (Ethereal Test Gateway)
  // Creates a real live SMTP environment on the fly so emails are actually sent and readable!
  const testAccount = await nodemailer.createTestAccount();
  return {
    transporter: nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
    isProduction: false
  };
}

// Styled HTML Template Helper
function getHTMLWrapper(body: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; padding: 30px 10px; color: #1f2937; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        <!-- Luxury Brand Header -->
        <div style="background-color: #0f172a; padding: 30px 20px; text-align: center; border-bottom: 4px solid #3b82f6;">
          <h1 style="margin: 0; color: #ffffff; letter-spacing: -0.03em; font-size: 28px; font-weight: 900;">AURA.</h1>
          <div style="font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-top: 5px; letter-spacing: 0.1em;">Modern Retail Standard</div>
        </div>
        
        <!-- Dynamic Content Wrapper -->
        <div style="padding: 40px 30px;">
          ${body}
        </div>
        
        <!-- Institutional Footer -->
        <div style="padding: 25px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} Aura Store. All rights reserved.</p>
          <p style="margin: 0;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * 📧 Trigger 1: Order Confirmation Dispatch
 */
export async function dispatchOrderNotifications(
  order: { id: string; total: number; shippingAddress?: string | null; phone?: string | null; paymentMethod?: string | null },
  user: { name?: string | null; email: string },
  items: OrderItem[]
) {
  try {
    const { transporter, isProduction } = await getTransporter();
    const orderHash = order.id.substring(0, 8).toUpperCase();
    const formattedTotal = order.total.toFixed(2);

    // 1. Build HTML Products Table
    let itemRows = "";
    items.forEach(item => {
      itemRows += `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 0; font-weight: 600; font-size: 14px;">${item.name}</td>
          <td style="padding: 12px 0; text-align: center; font-size: 14px; color: #6b7280;">x${item.quantity}</td>
          <td style="padding: 12px 0; text-align: right; font-weight: 700; font-size: 14px;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    });

    const emailHtml = getHTMLWrapper(`
      <h2 style="margin-top: 0; color: #111827; font-size: 22px; font-weight: 800;">Order Confirmed! ⚡</h2>
      <p>Hi ${user.name || 'there'},</p>
      <p>Thank you for shopping with Aura. Your order <strong>#${orderHash}</strong> has been successfully placed and is currently being processed. We will notify you once it ships.</p>
      
      <!-- Cart Breakdown Table -->
      <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
        <thead>
          <tr style="border-bottom: 2px solid #e5e7eb; text-align: left; color: #6b7280; font-size: 12px; text-transform: uppercase;">
            <th style="padding-bottom: 8px;">Item</th>
            <th style="padding-bottom: 8px; text-align: center;">Qty</th>
            <th style="padding-bottom: 8px; text-align: right;">Value</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr>
            <td colspan="2" style="padding-top: 20px; font-weight: 700; color: #111827;">TOTAL:</td>
            <td style="padding-top: 20px; text-align: right; font-size: 18px; font-weight: 900; color: #3b82f6;">₹${formattedTotal}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Address Coordinates Box -->
      <div style="background-color: #f8fafc; border-radius: 10px; padding: 18px; border: 1px solid #e2e8f0; font-size: 13px; margin-bottom: 30px;">
        <div style="font-weight: 700; text-transform: uppercase; font-size: 11px; color: #64748b; margin-bottom: 5px;">Shipping Address:</div>
        <div style="font-weight: 600; color: #334155; margin-bottom: 8px;">📍 ${order.shippingAddress || "Standard Delivery"}</div>
        <div style="font-weight: 700; text-transform: uppercase; font-size: 11px; color: #64748b; margin-bottom: 5px;">Phone Number:</div>
        <div style="font-family: monospace; font-weight: 700; color: #334155;">📞 ${order.phone || "Not Provided"}</div>
      </div>
      
      <div style="text-align: center;">
        <a href="http://localhost:3000/orders" style="display: inline-block; padding: 14px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px;">View Order Status</a>
      </div>
    `);

    // Send Outbound Email
    const info = await transporter.sendMail({
      from: isProduction ? `"Aura Storefront" <${process.env.SMTP_USER}>` : '"Aura Storefront" <noreply@aura.in>',
      to: user.email,
      subject: `⚡ Aura Confirmed! Order #${orderHash} authorized`,
      html: emailHtml,
      text: `Aura: Order #${orderHash} confirmed for ₹${formattedTotal}. Shipping address: ${order.shippingAddress}`
    });

    // Log Beautiful Stream Outcomes to Node Console
    logOutcome("ORDER CONFIRMATION EMAIL", info, isProduction, user.email);
    return { success: true, info };

  } catch (error) {
    console.error("❌ CRITICAL: Order Notification Dispatch Failed:", error);
    return { success: false, error };
  }
}

/**
 * 📧 Trigger 2: Status Modification Dispatch
 */
export async function dispatchStatusUpdateNotification(
  orderId: string,
  newStatus: string,
  user: { name?: string | null; email: string }
) {
  try {
    const { transporter, isProduction } = await getTransporter();
    const orderHash = orderId.substring(0, 8).toUpperCase();

    // Build custom messaging depending on new tracking lifecycle point
    let statusColor = "#3b82f6";
    let statusIcon = "⚡";
    let messageBody = "";

    switch (newStatus) {
      case "PROCESSING":
        statusColor = "#8b5cf6"; // Violet
        statusIcon = "⚙️";
        messageBody = "Your order is currently being processed and prepared for dispatch.";
        break;
      case "SHIPPED":
        statusColor = "#2563eb"; // Blue
        statusIcon = "🚚";
        messageBody = "Great news! Your order has been shipped and is on its way to you.";
        break;
      case "DELIVERED":
        statusColor = "#10b981"; // Emerald
        statusIcon = "✅";
        messageBody = "Your order has been successfully delivered. We hope you love your new items!";
        break;
      case "CANCELLED":
        statusColor = "#ef4444"; // Red
        statusIcon = "🛑";
        messageBody = "Your order has been cancelled. Any payments made will be refunded to your original payment method.";
        break;
      default:
        messageBody = "Your order status has been updated.";
    }

    const emailHtml = getHTMLWrapper(`
      <h2 style="margin-top: 0; color: #111827; font-size: 22px; font-weight: 800;">Order Status Update 📦</h2>
      <p>Hi ${user.name || 'there'},</p>
      
      <p>We wanted to let you know that there is an update regarding your Order <strong>#${orderHash}</strong>.</p>
      
      <!-- High Contrast Lifecycle Indicator -->
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; border-left: 6px solid ${statusColor}; text-align: center; margin: 30px 0;">
        <div style="font-size: 32px; margin-bottom: 10px;">${statusIcon}</div>
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 5px;">Updated Status:</div>
        <div style="font-size: 22px; font-weight: 900; color: ${statusColor};">${newStatus}</div>
      </div>
      
      <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin-bottom: 30px;">
        ${messageBody}
      </p>
      
      <div style="text-align: center;">
        <a href="http://localhost:3000/orders" style="display: inline-block; padding: 14px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px;">View Order Details</a>
      </div>
    `);

    // Send Status Change Email
    const info = await transporter.sendMail({
      from: isProduction ? `"Aura Storefront" <${process.env.SMTP_USER}>` : '"Aura Storefront" <noreply@aura.in>',
      to: user.email,
      subject: `📦 Status Update: Order #${orderHash} is now ${newStatus}`,
      html: emailHtml,
      text: `Aura: Order #${orderHash} tracking update. Status changed to: ${newStatus}`
    });

    logOutcome(`ORDER UPDATE EMAIL (${newStatus})`, info, isProduction, user.email);
    return { success: true, info };

  } catch (error) {
    console.error("❌ CRITICAL: Status Update Notification Failed:", error);
    return { success: false, error };
  }
}

// Standardized Visual Outcomes Logging Helper
function logOutcome(label: string, info: any, isProduction: boolean, email: string) {
  const divider = "═".repeat(72);
  if (isProduction) {
    console.log(`\n\x1b[32m╔${divider}╗\n║ ✅ PRODUCTION EMAIL DISPATCHED SUCCESSFULLY                             ║\n╠${divider}╣\n║  TYPE:    ${label.padEnd(60)} ║\n║  TARGET:  ${email.padEnd(60)} ║\n║  MESSAGE: SMTP Accepted Handshake & Serialized payload                 ║\n╚${divider}╝\x1b[0m\n`);
  } else {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`\n\x1b[33m╔${divider}╗\n║ 🧪 ZERO-CONFIG TEST EMAIL DELIVERED (ETHEREAL GATEWAY)                ║\n╠${divider}╣\n║  TYPE:    ${label.padEnd(60)} ║\n║  TARGET:  ${email.padEnd(60)} ║\n║  URL:     ${(previewUrl || "Unavailable").padEnd(60)} ║\n╠${divider}╣\n║  💡 ACTION REQUIRED: Click the URL above to view the rendered email!   ║\n╚${divider}╝\x1b[0m\n`);
  }
}
