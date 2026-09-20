import branding from "../config/branding";

export default {
    Images: {
        icon: branding.LOGO_PATH || require("../assets/image/logo.jpeg"),
        logo: branding.LOGO_PATH || require("../assets/image/logo.jpeg"),
        userIcon: require("../assets/image/userIcon.png"),
        background: require("../assets/image/background.png"),
        background2: require("../assets/image/background2.png"),
        flagPrimary: require("../assets/image/tanzania.png"),
        flagSecondary: require("../assets/image/uk.png"),
    }
}

export const LOCALES = [
    { code: "en", label: "English", flagKey: "flagSecondary" },
    { code: "sw", label: "Swahili", flagKey: "flagPrimary" },
];