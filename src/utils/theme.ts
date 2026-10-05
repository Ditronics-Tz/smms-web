
import { extendTheme } from '@mui/joy/styles';
import branding from '../config/branding';


declare module '@mui/joy/styles' {
  interface PaletteBackgroundOverrides {
    appcolor: true;
    secondaryColor: true
  }
}

// Dark mode used to reuse the light accent ramp with the steps reversed, which
// made `primary.plainColor` resolve to a dark brown (#bb5502) on a dark
// background - body and label text became hard to read. It also left
// `background.secondaryColor` at a near-white value, so any surface using it
// flashed bright in dark mode. The dark scheme below keeps the same orange
// identity but states the semantic colours explicitly and inverts the ramp the
// other way, so lighter shades stay light.
//
// "Too much contrast" was the second half of the problem, and it was not just the
// accent: nothing below overrode Joy's stock dark palette, so every page used
// #000 backgrounds against #F0F4F8 text (about 19:1, and genuinely harsh to look
// at for a whole shift). The scheme therefore also raises the surfaces off pure
// black and drops body text to a soft off-white, which lands around 12:1 - still
// far past WCAG AAA (7:1) for body text, but calmer to read.
const darkAccentSoft = '#e8b968';

// Surfaces: a blue-tinted charcoal rather than #000, so cards and sheets can be
// told apart from the page behind them without relying on a hard white edge.
const darkSurface = '#1A1F25';
const darkBody = '#14181D';

const theme = extendTheme({
  "colorSchemes": {
    "light": {
      "palette": {
        "primary": {
          // 50: "#F5F5F9",
          '100': '#fff5c5',
          '200': '#ffeb85',
          '300': '#ffda46',
          '400': '#ffc71b',
          '500': branding.PRIMARY_COLOR,
          '600': '#e27c00',
          '700': '#bb5502',
          '800': '#984208',
          '900': '#7c360b',
        },
        "background": {
          "appcolor": branding.PRIMARY_COLOR,
          "secondaryColor": "#F8F8FF",
        }
      }
    },
    "dark": {
      "palette": {
        "primary": {
          '100': '#7c360b',
          '200': '#984208',
          '300': '#bb5502',
          '400': '#e27c00',
          '500': branding.PRIMARY_COLOR,
          '600': '#ffc71b',
          '700': '#ffda46',
          '800': '#ffeb85',
          '900': '#fff5c5',
          // Named so the accent is legible on dark surfaces: solid surfaces use a
          // dark label, while plain/outlined text uses a light amber.
          "plainColor": darkAccentSoft,
          "plainHoverBg": "rgba(232, 185, 104, 0.12)",
          "plainActiveBg": "rgba(232, 185, 104, 0.20)",
          // Joy derived the dark outlinedColor from the ramp and landed on the
          // dark brown #984208 (about 2.9:1 on the old #000). Stated explicitly
          // so outlined buttons and links stay readable.
          "outlinedColor": darkAccentSoft,
          "outlinedHoverBg": "rgba(232, 185, 104, 0.10)",
          "solidBg": branding.PRIMARY_COLOR,
          "solidColor": "#1a1200",
          "solidHoverBg": "#ffc71b",
          "softColor": darkAccentSoft,
          "softBg": "rgba(232, 185, 104, 0.14)",
          "softHoverBg": "rgba(232, 185, 104, 0.22)",
        },
        "background": {
          // Muted accent: the full-saturation orange is used for the active
          // sidebar row, the header border and the empty-state glyph, all of
          // which glare against a dark background.
          "appcolor": darkAccentSoft,
          "secondaryColor": "#1B1B21",

          "body": darkBody,
          "popup": darkSurface,
          "surface": darkSurface,
          "level1": "#222830",
          "level2": "#2A313A",
          "level3": "#333B45",
          "tooltip": "#2A313A",
          "backdrop": "rgba(10, 13, 16, 0.6)",
        },
        "text": {
          // Off-white, not #F0F4F8, and not pure white: on #14181D this is
          // roughly 12:1, which passes AAA without the glare.
          "primary": "#D3DBE1",
          "secondary": "#A7B1BA",
          "tertiary": "#848F99",
          "icon": "#A7B1BA",
        },
        "divider": "rgba(255, 255, 255, 0.08)",
        "neutral": {
          "plainColor": "#C7CED4",
          "plainHoverBg": "rgba(255, 255, 255, 0.06)",
          "plainActiveBg": "rgba(255, 255, 255, 0.10)",
          "outlinedColor": "#A7B1BA",
          "solidColor": "#1A1F25",
          "softColor": "#C7CED4",
        },
      }
    }
  }
})


export default theme;
