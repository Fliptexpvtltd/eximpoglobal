// iOS/macOS Account Deletion Implementation
// Add this to your AuthService or AccountManager class

import Foundation

// MARK: - Account Deletion
extension AuthService {
    
    /// Delete user account (requires authentication)
    /// - Parameters:
    ///   - completion: Completion handler with success status and optional error
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
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        print("🗑️ Deleting account at: \(urlString)")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            // Check for network errors
            if let error = error {
                print("❌ Network error:", error.localizedDescription)
                DispatchQueue.main.async {
                    completion(false, "Network error: \(error.localizedDescription)")
                }
                return
            }
            
            // Check HTTP response
            guard let httpResponse = response as? HTTPURLResponse else {
                print("❌ Invalid response")
                DispatchQueue.main.async {
                    completion(false, "Invalid server response")
                }
                return
            }
            
            print("📊 Delete account response status: \(httpResponse.statusCode)")
            
            // Handle different status codes
            switch httpResponse.statusCode {
            case 200:
                // Success - account deleted
                do {
                    if let data = data {
                        let decoder = JSONDecoder()
                        let response = try decoder.decode(DeleteAccountResponse.self, from: data)
                        print("✅ Account deleted successfully: \(response.email)")
                        
                        DispatchQueue.main.async {
                            // Clear stored credentials
                            self.clearAuthData()
                            completion(true, nil)
                        }
                    }
                } catch {
                    print("⚠️ Failed to parse response: \(error)")
                    DispatchQueue.main.async {
                        self.clearAuthData()
                        completion(true, nil) // Still success, account was deleted
                    }
                }
                
            case 401:
                print("❌ Unauthorized - Invalid or expired token")
                DispatchQueue.main.async {
                    completion(false, "Session expired. Please login again.")
                }
                
            case 404:
                print("❌ User not found")
                DispatchQueue.main.async {
                    completion(false, "User account not found")
                }
                
            case 500:
                print("❌ Server error")
                if let data = data,
                   let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
                    DispatchQueue.main.async {
                        completion(false, errorResponse.message)
                    }
                } else {
                    DispatchQueue.main.async {
                        completion(false, "Server error. Please try again later.")
                    }
                }
                
            default:
                print("❌ Unexpected status code: \(httpResponse.statusCode)")
                DispatchQueue.main.async {
                    completion(false, "Failed to delete account (Status: \(httpResponse.statusCode))")
                }
            }
        }.resume()
    }
    
    /// Clear all stored authentication data
    private func clearAuthData() {
        print("🧹 Clearing authentication data")
        
        // Remove from Keychain (if using Keychain)
        let defaults = UserDefaults.standard
        defaults.removeObject(forKey: "auth_token")
        defaults.removeObject(forKey: "user_id")
        defaults.removeObject(forKey: "user_email")
        defaults.removeObject(forKey: "user_role")
        defaults.synchronize()
        
        // Also clear from secure storage if using SecureEnclave
        clearKeychainData()
    }
    
    /// Clear Keychain data (adjust keys based on your implementation)
    private func clearKeychainData() {
        let keychainQuery: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: "com.eximpoglobal.auth_token"
        ]
        SecItemDelete(keychainQuery as CFDictionary)
    }
}

// MARK: - Response Models
struct DeleteAccountResponse: Codable {
    let success: Bool
    let message: String
    let email: String
}

struct ErrorResponse: Codable {
    let success: Bool
    let message: String
}

// MARK: - Usage Example in View Controller / SwiftUI

// SwiftUI Example:
import SwiftUI

struct ProfileView: View {
    @State private var showDeleteConfirmation = false
    @State private var isDeleting = false
    @State private var deleteError: String?
    
    @Environment(\.dismiss) var dismiss
    let authService = AuthService()
    
    var body: some View {
        VStack(spacing: 16) {
            // ... other profile content ...
            
            // Delete Account Button
            Button(action: {
                showDeleteConfirmation = true
            }) {
                HStack {
                    Image(systemName: "trash.fill")
                    Text("Delete Account")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.red)
                .foregroundColor(.white)
                .cornerRadius(8)
            }
            
            // Delete Confirmation Alert
            .alert("Delete Account?", isPresented: $showDeleteConfirmation) {
                Button("Cancel", role: .cancel) { }
                Button("Delete", role: .destructive) {
                    deleteAccount()
                }
            } message: {
                Text("This action cannot be undone. All your data including orders, products, messages, and profile information will be permanently deleted.")
            }
            
            // Error message
            if let error = deleteError {
                Text(error)
                    .foregroundColor(.red)
                    .font(.caption)
            }
            
            if isDeleting {
                ProgressView()
                    .frame(maxWidth: .infinity)
            }
        }
        .padding()
    }
    
    private func deleteAccount() {
        isDeleting = true
        deleteError = nil
        
        authService.deleteAccount { success, error in
            isDeleting = false
            
            if success {
                print("✅ Account deleted successfully")
                // Navigate to login screen
                dismiss()
                // Or: AppDelegate.navigateToLogin()
            } else {
                deleteError = error ?? "Failed to delete account"
                print("❌ Delete failed: \(error ?? "Unknown error")")
            }
        }
    }
}

// UIKit Example (ViewController):
class ProfileViewController: UIViewController {
    @IBAction func deleteAccountTapped(_ sender: UIButton) {
        let alertController = UIAlertController(
            title: "Delete Account?",
            message: "This action cannot be undone. All your data will be permanently deleted.",
            preferredStyle: .alert
        )
        
        alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alertController.addAction(UIAlertAction(title: "Delete", style: .destructive) { _ in
            self.performDelete()
        })
        
        present(alertController, animated: true)
    }
    
    private func performDelete() {
        let authService = AuthService()
        
        authService.deleteAccount { success, error in
            if success {
                print("✅ Account deleted successfully")
                // Navigate to login
                self.navigationController?.popToRootViewController(animated: true)
            } else {
                let errorAlert = UIAlertController(
                    title: "Error",
                    message: error ?? "Failed to delete account",
                    preferredStyle: .alert
                )
                errorAlert.addAction(UIAlertAction(title: "OK", style: .default))
                self.present(errorAlert, animated: true)
            }
        }
    }
}
