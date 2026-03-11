import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { paymentAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentAPI.getMy();
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `₹${price}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Calculate totals
  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  
  const completedCount = payments.filter(p => p.status === 'completed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
            💳 My Payments
          </h1>
          <p className="text-gray-600">View your course purchase history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{completedCount}</div>
            <div className="text-xs md:text-sm text-gray-500">Courses Purchased</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-green-600">₹{totalSpent}</div>
            <div className="text-xs md:text-sm text-gray-500">Total Spent</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm col-span-2 md:col-span-1">
            <div className="text-2xl md:text-3xl font-bold text-primary-600">{payments.length}</div>
            <div className="text-xs md:text-sm text-gray-500">Total Transactions</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {['all', 'completed', 'pending', 'refunded'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Payment List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-500 mb-4">Start exploring courses to make your first purchase</p>
              <Link to="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPayments.map(payment => (
                <div key={payment._id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Course Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {payment.course?.category === 'Mathematics' ? '📐' : 
                         payment.course?.category === 'Science' ? '🔬' : '📚'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{payment.course?.title}</h3>
                        <p className="text-sm text-gray-500">
                          {payment.course?.category} • Class {payment.course?.class}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Purchased on {formatDate(payment.completedAt || payment.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Price & Status */}
                    <div className="flex items-center gap-4 md:text-right">
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatPrice(payment.amount)}
                        </div>
                        <div className="mt-1">
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                      {payment.status === 'completed' && (
                        <Link
                          to={`/courses/${payment.course?._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Continue Learning
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Transaction ID */}
                  {payment.transactionId && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Transaction ID: <span className="font-mono text-gray-700">{payment.transactionId}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPayments;

