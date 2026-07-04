import { PatAuth } from "../../../src/auth/PatAuth";

describe("PatAuth", () => {
    it("resolves the wrapped token", async () => {
        const auth = new PatAuth("my-token");

        await expect(auth.getToken()).resolves.toBe("my-token");
    });

    it("resolves the same token on repeated calls", async () => {
        const auth = new PatAuth("my-token");

        await expect(auth.getToken()).resolves.toBe("my-token");
        await expect(auth.getToken()).resolves.toBe("my-token");
    });
});
