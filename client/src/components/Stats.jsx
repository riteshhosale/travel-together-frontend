function Stats() {
  const stats = [
    {
      label: 'Trips created',
      value: '240+',
      hint: 'Across city breaks, road trips, and group escapes',
    },
    {
      label: 'AI plans crafted',
      value: '1.2k',
      hint: 'Fast itinerary help for travelers on the move',
    },
    {
      label: 'Travel match score',
      value: '4.8/5',
      hint: 'Built to make partner-finding feel easier',
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-3'>
      {stats.map((item) => (
        <div key={item.label} className='fg-card fg-card-hover px-6 py-6'>
          <p className='fg-muted text-xs uppercase tracking-[0.22em]'>{item.label}</p>
          <p className='fg-title mt-4 text-3xl font-black'>{item.value}</p>
          <p className='fg-muted mt-3 text-sm'>{item.hint}</p>
        </div>
      ))}
    </div>
  );
}

export default Stats;
