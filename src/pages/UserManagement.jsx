import React, { useState } from 'react'
import { useUsers } from '../context/UserContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDateShort, formatRelativeHours } from '../lib/date'
import { 
  Search, 
  Filter, 
  User, 
  Mail, 
  Calendar,
  BookOpen,
  Activity,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react'

const UserManagement = () => {
  const { users, loading, updateUserStatus } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('joinDate')

  const roles = ['all', ...Array.from(new Set(users.map(user => user.role)))]
  const statuses = ['all', 'Active', 'Inactive']

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'joinDate':
          return new Date(b.joinDate) - new Date(a.joinDate)
        case 'lastLogin':
          return new Date(b.lastLogin) - new Date(a.lastLogin)
        case 'totalArticles':
          return b.totalArticles - a.totalArticles
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const formatDate = (dateString) => formatDateShort(dateString)

  const formatLastLogin = (dateString) => formatRelativeHours(dateString)

  const handleStatusToggle = (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
    updateUserStatus(userId, newStatus)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage users and their permissions</p>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : role}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="joinDate">Join Date</option>
              <option value="lastLogin">Last Login</option>
              <option value="totalArticles">Articles Count</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'Admin' 
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'Editor'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{user.totalArticles}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{formatLastLogin(user.lastLogin)}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleStatusToggle(user.id, user.status)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          user.status === 'Active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredUsers.filter(u => u.status === 'Active').length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600">Total Articles</p>
          <p className="text-2xl font-bold text-gray-900">
            {filteredUsers.reduce((sum, user) => sum + user.totalArticles, 0).toLocaleString()}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-600">Avg Articles/User</p>
          <p className="text-2xl font-bold text-gray-900">
            {filteredUsers.length > 0 
              ? Math.round(filteredUsers.reduce((sum, user) => sum + user.totalArticles, 0) / filteredUsers.length)
              : 0
            }
          </p>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="mt-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Role Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(
              filteredUsers.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1
                return acc
              }, {})
            ).map(([role, count]) => (
              <div key={role} className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">{role}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-500">
                  {((count / filteredUsers.length) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement 