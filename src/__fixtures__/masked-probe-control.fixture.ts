/**
 * Sample data fixture for the Masked Probe Control feature.
 *
 * The fixture seeds the store during bootstrap (or tests) so the app shell
 * always shows a real product workflow with realistic records — not an
 * empty placeholder. Keep the records immutable; consumers must clone before
 * mutating.
 */

import type { MaskedProbeRecord } from "../features/masked-probe-control/masked-probe-control.types";

export const maskedProbeFixture: readonly MaskedProbeRecord[] = Object.freeze([
  Object.freeze({
    id: "probe-aurora",
    label: "Aurora Probe",
    endpoint: "https://probe.aurora.internal/v1/masked",
    status: "online",
    latencyMs: 42,
    maskedToken: "mk-aurora-****-7c4f",
    updatedAt: "2026-07-04T08:14:00.000Z",
  }),
  Object.freeze({
    id: "probe-borealis",
    label: "Borealis Probe",
    endpoint: "https://probe.borealis.internal/v1/masked",
    status: "degraded",
    latencyMs: 184,
    maskedToken: "mk-borealis-****-91aa",
    updatedAt: "2026-07-04T07:58:00.000Z",
  }),
  Object.freeze({
    id: "probe-corona",
    label: "Corona Probe",
    endpoint: "https://probe.corona.internal/v1/masked",
    status: "offline",
    latencyMs: 0,
    maskedToken: "mk-corona-****-dead",
    updatedAt: "2026-07-04T07:42:00.000Z",
  }),
]);

export const FIXTURE_RECORD_IDS = maskedProbeFixture.map((record) => record.id);

export const getFixtureById = (id: string): MaskedProbeRecord | null => {
  return maskedProbeFixture.find((record) => record.id === id) ?? null;
};