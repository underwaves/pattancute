/**
 * Worker API for Pattancute.shop
 * Handles reviews, image uploads to R2, score stats, and static asset serving.
 */

// Helper: JSON response with CORS headers
function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...extraHeaders,
    },
  });
}

// Helper: Extract YouTube Video ID from any standard URL or ID string
function extractYouTubeId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// Helper: Escape HTML special characters to prevent XSS
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper: Hash IP for rate limiting without storing raw IP (privacy preservation)
async function hashIp(ip) {
  const enc = new TextEncoder().encode(ip + '_pattancute_salt');
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper: Hash a customer's review edit token (raw token is never stored)
async function hashEditToken(token) {
  const enc = new TextEncoder().encode(String(token) + '_pattancute_edit');
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper: Constant-time string comparison
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Helper: Validate image magic bytes (strictly check JPEG, PNG, WebP)
function detectImageFormat(buffer) {
  const bytes = new Uint8Array(buffer.slice(0, 16));
  if (bytes.length < 12) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { ext: 'jpg', mime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { ext: 'png', mime: 'image/png' };
  }

  // WebP: RIFF .... WEBP
  if (
    bytes[0] === 0x52 && // R
    bytes[1] === 0x49 && // I
    bytes[2] === 0x46 && // F
    bytes[3] === 0x46 && // F
    bytes[8] === 0x57 && // W
    bytes[9] === 0x45 && // E
    bytes[10] === 0x42 && // B
    bytes[11] === 0x50 // P
  ) {
    return { ext: 'webp', mime: 'image/webp' };
  }

  return null;
}

// Helper: Get active admin token/password (checks D1 site_settings first, falls back to env.ADMIN_TOKEN)
async function getValidAdminToken(env) {
  try {
    const row = await env.DB.prepare("SELECT value FROM site_settings WHERE key = 'admin_token'").first();
    if (row && row.value) {
      return row.value;
    }
  } catch (e) {
    console.warn('Could not read admin_token from D1:', e);
  }
  return env.ADMIN_TOKEN || 'pattan_admin_0011533306ebaf9ced65c67d50614207';
}

// Helper: Verify admin authorization header
async function verifyAdminAuth(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const validToken = await getValidAdminToken(env);
  if (!validToken || token !== validToken) {
    return false;
  }
  return true;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle OPTIONS for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // API Routes
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env, url);
      } catch (err) {
        console.error('Worker API error:', err);
        return jsonResponse(
          { error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง' },
          500
        );
      }
    }

    // Serve Static Assets (Vite build output from dist/)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Assets binding not found', { status: 500 });
  },
};

async function handleApi(request, env, url) {
  const method = request.method;
  const path = url.pathname;

  // 1. GET /api/images/:key
  if (method === 'GET' && path.startsWith('/api/images/')) {
    const key = path.slice('/api/images/'.length);

    // Validate key pattern
    if (!/^[a-zA-Z0-9_\-]+\.(jpg|png|webp)$/i.test(key)) {
      return new Response('Invalid image key', { status: 400 });
    }

    const object = await env.IMAGES_BUCKET.get(key);
    if (!object) {
      return new Response('Image not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Access-Control-Allow-Origin', '*');

    return new Response(object.body, { headers });
  }

  // 2. GET /api/reviews
  if (method === 'GET' && path === '/api/reviews') {
    const cursor = url.searchParams.get('cursor'); // ISO date of last item
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '10', 10), 1), 30);

    // Fetch review stats
    const statsQuery = await env.DB.prepare(`
      SELECT 
        COUNT(*) as total,
        COALESCE(AVG(rating), 0) as average,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as star_5,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as star_4,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as star_3,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as star_2,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as star_1
      FROM reviews
      WHERE hidden = 0
    `).first();

    const stats = {
      total: Number(statsQuery?.total || 0),
      average: Number((statsQuery?.average || 0).toFixed(1)),
      breakdown: {
        5: Number(statsQuery?.star_5 || 0),
        4: Number(statsQuery?.star_4 || 0),
        3: Number(statsQuery?.star_3 || 0),
        2: Number(statsQuery?.star_2 || 0),
        1: Number(statsQuery?.star_1 || 0),
      },
    };

    // Fetch paginated reviews (where hidden = 0)
    let reviewsStmt;
    if (cursor) {
      reviewsStmt = env.DB.prepare(`
        SELECT id, name, rating, comment, created_at, updated_at
        FROM reviews
        WHERE hidden = 0 AND created_at < ?
        ORDER BY created_at DESC
        LIMIT ?
      `).bind(cursor, limit + 1);
    } else {
      reviewsStmt = env.DB.prepare(`
        SELECT id, name, rating, comment, created_at, updated_at
        FROM reviews
        WHERE hidden = 0
        ORDER BY created_at DESC
        LIMIT ?
      `).bind(limit + 1);
    }

    const { results } = await reviewsStmt.all();
    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, limit) : results;
    const nextCursor = items.length > 0 ? items[items.length - 1].created_at : null;

    // Fetch attached images for this page of reviews
    if (items.length > 0) {
      const placeholders = items.map(() => '?').join(',');
      const ids = items.map((r) => r.id);
      const imagesRes = await env.DB.prepare(`
        SELECT review_id, r2_key
        FROM review_images
        WHERE review_id IN (${placeholders})
      `).bind(...ids).all();

      const imageMap = {};
      for (const img of imagesRes.results || []) {
        if (!imageMap[img.review_id]) imageMap[img.review_id] = [];
        imageMap[img.review_id].push(`/api/images/${img.r2_key}`);
      }

      for (const item of items) {
        item.images = imageMap[item.id] || [];
      }
    }

    return jsonResponse({
      reviews: items,
      hasMore,
      nextCursor,
      stats,
    });
  }

  // 3. POST /api/reviews
  if (method === 'POST' && path === '/api/reviews') {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return jsonResponse({ error: 'รูปแบบข้อมูลไม่ถูกต้อง (ต้องเป็น multipart/form-data)' }, 400);
    }

    // IP Extraction and Rate Limiting
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      '127.0.0.1';
    const ipHash = await hashIp(clientIp);

    const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
    const rateCheck = await env.DB.prepare(`
      SELECT COUNT(*) as count 
      FROM rate_limits 
      WHERE ip_hash = ? AND created_at >= ?
    `).bind(ipHash, oneHourAgo).first();

    if (rateCheck && rateCheck.count >= 3) {
      return jsonResponse(
        {
          error: 'คุณส่งรีวิวเกินกำหนด (จำกัดไม่เกิน 3 ครั้งต่อ 1 ชั่วโมง) เพื่อป้องกันสแปม กรุณาลองใหม่ภายหลังค่ะ',
        },
        429
      );
    }

    const formData = await request.formData();

    // Anti-spam honeypot
    const honeypot = formData.get('website') || formData.get('hp_field') || '';
    if (honeypot && String(honeypot).trim() !== '') {
      return jsonResponse({ error: 'ตรวจพบพฤติกรรมผิดปกติ' }, 400);
    }

    // Field validations
    const rawName = (formData.get('name') || '').toString().trim();
    const rawRating = parseInt(formData.get('rating') || '0', 10);
    const rawComment = (formData.get('comment') || '').toString().trim();

    if (!rawName) {
      return jsonResponse({ error: 'กรุณากรอกชื่อของคุณ' }, 400);
    }
    if (rawName.length > 40) {
      return jsonResponse({ error: 'ชื่อต้องมีความยาวไม่เกิน 40 ตัวอักษร' }, 400);
    }

    if (!rawRating || rawRating < 1 || rawRating > 5) {
      return jsonResponse({ error: 'กรุณาให้คะแนนดาวระหว่าง 1 ถึง 5 ดาว' }, 400);
    }

    if (!rawComment) {
      return jsonResponse({ error: 'กรุณากรอกข้อความรีวิว/ความประทับใจ' }, 400);
    }
    if (rawComment.length > 500) {
      return jsonResponse({ error: 'ข้อความรีวิวต้องไม่เกิน 500 ตัวอักษร' }, 400);
    }

    // Escape sanitized text
    const cleanName = escapeHtml(rawName);
    const cleanComment = escapeHtml(rawComment);

    // Process attached images (0 to 3 images)
    const fileEntries = formData.getAll('images').concat(formData.getAll('photos'));
    const validFiles = fileEntries.filter(
      (f) => f && typeof f === 'object' && typeof f.size === 'number' && f.size > 0
    );

    if (validFiles.length > 3) {
      return jsonResponse({ error: 'สามารถแนบรูปภาพได้สูงสุดไม่เกิน 3 รูป' }, 400);
    }

    const maxFileSize = 3 * 1024 * 1024; // 3MB
    const savedKeys = [];

    for (const file of validFiles) {
      if (file.size > maxFileSize) {
        return jsonResponse({ error: `รูปภาพ "${file.name || 'แนบ'}" มีขนาดเกิน 3MB` }, 400);
      }

      const buffer = await file.arrayBuffer();
      const detected = detectImageFormat(buffer);

      if (!detected) {
        return jsonResponse(
          { error: `ไฟล์ "${file.name || 'แนบ'}" ไม่ใช่รูปภาพ JPG, PNG หรือ WebP ที่ถูกต้อง` },
          400
        );
      }

      // Generate UUID filename (do not use original filename)
      const r2Key = `${crypto.randomUUID()}.${detected.ext}`;

      // Upload to R2
      await env.IMAGES_BUCKET.put(r2Key, buffer, {
        httpMetadata: {
          contentType: detected.mime,
        },
      });

      savedKeys.push(r2Key);
    }

    // Insert into D1
    const reviewId = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    // Secret edit token: returned once to the customer, only its hash is stored
    const editToken = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, '');
    const editTokenHash = await hashEditToken(editToken);

    const stmts = [
      env.DB.prepare(`
        INSERT INTO reviews (id, name, rating, comment, created_at, hidden, edit_token_hash)
        VALUES (?, ?, ?, ?, ?, 0, ?)
      `).bind(reviewId, cleanName, rawRating, cleanComment, nowIso, editTokenHash),
      env.DB.prepare(`
        INSERT INTO rate_limits (ip_hash, created_at)
        VALUES (?, ?)
      `).bind(ipHash, nowIso),
    ];

    for (const key of savedKeys) {
      stmts.push(
        env.DB.prepare(`
          INSERT INTO review_images (id, review_id, r2_key)
          VALUES (?, ?, ?)
        `).bind(crypto.randomUUID(), reviewId, key)
      );
    }

    await env.DB.batch(stmts);

    return jsonResponse(
      {
        success: true,
        message: 'ขอบคุณสำหรับรีวิวและเครดิตร้าน Pattancute ค่ะ!',
        editToken,
        review: {
          id: reviewId,
          name: cleanName,
          rating: rawRating,
          comment: cleanComment,
          created_at: nowIso,
          images: savedKeys.map((k) => `/api/images/${k}`),
        },
      },
      201
    );
  }

  // 3.1 PUT /api/reviews/:id - Customer edits their own review (requires secret edit token)
  if (method === 'PUT' && path.startsWith('/api/reviews/')) {
    const id = path.slice('/api/reviews/'.length);
    if (!/^[a-f0-9-]{36}$/i.test(id)) {
      return jsonResponse({ error: 'รหัสรีวิวไม่ถูกต้อง' }, 400);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'รูปแบบข้อมูลไม่ถูกต้อง' }, 400);
    }

    const editToken = (body?.editToken || '').toString();
    if (!editToken) {
      return jsonResponse({ error: 'ไม่มีสิทธิ์แก้ไขรีวิวนี้' }, 403);
    }

    const existing = await env.DB.prepare(
      'SELECT id, edit_token_hash, created_at FROM reviews WHERE id = ? AND hidden = 0'
    ).bind(id).first();

    if (!existing) {
      return jsonResponse({ error: 'ไม่พบรีวิวนี้ อาจถูกลบไปแล้วค่ะ' }, 404);
    }

    const providedHash = await hashEditToken(editToken);
    if (!existing.edit_token_hash || !safeEqual(providedHash, existing.edit_token_hash)) {
      return jsonResponse({ error: 'ไม่มีสิทธิ์แก้ไขรีวิวนี้ (แก้ได้เฉพาะรีวิวของตัวเองจากเครื่องที่ใช้ส่งรีวิว)' }, 403);
    }

    const rawName = (body?.name || '').toString().trim();
    const rawRating = parseInt(body?.rating || '0', 10);
    const rawComment = (body?.comment || '').toString().trim();

    if (!rawName) return jsonResponse({ error: 'กรุณากรอกชื่อของคุณ' }, 400);
    if (rawName.length > 40) return jsonResponse({ error: 'ชื่อต้องมีความยาวไม่เกิน 40 ตัวอักษร' }, 400);
    if (!rawRating || rawRating < 1 || rawRating > 5) {
      return jsonResponse({ error: 'กรุณาให้คะแนนดาวระหว่าง 1 ถึง 5 ดาว' }, 400);
    }
    if (!rawComment) return jsonResponse({ error: 'กรุณากรอกข้อความรีวิว/ความประทับใจ' }, 400);
    if (rawComment.length > 500) return jsonResponse({ error: 'ข้อความรีวิวต้องไม่เกิน 500 ตัวอักษร' }, 400);

    const cleanName = escapeHtml(rawName);
    const cleanComment = escapeHtml(rawComment);
    const nowIso = new Date().toISOString();

    await env.DB.prepare(
      'UPDATE reviews SET name = ?, rating = ?, comment = ?, updated_at = ? WHERE id = ?'
    ).bind(cleanName, rawRating, cleanComment, nowIso, id).run();

    return jsonResponse({
      success: true,
      message: 'แก้ไขรีวิวเรียบร้อยแล้วค่ะ ✨',
      review: {
        id,
        name: cleanName,
        rating: rawRating,
        comment: cleanComment,
        created_at: existing.created_at,
        updated_at: nowIso,
      },
    });
  }

  // 4. DELETE /api/reviews/:id (Admin Token Authorization)
  if (method === 'DELETE' && path.startsWith('/api/reviews/')) {
    const id = path.slice('/api/reviews/'.length);

    if (!await verifyAdminAuth(request, env)) {
      return jsonResponse({ error: 'ไม่มีสิทธิ์ในการจัดการ (Admin Token ไม่ถูกต้อง)' }, 401);
    }

    const review = await env.DB.prepare('SELECT id FROM reviews WHERE id = ?').bind(id).first();
    if (!review) {
      return jsonResponse({ error: 'ไม่พบรีวิวที่ต้องการลบ' }, 404);
    }

    // Delete attached images from R2
    const images = await env.DB.prepare('SELECT r2_key FROM review_images WHERE review_id = ?')
      .bind(id)
      .all();

    for (const img of images.results || []) {
      try {
        await env.IMAGES_BUCKET.delete(img.r2_key);
      } catch (e) {
        console.error('Failed to delete image from R2:', img.r2_key, e);
      }
    }

    // Delete from D1
    await env.DB.batch([
      env.DB.prepare('DELETE FROM review_images WHERE review_id = ?').bind(id),
      env.DB.prepare('DELETE FROM reviews WHERE id = ?').bind(id),
    ]);

    return jsonResponse({
      success: true,
      message: 'ลบรีวิวและรูปภาพเรียบร้อยแล้ว',
    });
  }

  // 4.1 GET /api/settings - Fetch comprehensive site settings
  if (method === 'GET' && path === '/api/settings') {
    let settings = {};
    try {
      const { results } = await env.DB.prepare('SELECT key, value FROM site_settings').all();
      const map = {};
      for (const r of results || []) {
        map[r.key] = r.value;
      }

      if (map['site_config']) {
        try {
          settings = JSON.parse(map['site_config']);
        } catch (e) {}
      }

      // Overlay specific keys if set
      if (map['youtube_music_url']) {
        if (!settings.music) settings.music = {};
        settings.music.youtubeUrl = map['youtube_music_url'];
      }
      if (map['custom_logo_url']) {
        settings.logoUrl = map['custom_logo_url'];
      }
    } catch (e) {
      console.warn('Could not query site_settings:', e);
    }

    return jsonResponse({
      success: true,
      settings,
    });
  }

  // 4.2 POST /api/settings - Update comprehensive site settings (Protected by ADMIN_TOKEN)
  if (method === 'POST' && path === '/api/settings') {
    if (!await verifyAdminAuth(request, env)) {
      return jsonResponse({ error: 'ไม่มีสิทธิ์ในการจัดการ (Admin Token ไม่ถูกต้อง)' }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ error: 'JSON payload ไม่ถูกต้อง' }, 400);
    }

    const newSettings = body.settings;
    if (!newSettings || typeof newSettings !== 'object') {
      return jsonResponse({ error: 'กรุณาส่งข้อมูลการตั้งค่า (settings object)' }, 400);
    }

    const stmts = [
      env.DB.prepare(`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES ('site_config', ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).bind(JSON.stringify(newSettings)),
    ];

    if (newSettings.music && newSettings.music.youtubeUrl) {
      stmts.push(
        env.DB.prepare(`
          INSERT INTO site_settings (key, value, updated_at)
          VALUES ('youtube_music_url', ?, datetime('now'))
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
        `).bind(newSettings.music.youtubeUrl)
      );
    }

    if (newSettings.logoUrl) {
      stmts.push(
        env.DB.prepare(`
          INSERT INTO site_settings (key, value, updated_at)
          VALUES ('custom_logo_url', ?, datetime('now'))
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
        `).bind(newSettings.logoUrl)
      );
    }

    await env.DB.batch(stmts);

    return jsonResponse({
      success: true,
      message: 'บันทึกการตั้งค่าร้านทั้งหมดเรียบร้อยแล้วค่ะ! 🌸✨',
      settings: newSettings,
    });
  }

  // 4.3 POST /api/admin/verify - Verify admin token validity
  if (method === 'POST' && path === '/api/admin/verify') {
    const isAuthed = await verifyAdminAuth(request, env);
    if (!isAuthed) {
      return jsonResponse({ error: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้งค่ะ' }, 401);
    }
    return jsonResponse({ success: true, message: 'ยืนยันตัวตนสำเร็จ' });
  }

  // 4.4 POST /api/admin/change-password - Change admin password
  if (method === 'POST' && path === '/api/admin/change-password') {
    if (!await verifyAdminAuth(request, env)) {
      return jsonResponse({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง กรุณาตรวจสอบอีกครั้งค่ะ' }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ error: 'JSON payload ไม่ถูกต้อง' }, 400);
    }

    const { newPassword } = body || {};
    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 4) {
      return jsonResponse({ error: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษรค่ะ' }, 400);
    }

    const cleanNewPassword = newPassword.trim();
    await env.DB.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ('admin_token', ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(cleanNewPassword).run();

    return jsonResponse({
      success: true,
      message: 'เปลี่ยนรหัสผ่านหลังบ้านเรียบร้อยแล้วค่ะ! 🌸',
      newToken: cleanNewPassword,
    });
  }

  // 5. GET /api/music - Fetch current background music settings
  if (method === 'GET' && path === '/api/music') {
    let youtubeUrl = null;
    try {
      const row = await env.DB.prepare(
        "SELECT value FROM site_settings WHERE key = 'youtube_music_url' LIMIT 1"
      ).first();
      if (row && row.value) {
        youtubeUrl = row.value;
      }
    } catch (e) {
      console.warn('Could not query site_settings:', e);
    }

    const videoId = extractYouTubeId(youtubeUrl);
    return jsonResponse({
      youtubeUrl,
      videoId,
      title: 'Pattancute Background Music',
    });
  }

  // 6. POST /api/music - Update YouTube music link (Protected by ADMIN_TOKEN)
  if (method === 'POST' && path === '/api/music') {
    if (!await verifyAdminAuth(request, env)) {
      return jsonResponse({ error: 'ไม่มีสิทธิ์ในการจัดการ (Admin Token ไม่ถูกต้อง)' }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ error: 'JSON payload ไม่ถูกต้อง' }, 400);
    }

    const rawUrl = (body.youtubeUrl || '').trim();
    if (!rawUrl) {
      return jsonResponse({ error: 'กรุณาระบุลิงก์ YouTube ที่ต้องการ' }, 400);
    }

    const videoId = extractYouTubeId(rawUrl);
    if (!videoId) {
      return jsonResponse({ error: 'ลิงก์ YouTube ไม่ถูกต้อง (ไม่พบ Video ID ที่ใช้ได้)' }, 400);
    }

    const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
    await env.DB.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ('youtube_music_url', ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(cleanUrl).run();

    return jsonResponse({
      success: true,
      message: 'อัปเดตเพลง YouTube สำเร็จแล้วค่ะ',
      youtubeUrl: cleanUrl,
      videoId,
    });
  }

  // 7. GET /api/logo - Fetch current active logo URL
  if (method === 'GET' && path === '/api/logo') {
    let logoUrl = '/logo.png';
    try {
      const row = await env.DB.prepare(
        "SELECT value FROM site_settings WHERE key = 'custom_logo_url' LIMIT 1"
      ).first();
      if (row && row.value) {
        logoUrl = row.value;
      }
    } catch (e) {
      console.warn('Could not query custom_logo_url:', e);
    }
    return jsonResponse({ logoUrl });
  }

  // 8. POST /api/logo - Upload new logo (Protected by ADMIN_TOKEN)
  if (method === 'POST' && path === '/api/logo') {
    if (!await verifyAdminAuth(request, env)) {
      return jsonResponse({ error: 'ไม่มีสิทธิ์ในการจัดการ (Admin Token ไม่ถูกต้อง)' }, 401);
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return jsonResponse({ error: 'รูปแบบข้อมูลไม่ถูกต้อง (ต้องเป็น multipart/form-data)' }, 400);
    }

    const formData = await request.formData();
    const file = formData.get('logo') || formData.get('image');
    if (!file || typeof file !== 'object' || typeof file.size !== 'number' || file.size <= 0) {
      return jsonResponse({ error: 'กรุณาเลือกไฟล์รูปภาพโลโก้' }, 400);
    }

    if (file.size > 5 * 1024 * 1024) {
      return jsonResponse({ error: 'ขนาดไฟล์โลโก้ต้องไม่เกิน 5MB' }, 400);
    }

    const buffer = await file.arrayBuffer();
    const format = detectImageFormat(buffer);
    if (!format) {
      return jsonResponse({ error: 'ไฟล์ต้องเป็นรูปภาพ JPG, PNG หรือ WebP เท่านั้น' }, 400);
    }

    const key = `logo_${crypto.randomUUID()}.${format.ext}`;
    await env.IMAGES_BUCKET.put(key, buffer, {
      httpMetadata: {
        contentType: format.mime,
      },
    });

    const logoUrl = `/api/images/${key}`;

    await env.DB.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ('custom_logo_url', ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(logoUrl).run();

    return jsonResponse({
      success: true,
      message: 'อัปเดตโลโก้ร้าน Pattancute เรียบร้อยแล้วค่ะ',
      logoUrl,
    });
  }

  // 9. DELETE /api/logo - Reset logo to default /logo.png (Protected by ADMIN_TOKEN)
  if (method === 'DELETE' && path === '/api/logo') {
    if (!await verifyAdminAuth(request, env)) {
      return jsonResponse({ error: 'ไม่มีสิทธิ์ในการจัดการ (Admin Token ไม่ถูกต้อง)' }, 401);
    }

    await env.DB.prepare("DELETE FROM site_settings WHERE key = 'custom_logo_url'").run();

    return jsonResponse({
      success: true,
      message: 'รีเซ็ตโลโก้กลับเป็นค่าเริ่มต้นเรียบร้อยแล้วค่ะ',
      logoUrl: '/logo.png',
    });
  }

  // 10. POST /api/admin/upload-image - Upload any image for apps/posters to R2 (Protected by ADMIN_TOKEN)
  if (method === 'POST' && (path === '/api/admin/upload-image' || path === '/api/upload-image')) {
    if (!await verifyAdminAuth(request, env)) {
      return jsonResponse({ error: 'ไม่มีสิทธิ์ในการจัดการ (Admin Token ไม่ถูกต้อง)' }, 401);
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return jsonResponse({ error: 'รูปแบบข้อมูลไม่ถูกต้อง (ต้องเป็น multipart/form-data)' }, 400);
    }

    const formData = await request.formData();
    const file = formData.get('image') || formData.get('file');
    if (!file || typeof file !== 'object' || typeof file.size !== 'number' || file.size <= 0) {
      return jsonResponse({ error: 'กรุณาเลือกไฟล์รูปภาพ' }, 400);
    }

    if (file.size > 10 * 1024 * 1024) {
      return jsonResponse({ error: 'ขนาดไฟล์รูปภาพต้องไม่เกิน 10MB' }, 400);
    }

    const buffer = await file.arrayBuffer();
    const format = detectImageFormat(buffer);
    if (!format) {
      return jsonResponse({ error: 'ไฟล์ต้องเป็นรูปภาพ JPG, PNG หรือ WebP เท่านั้น' }, 400);
    }

    const key = `app_${crypto.randomUUID()}.${format.ext}`;
    await env.IMAGES_BUCKET.put(key, buffer, {
      httpMetadata: {
        contentType: format.mime,
      },
    });

    const imageUrl = `/api/images/${key}`;

    return jsonResponse({
      success: true,
      message: 'อัปโหลดรูปภาพเรียบร้อยแล้วค่ะ',
      url: imageUrl,
      imageUrl,
    });
  }

  return jsonResponse({ error: 'Endpoint not found' }, 404);
}
