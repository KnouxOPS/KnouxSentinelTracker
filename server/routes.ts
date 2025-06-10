import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSystemStatusSchema, insertToolConfigSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tools
  app.get("/api/tools", async (req, res) => {
    try {
      const tools = await storage.getAllTools();
      res.json(tools);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tools" });
    }
  });

  // Get tools by category
  app.get("/api/tools/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const tools = await storage.getToolsByCategory(category);
      res.json(tools);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tools by category" });
    }
  });

  // Get single tool
  app.get("/api/tools/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tool = await storage.getTool(id);
      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }
      res.json(tool);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tool" });
    }
  });

  // Update tool status
  app.patch("/api/tools/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['active', 'inactive'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const tool = await storage.updateToolStatus(id, status);
      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }
      res.json(tool);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tool status" });
    }
  });

  // Get system status
  app.get("/api/system-status", async (req, res) => {
    try {
      const status = await storage.getSystemStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch system status" });
    }
  });

  // Update system status
  app.patch("/api/system-status", async (req, res) => {
    try {
      const validatedData = insertSystemStatusSchema.parse(req.body);
      const status = await storage.updateSystemStatus(validatedData);
      res.json(status);
    } catch (error) {
      res.status(400).json({ error: "Invalid system status data" });
    }
  });

  // Save tool configuration
  app.post("/api/tool-config", async (req, res) => {
    try {
      const validatedData = insertToolConfigSchema.parse(req.body);
      const config = await storage.saveToolConfiguration(validatedData);
      res.json(config);
    } catch (error) {
      res.status(400).json({ error: "Invalid configuration data" });
    }
  });

  // Get tool configuration
  app.get("/api/tool-config/:toolId/:userId", async (req, res) => {
    try {
      const toolId = parseInt(req.params.toolId);
      const userId = parseInt(req.params.userId);
      const config = await storage.getToolConfiguration(toolId, userId);
      res.json(config || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tool configuration" });
    }
  });

  // Export data endpoint
  app.get("/api/export/:format", async (req, res) => {
    try {
      const { format } = req.params;
      const tools = await storage.getAllTools();
      const systemStatus = await storage.getSystemStatus();

      const exportData = {
        tools,
        systemStatus,
        exportedAt: new Date().toISOString(),
      };

      switch (format) {
        case 'json':
          res.json(exportData);
          break;
        case 'csv':
          const csvData = tools.map(tool => 
            `${tool.name},${tool.category},${tool.status},${tool.description}`
          ).join('\n');
          res.setHeader('Content-Type', 'text/csv');
          res.send(`Name,Category,Status,Description\n${csvData}`);
          break;
        default:
          res.status(400).json({ error: "Unsupported export format" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
