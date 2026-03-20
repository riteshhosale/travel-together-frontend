import { Link } from "react-router-dom";

function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="fg-card border-dashed p-8 text-center">
      <h3 className="fg-title text-xl font-bold">{title}</h3>
      {description ? <p className="fg-muted mt-3 text-sm">{description}</p> : null}
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="fg-btn-primary mt-6 text-sm">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export default EmptyState;
