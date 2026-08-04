import Link from "next/link";

export const filterFieldClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

export function FilterActions({
  clearHref,
  showClear,
}: {
  clearHref: string;
  showClear: boolean;
}) {
  return (
    <div className="flex items-end gap-2">
      <button
        type="submit"
        className="h-9 flex-1 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        筛选
      </button>
      {showClear ? (
        <Link
          href={clearHref}
          className="flex h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-muted"
        >
          清空
        </Link>
      ) : null}
    </div>
  );
}

export function FilterSelect({
  name,
  label,
  value,
  placeholder,
  options,
}: {
  name: string;
  label: string;
  value?: string | number;
  placeholder: string;
  options: { value: string | number; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select
        name={name}
        defaultValue={value ?? ""}
        className={filterFieldClass}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
