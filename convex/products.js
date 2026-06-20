import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

const starterProducts = [
  {
    name: "Pakcoy Hidroponik",
    category: "Daun",
    price: 12000,
    unit: "250 gram",
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Selada Romaine",
    category: "Daun",
    price: 15000,
    unit: "200 gram",
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kale Keriting",
    category: "Premium",
    price: 18000,
    unit: "150 gram",
    stock: 9,
    image:
      "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Bayam Hijau",
    category: "Daun",
    price: 10000,
    unit: "250 gram",
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=900&q=80",
  },
];

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const create = mutation({
  args: {
    sessionToken: v.string(),
    name: v.string(),
    category: v.string(),
    price: v.number(),
    unit: v.string(),
    stock: v.number(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);
    const { sessionToken, ...product } = args;
    return await ctx.db.insert("products", product);
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("products"),
    name: v.string(),
    category: v.string(),
    price: v.number(),
    unit: v.string(),
    stock: v.number(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);
    const { sessionToken, id, ...product } = args;
    await ctx.db.patch(id, product);
    return { ok: true };
  },
});

export const remove = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const seedDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();

    if (existing) {
      return { inserted: 0 };
    }

    for (const product of starterProducts) {
      await ctx.db.insert("products", product);
    }

    return { inserted: starterProducts.length };
  },
});
