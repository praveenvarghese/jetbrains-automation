import { SubscriptionSwitcher } from "../utils/SubscriptionSwitcher.js";
import { BillingSwitcher } from "../utils/BillingSwitcher.js";

export class StorePage {
  constructor(page) {
    this.page = page;
    this.subscriptionSwitcher = new SubscriptionSwitcher(page, "STORE");
    this.billingSwitcher = new BillingSwitcher(page, "STORE");
  }

  /** Verifies store page is loaded by checking for pricing title */
  async verifyStorePage() {
    return await this.page
      .locator("h1")
      .getByText("Subscription Options and Pricing")
      .isVisible();
  }

  /** Gets the currently selected subscription option text */
  async getSelectedSubscriptionOption() {
    return await this.subscriptionSwitcher.getSelectedOption();
  }

  /** Changes subscription option to specified type */
  async changeSubscriptionOption(option) {
    await this.subscriptionSwitcher.changeOption(option);
  }

  /** Gets the currently selected billing cycle text */
  async getSelectedBillingCycle() {
    const subscriptionOption = await this.getSelectedSubscriptionOption();
    return await this.billingSwitcher.getSelectedBillingCycle(
      subscriptionOption
    );
  }

  /** Changes billing cycle to specified option */
  async changeBillingOption(option) {
    await this.billingSwitcher.changeBillingOption(option);
  }

  /** Gets pricing details for specified product including base price, VAT, and period */
  async getPriceDetails(productName) {
    const largeCardProducts = [
      "All Products Pack",
      "IntelliJ IDEA Ultimate",
      "dotUltimate",
    ];

    if (largeCardProducts.includes(productName)) {
      return await this._getLargeCardPriceDetails(productName);
    } else {
      return await this._getSmallCardPriceDetails(productName);
    }
  }

  /** Gets list of all available products on the store page */
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

  /** Extracts pricing details from large product card structure @private */
  async _getLargeCardPriceDetails(productName) {
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
  }

  /** Extracts pricing details from small product card structure @private */
  async _getSmallCardPriceDetails(productName) {
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
