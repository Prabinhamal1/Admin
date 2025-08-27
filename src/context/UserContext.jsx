import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUsers = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "Active",
      joinDate: "2023-01-15",
      lastLogin: "2024-01-15T10:30:00Z",
      totalArticles: 45,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Editor",
      status: "Active",
      joinDate: "2023-03-20",
      lastLogin: "2024-01-14T16:45:00Z",
      totalArticles: 32,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      role: "Reporter",
      status: "Active",
      joinDate: "2023-06-10",
      lastLogin: "2024-01-13T09:15:00Z",
      totalArticles: 28,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      role: "Reporter",
      status: "Inactive",
      joinDate: "2023-02-28",
      lastLogin: "2023-12-20T14:20:00Z",
      totalArticles: 19,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@example.com",
      role: "Editor",
      status: "Active",
      joinDate: "2023-04-12",
      lastLogin: "2024-01-15T08:00:00Z",
      totalArticles: 41,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    },
    {
      id: 6,
      name: "Lisa Chen",
      email: "lisa.chen@example.com",
      role: "Reporter",
      status: "Active",
      joinDate: "2023-08-05",
      lastLogin: "2024-01-14T11:30:00Z",
      totalArticles: 23,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
    }
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setUsers(mockUsers)
      setLoading(false)
    }, 1000)
  }, [])

  const getUserAnalytics = () => {
    const totalUsers = users.length
    const activeUsers = users.filter(user => user.status === 'Active').length
    const inactiveUsers = users.filter(user => user.status === 'Inactive').length
    
    const roleStats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {})

    const totalArticles = users.reduce((sum, user) => sum + user.totalArticles, 0)
    const avgArticlesPerUser = totalUsers > 0 ? Math.round(totalArticles / totalUsers) : 0

    const recentUsers = users
      .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
      .slice(0, 5)

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      roleStats,
      totalArticles,
      avgArticlesPerUser,
      recentUsers
    }
  }

  const updateUserStatus = (userId, newStatus) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    )
  }

  const value = {
    users,
    loading,
    getUserAnalytics,
    updateUserStatus
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
} 