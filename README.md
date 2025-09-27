# JetBrains Pricing Tests

Test automation for JetBrains website pricing functionality using Playwright.

## What's tested

- Pricing validation for different products (IntelliJ IDEA, CLion, PhpStorm)
- Monthly vs yearly billing cycles
- Individual vs organization subscriptions
- Store page product listings
- Marketplace plugin pricing

## Setup

```bash
npm install
npx playwright install
```

## Run tests

```bash
# All tests
npx playwright test

# With browser UI
npx playwright test --headed

# Specific folder
npx playwright test tests/store/

# Generate report
npx playwright show-report

# Run all the test parallely
npx playwright test --retries=0 --workers=3
```

## Project structure

```
lib/
├── pages/           # Page objects for different sections
├── utils/           # Shared utilities (billing switchers, retry logic)
tests/
├── marketplace/     # Plugin pricing tests
├── product-pages/   # Individual product page tests
├── store/          # Main store pricing tests
```

## Notes

- Used Page Object Model to keep tests maintainable
- Created custom `retryExpect` utility because pricing elements can be slow to update
- Split subscription and billing switchers into separate utilities since they work differently across pages
- Tests cover the main pricing flows but focus on demonstrating good automation practices

The website has some dynamic content that loads asynchronously, so added retry mechanisms to handle timing issues.
