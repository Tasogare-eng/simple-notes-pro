'use client'

import { useState } from 'react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What happens when I reach 3 notes on the free plan?",
      answer: "When you create your 3rd note, you'll see a notification that you've reached the free plan limit. You can still edit your existing notes, but to create more notes, you'll need to upgrade to the Pro plan for ¥500/month."
    },
    {
      question: "Can I cancel my Pro subscription anytime?",
      answer: "Yes! You can cancel your Pro subscription at any time through your billing dashboard. When you cancel, you'll continue to have Pro access until the end of your current billing period, then your account will revert to the free plan."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level security with encrypted data storage and transmission. Your notes are private and only accessible by you. We never sell or share your personal data."
    },
    {
      question: "Do I need a credit card to start?",
      answer: "No credit card required! You can sign up and start using Simple Notes Pro immediately with our free plan. Only upgrade to Pro when you're ready for unlimited notes."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and digital wallets through our secure payment processor, Stripe. All payments are processed securely and we never store your payment information."
    },
    {
      question: "Can I access my notes from multiple devices?",
      answer: "Yes! Your notes are stored securely in the cloud and sync across all your devices. Access your notes from your computer, tablet, or phone - your data is always up to date."
    },
    {
      question: "What if I want to export my notes?",
      answer: "You own your data. While we don't currently have a bulk export feature, you can copy and paste your notes to save them locally. We're working on adding export functionality in a future update."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes! We offer a 30-day money-back guarantee. If you're not completely satisfied with Simple Notes Pro, contact us within 30 days of your purchase for a full refund."
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Simple Notes Pro
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:support@simplenotespro.com"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  )
}