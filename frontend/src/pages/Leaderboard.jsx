import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await userAPI.getLeaderboard(20);
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            🏆 Leaderboard
          </h1>
          <p className="text-yellow-100 text-lg">
            Top learners competing for the top spots
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <LoadingSpinner />
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No data yet</h3>
            <p className="text-gray-600">Start learning to appear on the leaderboard!</p>
          </div>
        ) : (
          <>
            {/* Top 3 */}
            {leaderboard.length >= 3 && (
              <div className="flex justify-center items-end gap-4 mb-8">
                {/* Second Place */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold mb-2 shadow-lg">
                    {leaderboard[1]?.name?.charAt(0)}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{leaderboard[1]?.name}</div>
                  <div className="text-2xl font-bold text-gray-500">{leaderboard[1]?.points}</div>
                  <div className="text-4xl">🥈</div>
                </div>

                {/* First Place */}
                <div className="text-center transform scale-110">
                  <div className="w-24 h-24 mx-auto bg-yellow-400 rounded-full flex items-center justify-center text-4xl font-bold mb-2 shadow-lg ring-4 ring-yellow-400">
                    {leaderboard[0]?.name?.charAt(0)}
                  </div>
                  <div className="text-xl font-bold text-gray-900">{leaderboard[0]?.name}</div>
                  <div className="text-3xl font-bold text-yellow-600">{leaderboard[0]?.points}</div>
                  <div className="text-5xl">🥇</div>
                </div>

                {/* Third Place */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-amber-600 rounded-full flex items-center justify-center text-3xl font-bold mb-2 shadow-lg">
                    {leaderboard[2]?.name?.charAt(0)}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{leaderboard[2]?.name}</div>
                  <div className="text-2xl font-bold text-gray-500">{leaderboard[2]?.points}</div>
                  <div className="text-4xl">🥉</div>
                </div>
              </div>
            )}

            {/* Full List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-600">Rank</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-600">Student</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-600">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry._id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {entry.rank}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {entry.name?.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{entry.name}</span>
                          {entry.badges?.length > 0 && (
                            <span className="text-2xl">{entry.badges[0].icon}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-lg font-bold text-primary-600">{entry.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Leaderboard;

