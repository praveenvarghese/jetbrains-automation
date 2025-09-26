import { test } from "@playwright/test";
import { retryExpect } from "../../../../lib/utils/retryExpect.js";
import { HomePage } from "../../../../lib/pages/HomePage.js";
import { StorePage } from "../../../../lib/pages/StorePage.js";

test("Verify PhpStorm organization pricing displays correct rates for yearly and monthly billing cycles", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const storePage = new StorePage(page);

  // Navigate to store organization page
  await homePage.navigateToHome();
  await homePage.navigateToStoreTeamsAndOrganizationsPage();
  await retryExpect(() => storePage.verifyStorePage()).toBe(true);

  // Verify organization use is selected and yearly billing is default
  await retryExpect(() => storePage.getSelectedSubscriptionOption()).toEqual(
    "For Organizations"
  );

  await retryExpect(() => storePage.getSelectedBillingCycle()).toContain(
    "Yearly billing"
  );

  // Validate yearly organization pricing for PhpStorm
  await retryExpect(() => storePage.getPriceDetails("PhpStorm")).toEqual({
    basePrice: "€249.00",
    vatPrice: "incl. VAT €306.27",
    period: "per user, per year",
  });

  // Switch to monthly billing and verify pricing updates
  await storePage.changeBillingOption("Monthly billing");

  await retryExpect(() => storePage.getSelectedBillingCycle()).toContain(
    "Monthly billing"
  );

  // Validate monthly organization pricing for PhpStorm
  await retryExpect(() => storePage.getPriceDetails("PhpStorm")).toEqual({
    basePrice: "€24.90",
    vatPrice: "incl. VAT €30.63",
    period: "per user, per month",
  });
});
