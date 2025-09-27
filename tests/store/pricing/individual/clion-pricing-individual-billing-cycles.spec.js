import { test } from "@playwright/test";
import { retryExpect } from "../../../../lib/utils/retryExpect.js";
import { HomePage } from "../../../../lib/pages/HomePage.js";
import { StorePage } from "../../../../lib/pages/StorePage.js";

test("Verify CLion organization pricing displays correct rates for yearly and monthly billing cycles", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const storePage = new StorePage(page);

  // Navigate to store individual use page and switch to organizations
  await homePage.navigateToHome();
  await homePage.navigateToStoreIndividualUsePage();
  await retryExpect(() => storePage.verifyStorePage()).toBe(true);

  // Verify individual use is initially selected
  await retryExpect(() => storePage.getSelectedSubscriptionOption()).toEqual(
    "For Individual Use"
  );

  // Switch to organization subscription and verify selection
  await storePage.changeSubscriptionOption("For Organizations");
  await retryExpect(() => storePage.getSelectedSubscriptionOption()).toEqual(
    "For Organizations"
  );

  await retryExpect(() => storePage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  // Switch to monthly billing and verify CLion monthly pricing
  await storePage.changeBillingOption("Monthly billing");

  await retryExpect(() => storePage.getSelectedBillingCycle()).toContain(
    "Monthly billing"
  );

  await retryExpect(() => storePage.getPriceDetails("CLion")).toEqual({
    basePrice: global.PRICING_DATA.CLION_ORGANIZATION_MONTHLY_BASE_PRICE,
    vatPrice: global.PRICING_DATA.CLION_ORGANIZATION_MONTHLY_VAT_PRICE,
    period: "per user, per month",
  });

  // Switch back to yearly billing and verify CLion yearly pricing
  await storePage.changeBillingOption("Yearly billing");

  await retryExpect(() => storePage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  await retryExpect(() => storePage.getPriceDetails("CLion")).toEqual({
    basePrice: global.PRICING_DATA.CLION_ORGANIZATION_YEARLY_BASE_PRICE,
    vatPrice: global.PRICING_DATA.CLION_ORGANIZATION_YEARLY_VAT_PRICE,
    period: "per user, per year",
  });
});
