import React from 'react'
import { useNews } from '../context/NewsContext'
import { useUsers } from '../context/UserContext'
import { 
  BarChart3, 
  Users, 
  Eye, 
  Heart, 
  TrendingUp,
  Newspaper,
  Clock
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Dashboard = () => {
  const { getNewsAnalytics, news, loading: newsLoading } = useNews()
  const { getUserAnalytics, users, loading: usersLoading } = useUsers()

  if (newsLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const newsAnalytics = getNewsAnalytics()
  const userAnalytics = getUserAnalytics()

  const categoryData = Object.entries(newsAnalytics.categoryStats).map(([name, value]) => ({
    name,
    value
  }))

  const roleData = Object.entries(userAnalytics.roleStats).map(([name, value]) => ({
    name,
    value
  }))

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  const StatCard = ({ title, value, icon: Icon, change, color = 'primary' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your news portal performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total News Articles"
          value={newsAnalytics.totalNews}
          icon={Newspaper}
          change={12}
        />
        <StatCard
          title="Total Views"
          value={newsAnalytics.totalReads}
          icon={Eye}
          change={8}
        />
        <StatCard
          title="Total Likes"
          value={newsAnalytics.totalLikes}
          icon={Heart}
          change={15}
        />
        <StatCard
          title="Active Users"
          value={userAnalytics.activeUsers}
          icon={Users}
          change={5}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* News Category Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">News by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Role Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing News */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing News</h3>
        <div className="space-y-4">
          {newsAnalytics.topNews.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-600">#{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-sm text-gray-500">{item.category} • {item.author}</p>
              </div>
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
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {userAnalytics.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Views per Article</span>
              <span className="text-sm font-medium text-gray-900">{newsAnalytics.avgReads.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Likes per Article</span>
              <span className="text-sm font-medium text-gray-900">{newsAnalytics.avgLikes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Articles per User</span>
              <span className="text-sm font-medium text-gray-900">{userAnalytics.avgArticlesPerUser}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Inactive Users</span>
              <span className="text-sm font-medium text-gray-900">{userAnalytics.inactiveUsers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 