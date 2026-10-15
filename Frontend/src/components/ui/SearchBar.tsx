import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

type SearchBarProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function SearchBar({ label, ...props }: SearchBarProps) {
  return (
    <div className="relative">
      <Input label={label} className="pl-10" {...props} />
      <Search className="pointer-events-none absolute left-3 top-[50px] h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
    </div>
  );
}
