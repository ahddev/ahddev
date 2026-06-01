self.addEventListener("push", (event) => {
  let data = { title: "New email", body: "", url: "/get-emails" };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/apple-icon.png",
      badge: "/apple-icon.png",
      data: { url: data.url ?? "/get-emails" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/get-emails";
  event.waitUntil(clients.openWindow(url));
});
