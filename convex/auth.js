import { mutation } from "./_generated/server";
import { v } from "convex/values";

const sessionDurationMs = 1000 * 60 * 60 * 8;

function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Admin credentials are not configured.");
  }

  return { email, password };
}

function createSessionToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function requireAdmin(ctx, sessionToken) {
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q) => q.eq("token", sessionToken))
    .unique();

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Admin session is invalid or expired.");
  }

  return session;
}

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = getAdminCredentials();

    if (args.email !== admin.email || args.password !== admin.password) {
      throw new Error("Email or password is incorrect.");
    }

    const token = createSessionToken();
    const expiresAt = Date.now() + sessionDurationMs;

    await ctx.db.insert("adminSessions", {
      email: admin.email,
      token,
      expiresAt,
    });

    return {
      email: admin.email,
      token,
      expiresAt,
    };
  },
});

export const logout = mutation({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.sessionToken))
      .unique();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { ok: true };
  },
});
