// utils/BillingSwitcher.js
export class BillingSwitcher {
  constructor(page, pageType) {
    this.page = page;
    this.config = this._getConfig(pageType);
  }

  /** Gets the currently selected billing cycle text */
  async getSelectedBillingCycle(subscriptionOption = null) {
    const { selectedBillingSelector, requiresSubscriptionContext } =
      this.config;

    if (requiresSubscriptionContext) {
      // For STORE and PRICING pages that need subscription context
      const isIndividualUse =
        subscriptionOption && subscriptionOption.includes("For Individual Use");
      const nthIndex = isIndividualUse ? 2 : 1;

      return await this.page
        .locator(selectedBillingSelector)
        .nth(nthIndex)
        .innerText();
    } else {
      // For MARKETPLACE page - simple selector
      return await this.page
        .locator(selectedBillingSelector)
        .first()
        .textContent();
    }
  }

  /** Changes billing cycle to specified option */
  async changeBillingOption(option) {
    const { containerSelector, buttonStrategy } = this.config;

    if (buttonStrategy.type === "role") {
      await this.page
        .locator(containerSelector)
        .getByRole("button", { name: option })
        .click();
    } else if (buttonStrategy.type === "direct") {
      await this.page.getByRole("button", { name: option }).click();
    }
  }

  /** Gets configuration based on page type @private */
  _getConfig(pageType) {
    const configs = {
      STORE: {
        selectedBillingSelector:
          '[data-test="adaptive-switcher__switcher"] [class*="_selected_"]',
        containerSelector: '[data-test="adaptive-switcher__switcher"]',
        buttonStrategy: { type: "role" },
        requiresSubscriptionContext: true,
      },
      MARKETPLACE: {
        selectedBillingSelector:
          '[data-test="switcher"] button[class*="_selected_"]',
        containerSelector: '[data-test="switcher"]',
        buttonStrategy: { type: "role" },
        requiresSubscriptionContext: false,
      },
      PRICING: {
        selectedBillingSelector:
          '[data-test="adaptive-switcher__switcher"] [class*="_selected_"]',
        containerSelector: "", // Uses direct strategy
        buttonStrategy: { type: "direct" },
        requiresSubscriptionContext: true,
      },
    };

    if (!configs[pageType]) {
      throw new Error(
        `Unknown page type: ${pageType}. Supported types: ${Object.keys(
          configs
        ).join(", ")}`
      );
    }

    return configs[pageType];
  }
}
