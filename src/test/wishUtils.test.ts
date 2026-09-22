import { describe, it, expect } from "vitest";
import {
  sanitizeName,
  sanitizeWish,
  CARD_THEMES,
  POSTER_SIZES,
  PATRIOTIC_QUOTES,
  getOrdinal,
  getIndependenceDayInfo,
} from "../lib/wishUtils";

describe("wishUtils", () => {
  it("sanitizes names by stripping invalid or dangerous characters", () => {
    expect(sanitizeName("  Rahul <script>alert(1)</script> Kumar ")).toBe("Rahul Kumar");
    expect(sanitizeName("A".repeat(50))).toHaveLength(40);
  });

  it("sanitizes wish message content safely", () => {
    const raw = "<script>stealCookies()</script>Happy Independence Day!";
    expect(sanitizeWish(raw)).toBe("Happy Independence Day!");
  });

  it("defines all core themes and poster dimensions correctly", () => {
    expect(CARD_THEMES.royal).toBeDefined();
    expect(CARD_THEMES.midnight).toBeDefined();
    expect(CARD_THEMES.parchment).toBeDefined();
    expect(CARD_THEMES.tricolor).toBeDefined();

    expect(POSTER_SIZES.phone).toBeDefined();
    expect(POSTER_SIZES.square).toBeDefined();
    expect(POSTER_SIZES.a4).toBeDefined();
    expect(PATRIOTIC_QUOTES.length).toBeGreaterThan(0);
  });

  it("calculates accurate ordinals for any year and number", () => {
    expect(getOrdinal(1)).toBe("1st");
    expect(getOrdinal(2)).toBe("2nd");
    expect(getOrdinal(3)).toBe("3rd");
    expect(getOrdinal(4)).toBe("4th");
    expect(getOrdinal(11)).toBe("11th");
    expect(getOrdinal(12)).toBe("12th");
    expect(getOrdinal(13)).toBe("13th");
    expect(getOrdinal(21)).toBe("21st");
    expect(getOrdinal(79)).toBe("79th");
    expect(getOrdinal(80)).toBe("80th");
    expect(getOrdinal(81)).toBe("81st");
    expect(getOrdinal(82)).toBe("82nd");
    expect(getOrdinal(83)).toBe("83rd");
    expect(getOrdinal(100)).toBe("100th");
  });

  it("automatically calculates future years and edition numbers accurately", () => {
    // 2026 -> 79th
    const info2026 = getIndependenceDayInfo(new Date("2026-05-01T00:00:00Z").getTime(), 2026);
    expect(info2026.targetYear).toBe(2026);
    expect(info2026.edition).toBe(79);
    expect(info2026.editionString).toBe("79th");

    // 2027 -> 80th
    const info2027 = getIndependenceDayInfo(new Date("2027-01-01T00:00:00Z").getTime(), 2027);
    expect(info2027.targetYear).toBe(2027);
    expect(info2027.edition).toBe(80);
    expect(info2027.editionString).toBe("80th");

    // 2028 -> 81st
    const info2028 = getIndependenceDayInfo(new Date("2028-01-01T00:00:00Z").getTime(), 2028);
    expect(info2028.targetYear).toBe(2028);
    expect(info2028.edition).toBe(81);
    expect(info2028.editionString).toBe("81st");

    // 2047 -> 100th Centenary
    const info2047 = getIndependenceDayInfo(new Date("2047-01-01T00:00:00Z").getTime(), 2047);
    expect(info2047.targetYear).toBe(2047);
    expect(info2047.edition).toBe(100);
    expect(info2047.editionString).toBe("100th");
    expect(info2047.specialMilestone).toContain("Centenary");
  });

  it("handles automatic year rollover after August 15 has concluded", () => {
    // Aug 17, 2026 should automatically target 2027
    const aug17_2026 = new Date("2026-08-17T12:00:00+05:30").getTime();
    const infoNext = getIndependenceDayInfo(aug17_2026);
    expect(infoNext.targetYear).toBe(2027);
    expect(infoNext.edition).toBe(80);
    expect(infoNext.editionString).toBe("80th");

    // Aug 15, 2026 should mark isToday = true
    const aug15_2026 = new Date("2026-08-15T12:00:00+05:30").getTime();
    const infoToday = getIndependenceDayInfo(aug15_2026);
    expect(infoToday.targetYear).toBe(2026);
    expect(infoToday.isToday).toBe(true);
  });
});
