export default function FeaturesSection() {
  const features = [
    {
      icon: '📝',
      title: '簡単なメモ作成',
      description: 'シンプルで直感的なインターフェースでメモを作成・編集。余計な機能はなく、あなたの思考に集中できます。'
    },
    {
      icon: '☁️',
      title: 'クラウド同期',
      description: 'メモは安全にクラウドに保存され、どのデバイスからでもアクセス可能です。'
    },
    {
      icon: '🔒',
      title: 'セキュア＆プライベート',
      description: '銀行レベルのセキュリティとエンドツーエンド暗号化。あなたのメモは安全に保護されます。'
    },
    {
      icon: '⚡',
      title: '高速動作',
      description: '瞬間検索、高速読み込み、レスポンシブなインターフェース。生産性を最大化します。'
    },
    {
      icon: '🎨',
      title: 'クリーンなデザイン',
      description: '美しく、ミニマルなデザインで重要なこと - あなたのアイデアに集中できます。'
    },
    {
      icon: '💎',
      title: 'プロ機能',
      description: '無制限のメモ、優先サポート、先進機能へのアップグレードが可能です。'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            主な機能
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple Notes Proは、思考を簡単にキャプチャ、整理、アクセスするために必要なすべてのツールを提供します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}