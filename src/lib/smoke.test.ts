import { describe, expect, it } from "vitest";

import { smoke } from "./smoke";

describe("smoke", () => {
  it("returns true", () => {
    expect(smoke()).toBe(true);
  });
});