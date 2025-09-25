// pages/IntelliJPage
import { expect } from "@playwright/test";

export class IntelliJPage {
  constructor(page) {
    this.page = page;
  }

  async verifyIntelliJPage() {
    await expect(
      this.page.locator("h1").getByText("IntelliJ IDEA")
    ).toBeVisible({
      timeout: 10000,
    });
  }

  async navigateToPricingPage() {
    await this.page
      .locator('[data-test="menu-second"]')
      .getByRole("link", { name: "Pricing" })
      .click();
  }
}
