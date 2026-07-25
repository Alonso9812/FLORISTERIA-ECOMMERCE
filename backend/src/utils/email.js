import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT) || 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: '"Floristería Online" <no-reply@floristeria.com>',
      to,
      subject,
      html
    });
    console.log('✅ Email enviado a Mailtrap:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
}

export function orderConfirmationTemplate(order, items) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product?.name || 'Producto'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${parseFloat(item.price).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #e11d48, #fb7185); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">🌸 Floristería Online</h1>
      </div>
      <div style="padding: 30px; background: #fff;">
        <h2 style="color: #e11d48;">¡Gracias por tu compra!</h2>
        <p>Hola <strong>${order.recipientName}</strong>,</p>
        <p>Tu pedido ha sido recibido y está siendo procesado.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Orden #${order.id}</strong></p>
          <p><strong>Total:</strong> $${parseFloat(order.total).toFixed(2)}</p>
          <p><strong>Estado:</strong> ${order.status}</p>
          <p><strong>Dirección:</strong> ${order.address}, ${order.city}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: center;">Cant.</th>
              <th style="padding: 10px; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      </div>
    </div>
  `;
}

export function newOrderAdminTemplate(order, items) {
  const itemsHtml = items.map(item => `
    <li>${item.quantity}x ${item.product?.name || 'Producto'} - $${(parseFloat(item.price) * item.quantity).toFixed(2)}</li>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e11d48;">📦 Nuevo Pedido #${order.id}</h2>
      <p><strong>Cliente:</strong> ${order.recipientName}</p>
      <p><strong>Total:</strong> $${parseFloat(order.total).toFixed(2)}</p>
      <ul>${itemsHtml}</ul>
    </div>
  `;
}