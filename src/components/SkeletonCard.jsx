export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden card-shadow animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-4 bg-gray-200 rounded-full w-1/3 mt-3" />
      </div>
    </div>
  );
}

export function SkeletonBanner() {
  return <div className="h-48 md:h-56 rounded-3xl bg-gray-200 animate-pulse" />;
}

export function SkeletonChips() {
  return (
    <div className="flex gap-2">
      {[80, 100, 70, 90, 80].map((w, i) => (
        <div key={i} className="h-9 rounded-full bg-gray-200 animate-pulse shrink-0" style={{ width: w }} />
      ))}
    </div>
  );
}
