import "./StatCard.css";

export function StatCard({ icone: Icone, valor, rotulo, cor = "destaque" }) {
  return (
    <div className={`stat-card stat-card--${cor}`}>
      <div className="stat-card__icone">
        <Icone size={20} strokeWidth={2.25} />
      </div>
      <div>
        <p className="stat-card__valor numero">{valor}</p>
        <p className="stat-card__rotulo">{rotulo}</p>
      </div>
    </div>
  );
}
