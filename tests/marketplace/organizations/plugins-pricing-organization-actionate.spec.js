import { test } from "@playwright/test";
import { retryExpect } from "../../../utils/retryExpect.js";
import { HomePage } from "../../../pages/HomePage.js";
import { MarketplacePluginsPage } from "../../../pages/MarketplacePluginsPage.js";

test("Verify Actionate plugin pricing for organizations displays correct rates for yearly and monthly billing", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const marketplacePluginsPage = new MarketplacePluginsPage(page);

  // Navigate to marketplace plugins page
  await homePage.navigateToHome();
  await homePage.navigateToMarketplacePluginsPage();
  await retryExpect(() =>
    marketplacePluginsPage.verifyMarketplacePluginsPage()
  ).toBe(true);

  // Verify organization use is selected by default and yearly billing is default
  await retryExpect(() =>
    marketplacePluginsPage.getSelectedSubscriptionOption()
  ).toContain("For Organizations");

  await retryExpect(() =>
    marketplacePluginsPage.getSelectedBillingCycle()
  ).toContain("Yearly billing");

  // Validate yearly organization pricing for Actionate plugin
  await retryExpect(() =>
    marketplacePluginsPage.getPluginDetails("Actionate")
  ).toEqual({
    basePrice: "€20.00",
    vatPrice: "incl. VAT €24.60",
    period: "per user, per year",
  });

  // Switch to monthly billing and verify pricing updates
  await marketplacePluginsPage.changeBillingOption("Monthly billing");
  await retryExpected(() =>
    marketplacePluginsPage.getSelectedBillingCycle()
  ).toContain("Monthly billing");

  // Validate monthly organization pricing for Actionate plugin
  await retryExpected(() =>
    marketplacePluginsPage.getPluginDetails("Actionate")
  ).toEqual({
    basePrice: "€2.00",
    vatPrice: "incl. VAT €2.46",
    period: "per user, per month",
  });
});
