export function getDeviceUUID() {
  if (typeof window === 'undefined') return 'srv-uuid';
  let id = localStorage.getItem('device_uuid');
  if (!id) {
    id = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    localStorage.setItem('device_uuid', id);
  }
  return id;
}
