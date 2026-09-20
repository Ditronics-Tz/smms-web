# SMMS Web Application

School Management System (SMMS) web application built with React and TypeScript.

## 🚀 Quick Start

### With Docker (Recommended)

**Development Mode** (with hot-reload):
```bash
make dev
# OR
docker-compose up
```
Visit: http://localhost:3000

**Production Mode** (optimized):
```bash
make prod
# OR
docker-compose -f docker-compose.prod.yml up -d
```
Visit: http://localhost:3000

📖 **[Complete Docker Documentation](DOCKER.md)** - Setup, deployment, troubleshooting, and more!

### Without Docker

**Prerequisites**: Node.js 20+, npm 9+

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

3. **Start development server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Build for production**:
   ```bash
   npm run build
   ```
   Outputs to `build/` folder

## 📋 Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## 🐳 Docker Commands

**Quick reference** (see [DOCKER.md](DOCKER.md) for complete guide):

| Command | Description |
|---------|-------------|
| `make dev` | Start development with hot-reload |
| `make prod` | Start optimized production server |
| `make build-prod` | Build production Docker image (<150MB) |
| `make stop` | Stop all containers |
| `make logs` | View container logs |
| `make test` | Run tests in container |
| `make clean` | Clean up Docker resources |

## 🔧 Technology Stack

- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Material-UI** - Component library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Firebase** - Authentication & backend
- **Axios** - HTTP client

## 📁 Project Structure

```
smms-web/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   ├── page/           # Page components
│   ├── store/          # Redux store
│   ├── service/        # API services
│   ├── firebase/       # Firebase config
│   └── App.tsx         # Main app component
├── Dockerfile          # Multi-stage Docker config
├── docker-compose.yml  # Development setup
├── docker-compose.prod.yml  # Production setup
├── nginx.conf          # Nginx configuration
├── Makefile            # Easy commands
└── DOCKER.md          # Complete Docker guide
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# OPTIONAL: set these Firebase values only if you want web push notifications.
# Leave them blank and the app runs fine with push silently disabled.
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_VAPID_KEY=your_vapid_key
# ... other optional Firebase config (see .env.example)
REACT_APP_API_BASE_URL=https://api.your-backend.example
```

## 🎨 Re-skinning / Branding

The whole visual identity is driven by a single config module
(`src/config/branding.ts`, fed by the `REACT_APP_*` vars above). You can
re-skin the app two ways — no code changes in either case:

**Option A — Replace the bundled default assets** (fastest). Keep the file
names and overwrite them, then rebuild/restart:

| File (`src/assets/image/`)                    | Used for                                                        |
| --------------------------------------------- | --------------------------------------------------------------- |
| `logo.jpeg`                                   | Header logo, login/loading screens, sidebar, 404 page           |
| `userIcon.png`                                | User avatar icon (unused by default UI)                         |
| `background.png` / `background2.png`          | Login, forgot-password, 404 and app-init backgrounds (light/dark) |
| `tanzania.png` / `uk.png`                     | Default language flags for Swahili / English                    |

**Option B — Use branding env vars** (white-label per deployment). Set any of
`REACT_APP_APP_NAME`, `REACT_APP_APP_SHORT_NAME`, `REACT_APP_LOGO_PATH`,
`REACT_APP_FAVICON_PATH`, `REACT_APP_PRIMARY_COLOR`, `REACT_APP_CURRENCY_SYMBOL`,
`REACT_APP_CURRENCY_CODE`, `REACT_APP_DEFAULT_LOCALE`, `REACT_APP_SUPPORT_EMAIL`,
`REACT_APP_SUPPORT_PHONE` (see `.env.example`) and rebuild. The logo comes from
`REACT_APP_LOGO_PATH` when set (path must be a file inside `public/`); otherwise
the bundled `logo.jpeg` is used.

Static branding is generated at build/start time by
`scripts/generate-public-assets.js` (run via `prestart`/`prebuild`):
`public/index.html` (browser `<title>`, meta description, theme-color, favicon
links), `public/manifest.json` (name/short_name/theme_color) and
`public/firebase-messaging-sw.js`. These files are gitignored — never edit them
directly. Values left unset keep the committed defaults.

Manual override is still required for: the `<html lang="...">` attribute and the
PWA icon PNG files (`public/apple-touch-icon.png`,
`public/android-chrome-*.png`), which are static files.

**Languages.** The locale list is data-driven in `src/constant/image.ts`
(`LOCALES`) — flags use neutral keys (`flagPrimary`/`flagSecondary`), not
country names. To add a language: add a locale JSON under
`src/i18n/locales/`, register it in `src/i18n/i18n.js`, add a flag image, and
append one entry to `LOCALES`.

## 📚 Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Additional Resources

- [Docker Documentation](DOCKER.md) - Complete containerization guide
- [Code Splitting](https://facebook.github.io/create-react-app/docs/code-splitting)
- [Analyzing Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- [Making a Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- [Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- [Deployment](https://facebook.github.io/create-react-app/docs/deployment)
- [Troubleshooting](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `make dev` or `npm start`
5. Build with `make build-prod` or `npm run build`
6. Submit a pull request

## 📄 License

This project is part of Ditronics SMMS system.

