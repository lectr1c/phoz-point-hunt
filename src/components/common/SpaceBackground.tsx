export default function SpaceBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden space-bg">
      <div className="starfield-sm starfield-twinkle opacity-80" />
      <div className="starfield-lg starfield-twinkle opacity-70 [animation-delay:3s]" />
    </div>
  );
}
