import { useState } from 'react';
import { runFirestoreDiagnostics } from '../services/firestoreService';

const FirestoreDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);
    setDiagnostics(null);
    
    try {
      const result = await runFirestoreDiagnostics();
      setDiagnostics(result);
    } catch (err) {
      setError(err.message || 'Failed to run diagnostics');
      console.error('Diagnostics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS':
        return 'text-green-600 bg-green-50';
      case 'FAIL':
        return 'text-red-600 bg-red-50';
      case 'ERROR':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS':
        return '✅';
      case 'FAIL':
        return '❌';
      case 'ERROR':
        return '⚠️';
      default:
        return '❓';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🔍 Firestore Diagnostics</h2>
        <p className="text-gray-600">Test your Firestore connection and configuration</p>
      </div>

      <button
        onClick={runDiagnostics}
        disabled={loading}
        className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">Error: {error}</p>
        </div>
      )}

      {diagnostics && (
        <div className="space-y-6">
          {/* Overall Status */}
          <div className={`p-4 rounded-lg border-2 ${getStatusColor(diagnostics.overallStatus)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">Overall Status</h3>
                <p className="text-sm opacity-80">Timestamp: {new Date(diagnostics.timestamp).toLocaleString()}</p>
              </div>
              <div className="text-4xl">
                {getStatusIcon(diagnostics.overallStatus)}
              </div>
            </div>
            <div className="mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(diagnostics.overallStatus)}`}>
                {diagnostics.overallStatus}
              </span>
            </div>
          </div>

          {/* Test Results */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Test Results</h3>
            <div className="space-y-3">
              {Object.entries(diagnostics.tests).map(([testName, result]) => (
                <div
                  key={testName}
                  className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getStatusIcon(result.status)}</span>
                      <span className="font-semibold text-lg capitalize">
                        {testName.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(result.status)}`}>
                      {result.status}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{result.message}</p>
                  {result.errorCode && (
                    <p className="text-xs text-gray-600">Error Code: {result.errorCode}</p>
                  )}
                  {result.details && (
                    <div className="mt-2 p-2 bg-white rounded text-xs">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(result.details, null, 2)}</pre>
                    </div>
                  )}
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                      {result.error}
                    </div>
                  )}
                  {result.recommendation && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                      💡 {result.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {diagnostics.recommendations && diagnostics.recommendations.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Recommendations</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {diagnostics.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-yellow-900 flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Raw Diagnostic Data */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
              View Raw Diagnostic Data
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {JSON.stringify(diagnostics, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">📖 How to Use</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Click "Run Diagnostics" to test your Firestore connection</li>
          <li>Review the test results to identify any issues</li>
          <li>Follow the recommendations to fix any problems</li>
          <li>Common issues: Permission denied (check Firestore rules), Database not created, Network issues</li>
        </ol>
      </div>
    </div>
  );
};

export default FirestoreDiagnostics;

