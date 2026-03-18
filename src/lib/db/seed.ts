import { db } from "./index";
import { products, categories, inventory } from "./schema";

async function seed() {
  console.log("🌱 Inizio Seeding...");

  // 1. Creiamo una categoria
  const [cat] = await db
    .insert(categories)
    .values({
      name: "Elettronica",
      description: "Gadget e dispositivi tech",
    })
    .returning();

  // 2. Creiamo un prodotto
  const [prod] = await db
    .insert(products)
    .values({
      name: "iPhone 15 Pro",
      sku: "IPH15P-001",
      price: 999.99,
      categoryId: cat.id,
    })
    .returning();

  // 3. Inizializziamo l'inventario per quel prodotto
  await db.insert(inventory).values({
    productId: prod.id,
    currentStock: 10,
    minStockThreshold: 2,
  });

  console.log("✅ Seeding completato con successo!");
}

seed().catch(console.error);
