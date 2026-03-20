"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Mail, MapPin, Clock, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send");

      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent! We'll get back to you within 24 hours.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-800">Contact Us</h1>
          <p className="text-lg text-slate-600">
            Have questions? We&apos;re here to help. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">

          {/* Contact Form */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold text-slate-800">Send us a Message</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h3 className="text-xl font-semibold text-slate-800">Message Sent!</h3>
                <p className="text-slate-600">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="mt-2"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Report a Bug</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">

            {/* Email Card */}
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                  <Mail className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Email Us</h3>
                  <p className="text-sm text-slate-600">We&apos;ll respond within 24 hours</p>
                </div>
              </div>
              <a href="mailto:support@voxaistudio.com" className="text-indigo-600 hover:underline">
                support@voxaistudio.com
              </a>
            </div>

            {/* Location Card */}
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100">
                  <MapPin className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Our Location</h3>
                  <p className="text-sm text-slate-600">Based in Ankara, Turkey</p>
                </div>
              </div>
              <p className="text-slate-600">
                Keçiören, Ankara<br />
                Turkey
              </p>
            </div>

            {/* Business Hours */}
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Business Hours</h3>
                  <p className="text-sm text-slate-600">We&apos;re here to help</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
                <p className="mt-3 text-xs text-slate-500">All times are in GMT+3 (Turkey Time)</p>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6">
              <h3 className="mb-2 font-semibold text-slate-800">Looking for quick answers?</h3>
              <p className="mb-4 text-sm text-slate-600">
                Check out our FAQ section for common questions and solutions.
              </p>
              <Link href="/faq">
                <Button variant="outline" className="w-full">
                  Visit FAQ
                </Button>
              </Link>
            </div>

          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 rounded-lg bg-white p-8 shadow-lg">
          <h3 className="mb-4 text-xl font-semibold text-slate-800">What to Expect</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="mb-2 text-3xl">📧</div>
              <h4 className="mb-2 font-semibold text-slate-800">Quick Response</h4>
              <p className="text-sm text-slate-600">
                We aim to respond to all inquiries within 24 hours during business days.
              </p>
            </div>
            <div>
              <div className="mb-2 text-3xl">🔒</div>
              <h4 className="mb-2 font-semibold text-slate-800">Privacy Protected</h4>
              <p className="text-sm text-slate-600">
                Your information is safe with us and will never be shared with third parties.
              </p>
            </div>
            <div>
              <div className="mb-2 text-3xl">💬</div>
              <h4 className="mb-2 font-semibold text-slate-800">Expert Support</h4>
              <p className="text-sm text-slate-600">
                Our team is knowledgeable and ready to help with any questions you have.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
