import { PublicNavigation } from './PublicNavigation';

interface CookiePolicyProps {
  onNavigate: (view: string) => void;
}

export function CookiePolicy({ onNavigate }: CookiePolicyProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation onNavigate={onNavigate} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 3, 2026</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies help us remember your preferences, understand how you use our platform, and improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              EximpoGlobal uses cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Essential Cookies:</strong> Required for the platform to function properly</li>
              <li><strong>Authentication:</strong> To keep you logged in as you navigate between pages</li>
              <li><strong>Security:</strong> To detect and prevent fraudulent activity</li>
              <li><strong>Preferences:</strong> To remember your settings and preferences</li>
              <li><strong>Analytics:</strong> To understand how visitors use our platform</li>
              <li><strong>Advertising:</strong> To deliver relevant advertisements (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies are necessary for the platform to function and cannot be disabled. They include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Session management and authentication</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing and server routing</li>
                  <li>Shopping cart and checkout functionality</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies enable personalized features and remember your choices:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Language and region preferences</li>
                  <li>Display settings and layout preferences</li>
                  <li>Recently viewed products</li>
                  <li>Search history and filters</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies help us understand how you interact with our platform:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Pages visited and time spent on pages</li>
                  <li>Navigation paths and click patterns</li>
                  <li>Error messages and technical issues</li>
                  <li>Device type, browser, and operating system</li>
                  <li>Geographic location (country/city level)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                  We use Google Analytics and similar services that may place cookies on your device.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  With your consent, these cookies help us deliver relevant advertisements:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Track ad impressions and clicks</li>
                  <li>Measure ad campaign effectiveness</li>
                  <li>Build profiles based on browsing behavior</li>
                  <li>Deliver personalized advertisements</li>
                  <li>Retarget visitors with relevant ads</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Third-Party Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Some cookies are placed by third-party services:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Payment processors (Stripe, PayPal)</li>
                  <li>Analytics providers (Google Analytics)</li>
                  <li>Advertising networks (Google Ads, Facebook Pixel)</li>
                  <li>Social media platforms (Facebook, LinkedIn, Twitter)</li>
                  <li>Chat and support services</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookie Duration</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These temporary cookies are deleted when you close your browser. They are used for essential functions like maintaining your login session.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Persistent Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies remain on your device for a set period (ranging from days to years) or until you manually delete them. They remember your preferences and settings across visits.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Managing Your Cookie Preferences</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have control over cookies:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookie Consent Banner</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you first visit our platform, you'll see a cookie banner where you can accept all cookies, reject non-essential cookies, or customize your preferences.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Browser Settings</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Most browsers allow you to control cookies through settings:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete cookies when you close the browser</li>
                  <li>View and delete individual cookies</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                  Note: Blocking essential cookies may prevent parts of our platform from functioning properly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Opt-Out of Analytics</h3>
                <p className="text-gray-700 leading-relaxed">
                  You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on available at: https://tools.google.com/dlpage/gaoptout
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Advertising Opt-Out</h3>
                <p className="text-gray-700 leading-relaxed">
                  To opt out of personalized advertising, visit the Digital Advertising Alliance's opt-out page at: http://www.aboutads.info/choices/
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Do Not Track</h2>
            <p className="text-gray-700 leading-relaxed">
              Some browsers have a "Do Not Track" feature that signals websites not to track you. Currently, there is no standard for how to respond to these signals. We do not alter our data collection practices in response to Do Not Track signals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Mobile Identifiers</h2>
            <p className="text-gray-700 leading-relaxed">
              When you use our mobile app, we may collect mobile device identifiers (such as advertising IDs) that function similarly to cookies. You can reset or limit tracking through your device settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will post the updated policy with a new "Last Updated" date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you have questions about our use of cookies:
            </p>
            <div className="text-gray-700 space-y-1 ml-4">
              <p><strong>Email:</strong> privacy@eximpoglobal.net</p>
              <p><strong>Phone:</strong> +91 7386663696</p>
              <p><strong>Address:</strong> H No: 6-640/1/2, Vimanapuri Colony, Quthbullapur, Hyderabad, Telangana - 500055, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
