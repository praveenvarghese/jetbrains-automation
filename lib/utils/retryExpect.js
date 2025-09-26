import { expect as playwrightExpect } from "@playwright/test";

export const retryExpect = (
  actualValueGetter, // function to get the value
  maxRetries = 3,
  delay = 1500
) =>
  new Proxy(playwrightExpect(null), {
    get(target, methodName) {
      return async (...args) => {
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const actual = await Promise.resolve(actualValueGetter()); // call the function to get the value
            console.log(`Retry ${attempt}: Resolved value:`, actual);

            // dynamically invoke the Playwright assertion method
            await playwrightExpect(actual)[methodName](...args);

            console.log(`Assertion passed on retry ${attempt}`);
            return; // exit on success
          } catch (error) {
            lastError = error;
            console.warn(
              `Retry ${attempt}/${maxRetries} failed for ${methodName}. Error: ${error.message}`
            );
            if (attempt < maxRetries) {
              await new Promise((res) => setTimeout(res, delay)); // wait before retrying
            }
          }
        }
        throw lastError; // throw the last error if retries are exhausted
      };
    },
  });
