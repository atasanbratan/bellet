package com.bellet.gateway

import android.Manifest
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings as AndroidSettings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.lifecycleScope
import com.bellet.gateway.ui.GatewayScreen
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private val smsPermissionGranted = mutableStateOf(false)

    private val requestPermission =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            smsPermissionGranted.value = granted
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        smsPermissionGranted.value =
            checkSelfPermission(Manifest.permission.RECEIVE_SMS) ==
                android.content.pm.PackageManager.PERMISSION_GRANTED

        // Report "online" as soon as the app starts, if it's already configured.
        lifecycleScope.launch {
            if (SettingsStore(this@MainActivity).current().enabled) {
                HeartbeatScheduler.start(this@MainActivity)
            }
        }

        setContent {
            MaterialTheme {
                Surface {
                    GatewayScreen(
                        smsPermissionGranted = smsPermissionGranted.value,
                        onRequestSmsPermission = {
                            requestPermission.launch(Manifest.permission.RECEIVE_SMS)
                        },
                        onRequestBatteryExemption = ::requestBatteryExemption,
                    )
                }
            }
        }
    }

    /** Ask Android to exclude us from battery optimization (Doze) killing. */
    private fun requestBatteryExemption() {
        val pm = getSystemService(PowerManager::class.java)
        if (pm.isIgnoringBatteryOptimizations(packageName)) return
        startActivity(
            Intent(
                AndroidSettings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                Uri.parse("package:$packageName"),
            ),
        )
    }
}
