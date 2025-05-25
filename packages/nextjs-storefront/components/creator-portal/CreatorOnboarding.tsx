// components/creator-portal/CreatorOnboarding.tsx
import React, { useState } from 'react'
import { PhylloConnect } from './PhylloConnect'

interface CreatorOnboardingProps {
  onComplete: (creatorData: any) => void
}

export const CreatorOnboarding: React.FC<CreatorOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    website: '',
    collaboration_types: [] as string[],
    content_categories: [] as string[],
    min_budget: ''
  })
  const [creatorId, setCreatorId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const collaborationTypes = [
    'Sponsored Posts',
    'Product Reviews',
    'Brand Ambassadorship',
    'Event Coverage',
    'Giveaways',
    'Long-term Partnerships'
  ]

  const contentCategories = [
    'Fashion & Beauty',
    'Technology',
    'Lifestyle',
    'Food & Cooking',
    'Travel',
    'Fitness & Health',
    'Gaming',
    'Education',
    'Entertainment',
    'Business'
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }))
  }

  const handleBasicInfoSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          contact_info: {
            phone: formData.phone,
            website: formData.website
          },
          preferences: {
            collaboration_types: formData.collaboration_types,
            content_categories: formData.content_categories,
            min_budget: formData.min_budget ? parseFloat(formData.min_budget) : undefined
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCreatorId(data.creator.id)
        setStep(2)
      } else {
        throw new Error('Failed to create creator profile')
      }
    } catch (error) {
      console.error('Error creating creator:', error)
      alert('Failed to create creator profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAccountConnected = () => {
    setStep(3)
  }

  const handleOnboardingComplete = () => {
    onComplete({ creatorId, ...formData })
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
            }`}>
              1
            </div>
            <span className="ml-2 font-medium">Basic Information</span>
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">Connect Platforms</span>
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
            }`}>
              3
            </div>
            <span className="ml-2 font-medium">Complete</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Create Your Creator Profile</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself and your content..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Collaboration Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {collaborationTypes.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.collaboration_types.includes(type)}
                        onChange={() => handleArrayToggle('collaboration_types', type)}
                        className="mr-2"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Content Categories
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {contentCategories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.content_categories.includes(category)}
                        onChange={() => handleArrayToggle('content_categories', category)}
                        className="mr-2"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Budget (USD)
                </label>
                <input
                  type="number"
                  value={formData.min_budget}
                  onChange={(e) => handleInputChange('min_budget', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500"
                />
              </div>

              <button
                onClick={handleBasicInfoSubmit}
                disabled={!formData.name || !formData.email || isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Profile...' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && creatorId && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Connect Your Social Media Accounts</h2>
            <p className="text-gray-600 mb-8">
              Connect your social media accounts to verify your reach and engagement metrics.
            </p>
            
            <div className="text-center">
              <PhylloConnect 
                userId={creatorId}
                onAccountConnected={handleAccountConnected}
                className="inline-block"
              />
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={() => setStep(3)}
                className="text-blue-600 hover:underline"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to the Creator Portal!</h2>
              <p className="text-gray-600">
                Your profile has been created successfully. You can now start collaborating with brands and managing your campaigns.
              </p>
            </div>
            
            <button
              onClick={handleOnboardingComplete}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
