package com.bellet.gateway.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.bellet.gateway.ForwardLog
import com.bellet.gateway.HeartbeatScheduler
import com.bellet.gateway.Settings
import com.bellet.gateway.SettingsStore
import kotlinx.coroutines.launch

@Composable
fun GatewayScreen(
    smsPermissionGranted: Boolean,
    onRequestSmsPermission: () -> Unit,
    onRequestBatteryExemption: () -> Unit,
) {
    val context = LocalContext.current
    val store = remember { SettingsStore(context) }
    val log = remember { ForwardLog(context) }
    val scope = rememberCoroutineScope()

    val settings by store.settings.collectAsState(initial = Settings("", "", "", false))
    val entries by log.entries.collectAsState(initial = emptyList())

    var url by remember { mutableStateOf("") }
    var secret by remember { mutableStateOf("") }
    var phoneNumber by remember { mutableStateOf("") }
    LaunchedEffect(settings.serverUrl, settings.secret, settings.phoneNumber) {
        url = settings.serverUrl
        secret = settings.secret
        phoneNumber = settings.phoneNumber
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Bellet SMS Gateway", style = MaterialTheme.typography.headlineSmall)

        if (!smsPermissionGranted) {
            Button(onClick = onRequestSmsPermission, modifier = Modifier.fillMaxWidth()) {
                Text("Grant SMS permission (required)")
            }
        }

        OutlinedTextField(
            value = url,
            onValueChange = { url = it },
            label = { Text("Server URL (e.g. https://api.bellet.tm/api)") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
        )
        OutlinedTextField(
            value = secret,
            onValueChange = { secret = it },
            label = { Text("Gateway secret") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
        )
        OutlinedTextField(
            value = phoneNumber,
            onValueChange = { phoneNumber = it },
            label = { Text("This SIM's phone number (e.g. +99365551234)") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
        )
        Button(
            onClick = {
                scope.launch {
                    store.save(url, secret, phoneNumber)
                    // Report the new number right away instead of waiting
                    // for the next periodic heartbeat.
                    if (settings.enabled) HeartbeatScheduler.start(context)
                }
            },
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Save settings")
        }

        Row(verticalAlignment = Alignment.CenterVertically) {
            Switch(
                checked = settings.enabled,
                onCheckedChange = { checked ->
                    scope.launch {
                        store.setEnabled(checked)
                        if (checked) HeartbeatScheduler.start(context) else HeartbeatScheduler.stop(context)
                    }
                },
                enabled = smsPermissionGranted,
            )
            Spacer(Modifier.width(10.dp))
            Text(if (settings.enabled) "Gateway ONLINE" else "Gateway OFFLINE")
        }

        OutlinedButton(onClick = onRequestBatteryExemption, modifier = Modifier.fillMaxWidth()) {
            Text("Disable battery optimization (recommended)")
        }

        HorizontalDivider()
        Text("Recent SMS", style = MaterialTheme.typography.titleMedium)
        LazyColumn(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            items(entries) { e ->
                Row(modifier = Modifier.fillMaxWidth()) {
                    Text(e.time, style = MaterialTheme.typography.bodySmall)
                    Spacer(Modifier.width(10.dp))
                    Text(e.phone, modifier = Modifier.weight(1f))
                    Text(e.status, style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}
