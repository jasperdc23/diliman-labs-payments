import { DocPage, DocSection, Note } from "@/components/docs/doc-parts";

export const metadata = { title: "Design principles — EP Design Kit" };

const rules = [
  {
    title: "Visual hierarchy is not optional",
    body: "Every screen has exactly one thing it most wants the viewer to see or do. Type scale, weight, spacing and color have to make that thing obvious at a glance — not applied evenly because a heading token exists. If two elements compete for attention, that's a bug, not a style choice.",
  },
  {
    title: "Never a dead end",
    body: "Every state a screen can be in — empty, error, loading, no results, a confirmation — offers a way back or a next step. See Empty states: the component enforces this at the type level rather than leaving it to a docs page nobody reads twice.",
  },
  {
    title: "Effects support hierarchy, they never substitute for it",
    body: "Glass, grain, mesh, shadow, motion — all of it exists to reinforce structure the layout already has. If stripping every visual effect from a screen makes it confusing rather than merely less pretty, the hierarchy was missing to begin with, and no effect fixes that.",
  },
  {
    title: "Copy states what happens, never decorates",
    body: "A button says the action (“Delete payout method,” not “Confirm”). A heading says what the section is, not a tagline. No lorem ipsum, no placeholder copy left in anything presented as finished.",
  },
  {
    title: "Motion communicates state, never personality",
    body: "Transform/opacity/color only, nothing on page load, one micro-interaction per element — see Motion. Motion added because it looks impressive rather than because it answers “what just happened here” is the single most common tell of ungoverned, AI-generated UI. Don't add it.",
  },
  {
    title: "Reuse before inventing",
    body: "Check the component library and existing docs/examples before creating a new pattern. A new card variant, a new spacing value, or a new interaction per screen is how a kit stops being a kit. If something close already exists, extend it rather than forking silently.",
  },
  {
    title: "Judge the flow, not the frame",
    body: "A screen that looks resolved in isolation but doesn't connect to what comes before or after it — no back path, an orphaned success state, a form with no way to review what you just submitted — is a failure even if every individual screen is polished.",
  },
  {
    title: "Delight comes from clarity, not decoration",
    body: "The goal is an interface that feels considerate: sensible defaults, empty states that suggest the next action, errors that explain what to do about them. Not one that looks striking in a static screenshot. If a choice trades understandability for visual novelty, don't make it.",
  },
];

const checklist = [
  "Can a first-time viewer tell what this screen wants them to do, in under two seconds?",
  "Does every possible state (empty / error / loading / success) lead somewhere?",
  "Would this still work with every glass/grain/shadow effect stripped out?",
  "Does every label say the specific thing it does, with no filler?",
  "Is anything animating that doesn't need to?",
  "Does this reuse an existing component or pattern, or invent one that already has a near-equivalent elsewhere in the kit?",
];

export default function PrinciplesDocs() {
  return (
    <DocPage
      title="Design principles"
      description="Rules for keeping this kit's output from drifting into generic, ungoverned interface design — the kind that looks plausible in a screenshot but doesn't actually serve the person using it. These apply above any individual component doc, to every screen built with this kit."
    >
      <DocSection title="Why this page exists">
        <Note>
          A design kit doesn&apos;t prevent bad UI by existing — it only prevents
          <em> inconsistent</em> UI. A screen can use every token correctly and still
          have no hierarchy, no way back from an empty state, and copy that decorates
          instead of informing. These eight rules are the check against that, and
          they bind AI-assisted work on this repo specifically — see{" "}
          <code>.ai/project/design-principles.md</code>.
        </Note>
      </DocSection>

      <DocSection title="The rules">
        <div className="flex flex-col gap-4">
          {rules.map((rule, i) => (
            <div key={rule.title} className="glass grain rounded-lg border p-6">
              <p className="mb-2 font-mono text-xs text-text-tertiary">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mb-2 text-base font-semibold text-text-primary">
                {rule.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">{rule.body}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        title="Before shipping any new screen or component"
        description="A quick pass, not a formal review — but every question here should have an honest yes before something ships."
      >
        <ul className="flex flex-col gap-3">
          {checklist.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm text-text-secondary"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-text-tertiary"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
