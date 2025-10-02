export async function startRun(payload: {
  device_uuid: string;
  pseudo?: string;
  loop: string; // 'nord' | 'centre_nord' | 'centre_sud' | 'sud'
}) {
  const res = await fetch('/api/run/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = `startRun failed: ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.message ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
