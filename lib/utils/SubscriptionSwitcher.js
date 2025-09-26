// utils/SubscriptionSwitcher.js
export class SubscriptionSwitcher {
  constructor(page, pageType) {
    this.page = page;
    this.config = this._getConfig(pageType);
  }

  /** Gets the currently selected subscription option text */
  async getSelectedOption() {
    const element = this.page
      .locator(this.config.selectedOptionSelector)
      .first();
    return await element.textContent();
  }

  /** Changes subscription option to specified type */
  async changeOption(optionName) {
    const { containerSelector, buttonStrategy } = this.config;

    if (buttonStrategy.type === "role") {
      await this.page
        .locator(containerSelector)
        .getByRole("button", { name: optionName })
        .click();
    } else if (buttonStrategy.type === "filter") {
      await this.page
        .locator(`${containerSelector} button`)
        .filter({ hasText: optionName })
        .click();
    } else if (buttonStrategy.type === "direct") {
      await this.page.getByRole("button", { name: optionName }).click();
    }
  }

  /** Gets configuration based on page type @private */
  _getConfig(pageType) {
    const configs = {
      STORE: {
        selectedOptionSelector:
          '[data-test="adaptive-switcher"] button[class*="_selected_"]',
        containerSelector: '.wt-container [data-test="switcher"]',
        buttonStrategy: { type: "role" },
      },
      MARKETPLACE: {
        selectedOptionSelector: '[data-test="tab tab-selected"]',
        containerSelector: '[data-test="tab-list"]',
        buttonStrategy: { type: "filter" },
      },
      PRICING: {
        selectedOptionSelector:
          '.wt-container section [data-test="adaptive-switcher__switcher"] [data-test="switcher"] [class*="_selected_"]',
        containerSelector: "", // Not needed for direct strategy
        buttonStrategy: { type: "direct" },
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
