"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react/ssr";
import styles from "./docs.module.css";

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={styles.codeBlock}>
      {label && <span className={styles.codeLabel}>{label}</span>}
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        className={styles.copyButton}
        aria-label={copied ? "Copied" : "Copy code"}
      >
        {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
