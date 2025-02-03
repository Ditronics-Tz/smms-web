
import { extendTheme } from '@mui/joy/styles';


declare module '@mui/joy/styles' {
  interface PaletteBackgroundOverrides {
    appcolor: true;
    secondaryColor: true
  }
}

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
          '500': '#ffa500',
          '600': '#e27c00',
          '700': '#bb5502',
          '800': '#984208',
          '900': '#7c360b',
        },
        "background": {
          "appcolor": "#FFA500",
          "secondaryColor": "#F8F8FF",
        }
      }
    },
    "dark": {
      "palette": {
        "primary": {
          // 900: "#F5F5F9",
          '900': '#fff5c5',
          '800': '#ffeb85',
          '700': '#ffda46',
          '600': '#ffc71b',
          '500': '#ffa500',
          '400': '#e27c00',
          '300': '#bb5502',
          '200': '#984208',
          '100': '#7c360b',
        },
        "background": {
          "appcolor": "#FFA500",
          "secondaryColor": "#F8F8FF",
        }
      }
    }
  }
})


export default theme;