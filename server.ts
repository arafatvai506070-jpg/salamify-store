import express from "express";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://wgctymduwrrdxmxvtsov.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnY3R5bWR1d3JyZHhteHZ0c292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Mjg0NTMsImV4cCI6MjA4ODMwNDQ1M30.3zNMVtZvtxxwPaZXsvihVatXjbHHpL2CquIt7FTWHO0";

const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  
  // Basic middleware
  app.use(express.json({ limit: '50mb' }));

  // Request logging for debugging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.get("/api/health", async (req, res) => {
    try {
      const { data, error } = await supabase.from("products").select("id").limit(1);
      res.json({ 
        status: "ok", 
        time: new Date().toISOString(),
        database: error ? "error" : "connected",
        db_error: error ? error.message : null
      });
    } catch (e: any) {
      res.json({ status: "error", error: e.message });
    }
  });

  // Helper function to verify admin token
  const verifyAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("Auth failed: No authorization header");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("Auth failed: No token in header");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      // টোকেনটি যদি ৭ দিনের বেশি পুরনো হয় তবে রিজেক্ট করবে
      if (Date.now() - decoded.time > 7 * 24 * 60 * 60 * 1000) {
        console.log("Auth failed: Session expired");
        return res.status(401).json({ error: "Session expired" });
      }
      next();
    } catch (e) {
      console.log("Auth failed: Invalid token format");
      res.status(401).json({ error: "Invalid session" });
    }
  };

  // API Routes
  app.get("/api/products", async (req, res) => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", req.params.id).single();
      if (error) return res.status(404).json({ error: "Product not found" });
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Login with Role Based Access
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      let { data: admin, error } = await supabase
        .from("admins")
        .select("id, email, role")
        .eq("email", email)
        .eq("password", password)
        .single();
      
      // Fallback if role column is missing
      if (error && error.message.includes('column "role" does not exist')) {
        console.warn("Admin table missing 'role' column, attempting fallback...");
        const { data: fallbackAdmin, error: fallbackError } = await supabase
          .from("admins")
          .select("id, email")
          .eq("email", email)
          .eq("password", password)
          .single();
        
        if (fallbackAdmin) {
          admin = { ...fallbackAdmin, role: 'superadmin' };
          error = null;
        } else {
          error = fallbackError;
        }
      }
      
      if (error) {
        console.error("Login error from Supabase:", error);
        return res.status(401).json({ error: "Invalid credentials or database error" });
      }
      
      if (admin) {
        const role = admin.role || 'admin';
        if (role === 'superadmin' || role === 'admin' || role === 'editor') {
          const sessionToken = Buffer.from(JSON.stringify({
            id: admin.id,
            role: role,
            time: Date.now()
          })).toString('base64');
          
          res.json({ 
            success: true, 
            token: sessionToken,
            role: role 
          });
        } else {
          res.status(403).json({ error: "Access denied: Unauthorized role" });
        }
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Protected Admin Routes (Token Required)
  app.post("/api/products", verifyAdmin, async (req, res) => {
    try {
      const { name, description, price, image, category, stock } = req.body;
      const { data, error } = await supabase
        .from("products")
        .insert([{ name, description, price, image, category, stock: stock || 0 }])
        .select();
      
      if (error) throw error;
      res.json({ id: data[0].id });
    } catch (error: any) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/products/:id", verifyAdmin, async (req, res) => {
    try {
      const { name, description, price, image, category, stock } = req.body;
      const { error } = await supabase
        .from("products")
        .update({ name, description, price, image, category, stock: stock || 0 })
        .eq("id", req.params.id);
      
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", verifyAdmin, async (req, res) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Customer Auth
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const { data, error } = await supabase
        .from("customers")
        .insert([{ name, email, phone, password }])
        .select();
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          res.status(400).json({ error: "Email or Phone already exists" });
        } else {
          throw error;
        }
      } else {
        res.status(201).json({ id: data[0].id, success: true });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { identifier, password } = req.body;
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .or(`email.eq.${identifier},phone.eq.${identifier}`)
        .eq("password", password)
        .single();
      
      if (data) {
        res.json({ success: true, customer: data });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Customer Profile
  app.get("/api/customer/profile", async (req, res) => {
    try {
      const { identifier } = req.query;
      if (!identifier) return res.status(400).json({ error: "Identifier required" });

      const { data: customer, error } = await supabase
        .from("customers")
        .select("*")
        .or(`email.eq.${identifier},phone.eq.${identifier}`)
        .single();
      
      if (!customer) {
        // Try to find from latest order to pre-fill
        const { data: latestOrder } = await supabase
          .from("orders")
          .select("*")
          .or(`customer_email.eq.${identifier},customer_phone.eq.${identifier}`)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (latestOrder) {
          res.json({
            name: latestOrder.customer_name,
            email: latestOrder.customer_email,
            phone: latestOrder.customer_phone,
            address: latestOrder.address,
            city: latestOrder.city,
            area: latestOrder.area,
            profile_image: null,
            bio: null
          });
        } else {
          res.status(404).json({ error: "Customer not found" });
        }
      } else {
        res.json(customer);
      }
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/customer/profile", async (req, res) => {
    try {
      const { name, email, phone, address, city, area, profile_image, bio } = req.body;
      
      const { data: existing } = await supabase
        .from("customers")
        .select("id")
        .or(`email.eq.${email},phone.eq.${phone}`)
        .single();
      
      if (existing) {
        await supabase
          .from("customers")
          .update({ name, email, phone, address, city, area, profile_image, bio })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("customers")
          .insert([{ name, email, phone, address, city, area, profile_image, bio }]);
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Customer Order Tracking
  app.get("/api/customer/orders", async (req, res) => {
    const { identifier } = req.query;
    if (!identifier) return res.status(400).json({ error: "Identifier required" });

    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            price,
            products (name)
          )
        `)
        .or(`customer_email.eq.${identifier},customer_phone.eq.${identifier}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Format to match previous API response
      const formattedOrders = orders.map((o: any) => ({
        ...o,
        items_summary: o.order_items.map((oi: any) => `${oi.products.name} (x${oi.quantity})`).join(", ")
      }));

      res.json(formattedOrders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Orders (Protected)
  app.get("/api/admin/orders", verifyAdmin, async (req, res) => {
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            price,
            products (name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedOrders = orders.map((o: any) => ({
        ...o,
        items_summary: o.order_items.map((oi: any) => `${oi.products.name} (x${oi.quantity})`).join(", ")
      }));

      res.json(formattedOrders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update Order Status (Protected)
  app.patch("/api/admin/orders/:id", verifyAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const { error } = await supabase.from("orders").update({ status }).eq("id", req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Analytics Endpoint (Protected)
  app.get("/api/admin/analytics", verifyAdmin, async (req, res) => {
    try {
      const { data: orders } = await supabase.from("orders").select("total, created_at");
      const { count: totalProducts } = await supabase.from("products").select("*", { count: 'exact', head: true });
      const { data: items } = await supabase.from("order_items").select("quantity, price, products(category)");

      const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
      const totalOrdersCount = orders?.length || 0;

      // Sales by category
      const categoryMap: Record<string, number> = {};
      items?.forEach((item: any) => {
        const cat = item.products.category;
        const val = Number(item.quantity) * Number(item.price);
        categoryMap[cat] = (categoryMap[cat] || 0) + val;
      });
      const salesByCategory = Object.entries(categoryMap).map(([category, value]) => ({ category, value }));

      // Sales over time (last 7 days)
      const dateMap: Record<string, number> = {};
      orders?.forEach(o => {
        const date = new Date(o.created_at).toISOString().split('T')[0];
        dateMap[date] = (dateMap[date] || 0) + Number(o.total);
      });
      const salesOverTime = Object.entries(dateMap)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-7);

      res.json({
        summary: {
          revenue: totalRevenue,
          orders: totalOrdersCount,
          products: totalProducts || 0,
          avgOrderValue: totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount) : 0
        },
        salesByCategory,
        salesOverTime
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    const { customer, items, total, payment } = req.body;
    
    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          city: customer.city,
          area: customer.area,
          address: customer.address,
          payment_method: payment.method,
          transaction_id: payment.transactionId || null,
          total
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      res.status(201).json({ id: order.id, message: "Order placed successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Catch-all route for SPA, but EXCLUDE /api routes
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

const appPromise = startServer();

// For local development
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  appPromise.then(app => {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

// Export for Vercel
export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};
