import { RequestHandler } from "express";
import { DatabaseService } from "../database/db";
import { v4 as uuidv4 } from "uuid";

const dbService = DatabaseService.getInstance();

// Simple AI-like responses for the chatbot
const chatbotResponses = {
  greetings: [
    "Hello! Welcome to our marketplace! How can I help you today?",
    "Hi there! I'm here to assist you with your shopping needs. What can I do for you?",
    "Welcome! I'm your virtual shopping assistant. How may I help you?",
  ],
  products: [
    "I can help you find products! What are you looking for?",
    "Let me help you discover amazing products. What category interests you?",
    "I can show you our featured products or help you search for something specific. What would you prefer?",
  ],
  orders: [
    "I can help you with order-related questions. Do you need to track an order or place a new one?",
    "For order assistance, I can help you check status, track shipments, or process returns. What do you need?",
    "Order support is my specialty! What's your order number or how can I assist with your purchase?",
  ],
  shipping: [
    "We offer fast and reliable shipping! Most orders are delivered within 3-5 business days.",
    "Shipping is free on orders over $50. Standard delivery takes 3-5 business days, express delivery 1-2 days.",
    "I can help you with shipping information. What would you like to know about delivery?",
  ],
  returns: [
    "We have a 30-day return policy. Items must be in original condition for a full refund.",
    "Returns are easy! You can return most items within 30 days. Would you like me to start a return process?",
    "Our return policy is customer-friendly. What item would you like to return?",
  ],
  payment: [
    "We accept all major credit cards, PayPal, and digital wallets for secure payment.",
    "Payment is secure and encrypted. We support credit cards, debit cards, and PayPal.",
    "Your payment information is safe with us. We use industry-standard encryption.",
  ],
  account: [
    "You can create an account for faster checkout and order tracking, but guest checkout is also available!",
    "Account benefits include order history, saved addresses, and exclusive offers. Would you like to sign up?",
    "No account required! You can shop as a guest or create an account for additional features.",
  ],
  default: [
    "I'm here to help! You can ask me about products, orders, shipping, returns, or account questions.",
    "I can assist with product searches, order tracking, shipping info, and more. What would you like to know?",
    "Feel free to ask me anything about shopping, orders, products, or our services!",
  ],
};

// Generate chatbot response based on user message
function generateChatbotResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Check for greeting keywords
  if (/(hello|hi|hey|greetings)/i.test(message)) {
    return getRandomResponse(chatbotResponses.greetings);
  }

  // Check for product-related keywords
  if (/(product|item|buy|purchase|shop|catalog)/i.test(message)) {
    return getRandomResponse(chatbotResponses.products);
  }

  // Check for order-related keywords
  if (/(order|track|status|receipt|purchase)/i.test(message)) {
    return getRandomResponse(chatbotResponses.orders);
  }

  // Check for shipping keywords
  if (/(shipping|delivery|ship|arrive|when)/i.test(message)) {
    return getRandomResponse(chatbotResponses.shipping);
  }

  // Check for return keywords
  if (/(return|refund|exchange|cancel)/i.test(message)) {
    return getRandomResponse(chatbotResponses.returns);
  }

  // Check for payment keywords
  if (/(payment|pay|credit|card|paypal|checkout)/i.test(message)) {
    return getRandomResponse(chatbotResponses.payment);
  }

  // Check for account keywords
  if (/(account|login|register|sign|profile)/i.test(message)) {
    return getRandomResponse(chatbotResponses.account);
  }

  // Default response
  return getRandomResponse(chatbotResponses.default);
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Start chat session
export const startChatSession: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId; // May be undefined for guests
    const { guestIdentifier } = req.body; // For anonymous users

    const sessionId = uuidv4();

    await dbService.createChatSession(
      sessionId,
      userId,
      guestIdentifier || `guest_${Date.now()}`,
    );

    // Send welcome message
    const welcomeMessage = getRandomResponse(chatbotResponses.greetings);
    await dbService.addChatMessage(sessionId, welcomeMessage, "bot");

    res.status(201).json({
      success: true,
      data: {
        sessionId,
        welcomeMessage,
      },
    });
  } catch (error: any) {
    console.error("Start chat session error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Send message to chatbot
export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Save user message
    await dbService.addChatMessage(sessionId, message, "user");

    // Generate bot response
    const botResponse = generateChatbotResponse(message);

    // Save bot response
    await dbService.addChatMessage(sessionId, botResponse, "bot", {
      timestamp: new Date().toISOString(),
      responseType: "automated",
    });

    res.json({
      success: true,
      data: {
        userMessage: message,
        botResponse,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get chat history
export const getChatHistory: RequestHandler = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    const messages = await dbService.getChatHistory(
      sessionId,
      parseInt(limit as string),
    );

    // Parse metadata for each message
    const processedMessages = messages.map((message) => ({
      ...message,
      metadata: JSON.parse(message.metadata || "{}"),
    }));

    res.json({
      success: true,
      data: processedMessages,
    });
  } catch (error: any) {
    console.error("Get chat history error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get product recommendations (enhanced chatbot feature)
export const getProductRecommendations: RequestHandler = async (req, res) => {
  try {
    const { query, category, maxPrice } = req.query;

    const filters: any = {
      isActive: true,
      limit: 5,
    };

    if (query) {
      filters.search = query as string;
    }

    if (category) {
      filters.categoryId = parseInt(category as string);
    }

    const products = await dbService.getProducts(filters);

    // Filter by price if specified
    let filteredProducts = products;
    if (maxPrice) {
      filteredProducts = products.filter((product) => {
        const price = product.discount_price || product.price;
        return price <= parseFloat(maxPrice as string);
      });
    }

    // Process products for response
    const recommendations = filteredProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      originalPrice: product.price,
      imageUrl: product.image_url,
      categoryName: product.category_name,
      vendorName: product.vendor_name,
    }));

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error: any) {
    console.error("Get product recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Handle specific product inquiry
export const handleProductInquiry: RequestHandler = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productId, question } = req.body;

    if (!productId || !question) {
      return res.status(400).json({
        success: false,
        message: "Product ID and question are required",
      });
    }

    const db = await dbService.getDb();
    const product = await db.get(
      `
      SELECT p.*, c.name as category_name, v.business_name as vendor_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN vendors v ON p.vendor_id = v.id
      WHERE p.id = ? AND p.is_active = 1
    `,
      [productId],
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Generate contextual response based on product and question
    let response = "";
    const lowerQuestion = question.toLowerCase();

    if (/(price|cost|how much)/i.test(question)) {
      const price = product.discount_price || product.price;
      response = `The price for "${product.name}" is $${price}${product.discount_price ? ` (discounted from $${product.price})` : ""}. `;
    } else if (/(stock|available|quantity)/i.test(question)) {
      response = `"${product.name}" ${product.stock_quantity > 0 ? `has ${product.stock_quantity} units in stock` : "is currently out of stock"}. `;
    } else if (/(shipping|delivery)/i.test(question)) {
      response = `"${product.name}" ships within 1-2 business days. Standard delivery takes 3-5 business days. `;
    } else if (/(return|warranty)/i.test(question)) {
      response = `"${product.name}" comes with our standard 30-day return policy and manufacturer warranty. `;
    } else {
      response = `I can help you with "${product.name}" from ${product.vendor_name}. This ${product.category_name} product is available for $${product.discount_price || product.price}. `;
    }

    response +=
      "Would you like to add it to your cart or need more information?";

    // Save the inquiry and response
    await dbService.addChatMessage(sessionId, question, "user", {
      productId,
      inquiryType: "product",
    });
    await dbService.addChatMessage(sessionId, response, "bot", {
      productId,
      productName: product.name,
      responseType: "product_inquiry",
    });

    res.json({
      success: true,
      data: {
        question,
        response,
        product: {
          id: product.id,
          name: product.name,
          price: product.discount_price || product.price,
          originalPrice: product.price,
          stockQuantity: product.stock_quantity,
          categoryName: product.category_name,
          vendorName: product.vendor_name,
        },
      },
    });
  } catch (error: any) {
    console.error("Handle product inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get chat analytics (admin only)
export const getChatAnalytics: RequestHandler = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const db = await dbService.getDb();

    // Get session stats
    let sessionQuery =
      "SELECT COUNT(*) as total_sessions FROM chat_sessions WHERE 1=1";
    const sessionParams: any[] = [];

    if (startDate) {
      sessionQuery += " AND created_at >= ?";
      sessionParams.push(startDate);
    }

    if (endDate) {
      sessionQuery += " AND created_at <= ?";
      sessionParams.push(endDate);
    }

    const sessionStats = await db.get(sessionQuery, sessionParams);

    // Get message stats
    let messageQuery =
      "SELECT COUNT(*) as total_messages, sender FROM chat_messages WHERE 1=1";
    const messageParams: any[] = [];

    if (startDate) {
      messageQuery += " AND created_at >= ?";
      messageParams.push(startDate);
    }

    if (endDate) {
      messageQuery += " AND created_at <= ?";
      messageParams.push(endDate);
    }

    messageQuery += " GROUP BY sender";

    const messageStats = await db.all(messageQuery, messageParams);

    // Get popular inquiries
    const popularTopics = await db.all(
      `
      SELECT 
        CASE 
          WHEN message LIKE '%product%' OR message LIKE '%item%' THEN 'Products'
          WHEN message LIKE '%order%' OR message LIKE '%track%' THEN 'Orders'
          WHEN message LIKE '%shipping%' OR message LIKE '%delivery%' THEN 'Shipping'
          WHEN message LIKE '%return%' OR message LIKE '%refund%' THEN 'Returns'
          WHEN message LIKE '%payment%' OR message LIKE '%pay%' THEN 'Payment'
          ELSE 'General'
        END as topic,
        COUNT(*) as count
      FROM chat_messages 
      WHERE sender = 'user'
      ${startDate ? "AND created_at >= ?" : ""}
      ${endDate ? "AND created_at <= ?" : ""}
      GROUP BY topic
      ORDER BY count DESC
    `,
      [startDate, endDate].filter(Boolean),
    );

    res.json({
      success: true,
      data: {
        sessionStats,
        messageStats,
        popularTopics,
      },
    });
  } catch (error: any) {
    console.error("Get chat analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
