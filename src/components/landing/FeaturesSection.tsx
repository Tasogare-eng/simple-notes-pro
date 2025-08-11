export default function FeaturesSection() {
  const features = [
    {
      icon: '📝',
      title: 'Easy Note Creation',
      description: 'Create and edit notes with our simple, intuitive interface. No clutter, just pure focus on your thoughts.'
    },
    {
      icon: '☁️',
      title: 'Cloud Sync',
      description: 'Your notes are securely stored in the cloud and accessible from any device, anywhere.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Bank-level security with end-to-end encryption. Your notes are private and protected.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Instant search, quick loading, and responsive interface. Your productivity, supercharged.'
    },
    {
      icon: '🎨',
      title: 'Clean Design',
      description: 'Beautiful, minimalist design that helps you focus on what matters - your ideas.'
    },
    {
      icon: '💎',
      title: 'Pro Features',
      description: 'Upgrade for unlimited notes, priority support, and advanced features as we grow.'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to stay organized
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple Notes Pro gives you all the tools you need to capture, organize, and access your thoughts effortlessly.
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

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 lg:p-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Start with 3 free notes, upgrade when you need more
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Perfect for trying out Simple Notes Pro. When you&apos;re ready for unlimited notes and premium features, 
              upgrade to Pro for just ¥500/month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-lg font-semibold text-gray-900 mb-2">Free Plan</div>
                <div className="text-3xl font-bold text-blue-600 mb-2">¥0</div>
                <div className="text-sm text-gray-500 mb-4">Forever</div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Up to 3 notes
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Cloud storage
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Email support
                  </li>
                </ul>
              </div>
              <div className="bg-blue-600 text-white rounded-lg p-6 shadow-sm relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <div className="text-lg font-semibold mb-2">Pro Plan</div>
                <div className="text-3xl font-bold mb-2">¥500</div>
                <div className="text-sm opacity-90 mb-4">per month</div>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-200 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited notes
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-200 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-200 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced features
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}