# Plan: Neutralize Tanzania-specific locale strings + auto-discover locales

Ticket: Audit `src/i18n/locales/en.json` & `sw.json` for Tanzania-specific/regional
wording; confirm locale list is easy to extend (adding a 3rd language file must
NOT require touching component code).

## Findings

1. **Tanzania-specific values** (in BOTH en.json and sw.json):
   - `support.phoneNumber` = `+255 785 907 500` (+255 = Tanzania)
   - `support.emailAddress` = `support@sava.co.tz` (.co.tz = Tanzania TLD)
   - `profile.nida` / `profile.nidaStatus` = "NIDA"/"Nida Status" (NIDA = Tanzania national ID authority)
   - `intro.owner` = "Ditronics" (company name)
   - `card.control_number` + student/parent/staff `controlNumber` = "Control Number" (Tanzanian govt-payment GePG terminology)
   - No hardcoded currency symbol present (labels "Amount"/"Price"/"Balance" already generic) -> nothing to do there.

2. **Extensibility FAILS**: `src/i18n/i18n.js` hardcodes
   `const resources = { en: {...}, sw: {...} }` with static imports. Adding a 3rd
   language file currently requires editing this component file -> violates the requirement.

## User decisions
- Neutralize ALL flagged content (both locale files).
- Use webpack `require.context` auto-discovery in i18n.js.

## Changes

### A. `src/i18n/locales/en.json`
| Key | Current | New |
|-----|---------|-----|
| intro.owner | Ditronics | Provider |
| support.phoneNumber | +255 785 907 500 | +1 (555) 000-0000 |
| support.emailAddress | support@sava.co.tz | support@example.com |
| profile.nida | NIDA Number | National ID Number |
| profile.nidaStatus | Nida Status | National ID Status |
| * controlNumber (student/parent/staff) | Control Number | Payment Reference |
| card.control_number | Control Number | Payment Reference |

(Only UI *labels* change. The SQL/API field `control_number` referenced in TSX
via `rfid_card.control_number` is NOT renamed.)

### B. `src/i18n/locales/sw.json` (same neutralization, Swahili)
| Key | Current | New |
|-----|---------|-----|
| intro.owner | Ditronics | Mtoa Huduma |
| support.phoneNumber | +255 785 907 500 | +1 (555) 000-0000 |
| support.emailAddress | support@sava.co.tz | support@example.com |
| profile.nida | Namba ya NIDA | Nambari ya Kitambulisho cha Taifa |
| profile.nidaStatus | Hali ya NIDA | Hali ya Kitambulisho cha Taifa |
| * controlNumber (student/parent/staff) | Nambari ya Udhibiti | Rejeleo la Malipo |
| card.control_number | Namba ya malipo | Rejeleo la Malipo |

### C. `src/i18n/i18n.js` -> require.context auto-discovery
Replace static imports + hardcoded resources with:
```js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const req = require.context("./locales", false, /\.json$/);
const resources = {};
req.keys().forEach((key) => {
  const code = key.replace("./", "").replace(/\.json$/, "");
  resources[code] = { translation: req(key) };
});

const lang = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: lang,
    fallbackLng: "en",
    debug: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "cookie", "htmlTag", "path", "subdomain"],
      caches: ["localStorage", "cookie"],
    },
  });

export default i18n;
```
Result: dropping `src/i18n/locales/fr.json` auto-registers `fr` with ZERO
component edits -> requirement satisfied. (webpack 5 / CRA 5.0.1 supports
require.context.)

## Verification
1. `node -e "JSON.parse(...)"` on both edited locale files -> valid.
2. `tsc --noEmit` -> exit 0 (no .ts regressions).
3. `npm run build` -> attempt; expected to be blocked by the pre-existing
   Node-24 / ajv (`Cannot find module 'ajv/dist/compile/codegen'`) environment
   issue, unrelated to these edits. Fall back to `npm start` to confirm the
   dev bundle compiles and require.context registers both languages.
4. Confirm `fr.json` drop-in would auto-register (no i18n.js edit).

## Done checklist
- [ ] Verify greps/audit summary noted (see Findings)
- [ ] Both locale files neutralized + valid JSON
- [ ] i18n.js auto-discovers locales
- [ ] tsc --noEmit passes; build status reported
- [ ] Short summary listing every file changed + extensibility confirmed
