package com.bellet.gateway

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import androidx.work.BackoffPolicy
import androidx.work.Constraints
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.workDataOf
import kotlinx.coroutines.runBlocking
import java.util.concurrent.TimeUnit

/**
 * Woken by the OS for every incoming SMS (works with the app killed and the
 * device locked). We only need the sender's number — clients send an *empty*
 * SMS to prove they own the phone — so the body is ignored entirely.
 */
class SmsReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) return

        val enabled = runBlocking { SettingsStore(context).current().enabled }
        if (!enabled) return

        val senders = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            .mapNotNull { it.originatingAddress }
            .distinct()

        for (phone in senders) {
            runBlocking { ForwardLog(context).add(phone, "queued") }
            enqueueForward(context, phone)
        }
    }

    private fun enqueueForward(context: Context, phone: String) {
        val request = OneTimeWorkRequestBuilder<ForwardWorker>()
            .setInputData(workDataOf(ForwardWorker.KEY_PHONE to phone))
            .setConstraints(
                Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.CONNECTED)
                    .build(),
            )
            .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 15, TimeUnit.SECONDS)
            .build()
        WorkManager.getInstance(context).enqueue(request)
    }
}
