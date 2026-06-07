// EximpoGlobal - API Endpoints Reference
// Base URL: https://api.eximpo.global (or your server IP)
// All protected routes require header: Authorization: Bearer <token>

import Foundation

struct APIConfig {
    static let baseURL = "https://app.eximpoglobal.net/api"
    // static let baseURL = "http://217.217.250.49/api" // direct IP fallback
}

struct APIEndpoints {

    // MARK: - Auth (Public - no token needed)
    struct Auth {
        static let checkEmail           = "\(APIConfig.baseURL)/auth/check-email"           // POST
        static let register             = "\(APIConfig.baseURL)/auth/register"               // POST
        static let login                = "\(APIConfig.baseURL)/auth/login"                  // POST
        static let forgotPassword       = "\(APIConfig.baseURL)/auth/forgot-password"        // POST
        static let verifyOTP            = "\(APIConfig.baseURL)/auth/verify-otp"             // POST
        static let resetPassword        = "\(APIConfig.baseURL)/auth/reset-password"         // POST
        static let googleSignIn         = "\(APIConfig.baseURL)/auth/google/signin"          // POST (not needed for iOS)
    }

    // MARK: - Profile (Protected)
    struct Profile {
        static let get                  = "\(APIConfig.baseURL)/auth/profile"                // GET
        static let update               = "\(APIConfig.baseURL)/auth/profile"                // PUT
        static let stats                = "\(APIConfig.baseURL)/auth/profile/stats"          // GET
        static let company              = "\(APIConfig.baseURL)/auth/profile/company"        // GET + PUT
        static let preferences          = "\(APIConfig.baseURL)/auth/profile/preferences"    // GET + PUT
    }

    // MARK: - Products
    struct Products {
        static let list                 = "\(APIConfig.baseURL)/products"                    // GET (public)
        static func detail(_ id: String) -> String {
            "\(APIConfig.baseURL)/products/\(id)"                                            // GET (public)
        }
        static let myProducts           = "\(APIConfig.baseURL)/products/my/products"        // GET (seller)
        static let create               = "\(APIConfig.baseURL)/products"                    // POST (seller)
        static func update(_ id: String) -> String {
            "\(APIConfig.baseURL)/products/\(id)"                                            // PUT (seller)
        }
        static func delete(_ id: String) -> String {
            "\(APIConfig.baseURL)/products/\(id)"                                            // DELETE (seller)
        }
    }

    // MARK: - Suppliers (Public)
    struct Suppliers {
        static let list                 = "\(APIConfig.baseURL)/suppliers"                   // GET
        static func detail(_ id: String) -> String {
            "\(APIConfig.baseURL)/suppliers/\(id)"                                           // GET
        }
        static func products(_ id: String) -> String {
            "\(APIConfig.baseURL)/suppliers/\(id)/products"                                  // GET
        }
        static func reviews(_ id: String) -> String {
            "\(APIConfig.baseURL)/suppliers/\(id)/reviews"                                   // GET
        }
        static func stats(_ id: String) -> String {
            "\(APIConfig.baseURL)/suppliers/\(id)/stats"                                     // GET
        }
        static let myProfile            = "\(APIConfig.baseURL)/suppliers/me/profile"        // GET + PUT (seller)
    }

    // MARK: - RFQs (Protected)
    struct RFQs {
        static let list                 = "\(APIConfig.baseURL)/rfqs"                        // GET
        static let create               = "\(APIConfig.baseURL)/rfqs"                        // POST (buyer)
        static func detail(_ id: String) -> String {
            "\(APIConfig.baseURL)/rfqs/\(id)"                                                // GET
        }
    }

    // MARK: - Quotes (Protected)
    struct Quotes {
        static let list                 = "\(APIConfig.baseURL)/quotes"                      // GET
        static let create               = "\(APIConfig.baseURL)/quotes"                      // POST (seller)
        static func byRFQ(_ rfqId: String) -> String {
            "\(APIConfig.baseURL)/quotes/rfq/\(rfqId)"                                       // GET
        }
        static func detail(_ id: String) -> String {
            "\(APIConfig.baseURL)/quotes/\(id)"                                              // GET
        }
        static func accept(_ id: String) -> String {
            "\(APIConfig.baseURL)/quotes/\(id)/accept"                                       // POST (buyer)
        }
        static func reject(_ id: String) -> String {
            "\(APIConfig.baseURL)/quotes/\(id)/reject"                                       // POST (buyer)
        }
    }

    // MARK: - Orders (Protected)
    struct Orders {
        static let list                 = "\(APIConfig.baseURL)/orders"                      // GET
        static let create               = "\(APIConfig.baseURL)/orders"                      // POST
        static func detail(_ id: String) -> String {
            "\(APIConfig.baseURL)/orders/\(id)"                                              // GET
        }
        static func updateStatus(_ id: String) -> String {
            "\(APIConfig.baseURL)/orders/\(id)/status"                                       // PUT (seller)
        }
        static func updatePayment(_ id: String) -> String {
            "\(APIConfig.baseURL)/orders/\(id)/payment"                                      // PUT (buyer)
        }
        static func cancel(_ id: String) -> String {
            "\(APIConfig.baseURL)/orders/\(id)/cancel"                                       // POST
        }
    }

    // MARK: - Shipments (Protected)
    struct Shipments {
        static func track(_ trackingNumber: String) -> String {
            "\(APIConfig.baseURL)/shipments/track/\(trackingNumber)"                         // GET (public)
        }
        static let list                 = "\(APIConfig.baseURL)/shipments"                   // GET
        static let create               = "\(APIConfig.baseURL)/shipments"                   // POST (seller)
        static func detail(_ id: String) -> String {
            "\(APIConfig.baseURL)/shipments/\(id)"                                           // GET
        }
        static func addTracking(_ id: String) -> String {
            "\(APIConfig.baseURL)/shipments/\(id)/tracking"                                  // POST (seller)
        }
    }

    // MARK: - Messages (Protected)
    struct Messages {
        static let conversations        = "\(APIConfig.baseURL)/messages/conversations"      // GET
        static let unreadCount          = "\(APIConfig.baseURL)/messages/unread/count"       // GET
        static let send                 = "\(APIConfig.baseURL)/messages"                    // POST
        static func withPartner(_ partnerId: String) -> String {
            "\(APIConfig.baseURL)/messages/\(partnerId)"                                     // GET
        }
        static func markRead(_ partnerId: String) -> String {
            "\(APIConfig.baseURL)/messages/\(partnerId)/read"                                // PATCH
        }
    }

    // MARK: - Notifications (Protected)
    struct Notifications {
        static let list                 = "\(APIConfig.baseURL)/notifications"               // GET
        static func markRead(_ id: String) -> String {
            "\(APIConfig.baseURL)/notifications/\(id)/read"                                  // PATCH
        }
        static func dismiss(_ id: String) -> String {
            "\(APIConfig.baseURL)/notifications/\(id)"                                       // DELETE
        }
    }

    // MARK: - Analytics (Protected)
    struct Analytics {
        static let buyer                = "\(APIConfig.baseURL)/analytics/buyer"             // GET
        static let seller               = "\(APIConfig.baseURL)/analytics/seller"            // GET
    }

    // MARK: - Payments (Protected)
    struct Payments {
        static let createOrder          = "\(APIConfig.baseURL)/payments/create-order"       // POST
        static let verify               = "\(APIConfig.baseURL)/payments/verify"             // POST
        static let orders               = "\(APIConfig.baseURL)/payments/orders"             // GET
        static func orderDetail(_ id: String) -> String {
            "\(APIConfig.baseURL)/payments/orders/\(id)"                                     // GET
        }
    }

    // MARK: - Uploads (Protected)
    struct Uploads {
        static let productImages        = "\(APIConfig.baseURL)/uploads/products/images"     // POST (multipart)
        static let productImage         = "\(APIConfig.baseURL)/uploads/products/image"      // POST (multipart)
        static let rfqDocuments         = "\(APIConfig.baseURL)/uploads/rfqs/documents"      // POST (multipart)
    }

    // MARK: - Users (Protected)
    struct Users {
        static let list                 = "\(APIConfig.baseURL)/users"                       // GET ?role=buyer|seller
    }

    // MARK: - Health (Public)
    static let health                   = "https://app.eximpoglobal.net/health"               // GET
}


// MARK: - Request Body Structures (for reference)

/*
 LOGIN:
 POST /api/auth/login
 { "email": "user@example.com", "password": "password123" }
 Response: { "success": true, "data": { "token": "jwt...", "user": { "id", "email", "fullName", "role", "companyName" } } }

 REGISTER:
 POST /api/auth/register
 { "email", "password", "fullName", "phone", "role": "buyer|seller", "companyName", "country" }

 SEND MESSAGE:
 POST /api/messages
 { "receiverId": "user-uuid", "message": "Hello" }

 CREATE RFQ:
 POST /api/rfqs
 { "products": [{ "productId", "quantity", "specifications" }], "incoterm", "destinationPort", "deadline" }

 CREATE ORDER:
 POST /api/orders
 { "quoteId": "uuid" }
*/
