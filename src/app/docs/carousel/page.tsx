import { Carousel } from "@/components/ui/carousel";
import { DocPage, DocSection, Example, Note, PropsTable } from "@/components/docs/doc-parts";

export const metadata = { title: "Carousel — EP Design Kit" };

function PlaceholderSlide({ label }: { label: string }) {
  return (
    <div
      className="flex h-40 w-full items-center justify-center rounded-lg text-text-secondary"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, transparent) 0%, var(--surface-sunken) 70%)",
        fontSize: "var(--text-sm)",
      }}
    >
      {label}
    </div>
  );
}

export default function CarouselDocs() {
  return (
    <DocPage
      title="Carousel"
      description="A horizontally scrollable set of slides built on native CSS scroll-snap rather than a JS drag/swipe reimplementation — touch swipe, trackpad scroll and keyboard arrow scrolling all come free from the browser."
    >
      <DocSection
        title="Basic usage"
        description="Prev/next call scrollTo on the track; the dots reflect the nearest snapped slide, computed from scrollLeft on every scroll event. Slides use the same token-built placeholder pattern as MediaCard — no external image URLs anywhere in this kit."
      >
        <Example
          layout="stacked"
          code={`<Carousel
  aria-label="Feature highlights"
  slides={[<Slide key="1" />, <Slide key="2" />, <Slide key="3" />]}
/>`}
        >
          <div style={{ maxWidth: "26rem" }}>
            <Carousel
              aria-label="Feature highlights"
              slides={[
                <PlaceholderSlide key="1" label="1. Send money with QR Ph" />,
                <PlaceholderSlide key="2" label="2. Track InstaPay transfers" />,
                <PlaceholderSlide key="3" label="3. Export settlement reports" />,
              ]}
            />
          </div>
        </Example>
        <Note>
          Position tracking reads <code>scrollLeft ÷ track width</code>, rounded to the nearest
          whole slide, on the track&apos;s native <code>scroll</code> event — simpler and just as
          reliable as an <code>IntersectionObserver</code> per slide, since it always agrees with
          whatever scroll-snap just settled the track on.
        </Note>
      </DocSection>

      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              name: "slides",
              type: "ReactNode[]",
              description: "One entry per slide, rendered in order.",
            },
            {
              name: "aria-label",
              type: "string",
              defaultValue: `"Carousel"`,
              description: "Label for the scrollable region.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
