const inventory = require('./inventoryService'); // Ensure the path is correct
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * HELPER FUNCTION: ask()
 * This wraps the old readline in a Promise so we can use 'await'.
 * It makes the code wait for the user to type before moving to the next line.
 */
const ask = (query) => new Promise((resolve) => readline.question(query, resolve));

async function main() {
  console.log("\n==============================");
  console.log("  STOCKLOGIC: INVENTORY SYSTEM");
  console.log("==============================");33
  console.log("1. Add Item");
  console.log("2. View Stock Report");
  console.log("3. Update Item Details");
  console.log("4. Delete Item");
  console.log("5. Exit");
  console.log("------------------------------");
  
  const choice = await ask('Choose an option: ');

  switch (choice) {
    case '1':
      console.log("\n--- Add New Product ---");
      const name = await ask('Product Name: ');
      const sku = await ask('Unique Item Code: ');
      const qty = await ask('Initial Quantity: ');
      const threshold = await ask('Low-Stock Alert Level: ');
      
      // We use parseInt because terminal input is text; the DB needs numbers.
      await inventory.addItem(name, sku, parseInt(qty), parseInt(threshold));
      return main(); // This loops back to the start

    case '2':
      console.log("\n--- Current Inventory Report ---");
      const data = await inventory.getAllStock();
      console.table(data);
      return main(); // Returns to menu after showing table


    case '3':
      console.log("\n--- Update Item Details ---");
      const Usku = await ask('Enter the SKU of the item to update: ');
      
      console.log("What would you like to change?");
      console.log("1. Name | 2. Quantity | 3. Low-Stock Limit | 4. SKU ");
      const updateChoice = await ask('Selection: ');

      let field, newValue;

      if (updateChoice === '1') {
        field = 'name';
        newValue = await ask('Enter new Name: ');
      } else if (updateChoice === '2') {
        field = 'quantity';
        const val = await ask('Enter new Quantity total: ');
        newValue = parseInt(val);
      } else if (updateChoice === '3') {
        field = 'threshold';
        const val = await ask('Enter new Threshold: ');
        newValue = parseInt(val);
       } else if (updateChoice === '4') {
        field = 'sku';
        newValue = await ask('Enter new SKU: ');
 
      } else {
        console.log("Invalid selection.");
        return main();
      }

      await inventory.updateItem(Usku, field, newValue);
      return main();


    case '4': // --- NEW DELETE OPTION ---
      console.log("\n--- Delete Item Permanently ---");
      const skuToDelete = await ask('Enter the SKU of the item to delete: ');
      const confirm = await ask(`Are you sure you want to delete ${skuToDelete}? (yes/no): `);
      
      if (confirm.toLowerCase() === 'yes') {
        await inventory.deleteItem(skuToDelete);
      } else {
        console.log("Deletion cancelled.");
      }
      return main();

    case '5':
      console.log("Shutting down StockLogic. nGoodbye!");
      readline.close();
      process.exit(0);
      break;

    default:
      console.log("❌ Invalid option. Please pick 1-4.");
      return main();
  }
}

// At the bottom of app.js
const hour = new Date().getHours();
let greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

console.log(`\n${greeting}! Welcome to StockLogic.`);

 // Start the loop

// Start the application
main();