const db = require('./config');

const inventoryService = {
  // CREATE: Why this way? Using '?' prevents SQL Injection (security)
  async addItem(name, sku, quantity, lowStockThreshold) {
    const query = 'INSERT INTO products (name, sku, quantity, threshold) VALUES (?, ?, ?, ?)';
    await db.execute(query, [name, sku, quantity, lowStockThreshold]);
    console.log(`Product ${name} added successfully.`);
  },

  // READ: Fetches all items to generate your "Stock Report"
  async getAllStock() {
    const [rows] = await db.execute('SELECT * FROM products');
    return rows;
  },
  // NEW FEATURE: Fetch ONLY products that are at or below their low-stock threshold
  async getLowStockReport() {
    try {
      const query = `
        SELECT 
          id AS 'ID', 
          name AS 'Product Name', 
          sku AS 'Item Code', 
          quantity AS 'In Stock', 
          threshold AS 'Min Level' 
        FROM products
        WHERE quantity <= threshold`;
      const [rows] = await db.execute(query);
      return rows;
    } catch (err) {
      console.error("\n❌ Database Error fetching low stock report:", err.message);
    }
  },

  // UPDATE & ALERT: Logic to check if we are running low
  async adjustQuantity(sku, amount) {
    const query = 'UPDATE products SET quantity = quantity + ? WHERE sku = ?';
    await db.execute(query, [amount, sku]);
    
    // After updating, we check if we triggered a low stock alert
    const [item] = await db.execute('SELECT name, quantity, threshold FROM products WHERE sku = ?', [sku]);
    if (item[0].quantity <= item[0].threshold) {
      console.log(`\n⚠️  ALERT: ${item[0].name} is low on stock (${item[0].quantity} left)!`);
    }
  },

  // Delete an Item from the Stock
  async deleteItem(sku) {
      try {
    const query = 'DELETE FROM products WHERE sku = ?';
    const [result] = await db.execute(query, [sku]);

    // Check if any row was actually deleted
    if (result.affectedRows > 0) {
      console.log(`\n✅ Success: Item with SKU [${sku}] has been removed.`);
    } else {
      console.log(`\n❌ Error: No item found with SKU [${sku}].`);
    }
   } catch (err) {
    console.error("\n❌ Database Error during deletion:", err.message); }
  },

  async updateItem(sku, field, newValue) {
   try {
    // We use a template string for the field name, but '?' for the value to stay safe
    const query = `UPDATE products SET ${field} = ? WHERE sku = ?`;
    const [result] = await db.execute(query, [newValue, sku]);

    if (result.affectedRows > 0) {
      console.log(`\n✅ Successfully updated ${field} for item ${sku}!`);
    } else {
      console.log("\n❌ Error: Item not found.");
    }  
   } catch (err) {
    console.error("\n❌ Database Error:", err.message);
   }
  },
  
   // We use "AS" to rename the columns just for the display
   const query = `
    SELECT 
      id AS 'ID', 
      name AS 'Product Name', 
      sku AS 'Item Code', 
      quantity AS 'In Stock', 
      threshold AS 'Min Level' 
    FROM products`;
    
   const [rows] = await db.execute(query);
   return rows;
  }

};

module.exports = inventoryService;
