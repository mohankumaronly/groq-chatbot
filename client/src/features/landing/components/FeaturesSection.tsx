export const FeaturesSection = () => {
  const features = [
    {
      icon: "🤖",
      title: "Advanced AI Model",
      description: "Powered by Groq's Llama 3.1-8b-instant for fast, intelligent responses"
    },
    {
      icon: "💬",
      title: "Natural Conversations",
      description: "Engage in smooth, context-aware conversations like ChatGPT"
    },
    {
      icon: "📝",
      title: "Code Generation",
      description: "Get accurate code snippets with syntax highlighting"
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your conversations are protected with JWT authentication"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Instant responses powered by Groq's optimized infrastructure"
    },
    {
      icon: "🎯",
      title: "Context Awareness",
      description: "Remembers conversation history for coherent and relevant answers"
    },
    {
      icon: "🔄",
      title: "Regenerate Responses",
      description: "Get alternative answers with one click if you want a different perspective"
    },
    {
      icon: "📚",
      title: "Multi-Purpose Assistant",
      description: "Helps with coding, writing, research, brainstorming, and more"
    },
    {
      icon: "💾",
      title: "Chat History",
      description: "Save and access your conversation history anytime"
    }
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: 'var(--bg-sidebar)' }}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Powerful Features
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Everything you need for intelligent conversations and coding assistance
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl p-6 border transition-all duration-300 hover:transform hover:-translate-y-1"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};