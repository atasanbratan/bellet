package com.bellet.gateway

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "gateway")

data class Settings(
    val serverUrl: String,
    val secret: String,
    val phoneNumber: String,
    val enabled: Boolean,
)

/** Persisted configuration: server URL, gateway secret, this SIM's phone
 * number (entered manually — Android can't reliably read it back), on/off
 * switch. */
class SettingsStore(private val context: Context) {

    private object Keys {
        val SERVER_URL = stringPreferencesKey("server_url")
        val SECRET = stringPreferencesKey("secret")
        val PHONE_NUMBER = stringPreferencesKey("phone_number")
        val ENABLED = booleanPreferencesKey("enabled")
    }

    val settings: Flow<Settings> = context.dataStore.data.map { p ->
        Settings(
            serverUrl = p[Keys.SERVER_URL] ?: "http://10.0.2.2:3000/api",
            secret = p[Keys.SECRET] ?: "",
            phoneNumber = p[Keys.PHONE_NUMBER] ?: "",
            enabled = p[Keys.ENABLED] ?: false,
        )
    }

    suspend fun current(): Settings = settings.first()

    suspend fun save(serverUrl: String, secret: String, phoneNumber: String) {
        context.dataStore.edit { p ->
            p[Keys.SERVER_URL] = serverUrl.trim().trimEnd('/')
            p[Keys.SECRET] = secret.trim()
            p[Keys.PHONE_NUMBER] = phoneNumber.trim()
        }
    }

    suspend fun setEnabled(enabled: Boolean) {
        context.dataStore.edit { p -> p[Keys.ENABLED] = enabled }
    }
}
