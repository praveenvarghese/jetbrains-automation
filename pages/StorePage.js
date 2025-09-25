// pages/IntelliJPage
import { expect } from "@playwright/test";

export class StorePage {
  constructor(page) {
    this.page = page;
  }

  async verifyStorePage() {
    return await this.page
      .locator("h1")
      .getByText("Subscription Options and Pricing")
      .isVisible();
  }

  async getSelectedSubscriptionOptions() {
    return await this.page
      .locator('[data-test="adaptive-switcher"] button[class*="_selected_"]')
      .first()
      .textContent();
  }

  async changeSubscriptionOption(option) {
    await this.page
      .locator(`.wt-container [data-test="switcher"]`)
      .getByRole("button", { name: option })
      .click();
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

  async changeBillingOption(option) {
    await this.page
      .locator(`[data-test="adaptive-switcher__switcher"]`)
      .getByRole("button", { name: option })
      .click();
  }

  async getPriceDetails(productName) {
    const largeCardProducts = [
      "All Products Pack",
      "IntelliJ IDEA Ultimate",
      "dotUltimate",
    ];

    if (largeCardProducts.includes(productName)) {
      // Large product card structure
      const productCard = this.page.locator(
        `[data-test*="product-card"]:has([data-test="product-name"]:text-is("${productName}"))`
      );

      const basePrice = await productCard
        .locator('[data-test="product-price"] .nowrap')
        .first()
        .textContent();
      const vatPrice = await productCard
        .locator('[data-test="product-price-block"] p')
        .first()
        .textContent();
      const period = await productCard
        .locator('[data-test="product-price-title"]')
        .first()
        .textContent();

      return {
        basePrice: basePrice.trim(),
        vatPrice: vatPrice.trim(),
        period: period.trim(),
      };
    } else {
      // Small individual product card structure
      const productCard = this.page.locator(".list-product-card").filter({
        has: this.page.locator("h3", { hasText: productName }),
      });

      const basePrice = await productCard
        .locator('[data-test="product-price"] .nowrap')
        .first()
        .textContent();
      const vatPrice = await productCard
        .locator('p:has-text("incl. VAT")')
        .first()
        .textContent();
      const period = await productCard
        .locator('[data-test="product-price-title"]')
        .first()
        .textContent();

      return {
        basePrice: basePrice.trim(),
        vatPrice: vatPrice.trim(),
        period: period.trim(),
      };
    }
  }

  async getAllProductsDetails() {
    const products = [];

    // Get large product cards
    const largeCards = await this.page
      .locator('[data-test*="product-card"] [data-test="product-name"]')
      .all();
    for (const card of largeCards) {
      const productName = await card.textContent();
      products.push(productName.trim());
    }

    // Get small individual product cards
    const smallCards = await this.page.locator(".list-product-card h3").all();
    for (const card of smallCards) {
      const productName = await card.textContent();
      products.push(productName.trim());
    }

    // Return unique products only
    return [...new Set(products)];
  }
}
