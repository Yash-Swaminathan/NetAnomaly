import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import StatisticCard from './StatisticCard';
import AnomalyTrend from './AnomalyTrend';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { 
    healthStatus, 
    statistics, 
    alerts, 
    isLoading, 
    error, 
    connectionStatus 
  } = useContext(AppContext);

  // Get only the most recent 5 alerts
  const recentAlerts = alerts.slice(0, 5);

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get color based on severity
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      {/* System Status */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">System Status</h2>
        <div className="flex items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            healthStatus.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>
            Status: <strong>{healthStatus.status || 'Unknown'}</strong>
          </span>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span>
            WebSocket: <strong>{connectionStatus}</strong>
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticCard 
          title="Total Flows Processed" 
          value={statistics.totalFlows} 
          icon="activity" 
        />
        <StatisticCard 
          title="Total Alerts" 
          value={statistics.totalAlerts} 
          icon="alert-triangle" 
          color="text-yellow-600"
        />
        <StatisticCard 
          title="High Severity Alerts" 
          value={statistics.highSeverityCount} 
          icon="alert-octagon" 
          color="text-red-600"
        />
        <StatisticCard 
          title="Model Status" 
          value={healthStatus.model_loaded ? 'Active' : 'Inactive'} 
          icon="cpu" 
          color={healthStatus.model_loaded ? 'text-green-600' : 'text-red-600'}
        />
      </div>

      {/* Anomaly Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Anomaly Score Trend</h3>
        <AnomalyTrend />
      </div>

      {/* Recent Alerts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Alerts</h3>
          <Link to="/alerts" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        
        {recentAlerts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentAlerts.map((alert) => (
                  <tr key={alert.alert_id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs uppercase font-semibold rounded-full text-white ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatTimestamp(alert.timestamp)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {alert.anomaly_score.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
                      {alert.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No alerts detected yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;