self.addEventListener("push", (event) => {
  let data = { title: "New email", body: "", url: "/inbox" };

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
      icon: "/icon/192",
      badge: "/icon/192",
      data: { url: data.url ?? "/inbox" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/inbox";
  event.waitUntil(clients.openWindow(url));
});
