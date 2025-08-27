import React from 'react'
import { NavLink } from 'react-router-dom'
import { useNews } from '../context/NewsContext'
import { 
  Users, 
  Bell,
  Home,
  List,
  Newspaper,
} from 'lucide-react'

const Sidebar = () => {
  const { notifications } = useNews()
  const unreadNotifications = notifications.filter(n => !n.read).length

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/news', icon: List, label: 'Raw News' },
    { path: '/news-all', icon: Newspaper, label: 'News' },
    { path: '/users', icon: Users, label: 'User Management' }
  ]

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">News Portal</h1>
        <p className="text-sm text-gray-600 mt-1">Admin Dashboard</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-200 ${
                isActive ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
            <Bell className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Unread</span>
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              {unreadNotifications}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar 