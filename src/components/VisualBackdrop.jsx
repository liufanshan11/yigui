const VisualBackdrop = () => {
  return (
    <div className="ambient-layer" aria-hidden="true">
      <div className="ambient-glow one" />
      <div className="ambient-glow two" />
      <div className="ambient-glow three" />
      <div className="ambient-grid" />
    </div>
  );
};

export default VisualBackdrop;
