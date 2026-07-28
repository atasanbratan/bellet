package com.bellet.gateway

import android.content.Context
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

/**
 * Starts/stops the heartbeat: an immediate report right away (app start,
 * enabling the switch, saving settings) plus a periodic renewal so the
 * server's staleness check never lapses. WorkManager's minimum periodic
 * interval is 15 minutes — comfortably under the server's 20-minute TTL.
 */
object HeartbeatScheduler {

    fun start(context: Context) {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        WorkManager.getInstance(context).enqueueUniqueWork(
            "${HeartbeatWorker.UNIQUE_WORK_NAME}-now",
            ExistingWorkPolicy.REPLACE,
            OneTimeWorkRequestBuilder<HeartbeatWorker>()
                .setConstraints(constraints)
                .build(),
        )
        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            HeartbeatWorker.UNIQUE_WORK_NAME,
            ExistingPeriodicWorkPolicy.UPDATE,
            PeriodicWorkRequestBuilder<HeartbeatWorker>(15, TimeUnit.MINUTES)
                .setConstraints(constraints)
                .build(),
        )
    }

    fun stop(context: Context) {
        WorkManager.getInstance(context).cancelUniqueWork(HeartbeatWorker.UNIQUE_WORK_NAME)
    }
}
