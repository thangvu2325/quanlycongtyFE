import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalStyle from "./components/GlobalStyle";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <GlobalStyle>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: "Roboto, sans-serif",
                fontSizeHeading1: 18,
                fontSizeHeading2: 16,
                fontSizeHeading3: 14,
                fontSizeHeading4: 12,
                fontSizeHeading5: 10,
                colorPrimary: "#6366f1",
                colorTextSecondary: "#6c737f",
                colorTextBase: "#111927",
                colorLink: "#6366f1",
              },
              components: {
                Typography: {
                  titleMarginBottom: 0,
                },
                Layout: {
                  headerBg: "transparent",
                  bodyBg: "transparent",
                  footerBg: "transparent",
                  headerHeight: 56,
                  headerPadding: "0 12px",
                  siderBg: "#1C2536",
                },
              },
            }}
          >
            <App />
          </ConfigProvider>
        </GlobalStyle>
      </Provider>
    </PersistGate>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
