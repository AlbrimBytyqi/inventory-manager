export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">
        Panoramica Magazzino
      </h1>

      {/* Qui metteremo le card con le statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Prodotti Totali</p>
          <p className="text-3xl font-bold">128</p>
        </div>
      </div>
    </div>
  );
}
