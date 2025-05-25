import React from 'react'

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🚀 Medusa Phyllo Creator Portal</h1>
      <p>Next.js storefront for creator management</p>
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        border: '1px solid #e0e0e0', 
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h2>✅ Status</h2>
        <ul>
          <li>✅ Medusa plugin built successfully</li>
          <li>✅ Next.js storefront initialized</li>
          <li>🔄 Ready for creator portal integration</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>🎯 Available Routes</h3>
        <ul>
          <li><code>/</code> - This home page</li>
          <li><code>/creator/dashboard</code> - Creator dashboard (coming soon)</li>
          <li><code>/creator/onboard</code> - Creator onboarding (coming soon)</li>
        </ul>
      </div>
    </div>
  )
}
