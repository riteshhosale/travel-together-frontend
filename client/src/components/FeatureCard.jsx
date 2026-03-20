import { Link } from "react-router-dom";

function FeatureCard({ title, description, to, actionLabel = "Open Feature" }) {
  return (
    <article className="fg-card p-5">
      <h3 className="fg-title text-base font-bold">{title}</h3>
      <p className="fg-muted mt-2 text-sm">{description}</p>
      {to ? (
        <Link to={to} className="fg-btn-secondary mt-4 inline-block text-sm">
          {actionLabel}
        </Link>
      ) : null}
    </article>
  );
}

export default FeatureCard;
