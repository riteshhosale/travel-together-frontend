function SectionHeader({ kicker, title, subtitle, align = "left" }) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "text-center" : ""}>
      {kicker ? (
        <p className="fg-kicker text-xs font-semibold uppercase">{kicker}</p>
      ) : null}
      {title ? (
        <h2 className="fg-title mt-3 text-3xl font-black sm:text-4xl">{title}</h2>
      ) : null}
      {subtitle ? (
        <p className={`fg-muted mt-3 text-sm sm:text-base ${isCenter ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeader;
