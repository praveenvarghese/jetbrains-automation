import { test } from "@playwright/test";
import { retryExpect } from "../../../lib/utils/retryExpect.js";
import { HomePage } from "../../../lib/pages/HomePage.js";
import { IntelliJPage } from "../../../lib/pages/IntelliJPage.js";
import { PricingPage } from "../../../lib/pages/PricingPage.js";

test("Verify IntelliJ individual pricing displays correct rates for yearly and monthly billing cycles", async ({
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
  await pricingPage.navigateToIndividualUseTab();

  // Verify individual use is selected and yearly billing is default
  await retryExpect(() => pricingPage.getSelectedSubscriptionOption()).toEqual(
    "For Individual Use"
  );
  await retryExpect(() => pricingPage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  // Validate first-year pricing structure
  await retryExpect(() => pricingPage.getPricingDetails()).toEqual({
    period: "first year",
    price: global.PRICING_DATA.INTELLIJ_INDIVIDUAL_YEARLY_BASE_PRICE,
    vatPrice: global.PRICING_DATA.INTELLIJ_INDIVIDUAL_YEARLY_VAT_PRICE,
  });

  // Switch to monthly billing and verify pricing updates
  await pricingPage.navigateToMonthlyBilling();

  // Validate monthly pricing matches expected rates
  await retryExpect(() => pricingPage.getPricingDetails()).toEqual({
    period: "per month",
    price: global.PRICING_DATA.INTELLIJ_INDIVIDUAL_MONTHLY_BASE_PRICE,
    vatPrice: global.PRICING_DATA.INTELLIJ_INDIVIDUAL_MONTHLY_VAT_PRICE,
  });
});
