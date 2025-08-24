import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Activity } from '../../types';
import { Search, Filter, Clock, User, Activity as ActivityIcon } from 'lucide-react';
import { format } from 'date-fns';

const ActivityLog: React.FC = () => {
  const { hasRole } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // Load activities from localStorage
    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
      const parsedActivities = JSON.parse(savedActivities);
      setActivities(parsedActivities);
      setFilteredActivities(parsedActivities);
    }
  }, []);

  // Apply filters
  React.useEffect(() => {
    let filtered = activities.filter(activity => {
      const matchesSearch = activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.entityId.includes(searchTerm);
      const matchesAction = actionFilter === 'all' || activity.action === actionFilter;
      const matchesEntity = entityFilter === 'all' || activity.entity === entityFilter;
      
      return matchesSearch && matchesAction && matchesEntity;
    });
    
    // Sort by timestamp (newest first)
    filtered = filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setFilteredActivities(filtered);
    setCurrentPage(1);
  }, [searchTerm, actionFilter, entityFilter, activities]);

  if (!hasRole(['admin'])) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <ActivityIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to view activity logs</p>
      </div>
    );
  }

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800 border-green-200';
      case 'update': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delete': return 'bg-red-100 text-red-800 border-red-200';
      case 'login': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'logout': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'register': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return '✨';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'login': return '🔑';
      case 'logout': return '🚪';
      case 'register': return '👤';
      default: return '📝';
    }
  };

  // Get unique actions and entities for filters
  const uniqueActions = [...new Set(activities.map(a => a.action))];
  const uniqueEntities = [...new Set(activities.map(a => a.entity))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <div className="text-sm text-gray-600">
          {filteredActivities.length} activities
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action} className="capitalize">
                {action}
              </option>
            ))}
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Entities</option>
            {uniqueEntities.map(entity => (
              <option key={entity} value={entity} className="capitalize">
                {entity}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span>🔑</span>
            <span>Authentication</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>✨</span>
            <span>Create</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>✏️</span>
            <span>Update</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🗑️</span>
            <span>Delete</span>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {paginatedActivities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{getActionIcon(activity.action)}</span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getActionColor(activity.action)}`}>
                      {activity.action}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {activity.entity}
                    </span>
                    {activity.entityId && (
                      <span className="text-xs text-gray-400">
                        ID: {activity.entityId}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                </div>
                
                <p className="text-gray-900 mb-2">{activity.details}</p>
                
                {activity.user && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{activity.user.name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="capitalize">{activity.user.role}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {paginatedActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ActivityIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          {totalPages > 5 && (
            <>
              <span className="text-gray-500">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-3 py-2 text-sm rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;