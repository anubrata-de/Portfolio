/** A red hanko stamp, 新 ("new"), for projects added in the last 30 days. */
export function NewStamp({ className = "" }: { className?: string }) {
  return (
    <span className={`stamp ${className}`}>
      <span aria-hidden="true">新</span>
      <span className="visually-hidden">New</span>
    </span>
  );
}
