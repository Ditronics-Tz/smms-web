const isNonEmpty = (value) => value !== undefined && value !== null && value !== "";

const branding = {
  APP_NAME: isNonEmpty(process.env.REACT_APP_APP_NAME) ? process.env.REACT_APP_APP_NAME : "Meal Management System",
  APP_SHORT_NAME: isNonEmpty(process.env.REACT_APP_APP_SHORT_NAME) ? process.env.REACT_APP_APP_SHORT_NAME : "MMS",
  SUPPORT_EMAIL: isNonEmpty(process.env.REACT_APP_SUPPORT_EMAIL) ? process.env.REACT_APP_SUPPORT_EMAIL : "",
  SUPPORT_PHONE: isNonEmpty(process.env.REACT_APP_SUPPORT_PHONE) ? process.env.REACT_APP_SUPPORT_PHONE : "",
  LOGO_PATH: isNonEmpty(process.env.REACT_APP_LOGO_PATH) ? process.env.REACT_APP_LOGO_PATH : "",
  FAVICON_PATH: isNonEmpty(process.env.REACT_APP_FAVICON_PATH) ? process.env.REACT_APP_FAVICON_PATH : "",
  PRIMARY_COLOR: isNonEmpty(process.env.REACT_APP_PRIMARY_COLOR) ? process.env.REACT_APP_PRIMARY_COLOR : "#FFA500",
  CURRENCY_SYMBOL: isNonEmpty(process.env.REACT_APP_CURRENCY_SYMBOL) ? process.env.REACT_APP_CURRENCY_SYMBOL : "$",
  CURRENCY_CODE: isNonEmpty(process.env.REACT_APP_CURRENCY_CODE) ? process.env.REACT_APP_CURRENCY_CODE : "USD",
  DEFAULT_LOCALE: isNonEmpty(process.env.REACT_APP_DEFAULT_LOCALE) ? process.env.REACT_APP_DEFAULT_LOCALE : "en",
};

export const checkEnv = () => {
  const problems = [];

  if (!isNonEmpty(branding.SUPPORT_EMAIL)) {
    problems.push("REACT_APP_SUPPORT_EMAIL: support contact email is not configured");
  }
  if (!isNonEmpty(branding.SUPPORT_PHONE)) {
    problems.push("REACT_APP_SUPPORT_PHONE: support contact phone is not configured");
  }

  if (process.env.NODE_ENV === "production") {
    const defaults = [
      ["REACT_APP_APP_NAME", branding.APP_NAME, "Meal Management System"],
      ["REACT_APP_APP_SHORT_NAME", branding.APP_SHORT_NAME, "MMS"],
      ["REACT_APP_LOGO_PATH", branding.LOGO_PATH, ""],
      ["REACT_APP_FAVICON_PATH", branding.FAVICON_PATH, ""],
      ["REACT_APP_PRIMARY_COLOR", branding.PRIMARY_COLOR, "#FFA500"],
      ["REACT_APP_CURRENCY_SYMBOL", branding.CURRENCY_SYMBOL, "$"],
      ["REACT_APP_CURRENCY_CODE", branding.CURRENCY_CODE, "USD"],
      ["REACT_APP_DEFAULT_LOCALE", branding.DEFAULT_LOCALE, "en"],
    ];
    defaults.forEach(([key, value, defaultVal]) => {
      if (value === defaultVal) {
        problems.push(key + ": still on the built-in default (" + JSON.stringify(defaultVal) + ")");
      }
    });
  }

  if (problems.length > 0) {
    console.warn(
      "[branding] Environment configuration warnings:\n  - " + problems.join("\n  - ")
    );
  }
};

export default branding;