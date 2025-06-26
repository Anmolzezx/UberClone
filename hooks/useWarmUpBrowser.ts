import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

/**
 * This hook warms up the browser (e.g. for OAuth login flows) to make them faster.
 */
export function useWarmUpBrowser() {
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
}
