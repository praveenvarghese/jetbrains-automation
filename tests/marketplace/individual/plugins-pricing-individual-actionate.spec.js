import { test } from "@playwright/test";
import { retryExpect } from "../../../utils/retryExpect.js";
import { HomePage } from "../../../pages/HomePage.js";
import { MarketplacePluginsPage } from "../../../pages/MarketplacePluginsPage.js";

test("Verify Actionate plugin pricing for individual users displays correct rates for yearly and monthly billing", async ({
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

  // Switch to individual use and verify selection
  await marketplacePluginsPage.changeSubscriptionOption("For Individual Use");
  await retryExpect(() =>
    marketplacePluginsPage.getSelectedSubscriptionOption()
  ).toContain("For Individual Use");

  // Validate yearly individual pricing for Actionate plugin
  await retryExpect(() =>
    marketplacePluginsPage.getPluginDetails("Actionate")
  ).toEqual({
    basePrice: "€10.00",
    vatPrice: "incl. VAT €12.30",
    period: "per year",
  });

  // Switch to monthly billing and verify pricing updates
  await marketplacePluginsPage.changeBillingOption("Monthly billing");
  await retryExpect(() =>
    marketplacePluginsPage.getSelectedBillingCycle()
  ).toContain("Monthly billing");

  // Validate monthly individual pricing for Actionate plugin
  await retryExpect(() =>
    marketplacePluginsPage.getPluginDetails("Actionate")
  ).toEqual({
    basePrice: "€1.00",
    vatPrice: "incl. VAT €1.23",
    period: "per month",
  });
});
