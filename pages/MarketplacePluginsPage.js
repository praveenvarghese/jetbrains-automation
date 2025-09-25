export class MarketplacePluginsPage {
  constructor(page) {
    this.page = page;
  }

  async verifyMarketplacePluginsPage() {
    return await this.page
      .locator("h1")
      .getByText("Marketplace Plugins")
      .isVisible();
  }

  async getSelectedSubscriptionOption() {
    return await this.page
      .locator('[data-test="tab tab-selected"]')
      .textContent();
  }

  async changeSubscriptionOption(option) {
    await this.page
      .locator('[data-test="tab-list"] button')
      .filter({ hasText: option })
      .click();
  }

  async getSelectedBillingCycle() {
    return await this.page
      .locator('[data-test="switcher"] button[class*="_selected_"]')
      .first()
      .textContent();
  }
  async changeBillingOption(option) {
    await this.page
      .locator('[data-test="switcher"]')
      .getByRole("button", { name: option })
      .click();
  }

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
