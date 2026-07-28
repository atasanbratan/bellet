# Bellet SMS Gateway (Android, Kotlin)

The physical half of Bellet's reverse-SMS verification. This app lives on a
dedicated Android phone with the gateway SIM. When a client sends an (empty)
SMS to that number, the app reports the **sender's phone number** to the
backend, which completes the client's registration / password reset:

```
client's SMS → this app → POST {server}/auth/sms/incoming
                          header  x-gateway-secret: <GATEWAY_SECRET>
                          body    { "fromPhone": "+993…" }
```

The SMS **body is never read or sent** — only the sender's number matters.

The app also reports its **own** phone number as "online" so clients know
which number to text and admins can see which gateways are alive:

```
app start / toggle ON / periodic (15 min) → POST {server}/gateway/heartbeat
                                            header  x-gateway-secret: <GATEWAY_SECRET>
                                            body    { "phoneNumber": "+993…" }
```

There's no explicit "going offline" call — Android gives no reliable signal
for that — so the server treats a gateway as offline once its heartbeat is
older than `GATEWAY_ONLINE_TTL_SEC` (20 minutes by default), which comfortably
survives one missed periodic beat.

## How it stays alive on a locked phone

- The receiver is **manifest-registered** for `SMS_RECEIVED`: Android wakes the
  app for every SMS even if it was killed and the screen is locked. No
  foreground service, no persistent notification.
- Delivery goes through **WorkManager**: reports survive reboots and retry
  with exponential backoff (up to 5 attempts) when mobile data is flaky.
  4xx responses are not retried; verifications expire server-side after
  10 minutes anyway.

## Build & install

1. Open the `gateway/` folder in **Android Studio** (it supplies Gradle).
2. Let it sync, then **Build → Build APK(s)**, or run on a connected phone.
3. Or from a terminal with Android Studio's tooling installed:
   `./gradlew assembleDebug` → APK at `app/build/outputs/apk/debug/`.
4. Install on the gateway phone (enable "install unknown apps"), e.g.
   `adb install app-debug.apk`. This app is sideloaded only — it must never
   go to Google Play (SMS-permission policy).

## Phone setup (once)

1. Open the app → **Grant SMS permission**.
2. Enter the **Server URL** (e.g. `https://api.example.com/api` — must be
   reachable from the phone's network), the **Gateway secret** — the same
   value as `GATEWAY_SECRET` in `backend/.env` — and **this SIM's phone
   number** (e.g. `+99365551234`; there's no reliable way to read it
   automatically, so it's typed once). Save.
3. Flip the switch **ON**. This immediately reports the number as online —
   check the admin dashboard's **Gateways** tab or the phone number shown on
   the app's register/reset screen.
4. Tap **Disable battery optimization** and confirm.
5. On Xiaomi/Huawei/Oppo etc., also enable **Autostart** for the app in the
   phone's settings (vendor battery killers ignore the standard exemption).

## Test it end-to-end

1. Run the backend with a `GATEWAY_SECRET` set and register a new user in the
   web app — it will say "send an empty SMS to X".
2. From any other phone, send an SMS to the gateway phone's number.
3. The app's **Recent SMS** list shows the number and `delivered`; the web
   app logs the new user in automatically.

For development without a phone, the web app's **"Simulate SMS (dev)"**
button plays this app's role.

## Files

| File | Purpose |
|------|---------|
| `SmsReceiver.kt` | Wakes on SMS, queues one forward per sender |
| `ForwardWorker.kt` | POSTs the sender's number to the backend with retry/backoff |
| `HeartbeatWorker.kt` | POSTs this phone's own number as "online" |
| `HeartbeatScheduler.kt` | Starts/stops the immediate + periodic heartbeat |
| `SettingsStore.kt` | DataStore: URL, secret, phone number, on/off |
| `ForwardLog.kt` | Rolling log of the last 50 forwards |
| `MainActivity.kt` + `ui/GatewayScreen.kt` | Compose (Material 3) settings UI |
