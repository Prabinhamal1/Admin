import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNews } from '../context/NewsContext'
import { ArrowLeft, Eye, Heart, Calendar, User, Tag, Bell, Share2, Check } from 'lucide-react'

const NewsDetailBasic = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getNewsById, addNotification } = useNews()
  const [newsItem, setNewsItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isNotified, setIsNotified] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const item = getNewsById(id)
    setNewsItem(item || null)
    setLoading(false)
  }, [id, getNewsById])

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  const handleNotify = () => {
    if (!newsItem) return
    addNotification(newsItem)
    setIsNotified(true)
    setTimeout(() => setIsNotified(false), 3000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        <button onClick={() => navigate('/news-all')} className="btn-primary">Back to News All</button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button onClick={() => navigate('/news-all')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to News All
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{newsItem.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center"><User className="w-4 h-4 mr-1" />{newsItem.author}</div>
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{formatDate(newsItem.publishedAt)}</div>
              <div className="flex items-center"><Tag className="w-4 h-4 mr-1" />{newsItem.category}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={handleNotify} className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${isNotified ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
              <Bell className="w-4 h-4 mr-2" /> {isNotified ? 'Notified!' : 'Notify'}
            </button>
            <button onClick={handleCopyLink} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />} {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-64 object-cover rounded-lg mb-6" />
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">{newsItem.content}</p>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center"><Eye className="w-4 h-4 mr-1" />{newsItem.readCount.toLocaleString()} views</div>
                <div className="flex items-center"><Heart className="w-4 h-4 mr-1" />{newsItem.likes.toLocaleString()} likes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 text-sm leading-relaxed">{newsItem.summary}</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Status:</span><span className="text-green-600 font-medium">Published</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Category:</span><span className="text-gray-900">{newsItem.category}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Author:</span><span className="text-gray-900">{newsItem.author}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Published:</span><span className="text-gray-900">{formatDate(newsItem.publishedAt)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Views:</span><span className="text-gray-900">{newsItem.readCount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Likes:</span><span className="text-gray-900">{newsItem.likes.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>

      {isNotified && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center"><Check className="w-5 h-5 mr-2" />Notification sent successfully!</div>
        </div>
      )}
    </div>
  )
}

export default NewsDetailBasic 