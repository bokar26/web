"use client";


import { complianceRecords } from "@/lib/mockData";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CompliancePage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'expiring':
        return 'text-amber-400 bg-amber-900/20 border-amber-500/30';
      case 'expired':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      default:
        return 'text-gray-600 dark:text-white bg-gray-900/20 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'expiring':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Shield className="w-4 h-4 text-gray-600 dark:text-white" />;
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'in-progress':
        return 'text-blue-400';
      case 'pending':
        return 'text-amber-400';
      default:
        return 'text-gray-600 dark:text-white';
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="dashboard-bg min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Compliance</h1>
        <p className="text-gray-900 dark:text-white">Certification management and audit compliance tracking</p>
      </div>

      {/* Expiry Timeline */}
      <Card className="dashboard-card mb-6">
        <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Certification Expiry Timeline</h3>
          <div className="text-sm text-gray-600 dark:text-white">Next 90 days</div>
        </div>
        
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-700 rounded-full"></div>
          <div className="space-y-4 pl-6">
            {complianceRecords.map((record, index) => {
              const daysUntilExpiry = getDaysUntilExpiry(record.expiryDate);
              return (
                <div key={index} className="relative">
                  <div className="absolute -left-8 top-2 w-3 h-3 rounded-full bg-gray-600"></div>
                  <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        <span className="text-sm font-medium text-white">{record.partner}</span>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${getStatusColor(record.status)}`}>
                        {record.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white mb-1">{record.certification}</div>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-white">
                      <span>Expires: {record.expiryDate}</span>
                      <span className={daysUntilExpiry < 30 ? 'text-red-400' : daysUntilExpiry < 60 ? 'text-amber-400' : 'text-green-400'}>
                        {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : `${Math.abs(daysUntilExpiry)} days overdue`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
        </Card>

      {/* Compliance Records Table */}
      <Card className="dashboard-card mb-6">
        <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Compliance Records</h3>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Add Certification
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-sm font-medium text-gray-900 dark:text-white py-3">Partner</th>
                <th className="text-left text-sm font-medium text-gray-900 dark:text-white py-3">Certification</th>
                <th className="text-center text-sm font-medium text-gray-900 dark:text-white py-3">Status</th>
                <th className="text-center text-sm font-medium text-gray-900 dark:text-white py-3">Score</th>
                <th className="text-center text-sm font-medium text-gray-900 dark:text-white py-3">Expiry Date</th>
                <th className="text-left text-sm font-medium text-gray-900 dark:text-white py-3">Auditor</th>
                <th className="text-center text-sm font-medium text-gray-900 dark:text-white py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complianceRecords.map((record, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-100 dark:bg-gray-900/50">
                  <td className="py-3">
                    <div className="text-sm font-medium text-white">{record.partner}</div>
                  </td>
                  <td className="py-3">
                    <div className="text-sm text-gray-900 dark:text-white">{record.certification}</div>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {getStatusIcon(record.status)}
                      <div className={`text-xs px-2 py-1 rounded ${getStatusColor(record.status)}`}>
                        {record.status.toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className={`text-sm font-medium ${
                      record.score >= 90 ? 'text-green-400' :
                      record.score >= 80 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {record.score}
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className="text-sm text-gray-900 dark:text-white">{record.expiryDate}</div>
                  </td>
                  <td className="py-3">
                    <div className="text-sm text-gray-900 dark:text-white">{record.auditor}</div>
                  </td>
                  <td className="py-3 text-center">
                    <Button variant="outline" size="sm" className="text-gray-900 dark:text-white border-gray-600">
                      <FileText className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
        </Card>

      {/* Corrective Actions */}
      <Card className="dashboard-card">
        <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Corrective Actions</h3>
        
        <div className="space-y-4">
          {complianceRecords
            .filter(record => record.correctiveActions.length > 0)
            .map((record, recordIndex) => 
              record.correctiveActions.map((action, actionIndex) => (
                <div key={`${recordIndex}-${actionIndex}`} className="p-4 rounded-lg bg-gray-800/50 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-white">{record.partner}</span>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      action.status === 'completed' ? 'text-green-400 bg-green-900/20' :
                      action.status === 'in-progress' ? 'text-blue-400 bg-blue-900/20' :
                      'text-amber-400 bg-amber-900/20'
                    }`}>
                      {action.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white mb-2">{action.action}</div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-white">
                    <span>Due: {action.dueDate}</span>
                    <span className={getActionStatusColor(action.status)}>
                      {action.status === 'completed' ? 'Completed' :
                       action.status === 'in-progress' ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
        </div>
      </CardContent>
        </Card>

      {/* Compliance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-600 dark:text-white">Active Certifications</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {complianceRecords.filter(r => r.status === 'active').length}
          </div>
          <div className="text-sm text-green-400">+2 this quarter</div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-gray-600 dark:text-white">Expiring Soon</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {complianceRecords.filter(r => r.status === 'expiring').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-white">Next 60 days</div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-gray-600 dark:text-white">Expired</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {complianceRecords.filter(r => r.status === 'expired').length}
          </div>
          <div className="text-sm text-red-400">Require renewal</div>
        </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-white">Avg Score</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(complianceRecords.reduce((sum, r) => sum + r.score, 0) / complianceRecords.length)}
          </div>
          <div className="text-sm text-green-400">+3 vs last audit</div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
