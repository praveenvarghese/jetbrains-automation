export class IntelliJPage {
  constructor(page) {
    this.page = page;
  }

  /** Verifies IntelliJ IDEA page is loaded by checking main heading */
  async verifyIntelliJPage() {
    return await this.page.locator("h1").getByText("IntelliJ IDEA").isVisible();
  }

  /** Navigates to pricing page via secondary menu link */
  async navigateToPricingPage() {
    await this.page
      .locator('[data-test="menu-second"]')
      .getByRole("link", { name: "Pricing" })
      .click();
  }
}
