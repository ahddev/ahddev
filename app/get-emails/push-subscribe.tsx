"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

export function PushSubscribe() {
  const [status, setStatus] = useState<"idle" | "loading" | "granted" | "unsupported" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") {
      setStatus("granted");
    }
  }, []);

  const enablePush = useCallback(async () => {
    if (!publicKey) {
      setStatus("error");
      setMessage("Push is not configured (missing VAPID public key).");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("error");
        setMessage("Notification permission was denied.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const res = await fetch("/api/subscribe-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Failed to save subscription.");
        return;
      }

      setStatus("granted");
      setMessage("Push enabled. You will be notified for new emails.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to enable push.");
    }
  }, [publicKey]);

  if (status === "unsupported") {
    return (
      <p className="mb-6 text-sm text-muted-foreground">
        Push notifications are not supported in this browser. Use Safari on iPhone (iOS 16.4+).
      </p>
    );
  }

  if (status === "granted") {
    return (
      <p className="mb-6 text-sm text-muted-foreground" role="status">
        Push notifications are enabled for this device.
      </p>
    );
  }

  return (
    <div className="mb-6">
      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        disabled={status === "loading"}
        onClick={() => void enablePush()}
      >
        {status === "loading" ? "Enabling…" : "Enable push notifications"}
      </Button>
      {message && (
        <p
          className={`mt-2 text-sm ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </div>
  );
}
