import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/apiClient'

const NewsContext = createContext()

export const useNews = () => {
  const context = useContext(NewsContext)
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider')
  }
  return context
}

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [savedNews, setSavedNews] = useState([])

  // Mock data for demonstration
  const mockNews = [
    {
      id: 1,
      title: "Breaking: Major Tech Breakthrough in AI",
      content: "Scientists have achieved a significant breakthrough in artificial intelligence technology that could revolutionize various industries. The new algorithm shows unprecedented efficiency in processing complex data sets.",
      summary: "AI breakthrough with unprecedented efficiency in data processing",
      author: "John Smith",
      category: "Technology",
      publishedAt: "2024-01-15T10:00:00Z",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
      readCount: 15420,
      likes: 892
    },
    {
      id: 2,
      title: "Global Climate Summit Reaches Historic Agreement",
      content: "World leaders have reached a historic agreement on climate change at the annual summit. The new commitments aim to reduce carbon emissions by 50% by 2030.",
      summary: "Historic climate agreement with 50% emission reduction target by 2030",
      author: "Sarah Johnson",
      category: "Environment",
      publishedAt: "2024-01-14T15:30:00Z",
      imageUrl: "https://images.unsplash.com/photo-1569163139397-4d5c02d3d2b0?w=800",
      readCount: 23450,
      likes: 1245
    },
    {
      id: 3,
      title: "New Economic Policy Announced by Central Bank",
      content: "The central bank has announced a new economic policy framework aimed at stabilizing inflation and promoting sustainable growth. Experts predict positive impacts on the economy.",
      summary: "Central bank announces new economic policy for inflation control and growth",
      author: "Michael Chen",
      category: "Economy",
      publishedAt: "2024-01-13T09:15:00Z",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
      readCount: 18760,
      likes: 756
    },
    {
      id: 4,
      title: "SpaceX Successfully Launches New Satellite Constellation",
      content: "SpaceX has successfully launched another batch of satellites as part of their global internet coverage project. The mission marks another milestone in space technology.",
      summary: "SpaceX launches new satellite constellation for global internet coverage",
      author: "Emily Rodriguez",
      category: "Space",
      publishedAt: "2024-01-12T14:45:00Z",
      imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d0bd843e8?w=800",
      readCount: 32100,
      likes: 1890
    },
    {
      id: 5,
      title: "Healthcare Innovation: New Treatment for Rare Disease",
      content: "Medical researchers have developed a breakthrough treatment for a previously untreatable rare disease. Clinical trials show promising results with 85% success rate.",
      summary: "Breakthrough treatment for rare disease with 85% clinical success rate",
      author: "Dr. Lisa Wang",
      category: "Health",
      publishedAt: "2024-01-11T11:20:00Z",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
      readCount: 15680,
      likes: 1123
    }
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setNews(mockNews)
      setLoading(false)
    }, 1000)
  }, [])

  const loadNewsFromApi = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/news')
      const data = Array.isArray(response.data) ? response.data : (response.data?.content || [])
      setNews(data)
      return { ok: true }
    } catch (error) {
      console.error('Failed to load news from API', error)
      return { ok: false, error }
    } finally {
      setLoading(false)
    }
  }

  const addNotification = (newsItem) => {
    const notification = {
      id: Date.now(),
      newsId: newsItem.id,
      title: newsItem.title,
      timestamp: new Date().toISOString(),
      read: false
    }
    setNotifications(prev => [notification, ...prev])
  }

  const saveNews = (newsItem) => {
    if (!savedNews.find(item => item.id === newsItem.id)) {
      setSavedNews(prev => [...prev, { ...newsItem, savedAt: new Date().toISOString() }])
    }
  }

  const removeSavedNews = (newsId) => {
    setSavedNews(prev => prev.filter(item => item.id !== newsId))
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const getNewsById = (id) => {
    return news.find(item => item.id === parseInt(id))
  }

  const getNewsAnalytics = () => {
    const totalNews = news.length
    const totalReads = news.reduce((sum, item) => sum + item.readCount, 0)
    const totalLikes = news.reduce((sum, item) => sum + item.likes, 0)
    const avgReads = totalNews > 0 ? Math.round(totalReads / totalNews) : 0
    const avgLikes = totalNews > 0 ? Math.round(totalLikes / totalNews) : 0

    const categoryStats = news.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})

    const topNews = [...news].sort((a, b) => b.readCount - a.readCount).slice(0, 5)

    return {
      totalNews,
      totalReads,
      totalLikes,
      avgReads,
      avgLikes,
      categoryStats,
      topNews
    }
  }

  const value = {
    news,
    loading,
    notifications,
    savedNews,
    loadNewsFromApi,
    addNotification,
    saveNews,
    removeSavedNews,
    markNotificationAsRead,
    getNewsById,
    getNewsAnalytics
  }

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  )
} 