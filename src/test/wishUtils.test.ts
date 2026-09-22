import { describe, it, expect } from "vitest";
import {
  sanitizeName,
  sanitizeWish,
  CARD_THEMES,
  POSTER_SIZES,
  PATRIOTIC_QUOTES,
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
});
