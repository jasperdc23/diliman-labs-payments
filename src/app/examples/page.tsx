import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Card, CardTitle, CardBody } from "@/components/ui/card";
import { BackLink } from "./_components/back-link";

export const metadata: Metadata = {
  title: "Examples — EP Design Kit",
  description: "Sample applications built entirely from EP components.",
};

const examples = [
  {
    href: "/examples/login",
    title: "Login",
    description: "A centered auth screen with email/password sign-in, built from Input, Button and the kit's glass surface.",
  },
  {
    href: "/examples/signup",
    title: "Sign up",
    description: "A new-account form with a terms acknowledgment, showing Checkbox alongside the same auth layout.",
  },
  {
    href: "/examples/dashboard",
    title: "Dashboard",
    description: "An operations dashboard for monitoring transaction volume, with charts, a sortable ledger, and a real app shell.",
  },
  {
    href: "/examples/modals",
    title: "Modals",
    description: "Every Modal pattern a payments product needs: a destructive confirmation, a form, a loading state, and sizes side by side.",
  },
];

export default function ExamplesPage() {
  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 pt-24 pb-24 sm:px-10">
      <BackLink href="/" label="Back to design kit" />
      <section className="flex flex-col gap-6">
        <p className="font-mono text-xs tracking-widest text-text-tertiary uppercase">
          Example applications
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-balance text-text-primary sm:text-5xl">
          Built entirely from the kit&apos;s components.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-text-secondary">
          These screens aren&apos;t documentation — they&apos;re proof that the
          component library composes into a real product. No extra styling,
          no one-off markup, just the same tokens and primitives used
          throughout the docs.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {examples.map((example) => (
          <Link key={example.href} href={example.href} className="block">
            <Card interactive className="h-full">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{example.title}</CardTitle>
                <ArrowRight size={16} className="text-text-tertiary" />
              </div>
              <CardBody>{example.description}</CardBody>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
