"use server";

import { db } from "./db";
import { products, inventory, stockMovements, categories } from "./db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Recupera tutti i prodotti con i dati di inventario e categoria associati.
 * Usiamo un 'leftJoin' per assicurarci di vedere il prodotto anche se l'inventario è vuoto.
 */
export async function getProducts() {
  try {
    const data = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        price: products.price,
        currentStock: inventory.currentStock,
        minStock: inventory.minStockThreshold,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(inventory, eq(products.id, inventory.productId))
      .leftJoin(categories, eq(products.categoryId, categories.id));

    return data;
  } catch (error) {
    console.error("Errore nel recupero prodotti:", error);
    return [];
  }
}

/**
 * LA FUNZIONE SACRA: Registra un movimento e aggiorna lo stock.
 * Se qualcosa fallisce, la transazione annulla tutto (Rollback).
 */
export async function addMovement(payload: {
  productId: string;
  quantity: number; // Può essere +5 o -3
  type: "IN" | "OUT" | "ADJUSTMENT";
  reason?: string;
}) {
  try {
    await db.transaction(async (tx) => {
      // 1. Inseriamo il movimento nel "diario"
      await tx.insert(stockMovements).values({
        productId: payload.productId,
        quantity: payload.quantity,
        type: payload.type,
        reason: payload.reason,
      });

      // 2. Aggiorniamo la tabella inventory in modo atomico
      // Usiamo sql`...` per evitare problemi di concorrenza (Race Conditions)
      await tx
        .update(inventory)
        .set({
          currentStock: sql`${inventory.currentStock} + ${payload.quantity}`,
          lastUpdated: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(inventory.productId, payload.productId));
    });

    // Forza Next.js a rinfrescare i dati nella pagina senza ricaricare
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Errore durante il movimento di magazzino:", error);
    return { success: false, error: "Errore durante l'aggiornamento" };
  }
}
