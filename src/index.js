import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { store, persistor } from "./store";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { AppInit } from "./components";
import { isFirebaseEnabled } from "./firebase/firebase";
import { checkEnv } from "./config/branding";

checkEnv();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <PersistGate loading={<AppInit/>} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </StoreProvider>
  </React.StrictMode>
);

const SERVICE_WORKER_PATH = "/firebase-messaging-sw.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const dropStaleWorkers = () => {
      // Unregister any messaging worker that is not currently healthy, so a
      // broken copy stops being re-evaluated on every navigation. This runs even
      // when Firebase is disabled: a developer who once had Firebase switched on
      // and then turned it off keeps a registered worker otherwise, and a worker
      // whose script throws is re-run by the browser on every page load, which is
      // exactly the "ServiceWorker script evaluation failed" console error that
      // cannot be cleared from inside the app.
      if (!navigator.serviceWorker.getRegistrations) return;
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          registrations.forEach((registration) => {
            if (
              registration.active &&
              registration.active.scriptURL.includes("firebase-messaging-sw")
            ) {
              registration.unregister();
            }
          });
        })
        .catch(() => {});
    };

    if (!isFirebaseEnabled) {
      // Nothing to register, so make sure nothing is left registered.
      dropStaleWorkers();
      return;
    }

    navigator.serviceWorker
      .register(SERVICE_WORKER_PATH)
      .catch((error) => {
        // Push notifications are a nice-to-have. A worker that cannot be
        // registered (offline, blocked CDN, stale cached copy) must not leave a
        // scary error in the console on every page load, and must not stop the
        // app from working.
        console.warn("Push notifications unavailable:", error && error.message);
        dropStaleWorkers();
      });
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
