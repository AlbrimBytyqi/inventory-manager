"use server";

import { db } from "@/lib/db";
import { inventory, stockMovements } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addMovementAction(payload: {
  productId: string;
  quantity: number;
  type: "IN" | "OUT" | "ADJUSTMENT";
  reason?: string;
}) {
  try {
    await db.transaction(async (tx) => {
      // 1. Registra il movimento
      await tx.insert(stockMovements).values({
        productId: payload.productId,
        quantity: payload.quantity,
        type: payload.type,
        reason: payload.reason,
      });

      // 2. Aggiorna l'inventario
      await tx
        .update(inventory)
        .set({
          currentStock: sql`${inventory.currentStock} + ${payload.quantity}`,
          lastUpdated: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(inventory.productId, payload.productId));
    });

    revalidatePath("/"); // Aggiorna la home o la pagina prodotti
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}
