import { test } from "@playwright/test";
test("Listar botones", async ({ page }) => {
  await page.goto("http://localhost:3001");
  await page.evaluate(() => {
    const demoUser = { email: "demo@flowdistributor.com", role: "admin", name: "Usuario Demo", uid: "demo-test-uid" };
    localStorage.setItem("flow_current_user", JSON.stringify(demoUser));
  });
  await page.goto("http://localhost:3001/flow");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);
  const buttons = await page.locator("button").allTextContents();
  console.log("TODOS LOS BOTONES:", JSON.stringify(buttons, null, 2));
});
