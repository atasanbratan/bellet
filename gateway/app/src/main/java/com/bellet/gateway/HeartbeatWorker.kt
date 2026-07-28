package com.bellet.gateway

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

/**
 * Reports "this phone number is online" to the backend so clients know where
 * to send their verification SMS and admins see it in the gateway list. The
 * app can't reliably detect its own shutdown, so there's no explicit
 * "going offline" — the server treats a stale heartbeat as offline instead.
 */
class HeartbeatWorker(context: Context, params: WorkerParameters) :
    CoroutineWorker(context, params) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        val settings = SettingsStore(applicationContext).current()
        if (!settings.enabled || settings.secret.isBlank() || settings.phoneNumber.isBlank()) {
            return@withContext Result.success()
        }

        val body = JSONObject().put("phoneNumber", settings.phoneNumber).toString()
            .toRequestBody("application/json".toMediaType())
        val request = Request.Builder()
            .url("${settings.serverUrl}/gateway/heartbeat")
            .header("x-gateway-secret", settings.secret)
            .post(body)
            .build()

        try {
            client.newCall(request).execute().use { response ->
                if (response.isSuccessful || response.code in 400..499) {
                    // 4xx (bad secret) won't fix itself by retrying now.
                    Result.success()
                } else if (runAttemptCount < MAX_ATTEMPTS) {
                    Result.retry()
                } else {
                    Result.success()
                }
            }
        } catch (e: Exception) {
            if (runAttemptCount < MAX_ATTEMPTS) Result.retry() else Result.success()
        }
    }

    companion object {
        const val UNIQUE_WORK_NAME = "heartbeat"
        private const val MAX_ATTEMPTS = 3

        private val client = OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build()
    }
}
