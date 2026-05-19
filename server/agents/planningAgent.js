// =========================
// PLANNING AGENT
// =========================

export async function generateProjectPlan(intentData){

  // =========================
  // DEFAULT PLAN
  // =========================

  const plan = {

    projectName: "",

    frontend: [],

    backend: [],

    database: [],

    features: [],

    apiRoutes: [],

    pages: []

  };

  // =========================
  // SAAS PROJECT
  // =========================

  if(
    intentData.category ===
    "saas"
  ){

    plan.projectName =
    "AI SaaS Platform";

    // =========================
    // FRONTEND
    // =========================

    plan.frontend = [

      "React",

      "TailwindCSS",

      "Monaco Editor"

    ];

    // =========================
    // BACKEND
    // =========================

    plan.backend = [

      "Node.js",

      "Express.js",

      "OpenAI API"

    ];

    // =========================
    // DATABASE
    // =========================

    plan.database = [

      "MongoDB"
    ];

    // =========================
    // FEATURES
    // =========================

    plan.features = [

      "Authentication",

      "AI Chat",

      "Code Generation",

      "Live Preview",

      "Deploy System"

    ];

    // =========================
    // ROUTES
    // =========================

    plan.apiRoutes = [

      "/api/ai",

      "/api/auth",

      "/api/projects"

    ];

    // =========================
    // PAGES
    // =========================

    plan.pages = [

      "Dashboard",

      "Workspace",

      "AI Chat",

      "Settings"

    ];

  }

  // =========================
  // FOOD DELIVERY
  // =========================

  if(
    intentData.category ===
    "food_delivery"
  ){

    plan.projectName =
    "Food Delivery Platform";

    plan.frontend = [

      "React",

      "TailwindCSS"

    ];

    plan.backend = [

      "Node.js",

      "Express.js"

    ];

    plan.database = [

      "MongoDB"
    ];

    plan.features = [

      "Restaurant Panel",

      "User Login",

      "Cart",

      "Order Tracking",

      "Payment Gateway"

    ];

    plan.apiRoutes = [

      "/api/orders",

      "/api/restaurants",

      "/api/payment"

    ];

    plan.pages = [

      "Home",

      "Restaurants",

      "Checkout",

      "Admin Panel"

    ];

  }

  // =========================
  // ECOMMERCE
  // =========================

  if(
    intentData.category ===
    "ecommerce"
  ){

    plan.projectName =
    "Ecommerce Platform";

    plan.frontend = [

      "React",

      "TailwindCSS"

    ];

    plan.backend = [

      "Node.js",

      "Express.js"

    ];

    plan.database = [

      "MongoDB"
    ];

    plan.features = [

      "Product Catalog",

      "Shopping Cart",

      "Payments",

      "Admin Dashboard"

    ];

    plan.apiRoutes = [

      "/api/products",

      "/api/orders",

      "/api/users"

    ];

    plan.pages = [

      "Home",

      "Shop",

      "Cart",

      "Dashboard"

    ];

  }

  // =========================
  // RETURN
  // =========================

  return plan;

}
