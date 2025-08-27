# News Portal Admin Dashboard

A modern, responsive admin dashboard for managing a news portal with comprehensive analytics, news management, and user management capabilities.

## Features

### 🎯 Dashboard Analytics
- **News Analytics**: Total articles, views, likes, and engagement metrics
- **User Analytics**: User count, role distribution, and activity statistics
- **Visual Charts**: Interactive pie charts for category and role distributions
- **Top Performing Content**: Ranking of most popular news articles
- **Real-time Stats**: Live updates of key performance indicators

### 📰 News Management
- **Comprehensive News Table**: View all news articles with search and filtering
- **Category Management**: Filter by news categories (Technology, Environment, Economy, etc.)
- **Advanced Search**: Search by title, content, or author
- **Sorting Options**: Sort by date, views, likes, or alphabetically
- **Quick Actions**: View detailed information for each article

### 👥 User Management
- **User Overview**: Complete user list with roles and status
- **Role-based Access**: Admin, Editor, and Reporter roles
- **Status Management**: Activate/deactivate users
- **User Analytics**: Article contribution statistics per user
- **Search & Filter**: Find users by name, email, role, or status

### 📖 News Detail View
- **Full Article Display**: Complete news content with images
- **Smart Summary**: Auto-generated article summaries
- **Notification System**: Send notifications for important news
- **Save Functionality**: Bookmark articles for later reference
- **Share Options**: Copy article links and share content

### 🔔 Notification System
- **Smart Notifications**: Send alerts for breaking news
- **Notification History**: Track all sent notifications
- **Unread Counter**: Real-time notification badge in sidebar

### 💾 Save & Bookmark
- **Personal Library**: Save important articles
- **Quick Access**: Easy retrieval of saved content
- **Organized Storage**: Manage your reading list

## Technology Stack

- **Frontend**: React 18 with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router for navigation
- **State Management**: React Context API
- **Build Tool**: Vite for fast development

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd news-portal-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Sidebar.jsx     # Navigation sidebar
├── context/            # React Context providers
│   ├── NewsContext.jsx # News data management
│   └── UserContext.jsx # User data management
├── pages/              # Main application pages
│   ├── Dashboard.jsx   # Analytics dashboard
│   ├── NewsManagement.jsx # News overview and management
│   ├── NewsDetail.jsx  # Individual news article view
│   └── UserManagement.jsx # User management interface
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Key Components

### Dashboard (`/`)
- Overview statistics and metrics
- Interactive charts and graphs
- Top performing content
- Recent user activity

### News Management (`/news`)
- Complete news article listing
- Advanced search and filtering
- Category-based organization
- Performance metrics

### News Detail (`/news/:id`)
- Full article content display
- Auto-generated summaries
- Notification and save actions
- Article statistics

### User Management (`/users`)
- User roster and management
- Role-based permissions
- Status controls
- User analytics

## Features in Detail

### 🔍 Search & Filtering
- **Real-time Search**: Instant results as you type
- **Multi-criteria Filtering**: Combine multiple filter options
- **Smart Sorting**: Multiple sorting algorithms
- **Category Filters**: Quick category-based navigation

### 📊 Analytics & Reporting
- **Performance Metrics**: Track article engagement
- **User Insights**: Monitor user activity and contributions
- **Trend Analysis**: Identify popular content patterns
- **Visual Data**: Easy-to-understand charts and graphs

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all device sizes
- **Dark/Light Theme**: Comfortable viewing experience
- **Intuitive Navigation**: Easy-to-use interface
- **Loading States**: Smooth user experience

### 🔐 Security Features
- **Role-based Access**: Different permissions for different user types
- **Status Management**: Control user access and activity
- **Secure Routing**: Protected route access

## Customization

### Adding New Categories
Edit the mock data in `src/context/NewsContext.jsx` to add new news categories.

### Modifying User Roles
Update the role definitions in `src/context/UserContext.jsx` to add new user roles.

### Styling Changes
Modify `src/index.css` and Tailwind configuration in `tailwind.config.js` for custom styling.

## API Integration

The current version uses mock data for demonstration. To integrate with a real API:

1. Replace mock data calls in context files
2. Update API endpoints in service functions
3. Implement proper error handling
4. Add authentication middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React and Tailwind CSS** 