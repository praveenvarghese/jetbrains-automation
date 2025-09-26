import { test } from "@playwright/test";
import { retryExpect } from "../../../lib/utils/retryExpect.js";
import { HomePage } from "../../../lib/pages/HomePage.js";
import { MarketplacePluginsPage } from "../../../lib/pages/MarketplacePluginsPage.js";

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
    basePrice: process.env.ACTIONATE_ORGANIZATION_YEARLY_BASE_PRICE,
    vatPrice: process.env.ACTIONATE_ORGANIZATION_YEARLY_VAT_PRICE,
    period: "per user, per year",
  });

  // Switch to monthly billing and verify pricing updates
  await marketplacePluginsPage.changeBillingOption("Monthly billing");
  await retryExpect(() =>
    marketplacePluginsPage.getSelectedBillingCycle()
  ).toContain("Monthly billing");

  // Validate monthly organization pricing for Actionate plugin
  await retryExpect(() =>
    marketplacePluginsPage.getPluginDetails("Actionate")
  ).toEqual({
    basePrice: process.env.ACTIONATE_ORGANIZATION_MONTHLY_BASE_PRICE,
    vatPrice: process.env.ACTIONATE_ORGANIZATION_MONTHLY_VAT_PRICE,
    period: "per user, per month",
  });
});
