import { File, FileArchive, FileDoc, FileImage, FilePdf, FileXls, X } from "@phosphor-icons/react/ssr";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const rounded = value >= 10 || value % 1 === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[unitIndex]}`;
}

function iconForFilename(filename: string, size: number) {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  const props = { size, "aria-hidden": true, style: { color: "var(--text-tertiary)" } } as const;
  switch (extension) {
    case "pdf":
      return <FilePdf {...props} />;
    case "png":
    case "jpg":
    case "jpeg":
    case "webp":
    case "gif":
      return <FileImage {...props} />;
    case "doc":
    case "docx":
      return <FileDoc {...props} />;
    case "xls":
    case "xlsx":
    case "csv":
      return <FileXls {...props} />;
    case "zip":
    case "rar":
    case "7z":
      return <FileArchive {...props} />;
    default:
      return <File {...props} />;
  }
}

type AttachmentProps = {
  filename: string;
  /** Size in bytes — formatted internally, e.g. 253952 -> "248 KB". */
  size: number;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
};

/**
 * A file chip — icon (picked by extension), filename, formatted size and
 * an optional remove button. The remove button reuses Badge's exact
 * removable pattern (src/components/ui/badge.tsx: same icon, size, opacity
 * and hover treatment) rather than inventing a second "removable chip"
 * mechanism in the same kit.
 */
export function Attachment({ filename, size, onRemove, removeLabel, className = "" }: AttachmentProps) {
  return (
    <span
      className={`inline-flex items-center border ${className}`}
      style={{
        gap: "var(--space-2)",
        padding: "var(--space-2) var(--space-3)",
        borderRadius: "var(--radius-md)",
        borderColor: "var(--border-default)",
        background: "var(--surface-raised)",
        maxWidth: "20rem",
      }}
    >
      {iconForFilename(filename, 18)}
      <span className="flex min-w-0 flex-col" style={{ lineHeight: "var(--leading-tight)" }}>
        <span
          className="truncate font-medium text-text-primary"
          style={{ fontSize: "var(--text-sm)" }}
        >
          {filename}
        </span>
        <span className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
          {formatFileSize(size)}
        </span>
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? `Remove ${filename}`}
          className="-mr-1 inline-flex shrink-0 items-center justify-center rounded-full opacity-70 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:opacity-100"
          style={{ color: "var(--text-tertiary)" }}
        >
          <X size={12} weight="bold" />
        </button>
      )}
    </span>
  );
}
