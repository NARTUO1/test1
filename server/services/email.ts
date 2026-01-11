import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  // If in production and Stripe configured, use real email service
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (smtpHost && smtpUser && smtpPassword) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
  } else {
    // Use test account for development
    transporter = nodemailer.createTestAccount().then(() => {
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || "demo@ethereal.email",
          pass: process.env.SMTP_PASSWORD || "demo",
        },
      });
    }) as any;
  }

  return transporter;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailer = await getTransporter();
    const from =
      options.from ||
      process.env.SMTP_FROM_EMAIL ||
      `noreply@${process.env.SITE_URL || "markethub.com"}`;

    const info = await mailer.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log(`Email sent to ${options.to}:`, info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendOrderConfirmation(
  email: string,
  orderNumber: string,
  items: Array<{ name: string; price: number; quantity: number }>,
  totalAmount: number
): Promise<boolean> {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.name} × ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Order Confirmation</h2>
      <p>Thank you for your order! Here are your order details:</p>
      
      <p style="margin: 20px 0;">
        <strong>Order Number:</strong> ${orderNumber}
      </p>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <p style="margin-top: 20px; text-align: right;">
        <strong>Total: $${totalAmount.toFixed(2)}</strong>
      </p>
      
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your MarketHub account.</p>
      
      <p style="margin: 20px 0;">
        <a href="${resetLink}" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
      </p>
      
      <p>Or copy this link: <code>${resetLink}</code></p>
      
      <p style="color: #666; font-size: 12px;">
        This link will expire in 24 hours. If you didn't request this, please ignore this email.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Password Reset Request - MarketHub",
    html,
  });
}

export async function sendVendorVerificationEmail(
  email: string,
  vendorName: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to MarketHub!</h2>
      <p>Congratulations! Your vendor account has been verified.</p>
      
      <p>Your store "<strong>${vendorName}</strong>" is now active and ready to start selling.</p>
      
      <p style="margin: 20px 0;">
        <a href="${process.env.SITE_URL}/vendor/dashboard" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Go to Dashboard
        </a>
      </p>
      
      <p style="color: #666; font-size: 12px;">
        You can now upload products and manage your store.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Vendor Verification Approved - MarketHub",
    html,
  });
}

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to MarketHub, ${name}!</h2>
      <p>Thank you for creating an account with us.</p>
      
      <p>You can now:</p>
      <ul>
        <li>Browse thousands of products from trusted vendors</li>
        <li>Create a wishlist of favorite items</li>
        <li>Track your orders in real-time</li>
        <li>Manage your account settings</li>
      </ul>
      
      <p style="margin-top: 30px;">
        <a href="${process.env.SITE_URL}/products" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Start Shopping
        </a>
      </p>
      
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        Happy shopping!<br>
        MarketHub Team
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to MarketHub!",
    html,
  });
}
