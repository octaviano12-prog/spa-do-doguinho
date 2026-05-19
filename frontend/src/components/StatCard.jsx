export default function StatCard({ title, value, icon: Icon, tone = "gold" }) {
  return (
    <div className="card stat">
      <div className={`statIcon ${tone}`}>{Icon && <Icon size={22} />}</div>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
