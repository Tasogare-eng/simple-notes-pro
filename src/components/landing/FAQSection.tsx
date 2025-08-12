'use client'

import { useState } from 'react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "無料プランで3つのメモに達したらどうなりますか？",
      answer: "3つ目のメモを作成すると、無料プランの上限に達したことを知らせる通知が表示されます。既存のメモは編集できますが、さらにメモを作成するには月額¥500のProプランにアップグレードする必要があります。"
    },
    {
      question: "Proサブスクリプションはいつでもキャンセルできますか？",
      answer: "はい！請求ダッシュボードからいつでもProサブスクリプションをキャンセルできます。キャンセルした場合、現在の請求期間の終了までProアクセスが継続され、その後アカウントは無料プランに戻ります。"
    },
    {
      question: "データは安全ですか？",
      answer: "もちろんです。銀行レベルのセキュリティと暗号化されたデータストレージ・送信を使用しています。あなたのメモはプライベートで、あなただけがアクセスできます。個人データを絶対に販売や共有しません。"
    },
    {
      question: "始めるのにクレジットカードは必要ですか？",
      answer: "クレジットカードは不要です！無料プランですぐにSimple Notes Proにサインアップして使用を開始できます。無制限のメモが必要になったらProにアップグレードしてください。"
    },
    {
      question: "どのような支払い方法を受け付けていますか？",
      answer: "セキュアな決済プロセッサーStripeを通じて、主要なクレジットカード（Visa、Mastercard、American Express）およびデジタルウォレットを受け付けています。すべての決済は安全に処理され、支払い情報を保存することはありません。"
    },
    {
      question: "複数のデバイスからメモにアクセスできますか？",
      answer: "はい！メモはクラウドに安全に保存され、すべてのデバイスで同期されます。コンピューター、タブレット、スマートフォンからメモにアクセス - データは常に最新の状態です。"
    },
    {
      question: "メモをエクスポートしたい場合はどうすればいいですか？",
      answer: "データはあなたの所有物です。現在は一括エクスポート機能はありませんが、メモをコピー・ペーストしてローカルに保存できます。将来のアップデートでエクスポート機能の追加を作業中です。"
    },
    {
      question: "返金はありますか？",
      answer: "はい！30日間の返金保証を提供しています。Simple Notes Proに完全に満足いただけない場合は、購入から30日以内にお連絡いただければ全額返金いたします。"
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            よくある質問
          </h2>
          <p className="text-xl text-gray-600">
            Simple Notes Proについて知っておくべきこと
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg" data-testid="faq-item">
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
                <div className="px-6 pb-4" data-testid="faq-answer">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            他にご質問はありませんか？
          </p>
          <a
            href="mailto:support@simplenotespro.com"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            サポートチームに連絡 →
          </a>
        </div>
      </div>
    </section>
  )
}