import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("RootLayout font configuration", () => {
  it("does not depend on Google Fonts during build", () => {
    const layoutSource = readFileSync(
      path.resolve(process.cwd(), "src/app/layout.tsx"),
      "utf8",
    );

    expect(layoutSource).not.toContain("next/font/google");
    expect(layoutSource).not.toContain("fonts.gstatic.com");
  });
});
