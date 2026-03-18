import { db } from "@/lib/db";
import { inventory, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getProductsWithStock() {
  return await db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      currentStock: inventory.currentStock,
    })
    .from(products)
    .leftJoin(inventory, eq(products.id, inventory.productId));
}
