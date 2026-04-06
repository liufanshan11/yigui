const RunwayMarquee = ({ items }) => {
  const stream = [...items, ...items];

  return (
    <div className="runway-marquee premium-card mt-6 overflow-hidden">
      <div className="px-5 pt-5 flex items-center justify-between">
        <h3 className="font-display text-lg text-slate-900">秀场灵感流</h3>
        <p className="text-xs text-slate-500 font-semibold tracking-[0.12em] uppercase">
          实时趋势
        </p>
      </div>

      <div className="runway-track-wrap">
        <div className="runway-track">
          {stream.map((item, index) => (
            <article key={`${item.title}-${index}`} className="runway-item">
              <img src={item.image} alt={item.title} className="runway-item-image" />
              <div className="runway-item-mask" />
              <div className="runway-item-content">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">{item.tag}</p>
                <h4 className="text-white font-semibold mt-1 leading-tight">{item.title}</h4>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RunwayMarquee;
