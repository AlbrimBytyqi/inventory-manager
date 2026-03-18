import { getProductsWithStock } from "@/lib/db/queries/products";

export default async function TestPage() {
  const products = await getProductsWithStock();

  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">📦 Test Inventario</h1>

      <div className="grid gap-4">
        {products.map((p) => {
          // Logica per il colore dell'allerta
          const isLowStock = (p.currentStock ?? 0) < (p.minStockThreshold ?? 0);

          return (
            <div key={p.id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">{p.name}</span>
                <span className="text-sm text-gray-500 uppercase">{p.sku}</span>
              </div>

              <div className="mt-2 flex gap-4 text-sm">
                <p>
                  Prezzo: <span className="font-medium">€{p.price}</span>
                </p>
                <p>
                  Stock:
                  <span
                    className={`ml-1 font-bold ${isLowStock ? "text-red-500" : "text-green-600"}`}
                  >
                    {p.currentStock ?? 0}
                  </span>
                  <span className="text-gray-400">
                    {" "}
                    / soglia: {p.minStockThreshold}
                  </span>
                </p>
              </div>

              {isLowStock && (
                <p className="text-xs text-red-500 mt-1 font-bold">
                  ⚠️ ATTENZIONE: Sottoscorta!
                </p>
              )}
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <p>Nessun prodotto trovato. Controlla il seed.</p>
      )}
    </main>
  );
}
