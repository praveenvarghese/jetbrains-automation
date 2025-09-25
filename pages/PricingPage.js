// pages/PricingPage
import { expect } from "@playwright/test";
export class PricingPage {
  constructor(page) {
    this.page = page;
  }

  async verifyPricingPage() {
    await expect(
      this.page.getByText("Subscription Options and Pricing")
    ).toBeVisible();
  }

  async getSelectedSubscriptionOptions() {
    return await this.page
      .locator(
        '.wt-container section [data-test="adaptive-switcher__switcher"] [data-test="switcher"] [class*="_selected_"]'
      )
      .innerText();
  }

  async getSelectedBillingCycle() {
    const selectedOption = await this.getSelectedSubscriptionOptions();
    const isIndividualUse = selectedOption.includes("For Individual Use");

    const billingElement = isIndividualUse
      ? this.page
          .locator(
            '[data-test="adaptive-switcher__switcher"] [class*="_selected_"]'
          )
          .nth(2) // Index 2 for Individual Use
      : this.page
          .locator(
            '[data-test="adaptive-switcher__switcher"] [class*="_selected_"]'
          )
          .nth(1); // Index 1 for Organizations

    return await billingElement.innerText();
  }

  async getPricingDetails() {
    const selectedOption = await this.getSelectedSubscriptionOptions();
    const isIndividualUse = selectedOption.includes("For Individual Use");

    const card = isIndividualUse
      ? this.page
          .locator('[data-test="product-card-IntelliJ-IDEA-Ultimate"]')
          .nth(1) // Card 11
      : this.page
          .locator('[data-test="product-card-IntelliJ-IDEA-Ultimate"]')
          .first(); // Card 0

    await card.waitFor({ state: "attached" });

    return {
      price: await card
        .locator('[data-test="product-price"] .nowrap')
        .first()
        .innerText(),
      period: await card
        .locator('[data-test="product-price-title"]')
        .first()
        .innerText(),
      vatPrice: await card
        .locator(
          '[data-test="product-price-block"] .formatted-price-composition p'
        )
        .first()
        .innerText(),
    };
  }

  async navigateToMonthlyBilling() {
    await this.page.getByRole("button", { name: "Monthly billing" }).click();
  }

  async navigateToIndividualUseTab() {
    await this.page.getByRole("button", { name: "For Individual Use" }).click();
  }
}
