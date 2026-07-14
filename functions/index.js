// Meta Conversions API (CAPI) — endpoint del sitio Altta Homes Cancún.
//
// Recibe eventos del navegador (vía /api/meta-capi, rewrite de Hosting) y los
// reenvía al dataset de Meta con el token guardado como SECRET (nunca en el
// código). El navegador manda el mismo evento vía fbq() con el MISMO event_id
// → Meta deduplica y se queda con el mejor de los dos canales.
//
// Fase actual: SOLO el evento "Contact" (clic a WhatsApp). NO se manda
// PageView por CAPI todavía: el Pixel de GTM ya lo envía sin event_id y se
// duplicaría. Cuando se haga la Fase de "aligerar el Pixel", se migra todo.

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const META_CAPI_TOKEN = defineSecret("META_CAPI_TOKEN");

const PIXEL_ID = "2016457592282966";
const GRAPH_URL = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;
const ALLOWED_EVENTS = new Set(["Contact", "Lead"]);

exports.metacapi = onRequest(
  {
    region: "us-central1",
    secrets: [META_CAPI_TOKEN],
    maxInstances: 3,
    memory: "256MiB",
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "method" });
      return;
    }

    let body = req.body;
    if (typeof body === "string" || Buffer.isBuffer(body)) {
      try {
        body = JSON.parse(body.toString());
      } catch {
        res.status(400).json({ error: "json" });
        return;
      }
    }
    if (!body || typeof body !== "object") {
      res.status(400).json({ error: "body" });
      return;
    }

    const eventName = String(body.event_name || "");
    if (!ALLOWED_EVENTS.has(eventName)) {
      res.status(400).json({ error: "event_name" });
      return;
    }

    const clamp = (v, max) =>
      typeof v === "string" && v.length > 0 ? v.slice(0, max) : undefined;

    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.ip ||
      undefined;

    const event = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: clamp(body.event_id, 64),
      event_source_url: clamp(body.event_source_url, 512),
      action_source: "website",
      user_data: {
        client_ip_address: ip,
        client_user_agent: clamp(req.headers["user-agent"], 512),
        fbp: clamp(body.fbp, 128),
        fbc: clamp(body.fbc, 256),
      },
    };

    const payload = {
      data: [event],
      access_token: META_CAPI_TOKEN.value().trim(),
    };
    // Código de prueba de Events Manager (pestaña "Probar eventos"), opcional
    const testCode = clamp(body.test_event_code, 32);
    if (testCode) payload.test_event_code = testCode;

    try {
      const r = await fetch(GRAPH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const out = await r.json().catch(() => ({}));
      if (!r.ok) {
        console.error("meta-capi error", r.status, JSON.stringify(out));
        res.status(502).json({ error: "meta", status: r.status });
        return;
      }
      res.status(200).json({ ok: true, events_received: out.events_received });
    } catch (e) {
      console.error("meta-capi fetch failed", e);
      res.status(502).json({ error: "network" });
    }
  }
);
