import PDFDocument from 'pdfkit';

const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc
        .fillColor('#444444')
        .fontSize(20)
        .text('NexMart Invoice', 50, 57)
        .fontSize(10)
        .text('NexMart Inc.', 200, 50, { align: 'right' })
        .text('123 Cyberpunk Ave', 200, 65, { align: 'right' })
        .text('Neo-Tokyo, NT 10001', 200, 80, { align: 'right' })
        .moveDown();

      doc.moveTo(50, 110).lineTo(550, 110).stroke();

      // Order Information
      doc
        .fontSize(10)
        .text(`Order ID: ${order._id}`, 50, 130)
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 145)
        .text(`Status: Paid`, 50, 160)
        .text('Bill To:', 300, 130)
        .font('Helvetica-Bold')
        .text(order.shippingAddress.fullName, 300, 145)
        .font('Helvetica')
        .text(`${order.shippingAddress.address}, ${order.shippingAddress.city}`, 300, 160)
        .text(`${order.shippingAddress.state}, ${order.shippingAddress.postalCode}`, 300, 175)
        .moveDown();

      doc.moveTo(50, 210).lineTo(550, 210).stroke();

      // Table Header
      let y = 230;
      doc
        .font('Helvetica-Bold')
        .text('Item', 50, y)
        .text('Quantity', 280, y, { width: 90, align: 'right' })
        .text('Price', 370, y, { width: 90, align: 'right' })
        .text('Line Total', 460, y, { width: 90, align: 'right' });

      doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
      doc.font('Helvetica');
      y += 30;

      // Items
      order.orderItems.forEach((item) => {
        doc
          .text(item.name, 50, y, { width: 230 })
          .text(item.qty.toString(), 280, y, { width: 90, align: 'right' })
          .text(`Rs. ${item.price.toLocaleString()}`, 370, y, { width: 90, align: 'right' })
          .text(`Rs. ${(item.price * item.qty).toLocaleString()}`, 460, y, { width: 90, align: 'right' });
        y += 25;
      });

      doc.moveTo(50, y).lineTo(550, y).stroke();
      y += 15;

      // Totals
      doc
        .font('Helvetica-Bold')
        .text('Total Amount:', 370, y, { width: 90, align: 'right' })
        .text(`Rs. ${order.totalPrice.toLocaleString()}`, 460, y, { width: 90, align: 'right' });

      // Footer
      doc
        .font('Helvetica')
        .fontSize(10)
        .text(
          'Thank you for shopping with NexMart. If you have any questions, please contact support@nexmart.com.',
          50,
          700,
          { align: 'center', width: 500 }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default generateInvoicePDF;
