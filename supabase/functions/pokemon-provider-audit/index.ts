const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type AuditRequest =
  | { action: "search-expansions"; query: string }
  | { action: "search-cards"; query: string; page?: number }
  | { action: "expansion-cards"; expansionId: string; sort?: string }
  | { action: "expansion-products"; expansionId: string; sort?: string }
  | { action: "card"; cardId: string };

const SAFE_SORTS = new Set(["price_highest", "price_lowest", "name_asc", "name_desc"]);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const requiredSecret = (name: string) => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Missing server secret: ${name}`);
  return value;
};

const cleanSegment = (value: unknown, label: string) => {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(value)) {
    throw new Error(`Invalid ${label}`);
  }
  return value;
};

const providerPath = (payload: AuditRequest) => {
  switch (payload.action) {
    case "search-expansions": {
      const query = typeof payload.query === "string" ? payload.query.trim() : "";
      if (!query || query.length > 100) throw new Error("Invalid search query");
      return `/episodes/search?search=${encodeURIComponent(query)}`;
    }
    case "search-cards": {
      const query = typeof payload.query === "string" ? payload.query.trim() : "";
      if (!query || query.length > 100) throw new Error("Invalid search query");
      const page = Math.max(1, Math.min(20, Number(payload.page) || 1));
      return `/cards?search=${encodeURIComponent(query)}&page=${page}`;
    }
    case "expansion-cards": {
      const id = cleanSegment(payload.expansionId, "expansion ID");
      const sort = payload.sort && SAFE_SORTS.has(payload.sort) ? payload.sort : "price_highest";
      return `/episodes/${id}/cards?sort=${encodeURIComponent(sort)}`;
    }
    case "expansion-products": {
      const id = cleanSegment(payload.expansionId, "expansion ID");
      const sort = payload.sort && SAFE_SORTS.has(payload.sort) ? payload.sort : "price_highest";
      return `/episodes/${id}/products?sort=${encodeURIComponent(sort)}`;
    }
    case "card":
      return `/pokemon/cards/${cleanSegment(payload.cardId, "card ID")}`;
    default:
      throw new Error("Unsupported action");
  }
};

const requireSignedInUser = async (request: Request) => {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) throw new Error("Unauthorized");

  const supabaseUrl = requiredSecret("SUPABASE_URL");
  const anonKey = requiredSecret("SUPABASE_ANON_KEY");
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: authorization, apikey: anonKey },
  });
  if (!response.ok) throw new Error("Unauthorized");
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    // Authentication is enforced for the deployed application function.
    await requireSignedInUser(request);
    const payload = (await request.json()) as AuditRequest;
    const baseUrl = requiredSecret("POKEMON_API_BASE_URL").replace(/\/$/, "");
    const host = requiredSecret("POKEMON_API_RAPIDAPI_HOST");
    const apiKey = requiredSecret("POKEMON_API_RAPIDAPI_KEY");
    if (!baseUrl.startsWith("https://")) throw new Error("Provider base URL must use HTTPS");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let upstream: Response;
    try {
      upstream = await fetch(`${baseUrl}${providerPath(payload)}`, {
        headers: {
          Accept: "application/json",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": host,
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const raw = await upstream.text();
    let data: unknown = raw;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      // Preserve a non-JSON provider error without exposing request credentials.
    }

    if (!upstream.ok) {
      return json({ error: "Provider request failed", providerStatus: upstream.status, details: data }, 502);
    }
    return json({ provider: "pokemon-api-rapidapi", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message === "Unauthorized"
      ? 401
      : message.startsWith("Invalid") || message === "Unsupported action"
        ? 400
        : 500;
    return json({ error: message }, status);
  }
});
