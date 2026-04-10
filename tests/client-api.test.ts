import { describe, expect, it } from "vitest";

import * as clientApi from "../src/client-api.ts";

describe("client API surface", () => {
  it("keeps PtyServer out of the compile-safe /client entrypoint", () => {
    expect("PtyServer" in clientApi).toBe(false);
  });
});
