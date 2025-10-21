interface SectionHeadingProps {
  label?: string;
  title: string;
}

export default function SectionHeading({ label, title }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="inline-flex items-center rounded-full bg-emerald-900/25 text-emerald-300 px-2 py-0.5 text-[11px] font-medium">
          {label}
        </span>
      )}
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
    </div>
  );
}
