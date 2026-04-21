/**
 * ZIROCRAFT INDUSTRIAL SECURITY ENGINE v1.0
 * Melindungi frontend dari eksploitasi dasar dan kebocoran data.
 */

export const sanitizeInput = (text) => {
  // Mencegah XSS (Cross-Site Scripting) sederhana
  return text.replace(/[<>]/g, "");
};

export const preventClickjacking = () => {
  if (window.self !== window.top) {
    window.top.location = window.self.location;
  }
};

export const clearSensitiveSession = () => {
  // Menghapus jejak jika terdeteksi manipulasi
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/login";
};

// Hook sederhana untuk proteksi UI
export const useIdleTimeout = (timeout = 600000) => {
  // 10 Menit Idle
  let timer;
  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(clearSensitiveSession, timeout);
  };

  window.onload = resetTimer;
  window.onmousemove = resetTimer;
  window.onmousedown = resetTimer;
  window.ontouchstart = resetTimer;
  window.onclick = resetTimer;
  window.onkeypress = resetTimer;
};
