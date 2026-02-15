const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const sendEmail = require('./sendEmail');

// Check stock every hour

const startStockChecker = () => {
  cron.schedule('0 * * * *', async () => {  // Runs at minute 0 of every hour
    console.log('Checking stock levels...');
    
    try {
      // Find all items below threshold
      const lowStockItems = await Inventory.find({
        $expr: { $lte: ['$quantity', '$threshold'] }
      });

      if (lowStockItems.length > 0) {
        const itemsList = lowStockItems.map(item => 
          `- ${item.name} (${item.itemType}): ${item.quantity} remaining (threshold: ${item.threshold})`
        ).join('\n');

        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: '⚠️ Low Stock Alert - Pizza Delivery',
          html: `
            <h2>Low Stock Alert</h2>
            <p>The following items are below their threshold levels:</p>
            <pre>${itemsList}</pre>
            <p>Please restock as soon as possible.</p>
          `
        });

        console.log(`Low stock email sent for ${lowStockItems.length} items`);
      }
    } catch (error) {
      console.error('Stock checker error:', error);
    }
  });

  console.log('Stock checker started - runs every hour');
};

module.exports = startStockChecker;