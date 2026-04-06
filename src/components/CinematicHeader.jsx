const CinematicHeader = ({ eyebrow, title, description, image }) => {
  return (
    <div className="cinematic-header premium-card overflow-hidden mb-6">
      <div
        className="cinematic-header-bg"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      <div className="cinematic-header-mask" aria-hidden="true" />
      <div className="cinematic-header-scan" aria-hidden="true" />

      <div className="relative z-10 p-6 lg:p-8 text-white">
        <p className="text-xs uppercase tracking-[0.22em] text-white/70 font-semibold">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 text-3xl lg:text-4xl leading-tight">
          {title}
        </h1>
        <p className="mt-3 text-white/85 max-w-2xl leading-relaxed text-sm lg:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CinematicHeader;
