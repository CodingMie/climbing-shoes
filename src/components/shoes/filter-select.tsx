import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function FilterActions({
  clearHref,
  showClear,
}: {
  clearHref: string;
  showClear: boolean;
}) {
  return (
    <div className="flex items-end gap-2">
      <Button type="submit" className="flex-1">
        筛选
      </Button>
      {showClear ? (
        <Button asChild variant="outline">
          <Link href={clearHref}>清空</Link>
        </Button>
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
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Select id={name} name={name} defaultValue={value ?? ""}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
