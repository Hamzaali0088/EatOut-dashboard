const STATUS_COLORS = {
  PENDING: "badge-warning",
  CONFIRMED: "badge-info",
  PREPARING: "badge-info",
  OUT_FOR_DELIVERY: "badge-info",
  COMPLETED: "badge-success",
  CANCELLED: "badge-danger"
};

export default function StatusBadge({ status }) {
  const normalized = status || "UNKNOWN";
  const cls = STATUS_COLORS[normalized] || "badge-info";
  return (
    <span className={`badge ${cls}`}>
      {normalized.replace(/_/g, " ").toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase())}
    </span>
  );
}

