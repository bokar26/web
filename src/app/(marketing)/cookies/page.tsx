import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { Button } from "@/components/ui/button"

export default function CookiePolicyPage() {
  return (
    <div>
      <Navbar />
      <main className="relative min-h-screen flex flex-col justify-start pt-4 md:pt-6 overflow-hidden bg-black text-white">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-left mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
            <p className="text-sm text-gray-400">Last Updated: January 2025</p>
          </div>

          <div className="space-y-8 text-left">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. What Are Cookies?</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Cookies allow us to recognize your device and store information about your preferences or past actions, enabling us to provide you with an improved experience when you visit our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Essential Cookies</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-2">
                  These cookies are strictly necessary for the operation of our Service and cannot be disabled. They enable core functionality such as security, authentication, and page navigation.
                </p>
                <p className="text-sm text-gray-400">Examples: Session management, authentication, security tokens</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Analytics and Performance Cookies</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-2">
                  These cookies help us understand how visitors interact with our Service by collecting and reporting information anonymously. They allow us to improve our Service and user experience.
                </p>
                <p className="text-sm text-gray-400">Examples: Page views, click patterns, session duration, error tracking</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Functional Cookies</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-2">
                  These cookies enable enhanced functionality and personalization, such as remembering your language preferences and login status.
                </p>
                <p className="text-sm text-gray-400">Examples: Language preferences, dashboard settings, user interface preferences</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Targeting and Advertising Cookies</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-2">
                  These cookies may be set by third-party services to deliver personalized content and relevant advertisements based on your interests and interactions.
                </p>
                <p className="text-sm text-gray-400">Examples: Social media integration, advertising network cookies</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Cookies</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-300">
                <li>To authenticate you and keep you logged in</li>
                <li>To remember your preferences and settings</li>
                <li>To analyze usage patterns and improve our Service</li>
                <li>To ensure the security and integrity of our platform</li>
                <li>To provide personalized features and content</li>
                <li>To monitor and prevent fraudulent activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Cookies</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                In addition to our own cookies, we may use third-party cookies from trusted partners to help us analyze website usage and deliver targeted content. These third parties include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-300">
                <li><strong>Analytics Providers:</strong> Google Analytics, Mixpanel, or similar services that help us understand how users interact with our Service</li>
                <li><strong>Authentication Services:</strong> Clerk or other authentication providers that manage user sessions</li>
                <li><strong>Content Delivery Networks:</strong> Providers that help us deliver content efficiently</li>
                <li><strong>Customer Support Tools:</strong> Services that enable customer support features</li>
              </ul>
              <p className="text-lg text-gray-300 leading-relaxed mt-4">
                These third parties may use cookies to collect information about your online activities across different websites. This information is used to provide you with relevant content and advertisements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Managing Cookies</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                You have the right to control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-300 mb-4">
                <li>See what cookies you have and delete them</li>
                <li>Block cookies from all websites or specific sites</li>
                <li>Block third-party cookies</li>
                <li>Delete all cookies when you close your browser</li>
                <li>Get notified before a cookie is stored</li>
              </ul>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Please note that blocking or deleting certain cookies may impact your ability to use all features of our Service, particularly essential cookies required for authentication and security.
              </p>

              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Browser-Specific Instructions:</h3>
                <ul className="list-disc pl-6 space-y-1 text-lg text-gray-300">
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Cookies and site permissions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookie Duration</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Cookies can be either "session" or "persistent":
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Session Cookies</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    These temporary cookies are deleted when you close your browser. They are used to maintain your session and remember your actions during your visit.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Persistent Cookies</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    These cookies remain on your device for a set period or until you delete them manually. They help us recognize you when you return to our Service and remember your preferences.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Cookie Choices</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                When you first visit our Service, you may be presented with a cookie consent banner that allows you to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-300 mb-4">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize your cookie preferences</li>
                <li>Learn more about our cookie practices</li>
              </ul>
              <p className="text-lg text-gray-300 leading-relaxed">
                You can change your cookie preferences at any time through your account settings or by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to This Cookie Policy</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page with a new "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <div className="bg-white/5 p-6 rounded-lg space-y-2 text-lg text-gray-300">
                <p><strong>Email:</strong> privacy@sla.com</p>
                <p><strong>Subject:</strong> Cookie Policy Inquiry</p>
              </div>
            </section>
          </div>

          <div className="flex justify-center pt-12">
            <Link href="/" passHref>
              <Button className="bg-[#00FF7F] text-black hover:brightness-95">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

