"use client";

import { useMemo, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  Lock,
  PlugsConnected,
  SignOut,
  Warning,
} from "@phosphor-icons/react/ssr";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  PERIOD_OPTIONS,
  RAILS,
  TODAY,
  formatCount,
  type Period,
  type Rail,
} from "@/app/dashboard/_data/payments";
import { logout } from "@/app/actions/auth";
import { SectionFrame } from "../_components/section-frame";
import { DEFAULT_SETTINGS, useOps } from "../_components/ops-context";
import styles from "../ops.module.css";

function SettingRow({
  name,
  help,
  children,
}: {
  name: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.settingRow}>
      <span className={styles.settingLabel}>
        <span className={styles.settingName}>{name}</span>
        <span className={styles.settingHelp}>{help}</span>
      </span>
      <span className={styles.chipRow}>{children}</span>
    </div>
  );
}

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
      <span className={styles.brandRule} aria-hidden="true" />
      <h3 className={styles.eyebrow}>{children}</h3>
    </div>
  );
}

function GeneralTab() {
  const ops = useOps();
  const { settings } = ops;

  const failedToday = useMemo(
    () => ops.rows.filter((row) => row.date.startsWith(TODAY) && row.status === "failed").length,
    [ops.rows],
  );
  const alertWouldFire = failedToday >= settings.failThreshold;

  const summary = [
    { label: "Alert at", value: `${formatCount(settings.failThreshold)} failed` },
    { label: "Page size", value: formatCount(settings.pageSize) },
    { label: "Density", value: settings.density === "compact" ? "Compact" : "Comfortable" },
    { label: "Payment methods plotted", value: `${settings.visibleRails.length} of 3` },
    { label: "Notifications", value: settings.toastsEnabled ? "On" : "Muted" },
    { label: "Feed", value: settings.simulateOutage ? "Simulated outage" : "Healthy" },
  ];

  function toggleRail(rail: Rail, checked: boolean) {
    const next = checked
      ? RAILS.filter((entry) => entry === rail || settings.visibleRails.includes(entry))
      : settings.visibleRails.filter((entry) => entry !== rail);
    ops.updateSettings({ visibleRails: [...next] });
  }

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
      {/* The one yellow block: a live readout of the effective config. */}
      <div className={styles.accentFrame}>
        <div data-surface="accent" className={`${styles.accentBand} grain`}>
          {summary.map((entry) => (
            <div key={entry.label} className={styles.bandFigure}>
              <span className={styles.eyebrow}>{entry.label}</span>
              <span className={styles.bandValue} style={{ fontSize: "var(--text-lg)" }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {settings.simulateOutage && (
        <Alert
          variant="warning"
          title="Feed outage is simulated"
          description={
            <span className="flex flex-wrap items-center" style={{ gap: "var(--space-4)" }}>
              <span>
                Overview, Transactions, Settlements and Merchants are all showing the failed-load
                state. Nothing is actually wrong with the data.
              </span>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => ops.updateSettings({ simulateOutage: false })}
              >
                Restore the feed
                <ArrowRight size={14} weight="bold" aria-hidden="true" />
              </button>
            </span>
          }
        />
      )}

      <Card>
        <GroupHeading>Monitoring</GroupHeading>

        <SettingRow
          name="Failed-transfer alert threshold"
          help={`The Overview banner appears when today's failed count reaches this number. Right now ${formatCount(failedToday)} have failed today, so the alert is ${alertWouldFire ? "showing" : "hidden"}.`}
        >
          <span style={{ minWidth: "14rem" }}>
            <Slider
              min={1}
              max={12}
              step={1}
              showValue
              value={settings.failThreshold}
              onValueChange={(value) => ops.updateSettings({ failThreshold: value })}
              label="Failed transfers"
              formatValue={(value) => `${formatCount(value)} today`}
            />
          </span>
        </SettingRow>

        <SettingRow
          name="Payment methods plotted on the Overview chart"
          help="Unchecking all of them is allowed — the chart then says so and offers a way back rather than drawing an empty frame."
        >
          <CheckboxGroup legend="Payment methods">
            {RAILS.map((rail) => (
              <Checkbox
                key={rail}
                label={rail}
                checked={settings.visibleRails.includes(rail)}
                onChange={(event) => toggleRail(rail, event.target.checked)}
              />
            ))}
          </CheckboxGroup>
        </SettingRow>

        <SettingRow
          name="Default reporting period"
          help="Sets the period the Overview opens on, and switches the current view to it immediately."
        >
          <NativeSelect
            aria-label="Default reporting period"
            value={settings.defaultPeriod}
            onChange={(event) => {
              const period = event.target.value as Period;
              ops.updateSettings({ defaultPeriod: period });
              ops.setPeriod(period);
            }}
            options={PERIOD_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
        </SettingRow>
      </Card>

      <Card>
        <GroupHeading>Tables</GroupHeading>

        <SettingRow
          name="Rows per page"
          help="Applies to the transactions ledger. Changing it returns you to page one, so a shorter page can't leave you past the end."
        >
          <ToggleGroup
            type="single"
            value={[String(settings.pageSize)]}
            onValueChange={(next) => ops.updateSettings({ pageSize: Number(next[0] ?? 10) })}
            aria-label="Rows per page"
          >
            <ToggleGroupItem value="10">10</ToggleGroupItem>
            <ToggleGroupItem value="25">25</ToggleGroupItem>
            <ToggleGroupItem value="50">50</ToggleGroupItem>
          </ToggleGroup>
        </SettingRow>

        <SettingRow
          name="Row density"
          help="Shared by the ledger, the batch table and the merchant table. The ledger toolbar sets the same preference."
        >
          <ToggleGroup
            type="single"
            value={[settings.density]}
            onValueChange={(next) =>
              ops.updateSettings({
                density: (next[0] as "compact" | "comfortable") ?? "comfortable",
              })
            }
            aria-label="Row density"
          >
            <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
            <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
          </ToggleGroup>
        </SettingRow>

        <SettingRow name="Zebra striping" help="Alternating row tint on every table in the console.">
          <Switch
            checked={settings.zebra}
            onChange={(event) => ops.updateSettings({ zebra: event.target.checked })}
            label={settings.zebra ? "On" : "Off"}
          />
        </SettingRow>
      </Card>

      <Card>
        <GroupHeading>Notifications and prototype controls</GroupHeading>

        <SettingRow
          name="Action notifications"
          help="Retries, flags, exports and resets still change the data when this is off — they just stop announcing themselves."
        >
          <Switch
            checked={settings.toastsEnabled}
            onChange={(event) => ops.updateSettings({ toastsEnabled: event.target.checked })}
            label={settings.toastsEnabled ? "On" : "Muted"}
          />
        </SettingRow>

        <SettingRow
          name="Simulate a data-feed outage"
          help="A prototype control, not a real toggle. It makes the failed-load state reachable so the way out of it can be checked."
        >
          <Switch
            checked={settings.simulateOutage}
            onChange={(event) => ops.updateSettings({ simulateOutage: event.target.checked })}
            label={settings.simulateOutage ? "Outage on" : "Feed healthy"}
          />
        </SettingRow>

        <SettingRow
          name="Prototype data"
          help={
            ops.mutatedCount === 0
              ? "No retries or flags have been applied yet. Every row is as the dataset authored it."
              : `${formatCount(ops.mutatedCount)} rows have been retried or flagged in this session. Resetting returns every one of them to its authored state.`
          }
        >
          <Button
            variant="danger"
            size="sm"
            iconLeft={<ArrowCounterClockwise size={14} weight="regular" />}
            disabled={ops.mutatedCount === 0}
            onClick={ops.requestReset}
          >
            Reset prototype data
          </Button>
        </SettingRow>
      </Card>

      <Card
        flat
        className="flex-wrap items-center justify-between"
        style={{ flexDirection: "row", gap: "var(--space-4)" }}
      >
        <span className="flex items-center" style={{ gap: "var(--space-3)" }}>
          <PlugsConnected size={20} weight="fill" className="text-accent-text" aria-hidden="true" />
          <span className="flex flex-col" style={{ gap: "var(--space-1)" }}>
            <span
              className="text-text-primary"
              style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)" }}
            >
              Nothing here is saved anywhere
            </span>
            <span className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
              Preferences live in React state for the length of this session. A reload returns
              every one of them to{" "}
              {formatCount(DEFAULT_SETTINGS.failThreshold)} failed / {formatCount(DEFAULT_SETTINGS.pageSize)}{" "}
              per page.
            </span>
          </span>
        </span>
        <button type="button" className={styles.linkButton} onClick={() => ops.goTo("overview")}>
          <Warning size={16} weight="regular" aria-hidden="true" />
          Back to the Overview
        </button>
      </Card>
    </div>
  );
}

function ProfileTab() {
  // Client-side only, like every other setting in this console — there is
  // no backend to persist an org profile to, so this mirrors the same
  // "session state, not storage" rule the rest of Settings follows.
  const [orgName, setOrgName] = useState("Diliman Labs");
  const [contactEmail, setContactEmail] = useState("ops@dilimanlabs.ph");
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
      <Card>
        <GroupHeading>Organization</GroupHeading>
        <SettingRow name="Organization name" help="Shown on statements and merchant-facing receipts.">
          <span style={{ minWidth: "16rem" }}>
            <Input
              aria-label="Organization name"
              value={orgName}
              onChange={(event) => setOrgName(event.target.value)}
            />
          </span>
        </SettingRow>
        <SettingRow name="Contact email" help="Where payout and dispute notices are sent.">
          <span style={{ minWidth: "16rem" }}>
            <Input
              type="email"
              aria-label="Contact email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
            />
          </span>
        </SettingRow>
        <SettingRow name="Weekly payout summary" help="An email summary of the week's payouts every Monday.">
          <Switch
            checked={weeklyDigest}
            onChange={(event) => setWeeklyDigest(event.target.checked)}
            label={weeklyDigest ? "On" : "Off"}
          />
        </SettingRow>
      </Card>

      <Alert
        variant="neutral"
        title="Profile fields are prototype-only"
        description="Nothing here is saved to a backend. Refreshing the page returns these fields to their defaults."
      />
    </div>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ tone: "success" | "danger"; text: string } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentPassword || !newPassword) {
      setMessage({ tone: "danger", text: "Enter your current and new password." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ tone: "danger", text: "New password and confirmation don't match." });
      return;
    }
    // Mock only — this prototype has a single demo credential and no
    // backend to persist a changed password to. Nothing is sent anywhere.
    setMessage({ tone: "success", text: "Password updated for this session (mock — nothing is stored)." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-6)" }}>
      <Card>
        <GroupHeading>Change password</GroupHeading>
        <form className="flex flex-col" style={{ gap: "var(--space-4)", paddingTop: "var(--space-2)" }} onSubmit={handlePasswordChange}>
          {message && <Alert variant={message.tone} title={message.text} />}
          <Input
            type="password"
            label="Current password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
          <Input
            type="password"
            label="New password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <Input
            type="password"
            label="Confirm new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <p className="text-text-tertiary" style={{ fontSize: "var(--text-xs)" }}>
            This is a prototype: the field validates locally and never leaves the browser. There
            is no real credential store behind it.
          </p>
          <span>
            <Button type="submit" variant="secondary" size="sm" iconLeft={<Lock size={14} weight="regular" />}>
              Update password
            </Button>
          </span>
        </form>
      </Card>

      <Card
        flat
        className="flex-wrap items-center justify-between"
        style={{ flexDirection: "row", gap: "var(--space-4)" }}
      >
        <span className="flex items-center" style={{ gap: "var(--space-3)" }}>
          <SignOut size={20} weight="fill" className="text-danger" aria-hidden="true" />
          <span className="flex flex-col" style={{ gap: "var(--space-1)" }}>
            <span className="text-text-primary" style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)" }}>
              Log out of this session
            </span>
            <span className="text-text-secondary" style={{ fontSize: "var(--text-sm)" }}>
              Ends the signed-in session and returns to the login screen.
            </span>
          </span>
        </span>
        <Button
          variant="danger"
          size="sm"
          iconLeft={<SignOut size={14} weight="regular" />}
          disabled={loggingOut}
          onClick={() => {
            setLoggingOut(true);
            void logout();
          }}
        >
          {loggingOut ? "Signing out…" : "Log out"}
        </Button>
      </Card>
    </div>
  );
}

export function SettingsSection() {
  const ops = useOps();

  return (
    <SectionFrame
      eyebrow="Console"
      title="Settings"
      description="Operator preferences, profile and account security for this console."
      loading={false}
      failed={false}
      onRetry={ops.refresh}
      onBack={() => ops.goTo("overview")}
      actions={
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<ArrowCounterClockwise size={14} weight="regular" />}
          onClick={ops.resetSettings}
        >
          Reset preferences
        </Button>
      }
    >
      <Tabs
        label="Settings sections"
        items={[
          { value: "general", label: "General", content: <GeneralTab /> },
          { value: "profile", label: "Profile", content: <ProfileTab /> },
          { value: "security", label: "Security", content: <SecurityTab /> },
        ]}
      />
    </SectionFrame>
  );
}
