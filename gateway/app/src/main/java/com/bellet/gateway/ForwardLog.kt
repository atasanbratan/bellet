package com.bellet.gateway

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

private val Context.logStore by preferencesDataStore(name = "forward_log")
private val LOG_KEY = stringPreferencesKey("entries")
private const val MAX_ENTRIES = 50

data class LogEntry(val time: String, val phone: String, val status: String)

/** Rolling log of the last forwarded SMS numbers and their delivery status. */
class ForwardLog(private val context: Context) {

    val entries: Flow<List<LogEntry>> = context.logStore.data.map { p ->
        parse(p[LOG_KEY] ?: "[]")
    }

    suspend fun add(phone: String, status: String) {
        val stamp = SimpleDateFormat("MM-dd HH:mm", Locale.US).format(Date())
        context.logStore.edit { p ->
            val list = parse(p[LOG_KEY] ?: "[]").toMutableList()
            list.add(0, LogEntry(stamp, phone, status))
            p[LOG_KEY] = serialize(list.take(MAX_ENTRIES))
        }
    }

    private fun parse(json: String): List<LogEntry> {
        val arr = JSONArray(json)
        return (0 until arr.length()).map { i ->
            val o = arr.getJSONObject(i)
            LogEntry(o.getString("time"), o.getString("phone"), o.getString("status"))
        }
    }

    private fun serialize(list: List<LogEntry>): String {
        val arr = JSONArray()
        list.forEach { e ->
            arr.put(
                JSONObject()
                    .put("time", e.time)
                    .put("phone", e.phone)
                    .put("status", e.status),
            )
        }
        return arr.toString()
    }
}
