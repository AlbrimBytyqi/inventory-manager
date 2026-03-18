import { db } from "../index";
import { inventory, products } from "../schema";
import { eq } from "drizzle-orm";

export async function getProductsWithStock() {
  return await db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      price: products.price, // Mancava questo!
      currentStock: inventory.currentStock,
      minStockThreshold: inventory.minStockThreshold, // E questo!
    })
    .from(products)
    .leftJoin(inventory, eq(products.id, inventory.productId));
}
