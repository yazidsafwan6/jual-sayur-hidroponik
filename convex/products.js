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
  {
    name: "Sawi Caisim",
    category: "Daun",
    price: 11000,
    unit: "250 gram",
    stock: 24,
    image:
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Tomat Cherry",
    category: "Buah Sayur",
    price: 22000,
    unit: "250 gram",
    stock: 14,
    image:
      "https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Basil Segar",
    category: "Herbal",
    price: 9000,
    unit: "50 gram",
    stock: 28,
    image:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mint Hidroponik",
    category: "Herbal",
    price: 8500,
    unit: "50 gram",
    stock: 22,
    image:
      "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Microgreens Mix",
    category: "Premium",
    price: 26000,
    unit: "100 gram",
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kangkung Hidroponik",
    category: "Daun",
    price: 9500,
    unit: "250 gram",
    stock: 32,
    image:
      "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=900&q=80",
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
    const existingProducts = await ctx.db.query("products").collect();
    const existingNames = new Set(existingProducts.map((product) => product.name));
    let inserted = 0;

    for (const product of starterProducts) {
      if (!existingNames.has(product.name)) {
        await ctx.db.insert("products", product);
        inserted += 1;
      }
    }

    return { inserted };
  },
});
