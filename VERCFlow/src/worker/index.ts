import { Hono } from "hono";
import {
  authMiddleware,
  deleteSession,
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

// ===== AUTH ROUTES =====
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });
  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60,
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  const mochaUser = c.get("user");
  
  if (!mochaUser) {
    return c.json({ error: "Not authenticated" }, 401);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM users WHERE mocha_user_id = ?"
  ).bind(mochaUser.id).all();

  let user = results[0];

  if (!user) {
    const name = mochaUser.google_user_data.name || mochaUser.email.split('@')[0];
    await c.env.DB.prepare(
      "INSERT INTO users (mocha_user_id, name, email, cargo, photo_url) VALUES (?, ?, ?, ?, ?)"
    ).bind(
      mochaUser.id,
      name,
      mochaUser.email,
      "Usuário",
      mochaUser.google_user_data.picture || null
    ).run();

    const { results: newResults } = await c.env.DB.prepare(
      "SELECT * FROM users WHERE mocha_user_id = ?"
    ).bind(mochaUser.id).all();
    
    user = newResults[0];
  }

  return c.json(user);
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// ===== PROJECTS ROUTES =====
app.get("/api/projects", authMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM projects ORDER BY created_at DESC"
  ).all();
  
  return c.json(results);
});

app.get("/api/projects/:id", authMiddleware, async (c) => {
  const projectId = c.req.param("id");
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM projects WHERE id = ?"
  ).bind(projectId).all();
  
  if (results.length === 0) {
    return c.json({ error: "Project not found" }, 404);
  }
  
  return c.json(results[0]);
});

app.post("/api/projects", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  const { results: userResults } = await c.env.DB.prepare(
    "SELECT id FROM users WHERE mocha_user_id = ?"
  ).bind(user?.id).all();

  const dbUser = userResults[0] as any;

  const result = await c.env.DB.prepare(
    "INSERT INTO projects (name, description, client_name, project_type, created_by) VALUES (?, ?, ?, ?, ?)"
  ).bind(
    body.name,
    body.description || null,
    body.client_name || null,
    body.project_type || null,
    dbUser.id
  ).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM projects WHERE id = ?"
  ).bind(result.meta.last_row_id).all();

  return c.json(results[0], 201);
});

app.get("/api/projects/:id", authMiddleware, async (c) => {
  const projectId = c.req.param("id");
  
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM projects WHERE id = ?"
  ).bind(projectId).all();
  
  return c.json(results[0]);
});

app.patch("/api/projects/:id", authMiddleware, async (c) => {
  const projectId = c.req.param("id");
  const body = await c.req.json();

  const updates: string[] = [];
  const bindings: any[] = [];

  if (body.name !== undefined) {
    updates.push("name = ?");
    bindings.push(body.name);
  }
  if (body.description !== undefined) {
    updates.push("description = ?");
    bindings.push(body.description);
  }
  if (body.client_name !== undefined) {
    updates.push("client_name = ?");
    bindings.push(body.client_name);
  }
  if (body.project_type !== undefined) {
    updates.push("project_type = ?");
    bindings.push(body.project_type);
  }
  if (body.status !== undefined) {
    updates.push("status = ?");
    bindings.push(body.status);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  bindings.push(projectId);

  await c.env.DB.prepare(
    `UPDATE projects SET ${updates.join(", ")} WHERE id = ?`
  ).bind(...bindings).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM projects WHERE id = ?"
  ).bind(projectId).all();

  return c.json(results[0]);
});

app.delete("/api/projects/:id", authMiddleware, async (c) => {
  const projectId = c.req.param("id");

  // Delete related data first
  await c.env.DB.prepare("DELETE FROM comments WHERE entity_type = 'project' AND entity_id = ?").bind(projectId).run();
  await c.env.DB.prepare("DELETE FROM raci_assignments WHERE entity_type = 'project' AND entity_id = ?").bind(projectId).run();
  
  // Delete requests
  await c.env.DB.prepare("DELETE FROM requests WHERE project_id = ?").bind(projectId).run();
  
  // Delete tasks from all disciplines
  const { results: disciplines } = await c.env.DB.prepare("SELECT id FROM disciplines WHERE project_id = ?").bind(projectId).all();
  for (const discipline of disciplines as any[]) {
    await c.env.DB.prepare("DELETE FROM tasks WHERE discipline_id = ?").bind(discipline.id).run();
    await c.env.DB.prepare("DELETE FROM comments WHERE entity_type = 'discipline' AND entity_id = ?").bind(discipline.id).run();
    await c.env.DB.prepare("DELETE FROM raci_assignments WHERE entity_type = 'discipline' AND entity_id = ?").bind(discipline.id).run();
  }
  
  // Delete disciplines
  await c.env.DB.prepare("DELETE FROM disciplines WHERE project_id = ?").bind(projectId).run();
  
  // Finally delete the project
  await c.env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(projectId).run();

  return c.json({ success: true });
});

// ===== DISCIPLINES ROUTES =====
app.get("/api/projects/:id/disciplines", authMiddleware, async (c) => {
  const projectId = c.req.param("id");
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM disciplines WHERE project_id = ? ORDER BY category, name"
  ).bind(projectId).all();
  
  return c.json(results);
});

app.post("/api/projects/:id/disciplines", authMiddleware, async (c) => {
  const projectId = c.req.param("id");
  const body = await c.req.json();

  const result = await c.env.DB.prepare(
    "INSERT INTO disciplines (project_id, category, name, description, status, subcategory, icon, color, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(
    projectId,
    body.category,
    body.name,
    body.description || null,
    "todo",
    body.subcategory || null,
    body.icon || null,
    body.color || null,
    body.assigned_to || null
  ).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM disciplines WHERE id = ?"
  ).bind(result.meta.last_row_id).all();

  return c.json(results[0], 201);
});

app.patch("/api/disciplines/:id", authMiddleware, async (c) => {
  const disciplineId = c.req.param("id");
  const body = await c.req.json();

  const updates: string[] = [];
  const bindings: any[] = [];

  if (body.status !== undefined) {
    updates.push("status = ?");
    bindings.push(body.status);
  }
  if (body.current_phase !== undefined) {
    updates.push("current_phase = ?");
    bindings.push(body.current_phase);
  }
  if (body.assigned_to !== undefined) {
    updates.push("assigned_to = ?");
    bindings.push(body.assigned_to);
  }
  if (body.description !== undefined) {
    updates.push("description = ?");
    bindings.push(body.description);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  bindings.push(disciplineId);

  await c.env.DB.prepare(
    `UPDATE disciplines SET ${updates.join(", ")} WHERE id = ?`
  ).bind(...bindings).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM disciplines WHERE id = ?"
  ).bind(disciplineId).all();

  return c.json(results[0]);
});

// ===== TASKS ROUTES =====
app.get("/api/disciplines/:id/tasks", authMiddleware, async (c) => {
  const disciplineId = c.req.param("id");
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM tasks WHERE discipline_id = ? ORDER BY created_at DESC"
  ).bind(disciplineId).all();
  
  return c.json(results);
});

app.post("/api/disciplines/:id/tasks", authMiddleware, async (c) => {
  const disciplineId = c.req.param("id");
  const body = await c.req.json();

  const result = await c.env.DB.prepare(
    "INSERT INTO tasks (discipline_id, title, description, status, category, priority, due_date, assigned_to, is_template) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(
    disciplineId,
    body.title,
    body.description || null,
    "todo",
    body.category || null,
    body.priority || null,
    body.due_date || null,
    body.assigned_to || null,
    body.is_template ? 1 : 0
  ).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM tasks WHERE id = ?"
  ).bind(result.meta.last_row_id).all();

  return c.json(results[0], 201);
});

app.delete("/api/tasks/:id", authMiddleware, async (c) => {
  const taskId = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(taskId).run();
  return c.json({ success: true });
});

app.patch("/api/tasks/:id", authMiddleware, async (c) => {
  const taskId = c.req.param("id");
  const body = await c.req.json();

  const updates: string[] = [];
  const bindings: any[] = [];

  if (body.status !== undefined) {
    updates.push("status = ?");
    bindings.push(body.status);
    if (body.status === "completed") {
      updates.push("completed_at = CURRENT_TIMESTAMP");
    }
  }
  if (body.title !== undefined) {
    updates.push("title = ?");
    bindings.push(body.title);
  }
  if (body.description !== undefined) {
    updates.push("description = ?");
    bindings.push(body.description);
  }
  if (body.priority !== undefined) {
    updates.push("priority = ?");
    bindings.push(body.priority);
  }
  if (body.assigned_to !== undefined) {
    updates.push("assigned_to = ?");
    bindings.push(body.assigned_to);
  }
  if (body.category !== undefined) {
    updates.push("category = ?");
    bindings.push(body.category);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  bindings.push(taskId);

  await c.env.DB.prepare(
    `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`
  ).bind(...bindings).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM tasks WHERE id = ?"
  ).bind(taskId).all();

  return c.json(results[0]);
});

// ===== COMMENTS ROUTES =====
app.get("/api/:entityType/:entityId/comments", authMiddleware, async (c) => {
  const entityType = c.req.param("entityType");
  const entityId = c.req.param("entityId");
  
  const { results: comments } = await c.env.DB.prepare(
    "SELECT c.*, u.name as user_name, u.photo_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.entity_type = ? AND c.entity_id = ? ORDER BY c.created_at ASC"
  ).bind(entityType, entityId).all();
  
  return c.json(comments);
});

app.post("/api/:entityType/:entityId/comments", authMiddleware, async (c) => {
  const entityType = c.req.param("entityType");
  const entityId = c.req.param("entityId");
  const body = await c.req.json();
  const mochaUser = c.get("user");

  const { results: userResults } = await c.env.DB.prepare(
    "SELECT id FROM users WHERE mocha_user_id = ?"
  ).bind(mochaUser?.id).all();

  const dbUser = userResults[0] as any;

  const result = await c.env.DB.prepare(
    "INSERT INTO comments (entity_type, entity_id, user_id, content) VALUES (?, ?, ?, ?)"
  ).bind(entityType, entityId, dbUser.id, body.content).run();

  const { results } = await c.env.DB.prepare(
    "SELECT c.*, u.name as user_name, u.photo_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?"
  ).bind(result.meta.last_row_id).all();

  return c.json(results[0], 201);
});

// ===== REQUESTS ROUTES =====
app.get("/api/projects/:id/requests", authMiddleware, async (c) => {
  const projectId = c.req.param("id");
  const { results } = await c.env.DB.prepare(
    `SELECT r.*, u.name as requested_by_name 
     FROM requests r 
     JOIN users u ON r.requested_by = u.id 
     WHERE r.project_id = ? 
     ORDER BY r.created_at DESC`
  ).bind(projectId).all();
  
  return c.json(results);
});

app.post("/api/projects/:id/requests", authMiddleware, async (c) => {
  const projectId = c.req.param("id");
  const body = await c.req.json();
  const mochaUser = c.get("user");

  const { results: userResults } = await c.env.DB.prepare(
    "SELECT id FROM users WHERE mocha_user_id = ?"
  ).bind(mochaUser?.id).all();

  const dbUser = userResults[0] as any;

  const result = await c.env.DB.prepare(
    `INSERT INTO requests (project_id, discipline_id, type, category, subcategory, title, description, status, priority, requested_by, assigned_to, due_date) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    projectId,
    body.discipline_id || null,
    body.type,
    body.category || null,
    body.subcategory || null,
    body.title,
    body.description,
    body.status || "open",
    body.priority || null,
    dbUser.id,
    body.assigned_to || null,
    body.due_date || null
  ).run();

  const { results } = await c.env.DB.prepare(
    `SELECT r.*, u.name as requested_by_name 
     FROM requests r 
     JOIN users u ON r.requested_by = u.id 
     WHERE r.id = ?`
  ).bind(result.meta.last_row_id).all();

  return c.json(results[0], 201);
});

app.patch("/api/requests/:id", authMiddleware, async (c) => {
  const requestId = c.req.param("id");
  const body = await c.req.json();

  if (body.status === "cancelled") {
    const mochaUser = c.get("user");
    const { results: userResults } = await c.env.DB.prepare(
      "SELECT id FROM users WHERE mocha_user_id = ?"
    ).bind(mochaUser?.id).all();
    const dbUser = userResults[0] as any;

    await c.env.DB.prepare(
      `UPDATE requests SET status = ?, cancellation_reason = ?, cancelled_by = ?, cancelled_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind("cancelled", body.cancellation_reason || null, dbUser.id, requestId).run();
  } else {
    await c.env.DB.prepare(
      "UPDATE requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(body.status, requestId).run();
  }

  const { results } = await c.env.DB.prepare(
    `SELECT r.*, u.name as requested_by_name 
     FROM requests r 
     JOIN users u ON r.requested_by = u.id 
     WHERE r.id = ?`
  ).bind(requestId).all();

  return c.json(results[0]);
});

// ===== RACI ROUTES =====
app.get("/api/:entityType/:entityId/raci", authMiddleware, async (c) => {
  const entityType = c.req.param("entityType");
  const entityId = c.req.param("entityId");
  
  const { results } = await c.env.DB.prepare(
    `SELECT r.*, u.name as user_name, u.email, u.cargo, u.photo_url 
     FROM raci_assignments r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.entity_type = ? AND r.entity_id = ?`
  ).bind(entityType, entityId).all();
  
  return c.json(results);
});

app.post("/api/:entityType/:entityId/raci", authMiddleware, async (c) => {
  const entityType = c.req.param("entityType");
  const entityId = c.req.param("entityId");
  const body = await c.req.json();

  const result = await c.env.DB.prepare(
    "INSERT INTO raci_assignments (entity_type, entity_id, user_id, role) VALUES (?, ?, ?, ?)"
  ).bind(entityType, entityId, body.user_id, body.role).run();

  const { results } = await c.env.DB.prepare(
    `SELECT r.*, u.name as user_name, u.email, u.cargo, u.photo_url 
     FROM raci_assignments r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.id = ?`
  ).bind(result.meta.last_row_id).all();

  return c.json(results[0], 201);
});

app.delete("/api/raci/:id", authMiddleware, async (c) => {
  const raciId = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM raci_assignments WHERE id = ?").bind(raciId).run();
  return c.json({ success: true });
});

// ===== USERS ROUTES =====
app.get("/api/users", authMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, name, email, cargo, photo_url FROM users ORDER BY name"
  ).all();
  
  return c.json(results);
});

// ===== DASHBOARD STATS =====
app.get("/api/dashboard/stats", authMiddleware, async (c) => {
  const [projects, disciplines, tasks, requests] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as count, status FROM projects GROUP BY status").all(),
    c.env.DB.prepare("SELECT COUNT(*) as count FROM disciplines").all(),
    c.env.DB.prepare("SELECT COUNT(*) as count, status FROM tasks GROUP BY status").all(),
    c.env.DB.prepare("SELECT COUNT(*) as count, status FROM requests GROUP BY status").all(),
  ]);

  const projectsActive = Number(projects.results.find((p: any) => p.status === 'active')?.count) || 0;
  const projectsCompleted = Number(projects.results.find((p: any) => p.status === 'completed')?.count) || 0;
  
  const tasksTodo = Number(tasks.results.find((t: any) => t.status === 'todo')?.count) || 0;
  const tasksInProgress = Number(tasks.results.find((t: any) => t.status === 'in_progress')?.count) || 0;
  const tasksCompleted = Number(tasks.results.find((t: any) => t.status === 'completed')?.count) || 0;
  
  const requestsOpen = Number(requests.results.find((r: any) => r.status === 'open')?.count) || 0;
  const requestsUrgent = Number(requests.results.find((r: any) => r.status === 'urgent')?.count) || 0;

  return c.json({
    projectsActive,
    projectsCompleted,
    totalDisciplines: Number(disciplines.results[0]?.count) || 0,
    tasksPending: tasksTodo + tasksInProgress,
    tasksCompleted,
    requestsOpen,
    requestsUrgent,
  });
});

app.get("/api/dashboard/recent-requests", authMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT 
      r.*, 
      p.name as project_name
    FROM requests r
    JOIN projects p ON r.project_id = p.id
    WHERE r.status != 'completed' AND r.status != 'cancelled'
    ORDER BY r.created_at DESC
    LIMIT 5
  `).all();

  return c.json(results);
});

// ===== TASK MOVEMENTS =====
app.get("/api/tasks/:taskId/movements", authMiddleware, async (c) => {
  const taskId = c.req.param("taskId");

  const { results } = await c.env.DB.prepare(`
    SELECT 
      tm.*,
      u.name as user_name,
      u.photo_url as user_photo
    FROM task_movements tm
    JOIN users u ON tm.user_id = u.id
    WHERE tm.task_id = ?
    ORDER BY tm.created_at DESC
  `).bind(taskId).all();

  return c.json(results);
});

app.post("/api/tasks/:taskId/movements", authMiddleware, async (c) => {
  const taskId = c.req.param("taskId");
  const body = await c.req.json();
  const mochaUser = c.get("user");

  const { results: userResults } = await c.env.DB.prepare(
    "SELECT id FROM users WHERE mocha_user_id = ?"
  ).bind(mochaUser?.id).all();

  const dbUser = userResults[0] as any;

  const result = await c.env.DB.prepare(
    "INSERT INTO task_movements (task_id, user_id, movement_type, description) VALUES (?, ?, ?, ?)"
  ).bind(
    taskId,
    dbUser.id,
    body.movement_type,
    body.description || null
  ).run();

  // Get task details for notification
  const { results: taskResults } = await c.env.DB.prepare(`
    SELECT t.*, d.name as discipline_name, d.project_id
    FROM tasks t
    JOIN disciplines d ON t.discipline_id = d.id
    WHERE t.id = ?
  `).bind(taskId).all();

  const task = taskResults[0] as any;

  // Create notification for assigned user if different from current user
  if (task.assigned_to && task.assigned_to !== dbUser.id) {
    await c.env.DB.prepare(
      "INSERT INTO notifications (user_id, entity_type, entity_id, title, message, link) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
      task.assigned_to,
      'task',
      taskId,
      'Nova movimentação na tarefa',
      `${dbUser.name || 'Alguém'} adicionou uma movimentação em "${task.title}"`,
      `/projects/${task.project_id}`
    ).run();
  }

  const { results } = await c.env.DB.prepare(`
    SELECT 
      tm.*,
      u.name as user_name,
      u.photo_url as user_photo
    FROM task_movements tm
    JOIN users u ON tm.user_id = u.id
    WHERE tm.id = ?
  `).bind(result.meta.last_row_id).all();

  return c.json(results[0], 201);
});

// ===== NOTIFICATIONS =====
app.get("/api/notifications", authMiddleware, async (c) => {
  const mochaUser = c.get("user");

  const { results: userResults } = await c.env.DB.prepare(
    "SELECT id FROM users WHERE mocha_user_id = ?"
  ).bind(mochaUser?.id).all();

  const dbUser = userResults[0] as any;

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20"
  ).bind(dbUser.id).all();

  return c.json(results);
});

app.get("/api/notifications/unread-count", authMiddleware, async (c) => {
  const mochaUser = c.get("user");

  const { results: userResults } = await c.env.DB.prepare(
    "SELECT id FROM users WHERE mocha_user_id = ?"
  ).bind(mochaUser?.id).all();

  const dbUser = userResults[0] as any;

  const { results } = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0"
  ).bind(dbUser.id).all();

  return c.json({ count: Number((results[0] as any).count) });
});

app.patch("/api/notifications/:id/read", authMiddleware, async (c) => {
  const notificationId = c.req.param("id");

  await c.env.DB.prepare(
    "UPDATE notifications SET is_read = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(notificationId).run();

  return c.json({ success: true });
});

app.post("/api/notifications/mark-all-read", authMiddleware, async (c) => {
  const mochaUser = c.get("user");

  const { results: userResults } = await c.env.DB.prepare(
    "SELECT id FROM users WHERE mocha_user_id = ?"
  ).bind(mochaUser?.id).all();

  const dbUser = userResults[0] as any;

  await c.env.DB.prepare(
    "UPDATE notifications SET is_read = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND is_read = 0"
  ).bind(dbUser.id).run();

  return c.json({ success: true });
});

// ===== USER ASSIGNED TASKS =====
app.get("/api/users/me/tasks", authMiddleware, async (c) => {
  const mochaUser = c.get("user");

  const { results: userResults } = await c.env.DB.prepare(
    "SELECT id FROM users WHERE mocha_user_id = ?"
  ).bind(mochaUser?.id).all();

  const dbUser = userResults[0] as any;

  const { results } = await c.env.DB.prepare(`
    SELECT 
      t.*,
      d.name as discipline_name,
      d.category as discipline_category,
      p.name as project_name,
      p.id as project_id
    FROM tasks t
    JOIN disciplines d ON t.discipline_id = d.id
    JOIN projects p ON d.project_id = p.id
    WHERE t.assigned_to = ? AND t.status != 'completed' AND t.status != 'cancelled'
    ORDER BY 
      CASE t.status
        WHEN 'in_progress' THEN 1
        WHEN 'in_review' THEN 2
        WHEN 'todo' THEN 3
        ELSE 4
      END,
      t.created_at DESC
    LIMIT 10
  `).bind(dbUser.id).all();

  return c.json(results);
});

export default app;
