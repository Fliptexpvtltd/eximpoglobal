# Account Deletion API - iOS/macOS Implementation Guide

## 📋 Endpoint

```
DELETE /api/auth/account
```

**Base URL:** `https://app.eximpoglobal.net` (production)  
**Base URL:** `http://localhost:5000` (local development)

---

## 🔐 Authentication

**Required:** Bearer token in `Authorization` header

```
Authorization: Bearer <JWT_TOKEN>
```

The JWT token is obtained during login (Apple Sign In or Google Sign In).

---

## 📤 Request

### Headers
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Body
No request body needed. The user ID is extracted from the JWT token.

### cURL Example
```bash
curl -X DELETE 'http://localhost:5000/api/auth/account' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN_HERE'
```

---

## 📥 Response

### Success (200 OK)
```json
{
  "success": true,
  "message": "Account successfully deleted",
  "email": "prakashchary319@gmail.com"
}
```

### Error Responses

**401 Unauthorized** - No token or invalid token
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**404 Not Found** - User not found (shouldn't happen if token is valid)
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Server Error**
```json
{
  "success": false,
  "message": "Failed to delete account"
}
```

---

## 🔄 What Happens After Deletion

1. ✅ **User account completely removed** from database
2. ✅ **All related data deleted** (orders, products, quotes, messages) via CASCADE
3. ✅ **JWT token becomes invalid** for future requests
4. ❌ **Cannot login** with the same email again
5. ✅ **Can register fresh account** with same email

---

## 📱 iOS Swift Implementation Steps

### Step 1: Add to Your AuthService Class

```swift
func deleteAccount(completion: @escaping (Bool, String?) -> Void) {
    guard let token = getStoredToken() else {
        completion(false, "No authentication token found")
        return
    }
    
    let urlString = "\(baseURL)/auth/account"
    guard let url = URL(string: urlString) else {
        completion(false, "Invalid URL")
        return
    }
    
    var request = URLRequest(url: url)
    request.httpMethod = "DELETE"
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    
    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            DispatchQueue.main.async {
                completion(false, error.localizedDescription)
            }
            return
        }
        
        guard let httpResponse = response as? HTTPURLResponse else {
            DispatchQueue.main.async {
                completion(false, "Invalid response")
            }
            return
        }
        
        if httpResponse.statusCode == 200 {
            // Clear stored token and user data
            UserDefaults.standard.removeObject(forKey: "auth_token")
            UserDefaults.standard.removeObject(forKey: "user_id")
            UserDefaults.standard.removeObject(forKey: "user_email")
            
            DispatchQueue.main.async {
                completion(true, nil)
            }
        } else {
            DispatchQueue.main.async {
                completion(false, "Failed to delete account (Status: \(httpResponse.statusCode))")
            }
        }
    }.resume()
}
```

### Step 2: Call from View Controller

**SwiftUI:**
```swift
Button(role: .destructive) {
    authService.deleteAccount { success, error in
        if success {
            // Navigate to login
            dismiss()
        } else {
            print("Delete failed: \(error ?? "")")
        }
    }
} label: {
    Label("Delete Account", systemImage: "trash.fill")
}
```

**UIKit:**
```swift
authService.deleteAccount { success, error in
    if success {
        self.navigationController?.popToRootViewController(animated: true)
    } else {
        let alert = UIAlertController(title: "Error", message: error, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        self.present(alert, animated: true)
    }
}
```

### Step 3: Handle Token Storage

Make sure your token storage works with the `Authorization: Bearer <token>` format:

```swift
// Getting token
let token = UserDefaults.standard.string(forKey: "auth_token") ?? ""

// Setting token (from login response)
UserDefaults.standard.set(response.data.token, forKey: "auth_token")
```

Or use Keychain for more security:

```swift
import Security

func storeTokenInKeychain(_ token: String) {
    let data = token.data(using: .utf8)!
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: "auth_token",
        kSecValueData as String: data
    ]
    SecItemDelete(query as CFDictionary)
    SecItemAdd(query as CFDictionary, nil)
}

func getTokenFromKeychain() -> String? {
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: "auth_token",
        kSecReturnData as String: true
    ]
    
    var result: AnyObject?
    SecItemCopyMatching(query as CFDictionary, &result)
    
    if let data = result as? Data {
        return String(data: data, encoding: .utf8)
    }
    return nil
}
```

---

## ✅ Testing Checklist

- [ ] User can tap "Delete Account" button
- [ ] Confirmation alert appears with warning message
- [ ] Upon confirmation, app shows loading indicator
- [ ] DELETE request sent to `/api/auth/account` with valid token
- [ ] Database confirms account is deleted: `SELECT * FROM users WHERE email = 'test@test.com'` returns 0 rows
- [ ] User is logged out (token cleared)
- [ ] App navigates to login screen
- [ ] User cannot login with same email (shows "Invalid email or password")
- [ ] User can register new account with same email ✅

---

## 🐛 Troubleshooting

**"Authentication required" error (401)**
- Check JWT token is being sent in Authorization header
- Token may be expired (90 days max)
- Verify token format: `Bearer <token>` (not just `<token>`)

**"User not found" error (404)**
- Shouldn't happen if token is valid
- Check if user was already deleted
- Verify user ID matches in token vs database

**"Failed to delete account" error (500)**
- Backend server error
- Check backend logs for details
- Verify database CASCADE constraints are set up

**App crashes after delete**
- Make sure to clear token BEFORE navigating away
- Don't use expired token for subsequent requests
- Handle nil token gracefully in headers

---

## 📞 API Response Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Account deleted successfully |
| 400 | Bad request (missing fields) |
| 401 | Unauthorized (no token or invalid) |
| 404 | User not found |
| 500 | Server error |

---

## 🔗 Related Endpoints

- `POST /api/auth/apple/signin` - Apple Sign In
- `POST /api/auth/apple/complete-registration` - Complete Apple registration
- `POST /api/auth/login` - Email/password login
- `GET /api/auth/profile` - Get user profile

---

## 📝 Notes

- Account deletion is **permanent and irreversible**
- All associated data is deleted via CASCADE constraints
- User can create new account with same email after deletion
- Deleted account data is NOT recoverable
- For compliance: Apple Review Guideline 5.1.1(v) requires account deletion feature

