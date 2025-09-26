import { SubscriptionSwitcher } from "../utils/SubscriptionSwitcher.js";
import { BillingSwitcher } from "../utils/BillingSwitcher.js";

export class PricingPage {
  constructor(page) {
    this.page = page;
    this.subscriptionSwitcher = new SubscriptionSwitcher(page, "PRICING");
    this.billingSwitcher = new BillingSwitcher(page, "PRICING");
  }

  /** Verifies pricing page is loaded by checking subscription options heading */
  async verifyPricingPage() {
    return await this.page
      .getByText("Subscription Options and Pricing")
      .isVisible();
  }

  /** Gets the currently selected subscription option text */
  async getSelectedSubscriptionOption() {
    return await this.subscriptionSwitcher.getSelectedOption();
  }

  /** Gets the currently selected billing cycle based on subscription type */
  async getSelectedBillingCycle() {
    const subscriptionOption = await this.getSelectedSubscriptionOption();
    return await this.billingSwitcher.getSelectedBillingCycle(
      subscriptionOption
    );
  }

  /** Gets pricing details for IntelliJ IDEA Ultimate including price, period, and VAT */
  async getPricingDetails() {
    const selectedOption = await this.getSelectedSubscriptionOption();
    const isIndividualUse = selectedOption.includes("For Individual Use");

    const card = isIndividualUse
      ? this.page
          .locator('[data-test="product-card-IntelliJ-IDEA-Ultimate"]')
          .nth(1) // Card 1 for Individual Use
      : this.page
          .locator('[data-test="product-card-IntelliJ-IDEA-Ultimate"]')
          .first(); // Card 0 for Organizations

    await card.waitFor({ state: "attached" });

    const price = await card
      .locator('[data-test="product-price"] .nowrap')
      .first()
      .innerText();
    const period = await card
      .locator('[data-test="product-price-title"]')
      .first()
      .innerText();
    const vatPrice = await card
      .locator(
        '[data-test="product-price-block"] .formatted-price-composition p'
      )
      .first()
      .innerText();

    return {
      price: price.trim(),
      vatPrice: vatPrice.trim(),
      period: period.trim(),
    };
  }

  /** Navigates to monthly billing option */
  async navigateToMonthlyBilling() {
    await this.billingSwitcher.changeBillingOption("Monthly billing");
  }

  /** Navigates to individual use subscription tab */
  async navigateToIndividualUseTab() {
    await this.subscriptionSwitcher.changeOption("For Individual Use");
  }
}
