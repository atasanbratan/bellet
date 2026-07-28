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
 * Delivers one "SMS received from X" report to the Bellet backend.
 * WorkManager persists it across reboots and retries with backoff, so a
 * report survives flaky mobile data. Verifications expire server-side after
 * 10 minutes, so we stop retrying after a few attempts.
 */
class ForwardWorker(context: Context, params: WorkerParameters) :
    CoroutineWorker(context, params) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        val phone = inputData.getString(KEY_PHONE) ?: return@withContext Result.failure()
        val settings = SettingsStore(applicationContext).current()
        val log = ForwardLog(applicationContext)

        if (settings.secret.isBlank()) {
            log.add(phone, "no secret configured")
            return@withContext Result.failure()
        }

        val body = JSONObject().put("fromPhone", phone).toString()
            .toRequestBody("application/json".toMediaType())
        val request = Request.Builder()
            .url("${settings.serverUrl}/auth/sms/incoming")
            .header("x-gateway-secret", settings.secret)
            .post(body)
            .build()

        try {
            client.newCall(request).execute().use { response ->
                when {
                    response.isSuccessful -> {
                        log.add(phone, "delivered")
                        Result.success()
                    }
                    // 4xx = the server understood and refused (bad secret,
                    // no pending verification) — retrying won't help.
                    response.code in 400..499 -> {
                        log.add(phone, "rejected (${response.code})")
                        Result.failure()
                    }
                    else -> retryOrGiveUp(log, phone, "server ${response.code}")
                }
            }
        } catch (e: Exception) {
            retryOrGiveUp(log, phone, "network error")
        }
    }

    private suspend fun retryOrGiveUp(
        log: ForwardLog,
        phone: String,
        reason: String,
    ): Result =
        if (runAttemptCount < MAX_ATTEMPTS) {
            log.add(phone, "$reason — retrying")
            Result.retry()
        } else {
            log.add(phone, "$reason — gave up")
            Result.failure()
        }

    companion object {
        const val KEY_PHONE = "phone"
        private const val MAX_ATTEMPTS = 5

        private val client = OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build()
    }
}
