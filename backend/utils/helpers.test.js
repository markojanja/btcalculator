import { test } from "node:test";
import assert from "node:assert/strict";
import { getShiftDayRange } from "./helpers.js";

const range = (now) => {
  const { startOfDay, endOfDay } = getShiftDayRange(new Date(now));
  return [startOfDay.toISOString(), endOfDay.toISOString()];
};

test("daytime belongs to the shift that started at 23:00 the previous evening (summer)", () => {
  // 14:00 Belgrade (UTC+2)
  assert.deepEqual(range("2026-10-17T12:00:00Z"), [
    "2026-10-16T21:00:00.000Z",
    "2026-10-17T21:00:00.000Z",
  ]);
});

test("after 23:00 Belgrade a new shift has started", () => {
  // 23:30 Belgrade
  assert.deepEqual(range("2026-10-17T21:30:00Z"), [
    "2026-10-17T21:00:00.000Z",
    "2026-10-18T21:00:00.000Z",
  ]);
});

test("23:00 exactly is the first instant of the new shift, with no gap", () => {
  assert.deepEqual(range("2026-10-17T21:00:00Z"), [
    "2026-10-17T21:00:00.000Z",
    "2026-10-18T21:00:00.000Z",
  ]);
  // One millisecond earlier still belongs to the previous shift, which ends
  // exactly where the next one starts.
  assert.deepEqual(range("2026-10-17T20:59:59.999Z"), [
    "2026-10-16T21:00:00.000Z",
    "2026-10-17T21:00:00.000Z",
  ]);
});

test("winter time uses UTC+1", () => {
  assert.deepEqual(range("2026-01-15T12:00:00Z"), [
    "2026-01-14T22:00:00.000Z",
    "2026-01-15T22:00:00.000Z",
  ]);
});

test("the shift spanning the end of summer time is 25 hours long", () => {
  // Clocks go back on 2026-10-25 at 03:00 Belgrade.
  assert.deepEqual(range("2026-10-25T12:00:00Z"), [
    "2026-10-24T21:00:00.000Z",
    "2026-10-25T22:00:00.000Z",
  ]);
});

test("the shift spanning the start of summer time is 23 hours long", () => {
  // Clocks go forward on 2026-03-29 at 02:00 Belgrade.
  assert.deepEqual(range("2026-03-29T12:00:00Z"), [
    "2026-03-28T22:00:00.000Z",
    "2026-03-29T21:00:00.000Z",
  ]);
});
