import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNews } from '../context/NewsContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDateShort } from '../lib/date'
import { 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  Calendar,
  User,
  Tag
} from 'lucide-react'

const NewsManagement = ({ title = 'Raw News' }) => {
  const { news, loading, loadNewsFromApi } = useNews()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('publishedAt')
  const [fetching, setFetching] = useState(false)

  const categories = ['all', ...Array.from(new Set(news.map(item => item.category)))]

  const filteredNews = news
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'publishedAt':
          return new Date(b.publishedAt) - new Date(a.publishedAt)
        case 'readCount':
          return b.readCount - a.readCount
        case 'likes':
          return b.likes - a.likes
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const formatDate = (dateString) => formatDateShort(dateString)

  const handleGenerate = async () => {
    setFetching(true)
    const res = await loadNewsFromApi()
    setFetching(false)
    if (!res.ok) {
      // eslint-disable-next-line no-alert
      alert('Failed to fetch from API. Check backend and VITE_API_BASE_URL.')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">Manage and monitor all news articles</p>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search news by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="publishedAt">Latest First</option>
              <option value="readCount">Most Read</option>
              <option value="likes">Most Liked</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* News Table */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Published News</h2>
          <button onClick={handleGenerate} disabled={fetching} className="btn-primary text-sm px-4 py-2">
            {fetching ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNews.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {item.category}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{item.author}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{formatDate(item.publishedAt)}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {item.readCount.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {item.likes.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/news/${item.id}`}
                        className="btn-primary text-xs px-3 py-1"
                      >
                        View Details
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No news articles found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <p className="text-sm text-gray-600">Total Articles</p>
          <p className="text-2xl font-bold text-gray-900">{filteredNews.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-2xl font-bold text-gray-900">
            {filteredNews.reduce((sum, item) => sum + item.readCount, 0).toLocaleString()}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600">Total Likes</p>
          <p className="text-2xl font-bold text-gray-900">
            {filteredNews.reduce((sum, item) => sum + item.likes, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default NewsManagement 