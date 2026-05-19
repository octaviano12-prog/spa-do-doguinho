export default function DataTable({ columns, rows, loading, empty = "Nenhum registro encontrado" }) {
  if (loading) return <div className="card loading"><div className="spinner" /> Carregando...</div>;

  return (
    <div className="card tableWrap">
      <table>
        <thead>
          <tr>{columns.map((col) => <th key={col.key}>{col.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="empty">{empty}</td></tr>
          ) : rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
