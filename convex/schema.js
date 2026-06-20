import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    category: v.string(),
    price: v.number(),
    unit: v.string(),
    stock: v.number(),
    image: v.string(),
  }).index("by_category", ["category"]),
});
