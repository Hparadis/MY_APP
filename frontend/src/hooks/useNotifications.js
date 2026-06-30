import { useState, useEffect, useCallback } from 'react'

export function useNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )
  const [supported] = useState(
    typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator
  )

  useEffect(() => {
    if (!supported) return
    setPermission(Notification.permission)
  }, [supported])

  const requestPermission = useCallback(async () => {
    if (!supported) return 'unsupported'
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [supported])

  // Schedule a reminder to fire at a specific timestamp (ms since epoch)
  const scheduleReminder = useCallback(async (id, text, fireAt) => {
    if (!supported || Notification.permission !== 'granted') return false
    const reg = await navigator.serviceWorker.ready
    reg.active?.postMessage({
      type: 'SCHEDULE_REMINDER',
      payload: { id, text, fireAt }
    })
    return true
  }, [supported])

  const cancelReminder = useCallback(async (id) => {
    if (!supported) return
    const reg = await navigator.serviceWorker.ready
    reg.active?.postMessage({
      type: 'CANCEL_REMINDER',
      payload: { id }
    })
  }, [supported])

  return { permission, supported, requestPermission, scheduleReminder, cancelReminder }
}

// Helpers for converting friendly time choices into timestamps
export function getTimeOptions() {
  const now = new Date()

  const todayAt = (hour, minute = 0) => {
    const d = new Date(now)
    d.setHours(hour, minute, 0, 0)
    return d
  }

  const tomorrowAt = (hour, minute = 0) => {
    const d = todayAt(hour, minute)
    d.setDate(d.getDate() + 1)
    return d
  }

  const in1Hour = new Date(now.getTime() + 60 * 60 * 1000)

  const options = [
    { label: 'In 1 hour', value: in1Hour },
    { label: 'This evening, 6pm', value: todayAt(18, 0) },
    { label: 'Tomorrow, 9am', value: tomorrowAt(9, 0) },
  ]

  // Filter out times already in the past (e.g. "this evening" if it's 9pm)
  return options.filter(o => o.value.getTime() > now.getTime())
}
