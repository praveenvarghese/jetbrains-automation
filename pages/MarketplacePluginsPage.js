// pages/MarketplacePluginsPage.js
export class MarketplacePluginsPage {
  constructor(page) {
    this.page = page;
  }

  /** Verifies marketplace plugins page is loaded by checking main heading */
  async verifyMarketplacePluginsPage() {
    return await this.page
      .locator("h1")
      .getByText("Marketplace Plugins")
      .isVisible();
  }

  /** Gets the currently selected subscription option text */
  async getSelectedSubscriptionOption() {
    return await this.page
      .locator('[data-test="tab tab-selected"]')
      .textContent();
  }

  /** Changes subscription option to specified type */
  async changeSubscriptionOption(option) {
    await this.page
      .locator('[data-test="tab-list"] button')
      .filter({ hasText: option })
      .click();
  }

  /** Gets the currently selected billing cycle text */
  async getSelectedBillingCycle() {
    return await this.page
      .locator('[data-test="switcher"] button[class*="_selected_"]')
      .first()
      .textContent();
  }

  /** Changes billing cycle to specified option */
  async changeBillingOption(option) {
    await this.page
      .locator('[data-test="switcher"]')
      .getByRole("button", { name: option })
      .click();
  }

  /** Gets pricing details for specified plugin including base price, VAT, and period */
  async getPluginDetails(pluginName) {
    // Find the plugin card that's currently visible (not in hidden content switcher block)
    const pluginCard = this.page
      .locator(
        '[data-test="card"]:not(.wt-css-content-switcher__block_hidden *)'
      )
      .filter({
        has: this.page.locator("h3", { hasText: pluginName }),
      })
      .first();

    const basePrice = await pluginCard
      .locator('[data-test="product-price"] .nowrap')
      .textContent();
    const vatPrice = await pluginCard
      .locator('p:has-text("incl. VAT")')
      .textContent();
    const period = await pluginCard
      .locator('[data-test="product-price-title"]')
      .textContent();

    return {
      basePrice: basePrice.trim(),
      vatPrice: vatPrice.trim(),
      period: period.trim(),
    };
  }
}
