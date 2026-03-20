function Stats() {
  const stats = [
    { label: "Trips created", value: "240+" },
    { label: "AI plans crafted", value: "1.2k" },
    { label: "Travel match score", value: "4.8/5" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((item) => (
        <div key={item.label} className="fg-card px-6 py-5">
          <p className="fg-muted text-xs uppercase tracking-[0.2em]">
            {item.label}
          </p>
          <p className="fg-title mt-3 text-2xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export default Stats;
