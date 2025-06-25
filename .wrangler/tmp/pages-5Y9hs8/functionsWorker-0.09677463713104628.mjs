var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../.wrangler/tmp/bundle-CgLpkP/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// api/admin-sync.ts
async function onRequestPost(context) {
  try {
    const request = context.request;
    const { updates, timestamp, source } = await request.json();
    if (!updates || !timestamp) {
      return new Response(JSON.stringify({
        success: false,
        error: "Updates and timestamp required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("=== ADMIN CHANGES RECEIVED ===");
    console.log("Timestamp:", timestamp);
    console.log("Source:", source);
    console.log("Updates:", JSON.stringify(updates, null, 2));
    return new Response(JSON.stringify({
      success: true,
      message: "Admin changes logged successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin sync error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestPost, "onRequestPost");
async function onRequestGet() {
  return new Response(JSON.stringify({
    message: "Admin sync endpoint active",
    status: "ready",
    type: "cloudflare-function"
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(onRequestGet, "onRequestGet");

// api/r2-proxy.ts
var onRequestGet2 = /* @__PURE__ */ __name(async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400"
  };
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const filePath = url.searchParams.get("file");
    if (!filePath) {
      return new Response("File path is required", {
        status: 400,
        headers: corsHeaders
      });
    }
    if (!env.MEDIA_BUCKET) {
      console.error("MEDIA_BUCKET not found in environment");
      return new Response("R2 bucket not configured", {
        status: 500,
        headers: corsHeaders
      });
    }
    console.log("Attempting to get file:", filePath);
    const object = await env.MEDIA_BUCKET.get(filePath);
    if (!object) {
      console.log("File not found in R2:", filePath);
      return new Response("File not found", {
        status: 404,
        headers: corsHeaders
      });
    }
    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
    headers.set("Content-Length", object.size.toString());
    headers.set("Cache-Control", "public, max-age=31536000");
    if (object.httpEtag) {
      headers.set("ETag", object.httpEtag);
    }
    console.log("Successfully serving file:", filePath, "Size:", object.size);
    return new Response(object.body, { headers });
  } catch (error) {
    console.error("R2 Proxy error:", error);
    return new Response("Internal server error: " + error.message, {
      status: 500,
      headers: corsHeaders
    });
  }
}, "onRequestGet");
var onRequestOptions = /* @__PURE__ */ __name(async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400"
    }
  });
}, "onRequestOptions");

// api/team.js
var defaultTeam = [
  {
    id: 1,
    name: "Mehmet \xD6zkan",
    position: "Kurucu & Genel M\xFCd\xFCr",
    description: "Ankara'da 25 y\u0131ll\u0131k deneyimi olan \u0131s\u0131tma sistemleri uzman\u0131. \xD6z Mevsim'i kurarak sekt\xF6rde g\xFCvenilir bir marka haline getirdi.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&face",
    email: "mehmet@ozmevsim.com",
    phone: "+90 312 357 0600",
    specialties: ["Proje Y\xF6netimi", "\u0130\u015F Geli\u015Ftirme", "M\xFC\u015Fteri \u0130li\u015Fkileri"],
    experience: "25+ Y\u0131l",
    status: "active",
    featured: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Ahmet Demir",
    position: "Teknik M\xFCd\xFCr",
    description: "Makine m\xFChendisi. Kombi, klima ve do\u011Falgaz tesisat\u0131 konular\u0131nda 20+ y\u0131l deneyimi olan teknik ekip lideri.",
    image: "https://images.unsplash.com/photo-1559548331-f9cb98001426?w=400&h=400&fit=crop&face",
    email: "ahmet@ozmevsim.com",
    phone: "+90 312 357 0601",
    specialties: ["Kombi Sistemleri", "Klima Teknolojileri", "Do\u011Falgaz Tesisat\u0131"],
    experience: "20+ Y\u0131l",
    status: "active",
    featured: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Fatma Kaya",
    position: "Montaj Ekip Lideri",
    description: "Saha deneyimi olan montaj uzman\u0131. T\xFCm marka kombi ve klima sistemlerinin kurulumu konusunda sertifikal\u0131.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&face",
    email: "fatma@ozmevsim.com",
    phone: "+90 312 357 0602",
    specialties: ["Kombi Montaj\u0131", "Klima Kurulumu", "Sistem Testleri"],
    experience: "15+ Y\u0131l",
    status: "active",
    featured: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "\xD6zlem \xC7elik",
    position: "M\xFC\u015Fteri Hizmetleri Uzman\u0131",
    description: "M\xFC\u015Fteri memnuniyeti odakl\u0131 \xE7al\u0131\u015Fan deneyimli m\xFC\u015Fteri hizmetleri uzman\u0131. 7/24 destek sa\u011Flar.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&face",
    email: "ozlem@ozmevsim.com",
    phone: "+90 312 357 0603",
    specialties: ["M\xFC\u015Fteri \u0130li\u015Fkileri", "Teknik Destek", "Randevu Y\xF6netimi"],
    experience: "8+ Y\u0131l",
    status: "active",
    featured: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Serkan Y\u0131lmaz",
    position: "Servis Teknisyeni",
    description: "T\xFCm marka kombi ve klima sistemlerinin bak\u0131m ve onar\u0131m\u0131 konusunda sertifikal\u0131 teknisyen.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&face",
    email: "serkan@ozmevsim.com",
    phone: "+90 312 357 0604",
    specialties: ["Bak\u0131m & Onar\u0131m", "Ar\u0131za Tespiti", "Yedek Par\xE7a"],
    experience: "12+ Y\u0131l",
    status: "active",
    featured: false,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];
async function onRequestGet3(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const featured = url.searchParams.get("featured");
    const position = url.searchParams.get("position");
    const status = url.searchParams.get("status") || "active";
    let filteredTeam = defaultTeam;
    if (status) {
      filteredTeam = filteredTeam.filter((member) => member.status === status);
    }
    if (featured === "true") {
      filteredTeam = filteredTeam.filter((member) => member.featured);
    }
    if (position && position !== "all") {
      filteredTeam = filteredTeam.filter(
        (member) => member.position.toLowerCase().includes(position.toLowerCase())
      );
    }
    return Response.json({
      success: true,
      data: filteredTeam,
      count: filteredTeam.length
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return Response.json(
      { success: false, error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
__name(onRequestGet3, "onRequestGet");
async function onRequestPost2(context) {
  try {
    return Response.json({
      success: true,
      message: "Team member creation endpoint - functionality to be implemented"
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    return Response.json(
      { success: false, error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
__name(onRequestPost2, "onRequestPost");
async function onRequestPut(context) {
  try {
    return Response.json({
      success: true,
      message: "Team member update endpoint - functionality to be implemented"
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    return Response.json(
      { success: false, error: "Failed to update team member" },
      { status: 500 }
    );
  }
}
__name(onRequestPut, "onRequestPut");
async function onRequestDelete(context) {
  try {
    return Response.json({
      success: true,
      message: "Team member deletion endpoint - functionality to be implemented"
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return Response.json(
      { success: false, error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
__name(onRequestDelete, "onRequestDelete");

// api/upload-r2.ts
var onRequestPost3 = /* @__PURE__ */ __name(async (context) => {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const files = formData.getAll("files");
    const folder = formData.get("folder") || "general";
    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No files provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const uploadedFilesData = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `File ${file.name} is too large. Maximum size is 10MB.`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const fileExtension = file.name.split(".").pop();
      const uniqueFilename = `${folder}/${timestamp}-${randomId}.${fileExtension}`;
      await env.MEDIA_BUCKET.put(uniqueFilename, file.stream(), {
        httpMetadata: {
          contentType: file.type
        }
      });
      const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document";
      const uploadedFile = {
        id: `${timestamp}-${randomId}`,
        name: uniqueFilename,
        originalName: file.name,
        type: fileType,
        mimeType: file.type,
        size: file.size,
        url: `/api/r2-proxy?file=${encodeURIComponent(uniqueFilename)}`,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (fileType === "image") {
        uploadedFile.thumbnail = uploadedFile.url;
        uploadedFile.dimensions = { width: 800, height: 600 };
      }
      uploadedFilesData.push(uploadedFile);
    }
    return new Response(
      JSON.stringify({
        success: true,
        data: uploadedFilesData,
        message: `${uploadedFilesData.length} file(s) uploaded successfully to R2`
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("R2 Upload error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to upload files to R2" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestPost");
var onRequestGet4 = /* @__PURE__ */ __name(async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const folder = url.searchParams.get("folder");
    const objects = await env.MEDIA_BUCKET.list({
      prefix: folder || void 0,
      limit: 100
    });
    const files = objects.objects.map((obj) => {
      const fileType = obj.httpMetadata?.contentType?.startsWith("image/") ? "image" : obj.httpMetadata?.contentType?.startsWith("video/") ? "video" : "document";
      const file = {
        id: obj.key.split("/").pop()?.split(".")[0] || obj.key,
        name: obj.key,
        originalName: obj.key.split("/").pop() || obj.key,
        type: fileType,
        mimeType: obj.httpMetadata?.contentType || "application/octet-stream",
        size: obj.size,
        url: `/api/r2-proxy?file=${encodeURIComponent(obj.key)}`,
        uploadedAt: obj.uploaded.toISOString()
      };
      if (fileType === "image") {
        file.thumbnail = file.url;
      }
      return file;
    });
    const filteredFiles = type ? files.filter((f) => f.type === type) : files;
    return new Response(
      JSON.stringify({
        success: true,
        data: filteredFiles,
        total: filteredFiles.length,
        message: `Found ${filteredFiles.length} files in R2 bucket`
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("R2 List error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch files from R2" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestGet");

// api/admin-auth.js
async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  try {
    const { method } = request;
    if (method === "POST") {
      const body = await request.json();
      const { password } = body;
      if (!password) {
        return Response.json({
          success: false,
          error: "\u015Eifre gerekli"
        }, {
          status: 400,
          headers: corsHeaders
        });
      }
      const stmt = env.ozmevsim_d1.prepare("SELECT value FROM settings WHERE key = ?");
      const result = await stmt.bind("admin_password").first();
      let correctPassword = "mali06";
      if (result && result.value) {
        correctPassword = result.value;
      } else {
        const insertStmt = env.ozmevsim_d1.prepare("INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)");
        await insertStmt.bind("admin_password", "mali06", (/* @__PURE__ */ new Date()).toISOString()).run();
      }
      if (password === correctPassword) {
        const sessionToken = btoa(Date.now() + "_" + Math.random().toString(36));
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString();
        const sessionStmt = env.ozmevsim_d1.prepare("INSERT OR REPLACE INTO admin_sessions (token, expires_at, created_at) VALUES (?, ?, ?)");
        await sessionStmt.bind(sessionToken, expiresAt, (/* @__PURE__ */ new Date()).toISOString()).run();
        return Response.json({
          success: true,
          token: sessionToken,
          message: "Giri\u015F ba\u015Far\u0131l\u0131"
        }, {
          status: 200,
          headers: corsHeaders
        });
      } else {
        return Response.json({
          success: false,
          error: "Hatal\u0131 \u015Fifre"
        }, {
          status: 401,
          headers: corsHeaders
        });
      }
    }
    if (method === "GET") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({
          success: false,
          authenticated: false,
          error: "Token gerekli"
        }, {
          status: 401,
          headers: corsHeaders
        });
      }
      const token = authHeader.replace("Bearer ", "");
      const stmt = env.ozmevsim_d1.prepare("SELECT * FROM admin_sessions WHERE token = ? AND expires_at > ?");
      const session = await stmt.bind(token, (/* @__PURE__ */ new Date()).toISOString()).first();
      if (session) {
        return Response.json({
          success: true,
          authenticated: true,
          message: "Ge\xE7erli oturum"
        }, {
          status: 200,
          headers: corsHeaders
        });
      } else {
        return Response.json({
          success: false,
          authenticated: false,
          error: "Ge\xE7ersiz veya s\xFCresi dolmu\u015F token"
        }, {
          status: 401,
          headers: corsHeaders
        });
      }
    }
    return Response.json({
      success: false,
      error: "Desteklenmeyen method"
    }, {
      status: 405,
      headers: corsHeaders
    });
  } catch (error) {
    console.error("Admin auth error:", error);
    return Response.json({
      success: false,
      error: "Sunucu hatas\u0131"
    }, {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(onRequest, "onRequest");

// api/blog.js
async function onRequest2(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "GET") {
      try {
        const category = url.searchParams.get("category");
        const status = url.searchParams.get("status") || "published";
        const featured = url.searchParams.get("featured");
        let query = "SELECT * FROM blog_posts WHERE status = ?";
        let params = [status];
        if (category && category !== "all") {
          query += " AND category = ?";
          params.push(category);
        }
        if (featured === "true") {
          query += " AND featured = 1";
        }
        query += " ORDER BY created_at DESC";
        const stmt = env.ozmevsim_d1.prepare(query);
        const { results } = await stmt.bind(...params).all();
        const processedPosts = results.map((post) => ({
          ...post,
          tags: typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags || [],
          featured: Boolean(post.featured)
        }));
        return new Response(JSON.stringify({
          success: true,
          data: processedPosts,
          total: processedPosts.length
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      } catch (dbError) {
        console.log("D1 not available, using static data:", dbError);
        const blogPosts = [
          {
            id: "1",
            title: "K\u0131\u015F Aylar\u0131nda Kombi Verimlili\u011Fini Art\u0131rman\u0131n 10 Yolu",
            slug: "kis-aylarinda-kombi-verimliligini-artirmanin-10-yolu",
            excerpt: "So\u011Fuk k\u0131\u015F aylar\u0131nda enerji faturalar\u0131n\u0131z\u0131 d\xFC\u015F\xFCr\xFCrken evinizi s\u0131cak tutman\u0131n pratik yollar\u0131n\u0131 ke\u015Ffedin.",
            content: "K\u0131\u015F aylar\u0131nda artan do\u011Falgaz faturalar\u0131 ailelerin en b\xFCy\xFCk endi\u015Felerinden biri. \u0130\u015Fte kombi verimlili\u011Finizi art\u0131rarak hem tasarruf edebilece\u011Finiz hem de \xE7evreyi koruyabilece\u011Finiz 10 etkili y\xF6ntem...",
            category: "tips",
            author: "Murat \xD6zkan",
            authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            publishDate: "2024-03-15",
            readTime: 8,
            views: 1250,
            tags: ["enerji tasarrufu", "kombi", "k\u0131\u015F bak\u0131m\u0131", "verimlilik"],
            featuredImage: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&h=400&fit=crop",
            featured: true,
            status: "published",
            createdAt: "2024-03-15T10:00:00Z",
            updatedAt: "2024-03-15T10:00:00Z"
          },
          {
            id: "2",
            title: "Yeni Nesil Ak\u0131ll\u0131 Termostat Teknolojileri",
            slug: "yeni-nesil-akilli-termostat-teknolojileri",
            excerpt: "IoT destekli ak\u0131ll\u0131 termostatlarla evinizin \u0131s\u0131tma sistemini nas\u0131l optimize edebilece\u011Finizi \xF6\u011Frenin.",
            content: "Teknolojinin h\u0131zla geli\u015Fmesiyle birlikte ev \u0131s\u0131tma sistemleri de ak\u0131llan\u0131yor. Yeni nesil ak\u0131ll\u0131 termostatlar...",
            category: "technology",
            author: "Ay\u015Fe Demir",
            authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            publishDate: "2024-03-12",
            readTime: 6,
            views: 890,
            tags: ["ak\u0131ll\u0131 sistem", "termostat", "IoT", "teknoloji"],
            featuredImage: "https://images.unsplash.com/photo-1558618666-fbd25c85cd64?w=600&h=400&fit=crop",
            featured: false,
            status: "published",
            createdAt: "2024-03-12T10:00:00Z",
            updatedAt: "2024-03-12T10:00:00Z"
          }
        ];
        const category = url.searchParams.get("category");
        const status = url.searchParams.get("status");
        const featured = url.searchParams.get("featured");
        let filteredPosts = [...blogPosts];
        if (category && category !== "all") {
          filteredPosts = filteredPosts.filter((post) => post.category === category);
        }
        if (status && status !== "all") {
          filteredPosts = filteredPosts.filter((post) => post.status === status);
        }
        if (featured === "true") {
          filteredPosts = filteredPosts.filter((post) => post.featured);
        }
        return new Response(JSON.stringify({
          success: true,
          data: filteredPosts,
          total: filteredPosts.length
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
    } else if (request.method === "POST") {
      const body = await request.json();
      const {
        title,
        slug,
        excerpt,
        content,
        category,
        author,
        publishDate,
        readTime,
        tags,
        featuredImage,
        featured,
        status
      } = body;
      if (!title || !content) {
        return new Response(JSON.stringify({
          error: "Title and content are required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9ğüşıöç\s]/gi, "").replace(/\s+/g, "-").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c");
      const stmt = env.ozmevsim_d1.prepare(`
        INSERT INTO blog_posts (
          title, slug, excerpt, content, category, author, 
          publish_date, read_time, tags, featured_image, 
          featured, status, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);
      const result = await stmt.bind(
        title,
        postSlug,
        excerpt || "",
        content,
        category || "general",
        author || "Admin",
        publishDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        readTime || 5,
        JSON.stringify(tags || []),
        featuredImage || "",
        featured ? 1 : 0,
        status || "published"
      ).run();
      if (!result.success) {
        throw new Error("Failed to create blog post");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Blog post created successfully",
        id: result.meta.last_row_id
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else if (request.method === "PUT") {
      const body = await request.json();
      const {
        id,
        title,
        slug,
        excerpt,
        content,
        category,
        author,
        publishDate,
        readTime,
        tags,
        featuredImage,
        featured,
        status
      } = body;
      if (!id) {
        return new Response(JSON.stringify({
          error: "Blog post ID is required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const stmt = env.ozmevsim_d1.prepare(`
        UPDATE blog_posts 
        SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, 
            author = ?, publish_date = ?, read_time = ?, tags = ?, 
            featured_image = ?, featured = ?, status = ?, updated_at = datetime('now')
        WHERE id = ?
      `);
      const result = await stmt.bind(
        title,
        slug,
        excerpt || "",
        content,
        category || "general",
        author || "Admin",
        publishDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        readTime || 5,
        JSON.stringify(tags || []),
        featuredImage || "",
        featured ? 1 : 0,
        status || "published",
        id
      ).run();
      if (!result.success) {
        throw new Error("Failed to update blog post");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Blog post updated successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else if (request.method === "DELETE") {
      const body = await request.json();
      const { id } = body;
      if (!id) {
        return new Response(JSON.stringify({
          error: "Blog post ID is required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const stmt = env.ozmevsim_d1.prepare("DELETE FROM blog_posts WHERE id = ?");
      const result = await stmt.bind(id).run();
      if (!result.success) {
        throw new Error("Failed to delete blog post");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Blog post deleted successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: "Method not allowed"
      }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
  } catch (error) {
    console.error("Blog API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest2, "onRequest");

// api/contact.js
async function onRequest3(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (!env.ozmevsim_d1) {
      throw new Error("Database not available");
    }
    if (request.method === "GET") {
      const status = url.searchParams.get("status");
      let query = "SELECT * FROM contact_messages";
      let params = [];
      if (status && status !== "all") {
        query += " WHERE status = ?";
        params.push(status);
      }
      query += " ORDER BY created_at DESC";
      const stmt = env.ozmevsim_d1.prepare(query);
      const result = await stmt.bind(...params).all();
      return new Response(JSON.stringify({
        success: true,
        data: result.results || []
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    if (request.method === "POST") {
      const body = await request.json();
      const { name, email, phone, subject, message } = body;
      if (!name || !email || !message) {
        return new Response(JSON.stringify({
          success: false,
          error: "Name, email and message are required"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid email format"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      const stmt = env.ozmevsim_d1.prepare(`
        INSERT INTO contact_messages (name, email, phone, subject, message, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = await stmt.bind(
        name,
        email,
        phone || "",
        subject || "",
        message,
        "unread"
      ).run();
      if (!result.success) {
        throw new Error("Failed to save contact message");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Mesaj\u0131n\u0131z ba\u015Far\u0131yla g\xF6nderildi. En k\u0131sa s\xFCrede size d\xF6n\xFC\u015F yapaca\u011F\u0131z.",
        data: {
          id: result.meta.last_row_id,
          submittedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Contact API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error: " + error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest3, "onRequest");

// api/data-kv.js
async function onRequest4(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const key = url.searchParams.get("key");
    if (request.method === "GET") {
      if (!key) {
        return new Response(JSON.stringify({
          success: false,
          error: "Key parameter required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const data = await env.SITE_DATA.get(key);
      return new Response(JSON.stringify({
        success: true,
        data: data ? JSON.parse(data) : null
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (request.method === "PUT" || request.method === "POST") {
      if (!key) {
        return new Response(JSON.stringify({
          success: false,
          error: "Key parameter required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const body = await request.json();
      await env.SITE_DATA.put(key, JSON.stringify({
        ...body,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      }));
      return new Response(JSON.stringify({
        success: true,
        message: "Data saved successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (request.method === "DELETE") {
      if (!key) {
        return new Response(JSON.stringify({
          success: false,
          error: "Key parameter required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      await env.SITE_DATA.delete(key);
      return new Response(JSON.stringify({
        success: true,
        message: "Data deleted successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
__name(onRequest4, "onRequest");

// api/faq.js
var faqData = [
  {
    id: "1",
    question: "Kombi montaj\u0131 ne kadar s\xFCrer?",
    answer: "Standart kombi montaj\u0131 genellikle 4-6 saat aras\u0131nda tamamlan\u0131r. Mevcut tesisat\u0131n durumuna g\xF6re bu s\xFCre de\u011Fi\u015Febilir.",
    category: "montaj",
    order: 1,
    isActive: true
  },
  {
    id: "2",
    question: "Kombi bak\u0131m\u0131 ne s\u0131kl\u0131kla yap\u0131lmal\u0131?",
    answer: "Kombiler y\u0131lda en az bir kez profesyonel bak\u0131m g\xF6rmelidir. Yo\u011Fun kullan\u0131m durumunda 6 ayda bir bak\u0131m \xF6nerilir.",
    category: "bakim",
    order: 2,
    isActive: true
  },
  {
    id: "3",
    question: "Hangi kombi markas\u0131n\u0131 tercih etmeliyim?",
    answer: "Vaillant, Buderus, Baymak gibi kaliteli markalar \xF6nerilir. Evinizin b\xFCy\xFCkl\xFC\u011F\xFC ve ihtiya\xE7lar\u0131n\u0131za g\xF6re se\xE7im yap\u0131lmal\u0131d\u0131r.",
    category: "urun",
    order: 3,
    isActive: true
  }
];
async function onRequest5(context) {
  const { request } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "GET") {
      const category = url.searchParams.get("category");
      let filteredFaqs = [...faqData];
      if (category && category !== "all") {
        filteredFaqs = filteredFaqs.filter((faq) => faq.category === category);
      }
      filteredFaqs = filteredFaqs.filter((faq) => faq.isActive);
      filteredFaqs.sort((a, b) => a.order - b.order);
      return new Response(JSON.stringify({
        success: true,
        data: filteredFaqs,
        total: filteredFaqs.length
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest5, "onRequest");

// api/media.js
var mediaFiles = [
  {
    id: "1",
    name: "vaillant-ecotec.jpg",
    originalName: "vaillant-ecotec.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 245760,
    url: "/uploads/products/vaillant-ecotec.jpg",
    thumbnail: "/uploads/products/vaillant-ecotec.jpg",
    alt: "Vaillant EcoTec Kombi Modeli",
    caption: "Y\xFCksek verimli Vaillant EcoTec kombi",
    folder: "products",
    uploadedAt: "2024-03-15T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "2",
    name: "ariston-kombi.jpg",
    originalName: "ariston-kombi.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 198432,
    url: "/uploads/products/ariston-kombi.jpg",
    thumbnail: "/uploads/products/ariston-kombi.jpg",
    alt: "Ariston Kombi Modeli",
    caption: "Ekonomik Ariston kombi serisi",
    folder: "products",
    uploadedAt: "2024-03-14T15:30:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "3",
    name: "daikin-altherma.jpg",
    originalName: "daikin-altherma.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 312576,
    url: "/uploads/products/daikin-altherma.jpg",
    thumbnail: "/uploads/products/daikin-altherma.jpg",
    alt: "Daikin Altherma Is\u0131 Pompas\u0131",
    caption: "Inverter teknolojili Daikin Altherma",
    folder: "products",
    uploadedAt: "2024-03-13T09:15:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "4",
    name: "mitsubishi-msz.jpg",
    originalName: "mitsubishi-msz.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 287104,
    url: "/uploads/products/mitsubishi-msz.jpg",
    thumbnail: "/uploads/products/mitsubishi-msz.jpg",
    alt: "Mitsubishi MSZ Klima Modeli",
    caption: "Sessiz \xE7al\u0131\u015Fan Mitsubishi MSZ klima",
    folder: "products",
    uploadedAt: "2024-03-12T14:20:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "5",
    name: "baymak-lunatec.jpg",
    originalName: "baymak-lunatec.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 234880,
    url: "/uploads/products/baymak-lunatec.jpg",
    thumbnail: "/uploads/products/baymak-lunatec.jpg",
    alt: "Baymak Lunatec Kombi Modeli",
    caption: "Yerli \xFCretim Baymak Lunatec kombi",
    folder: "products",
    uploadedAt: "2024-03-11T11:45:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "6",
    name: "purmo-radiator.jpg",
    originalName: "purmo-radiator.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 156672,
    url: "/uploads/products/purmo-radiator.jpg",
    thumbnail: "/uploads/products/purmo-radiator.jpg",
    alt: "Purmo Panel Radyat\xF6r",
    caption: "Panel radyat\xF6r Purmo serisi",
    folder: "products",
    uploadedAt: "2024-03-10T16:30:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "7",
    name: "buderus-gb122i2.jpg",
    originalName: "buderus-gb122i2.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 298752,
    url: "/uploads/products/buderus-gb122i2.jpg",
    thumbnail: "/uploads/products/buderus-gb122i2.jpg",
    alt: "Buderus GB122i2 Kombi Modeli",
    caption: "Alman teknolojisi Buderus GB122i2 kombi",
    folder: "products",
    uploadedAt: "2024-03-09T13:15:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "8",
    name: "bosch-kombi.jpg",
    originalName: "bosch-kombi.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 189440,
    url: "/uploads/products/bosch-kombi.jpg",
    thumbnail: "/uploads/products/bosch-kombi.jpg",
    alt: "Bosch Kombi Modeli",
    caption: "G\xFCvenilir Bosch kombi",
    folder: "products",
    uploadedAt: "2024-03-08T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "9",
    name: "baymak-elegant.jpg",
    originalName: "baymak-elegant.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 234880,
    url: "/uploads/products/baymak-elegant.jpg",
    thumbnail: "/uploads/products/baymak-elegant.jpg",
    alt: "Baymak Elegant Kombi",
    caption: "\u015E\u0131k tasar\u0131m Baymak Elegant kombi",
    folder: "products",
    uploadedAt: "2024-03-07T12:30:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "10",
    name: "baymak-duotec.jpg",
    originalName: "baymak-duotec.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 287104,
    url: "/uploads/products/baymak-duotec.jpg",
    thumbnail: "/uploads/products/baymak-duotec.jpg",
    alt: "Baymak Duotec Kombi",
    caption: "\xC7ift fonksiyonlu Baymak Duotec kombi",
    folder: "products",
    uploadedAt: "2024-03-06T09:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  // NEW BRAND LOGOS
  {
    id: "11",
    name: "bosch-logo.png",
    originalName: "bosch-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 110305,
    url: "/uploads/brands/bosch-logo.png",
    thumbnail: "/uploads/brands/bosch-logo.png",
    alt: "Bosch Logo",
    caption: "Bosch marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  {
    id: "12",
    name: "vaillant-logo.png",
    originalName: "vaillant-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 66697,
    url: "/uploads/brands/vaillant-logo.png",
    thumbnail: "/uploads/brands/vaillant-logo.png",
    alt: "Vaillant Logo",
    caption: "Vaillant marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  {
    id: "13",
    name: "buderus-logo.png",
    originalName: "buderus-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 117922,
    url: "/uploads/brands/buderus-logo.png",
    thumbnail: "/uploads/brands/buderus-logo.png",
    alt: "Buderus Logo",
    caption: "Buderus marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  {
    id: "14",
    name: "baymak-logo.png",
    originalName: "baymak-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 25e3,
    url: "/uploads/brands/baymak-logo.png",
    thumbnail: "/uploads/brands/baymak-logo.png",
    alt: "Baymak Logo",
    caption: "Baymak marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  {
    id: "15",
    name: "demirdokum-logo.png",
    originalName: "demirdokum-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 2091,
    url: "/uploads/brands/demirdokum-logo.png",
    thumbnail: "/uploads/brands/demirdokum-logo.png",
    alt: "DemirD\xF6k\xFCm Logo",
    caption: "DemirD\xF6k\xFCm marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  {
    id: "16",
    name: "eca-logo.png",
    originalName: "eca-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 141045,
    url: "/uploads/brands/eca-logo.png",
    thumbnail: "/uploads/brands/eca-logo.png",
    alt: "ECA Logo",
    caption: "ECA marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  // NEW PRODUCT IMAGES
  {
    id: "17",
    name: "bosch-condens-8300iw.png",
    originalName: "bosch-condens-8300iw.png",
    type: "image",
    mimeType: "image/png",
    size: 89893,
    url: "/uploads/products/bosch/bosch-condens-8300iw.png",
    thumbnail: "/uploads/products/bosch/bosch-condens-8300iw.png",
    alt: "Bosch Condens 8300iW Kombi",
    caption: "Bosch Condens 8300iW yo\u011Fu\u015Fmal\u0131 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 480, height: 480 }
  },
  {
    id: "18",
    name: "bosch-tronic-8500i.png",
    originalName: "bosch-tronic-8500i.png",
    type: "image",
    mimeType: "image/png",
    size: 89893,
    url: "/uploads/products/bosch/bosch-tronic-8500i.png",
    thumbnail: "/uploads/products/bosch/bosch-tronic-8500i.png",
    alt: "Bosch Tronic 8500i Elektrikli Su Is\u0131t\u0131c\u0131s\u0131",
    caption: "Bosch Tronic 8500i anl\u0131k elektrikli su \u0131s\u0131t\u0131c\u0131s\u0131",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 480, height: 480 }
  },
  {
    id: "19",
    name: "vaillant-ecotec-exclusive.png",
    originalName: "vaillant-ecotec-exclusive.png",
    type: "image",
    mimeType: "image/png",
    size: 173408,
    url: "/uploads/products/vaillant/vaillant-ecotec-exclusive.png",
    thumbnail: "/uploads/products/vaillant/vaillant-ecotec-exclusive.png",
    alt: "Vaillant ecoTEC Exclusive Kombi",
    caption: "Vaillant ecoTEC Exclusive premium kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 1e3, height: 800 }
  },
  {
    id: "20",
    name: "vaillant-ecotec-plus.png",
    originalName: "vaillant-ecotec-plus.png",
    type: "image",
    mimeType: "image/png",
    size: 513838,
    url: "/uploads/products/vaillant/vaillant-ecotec-plus.png",
    thumbnail: "/uploads/products/vaillant/vaillant-ecotec-plus.png",
    alt: "Vaillant ecoTEC Plus Kombi",
    caption: "Vaillant ecoTEC Plus yo\u011Fu\u015Fmal\u0131 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 1e3, height: 800 }
  },
  {
    id: "21",
    name: "buderus-logatherm-wlw186i.png",
    originalName: "buderus-logatherm-wlw186i.png",
    type: "image",
    mimeType: "image/png",
    size: 135026,
    url: "/uploads/products/buderus/buderus-logatherm-wlw186i.png",
    thumbnail: "/uploads/products/buderus/buderus-logatherm-wlw186i.png",
    alt: "Buderus Logatherm WLW186i Is\u0131 Pompas\u0131",
    caption: "Buderus Logatherm WLW186i AR \u0131s\u0131 pompas\u0131",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 420, height: 336 }
  },
  {
    id: "22",
    name: "buderus-logano-plus.png",
    originalName: "buderus-logano-plus.png",
    type: "image",
    mimeType: "image/png",
    size: 135026,
    url: "/uploads/products/buderus/buderus-logano-plus.png",
    thumbnail: "/uploads/products/buderus/buderus-logano-plus.png",
    alt: "Buderus Logano Plus Kombi",
    caption: "Buderus Logano Plus GB125 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 420, height: 336 }
  },
  {
    id: "23",
    name: "baymak-lunatec-kombi.png",
    originalName: "baymak-lunatec-kombi.png",
    type: "image",
    mimeType: "image/png",
    size: 5e4,
    url: "/uploads/products/baymak/baymak-lunatec-kombi.png",
    thumbnail: "/uploads/products/baymak/baymak-lunatec-kombi.png",
    alt: "Baymak Lunatec Kombi",
    caption: "Baymak Lunatec tam yo\u011Fu\u015Fmal\u0131 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 400, height: 400 }
  },
  {
    id: "24",
    name: "baymak-elegant-plus-klima.png",
    originalName: "baymak-elegant-plus-klima.png",
    type: "image",
    mimeType: "image/png",
    size: 5e4,
    url: "/uploads/products/baymak/baymak-elegant-plus-klima.png",
    thumbnail: "/uploads/products/baymak/baymak-elegant-plus-klima.png",
    alt: "Baymak Elegant Plus Klima",
    caption: "Baymak Elegant Plus duvar tipi split klima",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 400, height: 400 }
  },
  {
    id: "25",
    name: "demirdokum-nitromix-kombi.png",
    originalName: "demirdokum-nitromix-kombi.png",
    type: "image",
    mimeType: "image/png",
    size: 12579,
    url: "/uploads/products/demirdokum/demirdokum-nitromix-kombi.png",
    thumbnail: "/uploads/products/demirdokum/demirdokum-nitromix-kombi.png",
    alt: "DemirD\xF6k\xFCm Nitromix Kombi",
    caption: "DemirD\xF6k\xFCm Nitromix ioni yo\u011Fu\u015Fmal\u0131 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 300, height: 400 }
  },
  {
    id: "26",
    name: "eca-confeo-kombi.png",
    originalName: "eca-confeo-kombi.png",
    type: "image",
    mimeType: "image/png",
    size: 141186,
    url: "/uploads/products/eca/eca-confeo-kombi.png",
    thumbnail: "/uploads/products/eca/eca-confeo-kombi.png",
    alt: "ECA Confeo Kombi",
    caption: "ECA Confeo premix yo\u011Fu\u015Fmal\u0131 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 400, height: 500 }
  },
  {
    id: "27",
    name: "eca-mixer-banyo.png",
    originalName: "eca-mixer-banyo.png",
    type: "image",
    mimeType: "image/png",
    size: 141186,
    url: "/uploads/products/eca/eca-mixer-banyo.png",
    thumbnail: "/uploads/products/eca/eca-mixer-banyo.png",
    alt: "ECA Banyo Bataryas\u0131",
    caption: "ECA banyo lavabo bataryas\u0131",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 400, height: 500 }
  }
];
function getValidMediaFiles() {
  const validFileNames = [
    "vaillant-ecotec.jpg",
    "ariston-kombi.jpg",
    "daikin-altherma.jpg",
    "mitsubishi-msz.jpg",
    "baymak-lunatec.jpg",
    "purmo-radiator.jpg",
    "buderus-gb122i2.jpg",
    "bosch-kombi.jpg",
    "baymak-elegant.jpg",
    "baymak-duotec.jpg",
    // Brand logos
    "bosch-logo.png",
    "vaillant-logo.png",
    "buderus-logo.png",
    "baymak-logo.png",
    "demirdokum-logo.png",
    "eca-logo.png",
    // New product images
    "bosch-condens-8300iw.png",
    "bosch-tronic-8500i.png",
    "vaillant-ecotec-exclusive.png",
    "vaillant-ecotec-plus.png",
    "buderus-logatherm-wlw186i.png",
    "buderus-logano-plus.png",
    "baymak-lunatec-kombi.png",
    "baymak-elegant-plus-klima.png",
    "demirdokum-nitromix-kombi.png",
    "eca-confeo-kombi.png",
    "eca-mixer-banyo.png"
  ];
  const validFiles = mediaFiles.filter((file) => {
    return validFileNames.includes(file.name);
  });
  return validFiles;
}
__name(getValidMediaFiles, "getValidMediaFiles");
async function onRequest6(context) {
  const { request } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "GET") {
      const type = url.searchParams.get("type");
      const folder = url.searchParams.get("folder");
      const search = url.searchParams.get("search");
      const limit = parseInt(url.searchParams.get("limit")) || 50;
      let filteredFiles = getValidMediaFiles();
      if (type && type !== "all") {
        filteredFiles = filteredFiles.filter((file) => file.type === type);
      }
      if (folder && folder !== "all") {
        filteredFiles = filteredFiles.filter((file) => file.folder === folder);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        filteredFiles = filteredFiles.filter(
          (file) => file.name.toLowerCase().includes(searchLower) || file.originalName.toLowerCase().includes(searchLower) || file.alt && file.alt.toLowerCase().includes(searchLower) || file.caption && file.caption.toLowerCase().includes(searchLower)
        );
      }
      filteredFiles = filteredFiles.slice(0, limit);
      const allValidFiles = getValidMediaFiles();
      const stats = {
        total: allValidFiles.length,
        images: allValidFiles.filter((f) => f.type === "image").length,
        videos: allValidFiles.filter((f) => f.type === "video").length,
        documents: allValidFiles.filter((f) => f.type === "document").length
      };
      return new Response(JSON.stringify({
        success: true,
        data: filteredFiles,
        stats,
        total: filteredFiles.length
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    if (request.method === "POST") {
      const body = await request.json();
      if (body.action === "add") {
        return new Response(JSON.stringify({
          success: true,
          message: "Demo modunda dosyalar eklenmez",
          data: getValidMediaFiles()
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid action"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    if (request.method === "PUT") {
      const body = await request.json();
      const { id, alt, caption, folder } = body;
      const fileIndex = mediaFiles.findIndex((f) => f.id === id);
      if (fileIndex === -1) {
        return new Response(JSON.stringify({
          success: false,
          error: "Dosya bulunamad\u0131"
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      mediaFiles[fileIndex] = {
        ...mediaFiles[fileIndex],
        alt: alt || mediaFiles[fileIndex].alt,
        caption: caption || mediaFiles[fileIndex].caption,
        folder: folder || mediaFiles[fileIndex].folder
      };
      return new Response(JSON.stringify({
        success: true,
        message: "Dosya bilgileri g\xFCncellendi",
        data: mediaFiles[fileIndex]
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    if (request.method === "DELETE") {
      const body = await request.json();
      const { ids } = body;
      if (!Array.isArray(ids)) {
        return new Response(JSON.stringify({
          success: false,
          error: "Ge\xE7ersiz dosya ID listesi"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      const deletedCount = mediaFiles.length;
      mediaFiles = mediaFiles.filter((file) => !ids.includes(file.id));
      const actualDeletedCount = deletedCount - mediaFiles.length;
      return new Response(JSON.stringify({
        success: true,
        message: `${actualDeletedCount} dosya silindi`,
        deletedCount: actualDeletedCount
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error: " + error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest6, "onRequest");

// api/products.js
async function onRequest7(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const url = new URL(request.url);
    const method = request.method;
    if (method === "GET") {
      const status = url.searchParams.get("status") || "active";
      const stmt = env.ozmevsim_d1.prepare(
        "SELECT * FROM products WHERE status = ? ORDER BY created_at DESC"
      );
      const { results } = await stmt.bind(status).all();
      const processedProducts = results.map((product) => ({
        ...product,
        features: typeof product.features === "string" ? JSON.parse(product.features) : product.features,
        specifications: typeof product.specifications === "string" ? JSON.parse(product.specifications) : product.specifications
      }));
      return new Response(JSON.stringify({
        success: true,
        data: processedProducts
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else if (method === "POST") {
      const body = await request.json();
      const { title, description, price, image_url, category, brand, model, features, specifications, status } = body;
      if (!title || !description) {
        return new Response(JSON.stringify({
          error: "Title and description are required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const stmt = env.ozmevsim_d1.prepare(`
          INSERT INTO products (title, description, price, image_url, category, brand, model, features, specifications, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `);
      const result = await stmt.bind(
        title,
        description,
        price || 0,
        image_url || "",
        category || "general",
        brand || "",
        model || "",
        JSON.stringify(features || []),
        JSON.stringify(specifications || {}),
        status || "active"
      ).run();
      if (!result.success) {
        throw new Error("Failed to create product");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Product created successfully",
        id: result.meta.last_row_id
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else if (method === "PUT") {
      const body = await request.json();
      const { id, title, description, price, image_url, category, brand, model, features, specifications, status } = body;
      if (!id) {
        return new Response(JSON.stringify({
          error: "Product ID is required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const stmt = env.ozmevsim_d1.prepare(`
          UPDATE products 
          SET title = ?, description = ?, price = ?, image_url = ?, category = ?, brand = ?, model = ?, features = ?, specifications = ?, status = ?, updated_at = datetime('now')
          WHERE id = ?
        `);
      const result = await stmt.bind(
        title,
        description,
        price || 0,
        image_url || "",
        category || "general",
        brand || "",
        model || "",
        JSON.stringify(features || []),
        JSON.stringify(specifications || {}),
        status || "active",
        id
      ).run();
      if (!result.success) {
        throw new Error("Failed to update product");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Product updated successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else if (method === "DELETE") {
      const body = await request.json();
      const { id } = body;
      if (!id) {
        return new Response(JSON.stringify({
          error: "Product ID is required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const stmt = env.ozmevsim_d1.prepare("DELETE FROM products WHERE id = ?");
      const result = await stmt.bind(id).run();
      if (!result.success) {
        throw new Error("Failed to delete product");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Product deleted successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else {
      return new Response(JSON.stringify({
        error: "Method not allowed"
      }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  } catch (error) {
    console.error("Products API Error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
__name(onRequest7, "onRequest");

// api/references.js
var defaultReferences = [
  {
    id: 1,
    title: "Residence Villa Kompleksi",
    description: "Ankara'n\u0131n prestijli b\xF6lgelerinden birinde yer alan villa kompleksimizde 50 villa i\xE7in kombi ve radyat\xF6r sistemleri kurduk. Vaillant ecoTEC Plus kombiler ve Purmo panel radyat\xF6rler ile m\xFCkemmel \u0131s\u0131tma konforu sa\u011Flad\u0131k.",
    client: "Residence \u0130n\u015Faat",
    location: "\xC7ankaya, Ankara",
    category: "Residential",
    completedDate: "2023-11-15",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    status: "active",
    featured: true,
    rating: 5,
    createdAt: "2023-11-15T10:00:00Z",
    updatedAt: "2023-11-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Botanik Plaza Ofis Binas\u0131",
    description: "Botanik'te 25 katl\u0131 modern ofis binas\u0131nda merkezi \u0131s\u0131tma sistemi kurulumu ger\xE7ekle\u015Ftirdik. Bosch kondansing kazanlar ve ak\u0131ll\u0131 kontrol sistemleri ile enerji verimlili\u011Fi %35 art\u0131r\u0131ld\u0131.",
    client: "Botanik Plaza Yap\u0131",
    location: "Botanik, Ankara",
    category: "Commercial",
    completedDate: "2023-10-20",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    status: "active",
    featured: true,
    rating: 5,
    createdAt: "2023-10-20T10:00:00Z",
    updatedAt: "2023-10-20T10:00:00Z"
  },
  {
    id: 3,
    title: "Sanayi Fabrikas\u0131 Enerji Sistemi",
    description: "Organize Sanayi B\xF6lgesi'nde 5000 m\xB2 kapal\u0131 alana sahip \xFCretim tesisinde end\xFCstriyel \u0131s\u0131tma sistemi kurulumu. Buderus end\xFCstriyel kazanlar ve \u0131s\u0131 geri kazan\u0131m sistemi ile %40 enerji tasarrufu sa\u011Fland\u0131.",
    client: "ASO Makine San.",
    location: "Sincan OSB, Ankara",
    category: "Industrial",
    completedDate: "2023-09-30",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
    status: "active",
    featured: true,
    rating: 5,
    createdAt: "2023-09-30T10:00:00Z",
    updatedAt: "2023-09-30T10:00:00Z"
  },
  {
    id: 4,
    title: "Konutkent Sitesi Do\u011Falgaz D\xF6n\xFC\u015F\xFCm\xFC",
    description: "Ke\xE7i\xF6ren'de 200 konutluk sitede eski kalorifer sisteminden modern kombi sistemlerine ge\xE7i\u015F projesi. Her daireye Vaillant ecoTEC Pro kombiler kuruldu ve %50 enerji tasarrufu sa\u011Fland\u0131.",
    client: "Konutkent Y\xF6netimi",
    location: "Ke\xE7i\xF6ren, Ankara",
    category: "Residential",
    completedDate: "2023-08-15",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    status: "active",
    featured: true,
    rating: 4,
    createdAt: "2023-08-15T10:00:00Z",
    updatedAt: "2023-08-15T10:00:00Z"
  },
  {
    id: 5,
    title: "Capitol AVM Klima Sistemi",
    description: "Ankara'n\u0131n en b\xFCy\xFCk al\u0131\u015Fveri\u015F merkezlerinden Capitol AVM'de 50000 m\xB2 alana VRV klima sistemi kurulumu. Daikin VRV sistemi ile %30 enerji verimlili\u011Fi art\u0131\u015F\u0131 sa\u011Fland\u0131.",
    client: "Capitol AVM",
    location: "\xC7ukurambar, Ankara",
    category: "Commercial",
    completedDate: "2023-07-10",
    image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop",
    status: "active",
    featured: false,
    rating: 5,
    createdAt: "2023-07-10T10:00:00Z",
    updatedAt: "2023-07-10T10:00:00Z"
  },
  {
    id: 6,
    title: "Gazi \xDCniversitesi Teknokent",
    description: "Gazi \xDCniversitesi Teknokent binas\u0131nda ak\u0131ll\u0131 \u0131s\u0131tma ve so\u011Futma sistemi kurulumu. IoT sens\xF6rleri ve ak\u0131ll\u0131 kontrol sistemi ile %45 enerji tasarrufu elde edildi.",
    client: "Gazi \xDCniversitesi",
    location: "Maltepe, Ankara",
    category: "Institutional",
    completedDate: "2023-06-20",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
    status: "active",
    featured: false,
    rating: 5,
    createdAt: "2023-06-20T10:00:00Z",
    updatedAt: "2023-06-20T10:00:00Z"
  }
];
async function onRequest8(context) {
  const { request } = context;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
  try {
    const url = new URL(request.url);
    const featured = url.searchParams.get("featured");
    const category = url.searchParams.get("category");
    const limit = url.searchParams.get("limit");
    let filteredReferences = defaultReferences;
    if (featured === "true") {
      filteredReferences = filteredReferences.filter((ref) => ref.featured);
    }
    if (category) {
      filteredReferences = filteredReferences.filter(
        (ref) => ref.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredReferences = filteredReferences.slice(0, limitNum);
      }
    }
    return new Response(JSON.stringify({
      success: true,
      data: filteredReferences,
      count: filteredReferences.length,
      total: defaultReferences.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Error in references function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch references"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(onRequest8, "onRequest");

// api/testimonials.js
var testimonials = [
  {
    id: "1",
    name: "Mehmet Y\u0131lmaz",
    company: "Ev Sahibi",
    rating: 5,
    comment: "\xD6z Mevsim ekibi \xE7ok profesyonel. Kombi montaj\u0131n\u0131 h\u0131zl\u0131 ve temiz bir \u015Fekilde tamamlad\u0131lar.",
    date: "2024-03-10",
    location: "Ankara, \xC7ankaya",
    service: "Kombi Montaj\u0131",
    featured: true,
    status: "approved"
  },
  {
    id: "2",
    name: "Ay\u015Fe Kaya",
    company: "Ev Sahibi",
    rating: 5,
    comment: "Klima montaj\u0131 i\xE7in arad\u0131m, \xE7ok memnun kald\u0131m. Fiyatlar\u0131 da uygun.",
    date: "2024-03-08",
    location: "Ankara, Ke\xE7i\xF6ren",
    service: "Klima Montaj\u0131",
    featured: true,
    status: "approved"
  },
  {
    id: "3",
    name: "Ali Demir",
    company: "\u0130\u015F Yeri Sahibi",
    rating: 4,
    comment: "Do\u011Falgaz tesisat\u0131 kurulumu i\xE7in \xE7al\u0131\u015Ft\u0131k. \u0130\u015Flerini iyi yap\u0131yorlar.",
    date: "2024-03-05",
    location: "Ankara, Mamak",
    service: "Do\u011Falgaz Tesisat\u0131",
    featured: false,
    status: "approved"
  }
];
async function onRequest9(context) {
  const { request } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "GET") {
      const featured = url.searchParams.get("featured");
      const service = url.searchParams.get("service");
      let filteredTestimonials = [...testimonials];
      filteredTestimonials = filteredTestimonials.filter((t) => t.status === "approved");
      if (featured === "true") {
        filteredTestimonials = filteredTestimonials.filter((t) => t.featured);
      }
      if (service && service !== "all") {
        filteredTestimonials = filteredTestimonials.filter(
          (t) => t.service.toLowerCase().includes(service.toLowerCase())
        );
      }
      filteredTestimonials.sort((a, b) => new Date(b.date) - new Date(a.date));
      return new Response(JSON.stringify({
        success: true,
        data: filteredTestimonials,
        total: filteredTestimonials.length
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest9, "onRequest");

// api/upload.js
async function onRequest10(context) {
  const { request } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const files = formData.getAll("files");
        const folder = formData.get("folder") || "general";
        if (!files || files.length === 0) {
          return new Response(JSON.stringify({
            success: false,
            error: "Dosya bulunamad\u0131"
          }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const maxFileSize = 10 * 1024 * 1024;
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "video/mp4",
          "video/avi",
          "video/mov",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        for (const file of files) {
          if (file.size > maxFileSize) {
            return new Response(JSON.stringify({
              success: false,
              error: `Dosya ${file.name} \xE7ok b\xFCy\xFCk. Maksimum boyut 10MB.`
            }), {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          if (!allowedTypes.includes(file.type)) {
            return new Response(JSON.stringify({
              success: false,
              error: `Dosya t\xFCr\xFC ${file.type} desteklenmiyor.`
            }), {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
        }
        return new Response(JSON.stringify({
          success: true,
          message: `Demo modunda ${files.length} dosya y\xFCkleme sim\xFClasyonu tamamland\u0131. Ger\xE7ek dosyalar kaydedilmedi.`,
          data: [],
          demo: true,
          note: "Bu demo modudur. Dosyalar ger\xE7ekte kaydedilmez ve medya k\xFCt\xFCphanesinde g\xF6r\xFCnmez."
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      } catch (error) {
        console.error("Upload error:", error);
        return new Response(JSON.stringify({
          success: false,
          error: "Dosya y\xFCkleme s\u0131ras\u0131nda hata olu\u015Ftu: " + error.message
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
    }
    if (request.method === "GET") {
      return new Response(JSON.stringify({
        success: true,
        message: "Upload API demo modunda \xE7al\u0131\u015F\u0131yor",
        demo: true,
        supportedTypes: [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "video/mp4",
          "video/avi",
          "video/mov",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ],
        maxFileSize: "10MB",
        note: "Demo modunda dosyalar ger\xE7ekte kaydedilmez"
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error: " + error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest10, "onRequest");

// admin-sync.ts
async function onRequestPost4(context) {
  try {
    const request = context.request;
    const { updates, timestamp, source } = await request.json();
    if (!updates || !timestamp) {
      return new Response(JSON.stringify({
        success: false,
        error: "Updates and timestamp required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("=== ADMIN CHANGES RECEIVED ===");
    console.log("Timestamp:", timestamp);
    console.log("Source:", source);
    console.log("Updates:", JSON.stringify(updates, null, 2));
    return new Response(JSON.stringify({
      success: true,
      message: "Admin changes logged successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin sync error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestPost4, "onRequestPost");
async function onRequestGet5() {
  return new Response(JSON.stringify({
    message: "Admin sync endpoint active",
    status: "ready",
    type: "cloudflare-function"
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(onRequestGet5, "onRequestGet");

// hero-slides.js
async function onRequestGet6(context) {
  try {
    const { env } = context;
    if (env.ozmevsim_d1) {
      try {
        console.log("\u{1F504} Fetching hero slides from D1 database...");
        const result = await env.ozmevsim_d1.prepare(`
          SELECT * FROM hero_slides 
          WHERE is_active = 1 
          ORDER BY sort_order ASC, id ASC
        `).all();
        if (result.results && result.results.length > 0) {
          console.log("\u2705 Found hero slides in database:", result.results.length);
          const slides = result.results.map((slide) => ({
            id: slide.id,
            title: slide.title,
            subtitle: slide.subtitle,
            description: slide.description,
            image: slide.background_image,
            ctaText: slide.primary_cta_text,
            ctaLink: slide.primary_cta_href,
            active: slide.is_active === 1,
            order: slide.sort_order || 0
          }));
          return Response.json({
            success: true,
            data: slides,
            count: slides.length,
            source: "database"
          });
        }
      } catch (error) {
        console.error("Database error:", error);
      }
    }
    return Response.json({
      success: false,
      error: "Database not available",
      data: [],
      count: 0,
      source: "none"
    }, { status: 503 });
  } catch (error) {
    console.error("Hero slides API error:", error);
    return Response.json({
      success: false,
      error: "Failed to fetch hero slides"
    }, { status: 500 });
  }
}
__name(onRequestGet6, "onRequestGet");
async function onRequestPost5(context) {
  try {
    const { env, request } = context;
    const slideData = await request.json();
    for (const field of ["title", "subtitle", "description"]) {
      if (!slideData[field]) {
        return Response.json({
          success: false,
          error: `${field} is required`
        }, { status: 400 });
      }
    }
    if (env.ozmevsim_d1) {
      try {
        console.log("\u{1F4BE} Saving new hero slide to D1 database...");
        const stats = Array.isArray(slideData.stats) ? JSON.stringify(slideData.stats) : "[]";
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const result = await env.ozmevsim_d1.prepare(`
          INSERT INTO hero_slides (
            title, subtitle, description, background_image, stats,
            primary_cta_text, primary_cta_href, secondary_cta_text, secondary_cta_href,
            is_active, sort_order, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          slideData.title,
          slideData.subtitle,
          slideData.description || "",
          slideData.backgroundImage || slideData.background_image || "",
          stats,
          slideData.primaryCTA?.text || slideData.primary_cta_text || "",
          slideData.primaryCTA?.href || slideData.primary_cta_href || "",
          slideData.secondaryCTA?.text || slideData.secondary_cta_text || "",
          slideData.secondaryCTA?.href || slideData.secondary_cta_href || "",
          slideData.isActive !== void 0 ? slideData.isActive ? 1 : 0 : 1,
          slideData.sort_order || 0,
          now,
          now
        ).run();
        console.log("\u2705 Hero slide saved to database with ID:", result.meta.last_row_id);
        return Response.json({
          success: true,
          message: "Hero slide added successfully to database",
          data: {
            id: result.meta.last_row_id,
            ...slideData,
            created_at: now
          }
        });
      } catch (error) {
        console.error("Database save error:", error);
      }
    }
    return Response.json({
      success: true,
      message: "Hero slide added successfully (no database)",
      data: {
        id: Date.now(),
        ...slideData
      }
    });
  } catch (error) {
    console.error("Hero slides POST error:", error);
    return Response.json({
      success: false,
      error: "Failed to add hero slide"
    }, { status: 500 });
  }
}
__name(onRequestPost5, "onRequestPost");
async function onRequestPut2(context) {
  try {
    const { env, request } = context;
    if (!env.ozmevsim_d1) {
      return Response.json({
        success: false,
        error: "Database not available"
      });
    }
    const slideData = await request.json();
    if (!slideData.id) {
      return Response.json({
        success: false,
        error: "Hero slide ID is required"
      });
    }
    const stats = Array.isArray(slideData.stats) ? JSON.stringify(slideData.stats) : slideData.stats || "[]";
    await env.ozmevsim_d1.prepare(`
      UPDATE hero_slides SET
        title = ?, subtitle = ?, description = ?, background_image = ?, stats = ?,
        primary_cta_text = ?, primary_cta_href = ?, secondary_cta_text = ?, secondary_cta_href = ?,
        is_active = ?, sort_order = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      slideData.title,
      slideData.subtitle,
      slideData.description || "",
      slideData.backgroundImage || slideData.background_image || "",
      stats,
      slideData.primaryCTA?.text || slideData.primary_cta_text || "",
      slideData.primaryCTA?.href || slideData.primary_cta_href || "",
      slideData.secondaryCTA?.text || slideData.secondary_cta_text || "",
      slideData.secondaryCTA?.href || slideData.secondary_cta_href || "",
      slideData.isActive !== void 0 ? slideData.isActive ? 1 : 0 : slideData.is_active !== void 0 ? slideData.is_active : 1,
      slideData.sort_order || 0,
      (/* @__PURE__ */ new Date()).toISOString(),
      slideData.id
    ).run();
    return Response.json({
      success: true,
      data: slideData
    });
  } catch (error) {
    console.error("Error updating hero slide:", error);
    return Response.json({
      success: false,
      error: "Failed to update hero slide"
    });
  }
}
__name(onRequestPut2, "onRequestPut");
async function onRequestDelete2(context) {
  try {
    const { env, request } = context;
    if (!env.ozmevsim_d1) {
      return Response.json({
        success: false,
        error: "Database not available"
      });
    }
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return Response.json({
        success: false,
        error: "Hero slide ID is required"
      });
    }
    await env.ozmevsim_d1.prepare(`
      DELETE FROM hero_slides WHERE id = ?
    `).bind(id).run();
    return Response.json({
      success: true,
      message: "Hero slide deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    return Response.json({
      success: false,
      error: "Failed to delete hero slide"
    });
  }
}
__name(onRequestDelete2, "onRequestDelete");

// r2-proxy.ts
var onRequestGet7 = /* @__PURE__ */ __name(async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400"
  };
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const filePath = url.searchParams.get("file");
    if (!filePath) {
      return new Response("File path is required", {
        status: 400,
        headers: corsHeaders
      });
    }
    if (!env.MEDIA_BUCKET) {
      console.error("MEDIA_BUCKET not found in environment");
      return new Response("R2 bucket not configured", {
        status: 500,
        headers: corsHeaders
      });
    }
    console.log("Attempting to get file:", filePath);
    const object = await env.MEDIA_BUCKET.get(filePath);
    if (!object) {
      console.log("File not found in R2:", filePath);
      return new Response("File not found", {
        status: 404,
        headers: corsHeaders
      });
    }
    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
    headers.set("Content-Length", object.size.toString());
    headers.set("Cache-Control", "public, max-age=31536000");
    if (object.httpEtag) {
      headers.set("ETag", object.httpEtag);
    }
    console.log("Successfully serving file:", filePath, "Size:", object.size);
    return new Response(object.body, { headers });
  } catch (error) {
    console.error("R2 Proxy error:", error);
    return new Response("Internal server error: " + error.message, {
      status: 500,
      headers: corsHeaders
    });
  }
}, "onRequestGet");
var onRequestOptions2 = /* @__PURE__ */ __name(async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400"
    }
  });
}, "onRequestOptions");

// settings.js
var defaultSettings = {
  site_name: "Ankara Do\u011Falgaz Tesisat\u0131 | Kombi Servisi | Klima - \xD6zmevsim",
  site_description: "Ankara'da do\u011Falgaz tesisat\u0131, kombi sat\u0131\u015F-servis ve klima sistemleri. 7/24 servis \u2713 Uygun fiyat \u2713 Garantili i\u015F\xE7ilik. \u260E 0312 357 0600",
  site_url: "https://ozmevsim.com",
  admin_email: "admin@ozmevsim.com",
  timezone: "Europe/Istanbul",
  language: "tr",
  date_format: "DD/MM/YYYY",
  contact_phone: "+90 312 357 0600",
  contact_email: "info@ozmevsim.com",
  address: "Ku\u015Fca\u011F\u0131z Mahallesi Sanatoryum Caddesi No:221/A Ke\xE7i\xF6ren, Ankara"
};
async function onRequestGet8(context) {
  try {
    const { env } = context;
    if (env.ozmevsim_d1 || env["ozmevsim-d1"]) {
      const DB = env.ozmevsim_d1 || env["ozmevsim-d1"];
      try {
        console.log("\u{1F504} Fetching site settings from D1 database...");
        const result = await DB.prepare(`
          SELECT key, value 
          FROM settings
        `).all();
        if (result.results && result.results.length > 0) {
          console.log("\u2705 Found site settings in database:", result.results.length);
          const settings = { ...defaultSettings };
          result.results.forEach((row) => {
            settings[row.key] = row.value;
          });
          return new Response(JSON.stringify({
            success: true,
            data: settings,
            source: "database"
          }), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          });
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    }
    console.log("\u{1F4C1} Using default site settings");
    return new Response(JSON.stringify({
      success: true,
      data: defaultSettings,
      source: "default"
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Settings API error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch settings"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(onRequestGet8, "onRequestGet");
async function onRequestPost6(context) {
  try {
    const { env, request } = context;
    const data = await request.json();
    const DB = env.ozmevsim_d1 || env["ozmevsim-d1"];
    if (!DB) {
      return new Response(JSON.stringify({
        success: false,
        error: "Database not available"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    try {
      console.log("\u{1F4BE} Saving site settings to D1 database...");
      await DB.prepare(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string" || typeof value === "boolean") {
          await DB.prepare(`
            INSERT OR REPLACE INTO settings (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
          `).bind(key, String(value)).run();
          console.log(`\u2705 Saved setting: ${key} = ${value}`);
        }
      }
      console.log("\u2705 Site settings saved to database");
      return new Response(JSON.stringify({
        success: true,
        message: "Settings saved successfully",
        data
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (dbError) {
      console.error("Database save error:", dbError);
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to save settings"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("Settings POST error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to save settings"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(onRequestPost6, "onRequestPost");
async function onRequestOptions3(context) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
__name(onRequestOptions3, "onRequestOptions");

// team.js
var defaultTeam2 = [
  {
    id: 1,
    name: "Mehmet \xD6zkan",
    position: "Kurucu & Genel M\xFCd\xFCr",
    description: "Ankara'da 25 y\u0131ll\u0131k deneyimi olan \u0131s\u0131tma sistemleri uzman\u0131. \xD6z Mevsim'i kurarak sekt\xF6rde g\xFCvenilir bir marka haline getirdi.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&face",
    email: "mehmet@ozmevsim.com",
    phone: "+90 312 357 0600",
    specialties: ["Proje Y\xF6netimi", "\u0130\u015F Geli\u015Ftirme", "M\xFC\u015Fteri \u0130li\u015Fkileri"],
    experience: "25+ Y\u0131l",
    status: "active",
    featured: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Ahmet Demir",
    position: "Teknik M\xFCd\xFCr",
    description: "Makine m\xFChendisi. Kombi, klima ve do\u011Falgaz tesisat\u0131 konular\u0131nda 20+ y\u0131l deneyimi olan teknik ekip lideri.",
    image: "https://images.unsplash.com/photo-1559548331-f9cb98001426?w=400&h=400&fit=crop&face",
    email: "ahmet@ozmevsim.com",
    phone: "+90 312 357 0601",
    specialties: ["Kombi Sistemleri", "Klima Teknolojileri", "Do\u011Falgaz Tesisat\u0131"],
    experience: "20+ Y\u0131l",
    status: "active",
    featured: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Fatma Kaya",
    position: "Montaj Ekip Lideri",
    description: "Saha deneyimi olan montaj uzman\u0131. T\xFCm marka kombi ve klima sistemlerinin kurulumu konusunda sertifikal\u0131.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&face",
    email: "fatma@ozmevsim.com",
    phone: "+90 312 357 0602",
    specialties: ["Kombi Montaj\u0131", "Klima Kurulumu", "Sistem Testleri"],
    experience: "15+ Y\u0131l",
    status: "active",
    featured: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "\xD6zlem \xC7elik",
    position: "M\xFC\u015Fteri Hizmetleri Uzman\u0131",
    description: "M\xFC\u015Fteri memnuniyeti odakl\u0131 \xE7al\u0131\u015Fan deneyimli m\xFC\u015Fteri hizmetleri uzman\u0131. 7/24 destek sa\u011Flar.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&face",
    email: "ozlem@ozmevsim.com",
    phone: "+90 312 357 0603",
    specialties: ["M\xFC\u015Fteri \u0130li\u015Fkileri", "Teknik Destek", "Randevu Y\xF6netimi"],
    experience: "8+ Y\u0131l",
    status: "active",
    featured: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Serkan Y\u0131lmaz",
    position: "Servis Teknisyeni",
    description: "T\xFCm marka kombi ve klima sistemlerinin bak\u0131m ve onar\u0131m\u0131 konusunda sertifikal\u0131 teknisyen.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&face",
    email: "serkan@ozmevsim.com",
    phone: "+90 312 357 0604",
    specialties: ["Bak\u0131m & Onar\u0131m", "Ar\u0131za Tespiti", "Yedek Par\xE7a"],
    experience: "12+ Y\u0131l",
    status: "active",
    featured: false,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];
async function onRequestGet9(context) {
  try {
    const { request } = context;
    const url = new URL(request.url);
    const featured = url.searchParams.get("featured");
    const position = url.searchParams.get("position");
    const status = url.searchParams.get("status") || "active";
    let filteredTeam = defaultTeam2;
    if (status) {
      filteredTeam = filteredTeam.filter((member) => member.status === status);
    }
    if (featured === "true") {
      filteredTeam = filteredTeam.filter((member) => member.featured);
    }
    if (position && position !== "all") {
      filteredTeam = filteredTeam.filter(
        (member) => member.position.toLowerCase().includes(position.toLowerCase())
      );
    }
    return Response.json({
      success: true,
      data: filteredTeam,
      count: filteredTeam.length
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return Response.json(
      { success: false, error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
__name(onRequestGet9, "onRequestGet");
async function onRequestPost7(context) {
  try {
    return Response.json({
      success: true,
      message: "Team member creation endpoint - functionality to be implemented"
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    return Response.json(
      { success: false, error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
__name(onRequestPost7, "onRequestPost");
async function onRequestPut3(context) {
  try {
    return Response.json({
      success: true,
      message: "Team member update endpoint - functionality to be implemented"
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    return Response.json(
      { success: false, error: "Failed to update team member" },
      { status: 500 }
    );
  }
}
__name(onRequestPut3, "onRequestPut");
async function onRequestDelete3(context) {
  try {
    return Response.json({
      success: true,
      message: "Team member deletion endpoint - functionality to be implemented"
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return Response.json(
      { success: false, error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
__name(onRequestDelete3, "onRequestDelete");

// upload-r2.ts
var onRequestPost8 = /* @__PURE__ */ __name(async (context) => {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const files = formData.getAll("files");
    const folder = formData.get("folder") || "general";
    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No files provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const uploadedFilesData = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `File ${file.name} is too large. Maximum size is 10MB.`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const fileExtension = file.name.split(".").pop();
      const uniqueFilename = `${folder}/${timestamp}-${randomId}.${fileExtension}`;
      await env.MEDIA_BUCKET.put(uniqueFilename, file.stream(), {
        httpMetadata: {
          contentType: file.type
        }
      });
      const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document";
      const uploadedFile = {
        id: `${timestamp}-${randomId}`,
        name: uniqueFilename,
        originalName: file.name,
        type: fileType,
        mimeType: file.type,
        size: file.size,
        url: `/api/r2-proxy?file=${encodeURIComponent(uniqueFilename)}`,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (fileType === "image") {
        uploadedFile.thumbnail = uploadedFile.url;
        uploadedFile.dimensions = { width: 800, height: 600 };
      }
      uploadedFilesData.push(uploadedFile);
    }
    return new Response(
      JSON.stringify({
        success: true,
        data: uploadedFilesData,
        message: `${uploadedFilesData.length} file(s) uploaded successfully to R2`
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("R2 Upload error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to upload files to R2" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestPost");
var onRequestGet10 = /* @__PURE__ */ __name(async (context) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const folder = url.searchParams.get("folder");
    const objects = await env.MEDIA_BUCKET.list({
      prefix: folder || void 0,
      limit: 100
    });
    const files = objects.objects.map((obj) => {
      const fileType = obj.httpMetadata?.contentType?.startsWith("image/") ? "image" : obj.httpMetadata?.contentType?.startsWith("video/") ? "video" : "document";
      const file = {
        id: obj.key.split("/").pop()?.split(".")[0] || obj.key,
        name: obj.key,
        originalName: obj.key.split("/").pop() || obj.key,
        type: fileType,
        mimeType: obj.httpMetadata?.contentType || "application/octet-stream",
        size: obj.size,
        url: `/api/r2-proxy?file=${encodeURIComponent(obj.key)}`,
        uploadedAt: obj.uploaded.toISOString()
      };
      if (fileType === "image") {
        file.thumbnail = file.url;
      }
      return file;
    });
    const filteredFiles = type ? files.filter((f) => f.type === type) : files;
    return new Response(
      JSON.stringify({
        success: true,
        data: filteredFiles,
        total: filteredFiles.length,
        message: `Found ${filteredFiles.length} files in R2 bucket`
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("R2 List error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch files from R2" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestGet");

// blog.js
async function onRequest11(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "GET") {
      try {
        const category = url.searchParams.get("category");
        const status = url.searchParams.get("status") || "published";
        const featured = url.searchParams.get("featured");
        let query = "SELECT * FROM blog_posts WHERE status = ?";
        let params = [status];
        if (category && category !== "all") {
          query += " AND category = ?";
          params.push(category);
        }
        if (featured === "true") {
          query += " AND featured = 1";
        }
        query += " ORDER BY created_at DESC";
        const stmt = env.ozmevsim_d1.prepare(query);
        const { results } = await stmt.bind(...params).all();
        const processedPosts = results.map((post) => ({
          ...post,
          tags: typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags || [],
          featured: Boolean(post.featured)
        }));
        return new Response(JSON.stringify({
          success: true,
          data: processedPosts,
          total: processedPosts.length
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      } catch (dbError) {
        console.log("D1 not available, using static data:", dbError);
        const blogPosts = [
          {
            id: "1",
            title: "K\u0131\u015F Aylar\u0131nda Kombi Verimlili\u011Fini Art\u0131rman\u0131n 10 Yolu",
            slug: "kis-aylarinda-kombi-verimliligini-artirmanin-10-yolu",
            excerpt: "So\u011Fuk k\u0131\u015F aylar\u0131nda enerji faturalar\u0131n\u0131z\u0131 d\xFC\u015F\xFCr\xFCrken evinizi s\u0131cak tutman\u0131n pratik yollar\u0131n\u0131 ke\u015Ffedin.",
            content: "K\u0131\u015F aylar\u0131nda artan do\u011Falgaz faturalar\u0131 ailelerin en b\xFCy\xFCk endi\u015Felerinden biri. \u0130\u015Fte kombi verimlili\u011Finizi art\u0131rarak hem tasarruf edebilece\u011Finiz hem de \xE7evreyi koruyabilece\u011Finiz 10 etkili y\xF6ntem...",
            category: "tips",
            author: "Murat \xD6zkan",
            authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            publishDate: "2024-03-15",
            readTime: 8,
            views: 1250,
            tags: ["enerji tasarrufu", "kombi", "k\u0131\u015F bak\u0131m\u0131", "verimlilik"],
            featuredImage: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&h=400&fit=crop",
            featured: true,
            status: "published",
            createdAt: "2024-03-15T10:00:00Z",
            updatedAt: "2024-03-15T10:00:00Z"
          },
          {
            id: "2",
            title: "Yeni Nesil Ak\u0131ll\u0131 Termostat Teknolojileri",
            slug: "yeni-nesil-akilli-termostat-teknolojileri",
            excerpt: "IoT destekli ak\u0131ll\u0131 termostatlarla evinizin \u0131s\u0131tma sistemini nas\u0131l optimize edebilece\u011Finizi \xF6\u011Frenin.",
            content: "Teknolojinin h\u0131zla geli\u015Fmesiyle birlikte ev \u0131s\u0131tma sistemleri de ak\u0131llan\u0131yor. Yeni nesil ak\u0131ll\u0131 termostatlar...",
            category: "technology",
            author: "Ay\u015Fe Demir",
            authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            publishDate: "2024-03-12",
            readTime: 6,
            views: 890,
            tags: ["ak\u0131ll\u0131 sistem", "termostat", "IoT", "teknoloji"],
            featuredImage: "https://images.unsplash.com/photo-1558618666-fbd25c85cd64?w=600&h=400&fit=crop",
            featured: false,
            status: "published",
            createdAt: "2024-03-12T10:00:00Z",
            updatedAt: "2024-03-12T10:00:00Z"
          }
        ];
        const category = url.searchParams.get("category");
        const status = url.searchParams.get("status");
        const featured = url.searchParams.get("featured");
        let filteredPosts = [...blogPosts];
        if (category && category !== "all") {
          filteredPosts = filteredPosts.filter((post) => post.category === category);
        }
        if (status && status !== "all") {
          filteredPosts = filteredPosts.filter((post) => post.status === status);
        }
        if (featured === "true") {
          filteredPosts = filteredPosts.filter((post) => post.featured);
        }
        return new Response(JSON.stringify({
          success: true,
          data: filteredPosts,
          total: filteredPosts.length
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
    } else if (request.method === "POST") {
      const body = await request.json();
      const {
        title,
        slug,
        excerpt,
        content,
        category,
        author,
        publishDate,
        readTime,
        tags,
        featuredImage,
        featured,
        status
      } = body;
      if (!title || !content) {
        return new Response(JSON.stringify({
          error: "Title and content are required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9ğüşıöç\s]/gi, "").replace(/\s+/g, "-").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c");
      const stmt = env.ozmevsim_d1.prepare(`
        INSERT INTO blog_posts (
          title, slug, excerpt, content, category, author, 
          publish_date, read_time, tags, featured_image, 
          featured, status, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);
      const result = await stmt.bind(
        title,
        postSlug,
        excerpt || "",
        content,
        category || "general",
        author || "Admin",
        publishDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        readTime || 5,
        JSON.stringify(tags || []),
        featuredImage || "",
        featured ? 1 : 0,
        status || "published"
      ).run();
      if (!result.success) {
        throw new Error("Failed to create blog post");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Blog post created successfully",
        id: result.meta.last_row_id
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else if (request.method === "PUT") {
      const body = await request.json();
      const {
        id,
        title,
        slug,
        excerpt,
        content,
        category,
        author,
        publishDate,
        readTime,
        tags,
        featuredImage,
        featured,
        status
      } = body;
      if (!id) {
        return new Response(JSON.stringify({
          error: "Blog post ID is required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const stmt = env.ozmevsim_d1.prepare(`
        UPDATE blog_posts 
        SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, 
            author = ?, publish_date = ?, read_time = ?, tags = ?, 
            featured_image = ?, featured = ?, status = ?, updated_at = datetime('now')
        WHERE id = ?
      `);
      const result = await stmt.bind(
        title,
        slug,
        excerpt || "",
        content,
        category || "general",
        author || "Admin",
        publishDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        readTime || 5,
        JSON.stringify(tags || []),
        featuredImage || "",
        featured ? 1 : 0,
        status || "published",
        id
      ).run();
      if (!result.success) {
        throw new Error("Failed to update blog post");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Blog post updated successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else if (request.method === "DELETE") {
      const body = await request.json();
      const { id } = body;
      if (!id) {
        return new Response(JSON.stringify({
          error: "Blog post ID is required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const stmt = env.ozmevsim_d1.prepare("DELETE FROM blog_posts WHERE id = ?");
      const result = await stmt.bind(id).run();
      if (!result.success) {
        throw new Error("Failed to delete blog post");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Blog post deleted successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: "Method not allowed"
      }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
  } catch (error) {
    console.error("Blog API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest11, "onRequest");

// brands.js
async function onRequest12(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "GET") {
      const { results } = await env.ozmevsim_d1.prepare(`
        SELECT id, name, logo_url, alt_text, website_url, is_active, sort_order 
        FROM brands 
        WHERE is_active = 1 
        ORDER BY sort_order ASC
      `).all();
      return new Response(JSON.stringify({
        success: true,
        data: results,
        count: results.length,
        source: "database"
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    if (request.method === "POST") {
      const data = await request.json();
      const { results } = await env.ozmevsim_d1.prepare(`
        INSERT INTO brands (name, logo_url, alt_text, website_url, is_active, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        data.name,
        data.logo_url,
        data.alt_text || `${data.name} Logo`,
        data.website_url || "",
        data.is_active !== void 0 ? data.is_active : 1,
        data.sort_order || 0
      ).run();
      return new Response(JSON.stringify({
        success: true,
        data: { id: results.meta.last_row_id },
        message: "Brand added successfully"
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    if (request.method === "PUT") {
      const data = await request.json();
      const brandId = url.pathname.split("/").pop();
      await env.ozmevsim_d1.prepare(`
        UPDATE brands 
        SET name = ?, logo_url = ?, alt_text = ?, website_url = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        data.name,
        data.logo_url,
        data.alt_text,
        data.website_url,
        data.is_active,
        data.sort_order,
        brandId
      ).run();
      return new Response(JSON.stringify({
        success: true,
        message: "Brand updated successfully"
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    if (request.method === "DELETE") {
      const brandId = url.pathname.split("/").pop();
      await env.ozmevsim_d1.prepare(`
        DELETE FROM brands WHERE id = ?
      `).bind(brandId).run();
      return new Response(JSON.stringify({
        success: true,
        message: "Brand deleted successfully"
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Brands API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Internal server error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest12, "onRequest");

// contact.js
async function onRequest13(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (!env.ozmevsim_d1) {
      throw new Error("Database not available");
    }
    if (request.method === "GET") {
      const status = url.searchParams.get("status");
      let query = "SELECT * FROM contact_messages";
      let params = [];
      if (status && status !== "all") {
        query += " WHERE status = ?";
        params.push(status);
      }
      query += " ORDER BY created_at DESC";
      const stmt = env.ozmevsim_d1.prepare(query);
      const result = await stmt.bind(...params).all();
      return new Response(JSON.stringify({
        success: true,
        data: result.results || []
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    if (request.method === "POST") {
      const body = await request.json();
      const { name, email, phone, subject, message } = body;
      if (!name || !email || !message) {
        return new Response(JSON.stringify({
          success: false,
          error: "Name, email and message are required"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid email format"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      const stmt = env.ozmevsim_d1.prepare(`
        INSERT INTO contact_messages (name, email, phone, subject, message, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = await stmt.bind(
        name,
        email,
        phone || "",
        subject || "",
        message,
        "unread"
      ).run();
      if (!result.success) {
        throw new Error("Failed to save contact message");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Mesaj\u0131n\u0131z ba\u015Far\u0131yla g\xF6nderildi. En k\u0131sa s\xFCrede size d\xF6n\xFC\u015F yapaca\u011F\u0131z.",
        data: {
          id: result.meta.last_row_id,
          submittedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Contact API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error: " + error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest13, "onRequest");

// data-kv.js
async function onRequest14(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const key = url.searchParams.get("key");
    if (request.method === "GET") {
      if (!key) {
        return new Response(JSON.stringify({
          success: false,
          error: "Key parameter required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const data = await env.SITE_DATA.get(key);
      return new Response(JSON.stringify({
        success: true,
        data: data ? JSON.parse(data) : null
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (request.method === "PUT" || request.method === "POST") {
      if (!key) {
        return new Response(JSON.stringify({
          success: false,
          error: "Key parameter required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const body = await request.json();
      await env.SITE_DATA.put(key, JSON.stringify({
        ...body,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      }));
      return new Response(JSON.stringify({
        success: true,
        message: "Data saved successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (request.method === "DELETE") {
      if (!key) {
        return new Response(JSON.stringify({
          success: false,
          error: "Key parameter required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      await env.SITE_DATA.delete(key);
      return new Response(JSON.stringify({
        success: true,
        message: "Data deleted successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
__name(onRequest14, "onRequest");

// faq.js
var faqData2 = [
  {
    id: "1",
    question: "Kombi montaj\u0131 ne kadar s\xFCrer?",
    answer: "Standart kombi montaj\u0131 genellikle 4-6 saat aras\u0131nda tamamlan\u0131r. Mevcut tesisat\u0131n durumuna g\xF6re bu s\xFCre de\u011Fi\u015Febilir.",
    category: "montaj",
    order: 1,
    isActive: true
  },
  {
    id: "2",
    question: "Kombi bak\u0131m\u0131 ne s\u0131kl\u0131kla yap\u0131lmal\u0131?",
    answer: "Kombiler y\u0131lda en az bir kez profesyonel bak\u0131m g\xF6rmelidir. Yo\u011Fun kullan\u0131m durumunda 6 ayda bir bak\u0131m \xF6nerilir.",
    category: "bakim",
    order: 2,
    isActive: true
  },
  {
    id: "3",
    question: "Hangi kombi markas\u0131n\u0131 tercih etmeliyim?",
    answer: "Vaillant, Buderus, Baymak gibi kaliteli markalar \xF6nerilir. Evinizin b\xFCy\xFCkl\xFC\u011F\xFC ve ihtiya\xE7lar\u0131n\u0131za g\xF6re se\xE7im yap\u0131lmal\u0131d\u0131r.",
    category: "urun",
    order: 3,
    isActive: true
  }
];
async function onRequest15(context) {
  const { request } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "GET") {
      const category = url.searchParams.get("category");
      let filteredFaqs = [...faqData2];
      if (category && category !== "all") {
        filteredFaqs = filteredFaqs.filter((faq) => faq.category === category);
      }
      filteredFaqs = filteredFaqs.filter((faq) => faq.isActive);
      filteredFaqs.sort((a, b) => a.order - b.order);
      return new Response(JSON.stringify({
        success: true,
        data: filteredFaqs,
        total: filteredFaqs.length
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest15, "onRequest");

// media.js
var mediaFiles2 = [
  {
    id: "1",
    name: "vaillant-ecotec.jpg",
    originalName: "vaillant-ecotec.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 245760,
    url: "/uploads/products/vaillant-ecotec.jpg",
    thumbnail: "/uploads/products/vaillant-ecotec.jpg",
    alt: "Vaillant EcoTec Kombi Modeli",
    caption: "Y\xFCksek verimli Vaillant EcoTec kombi",
    folder: "products",
    uploadedAt: "2024-03-15T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "2",
    name: "ariston-kombi.jpg",
    originalName: "ariston-kombi.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 198432,
    url: "/uploads/products/ariston-kombi.jpg",
    thumbnail: "/uploads/products/ariston-kombi.jpg",
    alt: "Ariston Kombi Modeli",
    caption: "Ekonomik Ariston kombi serisi",
    folder: "products",
    uploadedAt: "2024-03-14T15:30:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "3",
    name: "daikin-altherma.jpg",
    originalName: "daikin-altherma.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 312576,
    url: "/uploads/products/daikin-altherma.jpg",
    thumbnail: "/uploads/products/daikin-altherma.jpg",
    alt: "Daikin Altherma Is\u0131 Pompas\u0131",
    caption: "Inverter teknolojili Daikin Altherma",
    folder: "products",
    uploadedAt: "2024-03-13T09:15:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "4",
    name: "mitsubishi-msz.jpg",
    originalName: "mitsubishi-msz.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 287104,
    url: "/uploads/products/mitsubishi-msz.jpg",
    thumbnail: "/uploads/products/mitsubishi-msz.jpg",
    alt: "Mitsubishi MSZ Klima Modeli",
    caption: "Sessiz \xE7al\u0131\u015Fan Mitsubishi MSZ klima",
    folder: "products",
    uploadedAt: "2024-03-12T14:20:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "5",
    name: "baymak-lunatec.jpg",
    originalName: "baymak-lunatec.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 234880,
    url: "/uploads/products/baymak-lunatec.jpg",
    thumbnail: "/uploads/products/baymak-lunatec.jpg",
    alt: "Baymak Lunatec Kombi Modeli",
    caption: "Yerli \xFCretim Baymak Lunatec kombi",
    folder: "products",
    uploadedAt: "2024-03-11T11:45:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "6",
    name: "purmo-radiator.jpg",
    originalName: "purmo-radiator.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 156672,
    url: "/uploads/products/purmo-radiator.jpg",
    thumbnail: "/uploads/products/purmo-radiator.jpg",
    alt: "Purmo Panel Radyat\xF6r",
    caption: "Panel radyat\xF6r Purmo serisi",
    folder: "products",
    uploadedAt: "2024-03-10T16:30:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "7",
    name: "buderus-gb122i2.jpg",
    originalName: "buderus-gb122i2.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 298752,
    url: "/uploads/products/buderus-gb122i2.jpg",
    thumbnail: "/uploads/products/buderus-gb122i2.jpg",
    alt: "Buderus GB122i2 Kombi Modeli",
    caption: "Alman teknolojisi Buderus GB122i2 kombi",
    folder: "products",
    uploadedAt: "2024-03-09T13:15:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "8",
    name: "bosch-kombi.jpg",
    originalName: "bosch-kombi.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 189440,
    url: "/uploads/products/bosch-kombi.jpg",
    thumbnail: "/uploads/products/bosch-kombi.jpg",
    alt: "Bosch Kombi Modeli",
    caption: "G\xFCvenilir Bosch kombi",
    folder: "products",
    uploadedAt: "2024-03-08T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "9",
    name: "baymak-elegant.jpg",
    originalName: "baymak-elegant.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 234880,
    url: "/uploads/products/baymak-elegant.jpg",
    thumbnail: "/uploads/products/baymak-elegant.jpg",
    alt: "Baymak Elegant Kombi",
    caption: "\u015E\u0131k tasar\u0131m Baymak Elegant kombi",
    folder: "products",
    uploadedAt: "2024-03-07T12:30:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  {
    id: "10",
    name: "baymak-duotec.jpg",
    originalName: "baymak-duotec.jpg",
    type: "image",
    mimeType: "image/jpeg",
    size: 287104,
    url: "/uploads/products/baymak-duotec.jpg",
    thumbnail: "/uploads/products/baymak-duotec.jpg",
    alt: "Baymak Duotec Kombi",
    caption: "\xC7ift fonksiyonlu Baymak Duotec kombi",
    folder: "products",
    uploadedAt: "2024-03-06T09:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 800, height: 600 }
  },
  // NEW BRAND LOGOS
  {
    id: "11",
    name: "bosch-logo.png",
    originalName: "bosch-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 110305,
    url: "/uploads/brands/bosch-logo.png",
    thumbnail: "/uploads/brands/bosch-logo.png",
    alt: "Bosch Logo",
    caption: "Bosch marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  {
    id: "12",
    name: "vaillant-logo.png",
    originalName: "vaillant-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 66697,
    url: "/uploads/brands/vaillant-logo.png",
    thumbnail: "/uploads/brands/vaillant-logo.png",
    alt: "Vaillant Logo",
    caption: "Vaillant marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  {
    id: "13",
    name: "buderus-logo.png",
    originalName: "buderus-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 117922,
    url: "/uploads/brands/buderus-logo.png",
    thumbnail: "/uploads/brands/buderus-logo.png",
    alt: "Buderus Logo",
    caption: "Buderus marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  {
    id: "14",
    name: "baymak-logo.png",
    originalName: "baymak-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 25e3,
    url: "/uploads/brands/baymak-logo.png",
    thumbnail: "/uploads/brands/baymak-logo.png",
    alt: "Baymak Logo",
    caption: "Baymak marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  {
    id: "15",
    name: "demirdokum-logo.png",
    originalName: "demirdokum-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 2091,
    url: "/uploads/brands/demirdokum-logo.png",
    thumbnail: "/uploads/brands/demirdokum-logo.png",
    alt: "DemirD\xF6k\xFCm Logo",
    caption: "DemirD\xF6k\xFCm marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  {
    id: "16",
    name: "eca-logo.png",
    originalName: "eca-logo.png",
    type: "image",
    mimeType: "image/png",
    size: 141045,
    url: "/uploads/brands/eca-logo.png",
    thumbnail: "/uploads/brands/eca-logo.png",
    alt: "ECA Logo",
    caption: "ECA marka logosu",
    folder: "brands",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 200, height: 100 }
  },
  // NEW PRODUCT IMAGES
  {
    id: "17",
    name: "bosch-condens-8300iw.png",
    originalName: "bosch-condens-8300iw.png",
    type: "image",
    mimeType: "image/png",
    size: 89893,
    url: "/uploads/products/bosch/bosch-condens-8300iw.png",
    thumbnail: "/uploads/products/bosch/bosch-condens-8300iw.png",
    alt: "Bosch Condens 8300iW Kombi",
    caption: "Bosch Condens 8300iW yo\u011Fu\u015Fmal\u0131 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 480, height: 480 }
  },
  {
    id: "18",
    name: "bosch-tronic-8500i.png",
    originalName: "bosch-tronic-8500i.png",
    type: "image",
    mimeType: "image/png",
    size: 89893,
    url: "/uploads/products/bosch/bosch-tronic-8500i.png",
    thumbnail: "/uploads/products/bosch/bosch-tronic-8500i.png",
    alt: "Bosch Tronic 8500i Elektrikli Su Is\u0131t\u0131c\u0131s\u0131",
    caption: "Bosch Tronic 8500i anl\u0131k elektrikli su \u0131s\u0131t\u0131c\u0131s\u0131",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 480, height: 480 }
  },
  {
    id: "19",
    name: "vaillant-ecotec-exclusive.png",
    originalName: "vaillant-ecotec-exclusive.png",
    type: "image",
    mimeType: "image/png",
    size: 173408,
    url: "/uploads/products/vaillant/vaillant-ecotec-exclusive.png",
    thumbnail: "/uploads/products/vaillant/vaillant-ecotec-exclusive.png",
    alt: "Vaillant ecoTEC Exclusive Kombi",
    caption: "Vaillant ecoTEC Exclusive premium kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 1e3, height: 800 }
  },
  {
    id: "20",
    name: "vaillant-ecotec-plus.png",
    originalName: "vaillant-ecotec-plus.png",
    type: "image",
    mimeType: "image/png",
    size: 513838,
    url: "/uploads/products/vaillant/vaillant-ecotec-plus.png",
    thumbnail: "/uploads/products/vaillant/vaillant-ecotec-plus.png",
    alt: "Vaillant ecoTEC Plus Kombi",
    caption: "Vaillant ecoTEC Plus yo\u011Fu\u015Fmal\u0131 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 1e3, height: 800 }
  },
  {
    id: "21",
    name: "buderus-logatherm-wlw186i.png",
    originalName: "buderus-logatherm-wlw186i.png",
    type: "image",
    mimeType: "image/png",
    size: 135026,
    url: "/uploads/products/buderus/buderus-logatherm-wlw186i.png",
    thumbnail: "/uploads/products/buderus/buderus-logatherm-wlw186i.png",
    alt: "Buderus Logatherm WLW186i Is\u0131 Pompas\u0131",
    caption: "Buderus Logatherm WLW186i AR \u0131s\u0131 pompas\u0131",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 420, height: 336 }
  },
  {
    id: "22",
    name: "buderus-logano-plus.png",
    originalName: "buderus-logano-plus.png",
    type: "image",
    mimeType: "image/png",
    size: 135026,
    url: "/uploads/products/buderus/buderus-logano-plus.png",
    thumbnail: "/uploads/products/buderus/buderus-logano-plus.png",
    alt: "Buderus Logano Plus Kombi",
    caption: "Buderus Logano Plus GB125 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 420, height: 336 }
  },
  {
    id: "23",
    name: "baymak-lunatec-kombi.png",
    originalName: "baymak-lunatec-kombi.png",
    type: "image",
    mimeType: "image/png",
    size: 5e4,
    url: "/uploads/products/baymak/baymak-lunatec-kombi.png",
    thumbnail: "/uploads/products/baymak/baymak-lunatec-kombi.png",
    alt: "Baymak Lunatec Kombi",
    caption: "Baymak Lunatec tam yo\u011Fu\u015Fmal\u0131 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 400, height: 400 }
  },
  {
    id: "24",
    name: "baymak-elegant-plus-klima.png",
    originalName: "baymak-elegant-plus-klima.png",
    type: "image",
    mimeType: "image/png",
    size: 5e4,
    url: "/uploads/products/baymak/baymak-elegant-plus-klima.png",
    thumbnail: "/uploads/products/baymak/baymak-elegant-plus-klima.png",
    alt: "Baymak Elegant Plus Klima",
    caption: "Baymak Elegant Plus duvar tipi split klima",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 400, height: 400 }
  },
  {
    id: "25",
    name: "demirdokum-nitromix-kombi.png",
    originalName: "demirdokum-nitromix-kombi.png",
    type: "image",
    mimeType: "image/png",
    size: 12579,
    url: "/uploads/products/demirdokum/demirdokum-nitromix-kombi.png",
    thumbnail: "/uploads/products/demirdokum/demirdokum-nitromix-kombi.png",
    alt: "DemirD\xF6k\xFCm Nitromix Kombi",
    caption: "DemirD\xF6k\xFCm Nitromix ioni yo\u011Fu\u015Fmal\u0131 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 300, height: 400 }
  },
  {
    id: "26",
    name: "eca-confeo-kombi.png",
    originalName: "eca-confeo-kombi.png",
    type: "image",
    mimeType: "image/png",
    size: 141186,
    url: "/uploads/products/eca/eca-confeo-kombi.png",
    thumbnail: "/uploads/products/eca/eca-confeo-kombi.png",
    alt: "ECA Confeo Kombi",
    caption: "ECA Confeo premix yo\u011Fu\u015Fmal\u0131 kombi",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 400, height: 500 }
  },
  {
    id: "27",
    name: "eca-mixer-banyo.png",
    originalName: "eca-mixer-banyo.png",
    type: "image",
    mimeType: "image/png",
    size: 141186,
    url: "/uploads/products/eca/eca-mixer-banyo.png",
    thumbnail: "/uploads/products/eca/eca-mixer-banyo.png",
    alt: "ECA Banyo Bataryas\u0131",
    caption: "ECA banyo lavabo bataryas\u0131",
    folder: "products",
    uploadedAt: "2024-06-16T10:00:00Z",
    uploadedBy: "Admin",
    dimensions: { width: 400, height: 500 }
  }
];
function getValidMediaFiles2() {
  const validFileNames = [
    "vaillant-ecotec.jpg",
    "ariston-kombi.jpg",
    "daikin-altherma.jpg",
    "mitsubishi-msz.jpg",
    "baymak-lunatec.jpg",
    "purmo-radiator.jpg",
    "buderus-gb122i2.jpg",
    "bosch-kombi.jpg",
    "baymak-elegant.jpg",
    "baymak-duotec.jpg",
    // Brand logos
    "bosch-logo.png",
    "vaillant-logo.png",
    "buderus-logo.png",
    "baymak-logo.png",
    "demirdokum-logo.png",
    "eca-logo.png",
    // New product images
    "bosch-condens-8300iw.png",
    "bosch-tronic-8500i.png",
    "vaillant-ecotec-exclusive.png",
    "vaillant-ecotec-plus.png",
    "buderus-logatherm-wlw186i.png",
    "buderus-logano-plus.png",
    "baymak-lunatec-kombi.png",
    "baymak-elegant-plus-klima.png",
    "demirdokum-nitromix-kombi.png",
    "eca-confeo-kombi.png",
    "eca-mixer-banyo.png"
  ];
  const validFiles = mediaFiles2.filter((file) => {
    return validFileNames.includes(file.name);
  });
  return validFiles;
}
__name(getValidMediaFiles2, "getValidMediaFiles");
async function onRequest16(context) {
  const { request } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "GET") {
      const type = url.searchParams.get("type");
      const folder = url.searchParams.get("folder");
      const search = url.searchParams.get("search");
      const limit = parseInt(url.searchParams.get("limit")) || 50;
      let filteredFiles = getValidMediaFiles2();
      if (type && type !== "all") {
        filteredFiles = filteredFiles.filter((file) => file.type === type);
      }
      if (folder && folder !== "all") {
        filteredFiles = filteredFiles.filter((file) => file.folder === folder);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        filteredFiles = filteredFiles.filter(
          (file) => file.name.toLowerCase().includes(searchLower) || file.originalName.toLowerCase().includes(searchLower) || file.alt && file.alt.toLowerCase().includes(searchLower) || file.caption && file.caption.toLowerCase().includes(searchLower)
        );
      }
      filteredFiles = filteredFiles.slice(0, limit);
      const allValidFiles = getValidMediaFiles2();
      const stats = {
        total: allValidFiles.length,
        images: allValidFiles.filter((f) => f.type === "image").length,
        videos: allValidFiles.filter((f) => f.type === "video").length,
        documents: allValidFiles.filter((f) => f.type === "document").length
      };
      return new Response(JSON.stringify({
        success: true,
        data: filteredFiles,
        stats,
        total: filteredFiles.length
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    if (request.method === "POST") {
      const body = await request.json();
      if (body.action === "add") {
        return new Response(JSON.stringify({
          success: true,
          message: "Demo modunda dosyalar eklenmez",
          data: getValidMediaFiles2()
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid action"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    if (request.method === "PUT") {
      const body = await request.json();
      const { id, alt, caption, folder } = body;
      const fileIndex = mediaFiles2.findIndex((f) => f.id === id);
      if (fileIndex === -1) {
        return new Response(JSON.stringify({
          success: false,
          error: "Dosya bulunamad\u0131"
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      mediaFiles2[fileIndex] = {
        ...mediaFiles2[fileIndex],
        alt: alt || mediaFiles2[fileIndex].alt,
        caption: caption || mediaFiles2[fileIndex].caption,
        folder: folder || mediaFiles2[fileIndex].folder
      };
      return new Response(JSON.stringify({
        success: true,
        message: "Dosya bilgileri g\xFCncellendi",
        data: mediaFiles2[fileIndex]
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    if (request.method === "DELETE") {
      const body = await request.json();
      const { ids } = body;
      if (!Array.isArray(ids)) {
        return new Response(JSON.stringify({
          success: false,
          error: "Ge\xE7ersiz dosya ID listesi"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      const deletedCount = mediaFiles2.length;
      mediaFiles2 = mediaFiles2.filter((file) => !ids.includes(file.id));
      const actualDeletedCount = deletedCount - mediaFiles2.length;
      return new Response(JSON.stringify({
        success: true,
        message: `${actualDeletedCount} dosya silindi`,
        deletedCount: actualDeletedCount
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error: " + error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest16, "onRequest");

// products.js
async function onRequest17(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const url = new URL(request.url);
    const method = request.method;
    if (method === "GET") {
      const status = url.searchParams.get("status") || "active";
      const stmt = env.ozmevsim_d1.prepare(
        "SELECT * FROM products WHERE status = ? ORDER BY created_at DESC"
      );
      const { results } = await stmt.bind(status).all();
      const processedProducts = results.map((product) => ({
        ...product,
        features: typeof product.features === "string" ? JSON.parse(product.features) : product.features,
        specifications: typeof product.specifications === "string" ? JSON.parse(product.specifications) : product.specifications
      }));
      return new Response(JSON.stringify({
        success: true,
        data: processedProducts
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else if (method === "POST") {
      const body = await request.json();
      const { title, description, price, image_url, category, brand, model, features, specifications, status } = body;
      if (!title || !description) {
        return new Response(JSON.stringify({
          error: "Title and description are required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const stmt = env.ozmevsim_d1.prepare(`
          INSERT INTO products (title, description, price, image_url, category, brand, model, features, specifications, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `);
      const result = await stmt.bind(
        title,
        description,
        price || 0,
        image_url || "",
        category || "general",
        brand || "",
        model || "",
        JSON.stringify(features || []),
        JSON.stringify(specifications || {}),
        status || "active"
      ).run();
      if (!result.success) {
        throw new Error("Failed to create product");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Product created successfully",
        id: result.meta.last_row_id
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else if (method === "PUT") {
      const body = await request.json();
      const { id, title, description, price, image_url, category, brand, model, features, specifications, status } = body;
      if (!id) {
        return new Response(JSON.stringify({
          error: "Product ID is required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const stmt = env.ozmevsim_d1.prepare(`
          UPDATE products 
          SET title = ?, description = ?, price = ?, image_url = ?, category = ?, brand = ?, model = ?, features = ?, specifications = ?, status = ?, updated_at = datetime('now')
          WHERE id = ?
        `);
      const result = await stmt.bind(
        title,
        description,
        price || 0,
        image_url || "",
        category || "general",
        brand || "",
        model || "",
        JSON.stringify(features || []),
        JSON.stringify(specifications || {}),
        status || "active",
        id
      ).run();
      if (!result.success) {
        throw new Error("Failed to update product");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Product updated successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else if (method === "DELETE") {
      const body = await request.json();
      const { id } = body;
      if (!id) {
        return new Response(JSON.stringify({
          error: "Product ID is required"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const stmt = env.ozmevsim_d1.prepare("DELETE FROM products WHERE id = ?");
      const result = await stmt.bind(id).run();
      if (!result.success) {
        throw new Error("Failed to delete product");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Product deleted successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } else {
      return new Response(JSON.stringify({
        error: "Method not allowed"
      }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  } catch (error) {
    console.error("Products API Error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
__name(onRequest17, "onRequest");

// references.js
var defaultReferences2 = [
  {
    id: 1,
    title: "Residence Villa Kompleksi",
    description: "Ankara'n\u0131n prestijli b\xF6lgelerinden birinde yer alan villa kompleksimizde 50 villa i\xE7in kombi ve radyat\xF6r sistemleri kurduk. Vaillant ecoTEC Plus kombiler ve Purmo panel radyat\xF6rler ile m\xFCkemmel \u0131s\u0131tma konforu sa\u011Flad\u0131k.",
    client: "Residence \u0130n\u015Faat",
    location: "\xC7ankaya, Ankara",
    category: "Residential",
    completedDate: "2023-11-15",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    status: "active",
    featured: true,
    rating: 5,
    createdAt: "2023-11-15T10:00:00Z",
    updatedAt: "2023-11-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Botanik Plaza Ofis Binas\u0131",
    description: "Botanik'te 25 katl\u0131 modern ofis binas\u0131nda merkezi \u0131s\u0131tma sistemi kurulumu ger\xE7ekle\u015Ftirdik. Bosch kondansing kazanlar ve ak\u0131ll\u0131 kontrol sistemleri ile enerji verimlili\u011Fi %35 art\u0131r\u0131ld\u0131.",
    client: "Botanik Plaza Yap\u0131",
    location: "Botanik, Ankara",
    category: "Commercial",
    completedDate: "2023-10-20",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    status: "active",
    featured: true,
    rating: 5,
    createdAt: "2023-10-20T10:00:00Z",
    updatedAt: "2023-10-20T10:00:00Z"
  },
  {
    id: 3,
    title: "Sanayi Fabrikas\u0131 Enerji Sistemi",
    description: "Organize Sanayi B\xF6lgesi'nde 5000 m\xB2 kapal\u0131 alana sahip \xFCretim tesisinde end\xFCstriyel \u0131s\u0131tma sistemi kurulumu. Buderus end\xFCstriyel kazanlar ve \u0131s\u0131 geri kazan\u0131m sistemi ile %40 enerji tasarrufu sa\u011Fland\u0131.",
    client: "ASO Makine San.",
    location: "Sincan OSB, Ankara",
    category: "Industrial",
    completedDate: "2023-09-30",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
    status: "active",
    featured: true,
    rating: 5,
    createdAt: "2023-09-30T10:00:00Z",
    updatedAt: "2023-09-30T10:00:00Z"
  },
  {
    id: 4,
    title: "Konutkent Sitesi Do\u011Falgaz D\xF6n\xFC\u015F\xFCm\xFC",
    description: "Ke\xE7i\xF6ren'de 200 konutluk sitede eski kalorifer sisteminden modern kombi sistemlerine ge\xE7i\u015F projesi. Her daireye Vaillant ecoTEC Pro kombiler kuruldu ve %50 enerji tasarrufu sa\u011Fland\u0131.",
    client: "Konutkent Y\xF6netimi",
    location: "Ke\xE7i\xF6ren, Ankara",
    category: "Residential",
    completedDate: "2023-08-15",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    status: "active",
    featured: true,
    rating: 4,
    createdAt: "2023-08-15T10:00:00Z",
    updatedAt: "2023-08-15T10:00:00Z"
  },
  {
    id: 5,
    title: "Capitol AVM Klima Sistemi",
    description: "Ankara'n\u0131n en b\xFCy\xFCk al\u0131\u015Fveri\u015F merkezlerinden Capitol AVM'de 50000 m\xB2 alana VRV klima sistemi kurulumu. Daikin VRV sistemi ile %30 enerji verimlili\u011Fi art\u0131\u015F\u0131 sa\u011Fland\u0131.",
    client: "Capitol AVM",
    location: "\xC7ukurambar, Ankara",
    category: "Commercial",
    completedDate: "2023-07-10",
    image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop",
    status: "active",
    featured: false,
    rating: 5,
    createdAt: "2023-07-10T10:00:00Z",
    updatedAt: "2023-07-10T10:00:00Z"
  },
  {
    id: 6,
    title: "Gazi \xDCniversitesi Teknokent",
    description: "Gazi \xDCniversitesi Teknokent binas\u0131nda ak\u0131ll\u0131 \u0131s\u0131tma ve so\u011Futma sistemi kurulumu. IoT sens\xF6rleri ve ak\u0131ll\u0131 kontrol sistemi ile %45 enerji tasarrufu elde edildi.",
    client: "Gazi \xDCniversitesi",
    location: "Maltepe, Ankara",
    category: "Institutional",
    completedDate: "2023-06-20",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
    status: "active",
    featured: false,
    rating: 5,
    createdAt: "2023-06-20T10:00:00Z",
    updatedAt: "2023-06-20T10:00:00Z"
  }
];
async function onRequest18(context) {
  const { request } = context;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
  try {
    const url = new URL(request.url);
    const featured = url.searchParams.get("featured");
    const category = url.searchParams.get("category");
    const limit = url.searchParams.get("limit");
    let filteredReferences = defaultReferences2;
    if (featured === "true") {
      filteredReferences = filteredReferences.filter((ref) => ref.featured);
    }
    if (category) {
      filteredReferences = filteredReferences.filter(
        (ref) => ref.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredReferences = filteredReferences.slice(0, limitNum);
      }
    }
    return new Response(JSON.stringify({
      success: true,
      data: filteredReferences,
      count: filteredReferences.length,
      total: defaultReferences2.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Error in references function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch references"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(onRequest18, "onRequest");

// testimonials.js
var testimonials2 = [
  {
    id: "1",
    name: "Mehmet Y\u0131lmaz",
    company: "Ev Sahibi",
    rating: 5,
    comment: "\xD6z Mevsim ekibi \xE7ok profesyonel. Kombi montaj\u0131n\u0131 h\u0131zl\u0131 ve temiz bir \u015Fekilde tamamlad\u0131lar.",
    date: "2024-03-10",
    location: "Ankara, \xC7ankaya",
    service: "Kombi Montaj\u0131",
    featured: true,
    status: "approved"
  },
  {
    id: "2",
    name: "Ay\u015Fe Kaya",
    company: "Ev Sahibi",
    rating: 5,
    comment: "Klima montaj\u0131 i\xE7in arad\u0131m, \xE7ok memnun kald\u0131m. Fiyatlar\u0131 da uygun.",
    date: "2024-03-08",
    location: "Ankara, Ke\xE7i\xF6ren",
    service: "Klima Montaj\u0131",
    featured: true,
    status: "approved"
  },
  {
    id: "3",
    name: "Ali Demir",
    company: "\u0130\u015F Yeri Sahibi",
    rating: 4,
    comment: "Do\u011Falgaz tesisat\u0131 kurulumu i\xE7in \xE7al\u0131\u015Ft\u0131k. \u0130\u015Flerini iyi yap\u0131yorlar.",
    date: "2024-03-05",
    location: "Ankara, Mamak",
    service: "Do\u011Falgaz Tesisat\u0131",
    featured: false,
    status: "approved"
  }
];
async function onRequest19(context) {
  const { request } = context;
  const url = new URL(request.url);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "GET") {
      const featured = url.searchParams.get("featured");
      const service = url.searchParams.get("service");
      let filteredTestimonials = [...testimonials2];
      filteredTestimonials = filteredTestimonials.filter((t) => t.status === "approved");
      if (featured === "true") {
        filteredTestimonials = filteredTestimonials.filter((t) => t.featured);
      }
      if (service && service !== "all") {
        filteredTestimonials = filteredTestimonials.filter(
          (t) => t.service.toLowerCase().includes(service.toLowerCase())
        );
      }
      filteredTestimonials.sort((a, b) => new Date(b.date) - new Date(a.date));
      return new Response(JSON.stringify({
        success: true,
        data: filteredTestimonials,
        total: filteredTestimonials.length
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest19, "onRequest");

// upload.js
async function onRequest20(context) {
  const { request } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (request.method === "POST") {
      try {
        const formData = await request.formData();
        const files = formData.getAll("files");
        const folder = formData.get("folder") || "general";
        if (!files || files.length === 0) {
          return new Response(JSON.stringify({
            success: false,
            error: "Dosya bulunamad\u0131"
          }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const maxFileSize = 10 * 1024 * 1024;
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "video/mp4",
          "video/avi",
          "video/mov",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        for (const file of files) {
          if (file.size > maxFileSize) {
            return new Response(JSON.stringify({
              success: false,
              error: `Dosya ${file.name} \xE7ok b\xFCy\xFCk. Maksimum boyut 10MB.`
            }), {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          if (!allowedTypes.includes(file.type)) {
            return new Response(JSON.stringify({
              success: false,
              error: `Dosya t\xFCr\xFC ${file.type} desteklenmiyor.`
            }), {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
        }
        return new Response(JSON.stringify({
          success: true,
          message: `Demo modunda ${files.length} dosya y\xFCkleme sim\xFClasyonu tamamland\u0131. Ger\xE7ek dosyalar kaydedilmedi.`,
          data: [],
          demo: true,
          note: "Bu demo modudur. Dosyalar ger\xE7ekte kaydedilmez ve medya k\xFCt\xFCphanesinde g\xF6r\xFCnmez."
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      } catch (error) {
        console.error("Upload error:", error);
        return new Response(JSON.stringify({
          success: false,
          error: "Dosya y\xFCkleme s\u0131ras\u0131nda hata olu\u015Ftu: " + error.message
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
    }
    if (request.method === "GET") {
      return new Response(JSON.stringify({
        success: true,
        message: "Upload API demo modunda \xE7al\u0131\u015F\u0131yor",
        demo: true,
        supportedTypes: [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "video/mp4",
          "video/avi",
          "video/mov",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ],
        maxFileSize: "10MB",
        note: "Demo modunda dosyalar ger\xE7ekte kaydedilmez"
      }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error: " + error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(onRequest20, "onRequest");

// ../.wrangler/tmp/pages-5Y9hs8/functionsRoutes-0.9993987079475075.mjs
var routes = [
  {
    routePath: "/api/admin-sync",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/admin-sync",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/r2-proxy",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/r2-proxy",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/team",
    mountPath: "/api",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/team",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/team",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/team",
    mountPath: "/api",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/upload-r2",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/upload-r2",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/admin-auth",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/blog",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/contact",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/api/data-kv",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/api/faq",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/api/media",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest6]
  },
  {
    routePath: "/api/products",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest7]
  },
  {
    routePath: "/api/references",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest8]
  },
  {
    routePath: "/api/testimonials",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest9]
  },
  {
    routePath: "/api/upload",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest10]
  },
  {
    routePath: "/admin-sync",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/admin-sync",
    mountPath: "/",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/hero-slides",
    mountPath: "/",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete2]
  },
  {
    routePath: "/hero-slides",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/hero-slides",
    mountPath: "/",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/hero-slides",
    mountPath: "/",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut2]
  },
  {
    routePath: "/r2-proxy",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/r2-proxy",
    mountPath: "/",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions2]
  },
  {
    routePath: "/settings",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  },
  {
    routePath: "/settings",
    mountPath: "/",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions3]
  },
  {
    routePath: "/settings",
    mountPath: "/",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/team",
    mountPath: "/",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete3]
  },
  {
    routePath: "/team",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet9]
  },
  {
    routePath: "/team",
    mountPath: "/",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/team",
    mountPath: "/",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut3]
  },
  {
    routePath: "/upload-r2",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet10]
  },
  {
    routePath: "/upload-r2",
    mountPath: "/",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost8]
  },
  {
    routePath: "/blog",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest11]
  },
  {
    routePath: "/brands",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest12]
  },
  {
    routePath: "/contact",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest13]
  },
  {
    routePath: "/data-kv",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest14]
  },
  {
    routePath: "/faq",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest15]
  },
  {
    routePath: "/media",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest16]
  },
  {
    routePath: "/products",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest17]
  },
  {
    routePath: "/references",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest18]
  },
  {
    routePath: "/testimonials",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest19]
  },
  {
    routePath: "/upload",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest20]
  }
];

// ../node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-CgLpkP/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-CgLpkP/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.09677463713104628.mjs.map
