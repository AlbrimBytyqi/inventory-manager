import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. CATEGORIE
// Per organizzare il catalogo (es. "Elettronica", "Abbigliamento")
export const categories = sqliteTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
});

// 2. PRODOTTI
// Contiene le informazioni "statiche" del prodotto
export const products = sqliteTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sku: text("sku").notNull().unique(), // Codice a barre o ID univoco commerciale
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull().default(0),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 3. INVENTORY (Giacenze)
// Relazione 1:1 con Products. Contiene i dati dinamici delle scorte.
export const inventory = sqliteTable("inventory", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .unique()
    .references(() => products.id, { onDelete: "cascade" }),
  currentStock: integer("current_stock").notNull().default(0),
  minStockThreshold: integer("min_stock_threshold").notNull().default(5), // Soglia per alert "Sottoscorta"
  lastUpdated: text("last_updated").default(sql`CURRENT_TIMESTAMP`),
});

// 4. STOCK MOVEMENTS (Il "Diario")
// Registra ogni singola variazione. Fondamentale per i report aziendali.
export const stockMovements = sqliteTable("stock_movements", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(), // Esempio: +10 (carico), -2 (vendita)
  type: text("type", { enum: ["IN", "OUT", "ADJUSTMENT"] }).notNull(),
  reason: text("reason"), // es. "Vendita POS", "Rifornimento fornitore", "Scadenza"
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
