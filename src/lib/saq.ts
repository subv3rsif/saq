const API = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

export type StartRunIn = { device_uuid: string; pseudo?: string; loop: "nord"|"centre_nord"|"centre_sud"|"sud" };
export type StartRunOut = { run_id: string; first?: { slug: string } };

async function j<T>(res: Response): Promise<T> {
  let body: any = null;
  try { body = await res.json(); } catch { /* noop */ }
  if (!res.ok) {
    const msg = body?.error || body?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body as T;
}

export function startRun(p: StartRunIn) {
  return fetch(`${API}/api/run/start`, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(p) }).then(j<StartRunOut>);
}

export function getArtworks(loop: string) {
  return fetch(`${API}/api/artworks?loop=${encodeURIComponent(loop)}`).then(j<{items:any[]}>);
}

export function scan(p:{ run_id: string; artwork_ref:{slug:string}; coords?:{lat:number;lng:number} }) {
  return fetch(`${API}/api/scan`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(p) }).then(j<any>);
}

export function answer(p:{ run_id:string; artwork_id:number; enigma_id:number; answer:string }) {
  return fetch(`${API}/api/answer/v2`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(p) }).then(j<any>);
}
