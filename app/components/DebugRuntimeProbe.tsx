"use client";

import { useEffect } from "react";

type EthereumProviderShape = {
  isMetaMask?: boolean;
  request?: (args: { method: string }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProviderShape;
  }
}

const DEBUG_ENDPOINT =
  "http://127.0.0.1:7354/ingest/80fda280-b937-4af2-be3a-52af5cf0eba5";
const DEBUG_SESSION_ID = "386c92";

function postDebugLog(payload: {
  runId: string;
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, unknown>;
}) {
  // #region agent log
  fetch(DEBUG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": DEBUG_SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION_ID,
      ...payload,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

export function DebugRuntimeProbe() {
  useEffect(() => {
    const runId = `run-${Date.now()}`;
    const ethereum = window.ethereum;
    const hasEthereum = Boolean(ethereum);
    const isMetaMask = Boolean(ethereum?.isMetaMask);
    const hasRequest = typeof ethereum?.request === "function";

    // #region agent log
    postDebugLog({
      runId,
      hypothesisId: "H1",
      location: "app/components/DebugRuntimeProbe.tsx:46",
      message: "Provider capability snapshot on mount",
      data: { hasEthereum, isMetaMask, hasRequest },
    });
    // #endregion

    // #region agent log
    fetch("/api/health?debugProbe=386c92").catch(() => {});
    // #endregion

    const onWindowError = (event: ErrorEvent) => {
      // #region agent log
      postDebugLog({
        runId,
        hypothesisId: "H2",
        location: "app/components/DebugRuntimeProbe.tsx:61",
        message: "Window error captured",
        data: {
          message: event.message,
          filename: event.filename,
          sourceIsExtension:
            typeof event.filename === "string" &&
            event.filename.startsWith("chrome-extension://"),
        },
      });
      // #endregion
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reasonMessage =
        typeof event.reason === "string"
          ? event.reason
          : event.reason instanceof Error
            ? event.reason.message
            : "unknown";

      // #region agent log
      postDebugLog({
        runId,
        hypothesisId: "H3",
        location: "app/components/DebugRuntimeProbe.tsx:84",
        message: "Unhandled rejection captured",
        data: { reasonMessage },
      });
      // #endregion
    };

    window.addEventListener("error", onWindowError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onWindowError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
