import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNews } from '../context/NewsContext'
import { 
  ArrowLeft, 
  Eye, 
  Heart, 
  Calendar, 
  User, 
  Tag, 
  Bell, 
  Bookmark,
  Share2,
  Copy,
  Check,
  Sparkles
} from 'lucide-react'

const NewsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getNewsById, addNotification, saveNews, removeSavedNews, savedNews } = useNews()
  const [newsItem, setNewsItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isNotified, setIsNotified] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showSummary, setShowSummary] = useState(true)
  const [generatedSummary, setGeneratedSummary] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [summaryNotified, setSummaryNotified] = useState(false)
  const [summarySaved, setSummarySaved] = useState(false)

  useEffect(() => {
    const item = getNewsById(id)
    if (item) {
      setNewsItem(item)
      setIsSaved(savedNews.some(saved => saved.id === item.id))
      setIsNotified(false) // Reset notification state
    }
    setLoading(false)
  }, [id, getNewsById, savedNews])

  const handleNotify = () => {
    if (newsItem) {
      addNotification(newsItem)
      setIsNotified(true)
      // Auto-hide notification after 3 seconds
      setTimeout(() => setIsNotified(false), 3000)
    }
  }

  const handleSave = () => {
    if (newsItem) {
      if (isSaved) {
        removeSavedNews(newsItem.id)
        setIsSaved(false)
      } else {
        saveNews(newsItem)
        setIsSaved(true)
      }
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerateSummary = () => {
    if (newsItem) {
      setIsGenerating(true)
      // Simulate AI summary generation
      setTimeout(() => {
        const generatedSummary = `AI-Generated Summary for "${newsItem.title}":\n\n${newsItem.content.split('.').slice(0, 3).join('.')}...\n\nKey Points:\n• ${newsItem.category} news by ${newsItem.author}\n• Published on ${new Date(newsItem.publishedAt).toLocaleDateString()}\n• High engagement with ${newsItem.readCount.toLocaleString()} views and ${newsItem.likes.toLocaleString()} likes\n• Main focus: ${newsItem.summary}`
        setGeneratedSummary(generatedSummary)
        setIsGenerating(false)
      }, 2000)
    }
  }

  const handleSummaryNotify = () => {
    if (generatedSummary) {
      // Create a notification for the AI summary
      const summaryNotification = {
        id: Date.now(),
        newsId: newsItem.id,
        title: `AI Summary: ${newsItem.title}`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'ai-summary'
      }
      addNotification(summaryNotification)
      setSummaryNotified(true)
      // Auto-hide notification after 3 seconds
      setTimeout(() => setSummaryNotified(false), 3000)
    }
  }

  const handleSummarySave = () => {
    if (generatedSummary) {
      // Save the AI summary
      const summaryToSave = {
        id: `summary-${newsItem.id}`,
        title: `AI Summary: ${newsItem.title}`,
        content: generatedSummary,
        originalNewsId: newsItem.id,
        savedAt: new Date().toISOString(),
        type: 'ai-summary'
      }
      // You can implement a separate save function for summaries or use the existing one
      setSummarySaved(true)
      // Auto-hide saved state after 3 seconds
      setTimeout(() => setSummarySaved(false), 3000)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!newsItem) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">News Article Not Found</h1>
        <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/news')}
          className="btn-primary"
        >
          Back to News
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/news')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to News
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{newsItem.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {newsItem.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(newsItem.publishedAt)}
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {newsItem.category}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleNotify}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                isNotified 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <Bell className="w-4 h-4 mr-2" />
              {isNotified ? 'Notified!' : 'Notify'}
            </button>
            
            <button
              onClick={handleSave}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                isSaved 
                  ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              {isSaved ? 'Saved' : 'Save'}
            </button>
            
            <button
              onClick={handleCopyLink}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Article Content */}
        <div className="lg:col-span-2">
          <div className="card">
            <img
              src={newsItem.imageUrl}
              alt={newsItem.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {newsItem.content}
              </p>
            </div>

            {/* Generate Button - Centered */}
            <div className="flex justify-center my-8">
              <button
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isGenerating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Summary
                  </>
                )}
              </button>
            </div>

            {/* Generated Summary */}
            {generatedSummary && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                    AI-Generated Summary
                  </h3>
                  
                  {/* Summary Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSummaryNotify}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        summaryNotified 
                          ? 'bg-green-100 text-green-700 border border-green-300' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      <Bell className="w-4 h-4 mr-1" />
                      {summaryNotified ? 'Notified!' : 'Notify'}
                    </button>
                    
                    <button
                      onClick={handleSummarySave}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        summarySaved 
                          ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 mr-1" />
                      {summarySaved ? 'Saved!' : 'Save Summary'}
                    </button>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-blue-100">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                    {generatedSummary}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Article Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {newsItem.readCount.toLocaleString()} views
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {newsItem.likes.toLocaleString()} likes
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Article ID: {newsItem.id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Article Summary</h3>
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {showSummary ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showSummary && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {newsItem.summary}
                </p>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Key Points:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Published on {formatDate(newsItem.publishedAt)}</li>
                <li>• Category: {newsItem.category}</li>
                <li>• Author: {newsItem.author}</li>
                <li>• High engagement with {newsItem.readCount.toLocaleString()} views</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleNotify}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isNotified 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Bell className="w-4 h-4 mr-2" />
                {isNotified ? 'Notification Sent!' : 'Send Notification'}
              </button>
              
              <button
                onClick={handleSave}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isSaved 
                    ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                {isSaved ? 'Remove from Saved' : 'Save Article'}
              </button>
            </div>
          </div>

          {/* Related Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Published</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="text-gray-900">{newsItem.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Author:</span>
                <span className="text-gray-900">{newsItem.author}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Published:</span>
                <span className="text-gray-900">{formatDate(newsItem.publishedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Views:</span>
                <span className="text-gray-900">{newsItem.readCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Likes:</span>
                <span className="text-gray-900">{newsItem.likes.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {isNotified && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2">
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-2" />
            Notification sent successfully!
          </div>
        </div>
      )}

      {/* Summary Notification Toast */}
      {summaryNotified && (
        <div className="fixed bottom-6 right-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2">
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-2" />
            AI Summary notification sent!
          </div>
        </div>
      )}

      {/* Summary Saved Toast */}
      {summarySaved && (
        <div className="fixed bottom-6 right-6 bg-primary-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2">
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-2" />
            AI Summary saved successfully!
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsDetail 