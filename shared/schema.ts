import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  status: text("status").notNull().default("inactive"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const systemStatus = pgTable("system_status", {
  id: serial("id").primaryKey(),
  protection: boolean("protection").default(true),
  vpn: boolean("vpn").default(true),
  maxMode: boolean("max_mode").default(false),
  autopilot: boolean("autopilot").default(true),
  threatsDetected: integer("threats_detected").default(0),
  lastScan: timestamp("last_scan").defaultNow(),
});

export const toolConfigurations = pgTable("tool_configurations", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").references(() => tools.id),
  userId: integer("user_id").references(() => users.id),
  config: text("config").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
  lastUpdated: true,
});

export const insertSystemStatusSchema = createInsertSchema(systemStatus).omit({
  id: true,
});

export const insertToolConfigSchema = createInsertSchema(toolConfigurations).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Tool = typeof tools.$inferSelect;
export type InsertTool = z.infer<typeof insertToolSchema>;
export type SystemStatus = typeof systemStatus.$inferSelect;
export type InsertSystemStatus = z.infer<typeof insertSystemStatusSchema>;
export type ToolConfiguration = typeof toolConfigurations.$inferSelect;
export type InsertToolConfiguration = z.infer<typeof insertToolConfigSchema>;
