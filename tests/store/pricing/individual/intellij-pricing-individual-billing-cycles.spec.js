import { test } from "@playwright/test";
import { retryExpect } from "../../../../utils/retryExpect.js";
import { HomePage } from "../../../../pages/HomePage.js";
import { StorePage } from "../../../../pages/StorePage.js";

test("Verify IntelliJ IDEA Ultimate organization pricing displays correct rates for yearly and monthly billing cycles", async ({
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

  // Switch to monthly billing and verify IntelliJ monthly pricing
  await storePage.changeBillingOption("Monthly billing");

  await retryExpected(() => storePage.getSelectedBillingCycle()).toContain(
    "Monthly billing"
  );

  await retryExpect(() =>
    storePage.getPriceDetails("IntelliJ IDEA Ultimate")
  ).toEqual({
    basePrice: "€59.90",
    vatPrice: "incl. VAT €73.68",
    period: "per user, per month",
  });

  // Switch back to yearly billing and verify IntelliJ yearly pricing
  await storePage.changeBillingOption("Yearly billing");

  await retryExpect(() => storePage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  await retryExpected(() =>
    storePage.getPriceDetails("IntelliJ IDEA Ultimate")
  ).toEqual({
    basePrice: "€599.00",
    vatPrice: "incl. VAT €736.77",
    period: "per user, per year",
  });
});
