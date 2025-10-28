import Link from "next/link"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  return (
    <div>
      <Navbar />
      <main className="relative min-h-screen flex flex-col justify-start pt-4 md:pt-6 overflow-hidden bg-black text-white">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-left mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-sm text-gray-400">Last Updated: January 2025</p>
          </div>

          <div className="space-y-8 text-left">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                SLA ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our supply chain optimization platform and related services (collectively, the "Service").
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                By accessing or using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                We collect several types of information to provide and improve our Service:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-300">
                <li><strong>Account Information:</strong> Name, email address, company name, and other contact details you provide when creating an account.</li>
                <li><strong>Business Data:</strong> Supply chain information, vendor data, logistics data, and other business-related information you input into our platform.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our Service, including pages visited, features used, and time spent.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and other technical identifiers.</li>
                <li><strong>Payment Information:</strong> Billing details and payment method information processed through secure third-party payment processors.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-300">
                <li>To provide, maintain, and improve our Service and its features</li>
                <li>To process transactions and manage your account</li>
                <li>To send you service-related communications, including updates and support messages</li>
                <li>To provide analytics and insights to optimize your supply chain operations</li>
                <li>To comply with legal obligations and enforce our terms of service</li>
                <li>To protect against fraud, abuse, or security threats</li>
                <li>To send promotional materials and marketing communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Protection and Security</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-300">
                <li><strong>Encryption:</strong> All data in transit and at rest is encrypted using advanced encryption standards.</li>
                <li><strong>Access Controls:</strong> Access to your data is restricted to authorized personnel who require it for service delivery.</li>
                <li><strong>Regular Audits:</strong> We conduct regular security audits and assessments to identify and address vulnerabilities.</li>
                <li><strong>Compliance:</strong> We adhere to applicable data protection laws including GDPR, CCPA, and other relevant regulations.</li>
              </ul>
              <p className="text-lg text-gray-300 leading-relaxed mt-4">
                Despite our security measures, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                We use cookies, web beacons, and similar tracking technologies to collect information about your activity. For detailed information about our use of cookies, please refer to our Cookie Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Third-Party Services</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Our Service may integrate with third-party services and APIs, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-300">
                <li>Cloud hosting and infrastructure providers</li>
                <li>Payment processing services</li>
                <li>Analytics and monitoring tools</li>
                <li>Customer support platforms</li>
                <li>Email and communication services</li>
              </ul>
              <p className="text-lg text-gray-300 leading-relaxed mt-4">
                These third parties may have access to your information but only to perform specific tasks on our behalf and are obligated not to disclose or use it for other purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights and Choices</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Depending on your jurisdiction, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-300">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Restriction:</strong> Request restriction of processing your personal information</li>
                <li><strong>Objection:</strong> Object to certain types of processing</li>
              </ul>
              <p className="text-lg text-gray-300 leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Data Retention</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. International Data Transfers</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Children's Privacy</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
              </p>
              <div className="bg-white/5 p-6 rounded-lg space-y-2 text-lg text-gray-300">
                <p><strong>Email:</strong> privacy@sla.com</p>
                <p><strong>Address:</strong> SLA Privacy Team, [Company Address]</p>
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

