// Допоміжні функції використовуються в обох версіях резюме.
export function getThemeByHour(hour) {
  return hour >= 7 && hour < 21 ? 'light' : 'dark'
}

export function saveSystemInfo() {
  const info = {
    userAgent: navigator.userAgent,
    platform: navigator.platform || 'Не надано браузером',
    language: navigator.language,
    languages: navigator.languages.join(', '),
    vendor: navigator.vendor || 'Не надано браузером',
    cookiesEnabled: navigator.cookieEnabled,
    logicalProcessors: navigator.hardwareConcurrency ?? 'Не надано браузером',
    deviceMemoryGB: navigator.deviceMemory ?? 'Не надано браузером',
    maxTouchPoints: navigator.maxTouchPoints,
    screen: `${screen.width} × ${screen.height}`,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }

  try {
    localStorage.setItem('lab4.systemInfo', JSON.stringify(info))
    return true
  } catch {
    return false
  }
}

export function getStorageEntries() {
  try {
    const entries = []
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index)
      entries.push([key, localStorage.getItem(key)])
    }
    return entries
  } catch {
    return []
  }
}

export function hasSeenContact(key) {
  try {
    return sessionStorage.getItem(key) === 'true'
  } catch {
    return false
  }
}

export function rememberContact(key) {
  try {
    sessionStorage.setItem(key, 'true')
  } catch {
    // Без sessionStorage таймер усе одно запускається лише один раз на сторінці.
  }
}

export function validatePhone(value) {
  const digits = value.replace(/\D/g, '')
  return (
    /^[+\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15
  )
}
