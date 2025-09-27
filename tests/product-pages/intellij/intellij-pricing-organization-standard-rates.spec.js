import { test } from "@playwright/test";
import { retryExpect } from "../../../lib/utils/retryExpect.js";
import { HomePage } from "../../../lib/pages/HomePage.js";
import { IntelliJPage } from "../../../lib/pages/IntelliJPage.js";
import { PricingPage } from "../../../lib/pages/PricingPage.js";

test("Verify IntelliJ organization pricing displays correct rates for yearly and monthly billing cycles", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const intelliJPage = new IntelliJPage(page);
  const pricingPage = new PricingPage(page);

  // Navigate to IntelliJ pricing page
  await homePage.navigateToHome();
  await homePage.navigateToIntelliJPage();
  await retryExpect(() => intelliJPage.verifyIntelliJPage()).toBe(true);
  await intelliJPage.navigateToPricingPage();
  await pricingPage.verifyPricingPage();

  // Verify organization use is selected and yearly billing is default
  await retryExpect(() => pricingPage.getSelectedSubscriptionOption()).toEqual(
    "For Organizations"
  );
  await retryExpect(() => pricingPage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  // Validate yearly organization pricing structure
  await retryExpect(() => pricingPage.getPricingDetails()).toEqual({
    price: global.PRICING_DATA.INTELLIJ_ORGANIZATION_YEARLY_BASE_PRICE,
    period: "per user, per year",
    vatPrice: global.PRICING_DATA.INTELLIJ_ORGANIZATION_YEARLY_VAT_PRICE,
  });

  // Switch to monthly billing and verify pricing updates
  await pricingPage.navigateToMonthlyBilling();

  // Validate monthly organization pricing matches expected rates
  await retryExpect(() => pricingPage.getPricingDetails()).toEqual({
    period: "per user, per month",
    price: global.PRICING_DATA.INTELLIJ_ORGANIZATION_MONTHLY_BASE_PRICE,
    vatPrice: global.PRICING_DATA.INTELLIJ_ORGANIZATION_MONTHLY_VAT_PRICE,
  });
});
