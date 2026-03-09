import { LogLevel } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "Y2bc7f8a6-9083-41cc-9347-e086de740830",
    authority: "https://login.microsoftonline.com/258b485f-556e-4372-8f74-7a20e9ff44a9",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

const loginRequest = {
  scopes: ["User.Read"],
};

export { msalConfig, loginRequest };
