import { test } from "@playwright/test";
import { retryExpect } from "../../../../utils/retryExpect.js";
import { HomePage } from "../../../../pages/HomePage.js";
import { StorePage } from "../../../../pages/StorePage.js";

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
  await retryExpect(() => storePage.getSelectedSubscriptionOptions()).toEqual(
    "For Individual Use"
  );

  // Switch to organization subscription and verify selection
  await storePage.changeSubscriptionOption("For Organizations");
  await retryExpect(() => storePage.getSelectedSubscriptionOptions()).toEqual(
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
    basePrice: "€22.90",
    vatPrice: "incl. VAT €28.17",
    period: "per user, per month",
  });

  // Switch back to yearly billing and verify CLion yearly pricing
  await storePage.changeBillingOption("Yearly billing");

  await retryExpect(() => storePage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  await retryExpect(() => storePage.getPriceDetails("CLion")).toEqual({
    basePrice: "€229.00",
    vatPrice: "incl. VAT €281.67",
    period: "per user, per year",
  });
});
