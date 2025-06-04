import React, {useEffect, useState} from 'react';
import { FaMoneyBillWave, FaArrowUp, FaArrowDown, FaPiggyBank, FaPercent, FaUserCircle, FaBell, FaLock, FaPalette, FaLanguage, FaCreditCard, FaChartLine, FaMoneyBillWave as FaMoney } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import './user.css'; 
import logo_dashboard from '../assets/7a6898f73cd7a6aace48d3358810b49b-removebg-preview.png'
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { useNavigate, Link } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import Cookies from 'js-cookie';

const Dashboard = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
    const [dashboardData, setDashboardData] = useState('');
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
      const token = Cookies.get('token');

      if(!token){
        toast.error("Not authenticated");
        navigate('/signup');
        return;
      }

      const fetchUsername = async () => {
        try{
          const res = await fetch('http://localhost:4000/api/auth/username', {
            method: 'GET',
            credentials: 'include',
          });

          const data = await res.json();
          console.log(data);
          
          if(res.ok){
            setUsername(data.username);
          }else{
            toast.error( data.message || "Failed to fetch username");
          }
        }catch(err){
          toast.error("Error fetching username");
        }
      };

      fetchUsername();
  },[]);

    
    useEffect(() => {
      const token = Cookies.get('token');

      if (!token) {
        toast.error("Not authenticated");
        setLoading(false);
        return;
      }

      fetch('http://localhost:4000/api/auth/appExpense', { 
        method: 'GET', 
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard data', err);
        toast.error('Failed to fetch data');
        setLoading(false);
      });
    }, []);

    if (loading) {
      return <div className='dashboard-container'>Loading data...</div>;
    }

    if (!dashboardData) {
      return <div className='dashboard-container'>No user data to display</div>;
    }

    
    const handlelogout = async() => {
      try{
        Cookies.remove('token');
        
        const response = await fetch('http://localhost:4000/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        const data = await response.json();
        if(response.ok){
          console.log(data.message);
          navigate('/');
         
        }else{
          console.error('Failed to logout');
        } 
      }catch(error){
        console.error("Logout error:", error);
      }
    };

    const renderTrends = () => {
      const monthlyData = [
        { month: 'Jan', income: 4000, expenses: 3000, savings: 1000 },
        { month: 'Feb', income: 4500, expenses: 3200, savings: 1300 },
        { month: 'Mar', income: 5000, expenses: 3500, savings: 1500 },
        { month: 'Apr', income: 4800, expenses: 3300, savings: 1500 },
        { month: 'May', income: 5200, expenses: 3600, savings: 1600 },
        { month: 'Jun', income: 5500, expenses: 3800, savings: 1700 },
      ];

      const categoryData = [
        { category: 'Food', amount: 1200, trend: '+15%' },
        { category: 'Transport', amount: 800, trend: '-5%' },
        { category: 'Shopping', amount: 1500, trend: '+25%' },
        { category: 'Bills', amount: 2000, trend: '0%' },
      ];

      return (
        <div className="trends-container">
          <div className="trends-header">
            <h1>Financial Trends</h1>
            <div className="trends-filters">
              <select className="trend-select">
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>Custom Range</option>
              </select>
              <button className="trend-btn">
                <FaCalendarAlt /> Select Date Range
              </button>
            </div>
          </div>

          <div className="trends-grid">
            <div className="trend-card main-trend">
              <h3>Overall Financial Health</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#incomeGradient)" />
                  <Area type="monotone" dataKey="expenses" stroke="#EF4444" fillOpacity={1} fill="url(#expenseGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="trend-card">
              <h3>Category Analysis</h3>
              <div className="category-list">
                {categoryData.map((item, index) => (
                  <div key={index} className="category-item">
                    <div className="category-info">
                      <span className="category-name">{item.category}</span>
                      <span className="category-amount">${item.amount}</span>
                    </div>
                    <span className={`category-trend ${item.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                      {item.trend}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="trend-card">
              <h3>Savings Progress</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="trend-card">
              <h3>Key Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <FaChartLine className="metric-icon" />
                  <div className="metric-info">
                    <span className="metric-label">Growth Rate</span>
                    <span className="metric-value">+12.5%</span>
                  </div>
                </div>
                <div className="metric-item">
                  <FaMoney className="metric-icon" />
                  <div className="metric-info">
                    <span className="metric-label">Avg. Monthly Income</span>
                    <span className="metric-value">$4,833</span>
                  </div>
                </div>
                <div className="metric-item">
                  <FaArrowTrendUp className="metric-icon" />
                  <div className="metric-info">
                    <span className="metric-label">Savings Rate</span>
                    <span className="metric-value">28.3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderSettings = () => {
      return (
        <div className="settings-container">
          <div className="settings-header">
            <h1>Settings</h1>
            <p>Manage your account settings and preferences</p>
          </div>

          <div className="settings-content">
            <div className="settings-sidebar">
              <button 
                className={`settings-tab ${activeSettingsTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveSettingsTab('profile')}
              >
                <FaUserCircle /> Profile Settings
              </button>
              <button 
                className={`settings-tab ${activeSettingsTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveSettingsTab('notifications')}
              >
                <FaBell /> Notifications
              </button>
              <button 
                className={`settings-tab ${activeSettingsTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveSettingsTab('security')}
              >
                <FaLock /> Security
              </button>
              <button 
                className={`settings-tab ${activeSettingsTab === 'appearance' ? 'active' : ''}`}
                onClick={() => setActiveSettingsTab('appearance')}
              >
                <FaPalette /> Appearance
              </button>
              <button 
                className={`settings-tab ${activeSettingsTab === 'language' ? 'active' : ''}`}
                onClick={() => setActiveSettingsTab('language')}
              >
                <FaLanguage /> Language
              </button>
              <button 
                className={`settings-tab ${activeSettingsTab === 'billing' ? 'active' : ''}`}
                onClick={() => setActiveSettingsTab('billing')}
              >
                <FaCreditCard /> Billing
              </button>
            </div>

            <div className="settings-main">
              {activeSettingsTab === 'profile' && (
                <div className="settings-section">
                  <h2>Profile Settings</h2>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Profile Picture</label>
                      <div className="profile-picture-upload">
                        <div className="profile-picture">
                          <FaUserCircle size={80} />
                        </div>
                        <button className="upload-btn">Change Picture</button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" placeholder="Enter your full name" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" placeholder="Enter your phone number" />
                    </div>
                    <button className="save-btn">Save Changes</button>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'notifications' && (
                <div className="settings-section">
                  <h2>Notification Preferences</h2>
                  <div className="notification-settings">
                    <div className="notification-item">
                      <div className="notification-info">
                        <h3>Email Notifications</h3>
                        <p>Receive email updates about your account</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h3>Expense Alerts</h3>
                        <p>Get notified about unusual spending patterns</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h3>Budget Updates</h3>
                        <p>Receive weekly budget reports</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'security' && (
                <div className="settings-section">
                  <h2>Security Settings</h2>
                  <div className="security-settings">
                    <div className="security-item">
                      <div className="security-info">
                        <h3>Two-Factor Authentication</h3>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                      <button className="enable-btn">Enable</button>
                    </div>
                    <div className="security-item">
                      <div className="security-info">
                        <h3>Change Password</h3>
                        <p>Update your password regularly</p>
                      </div>
                      <button className="change-btn">Change</button>
                    </div>
                    <div className="security-item">
                      <div className="security-info">
                        <h3>Login History</h3>
                        <p>View your recent login activity</p>
                      </div>
                      <button className="view-btn">View</button>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'appearance' && (
                <div className="settings-section">
                  <h2>Appearance Settings</h2>
                  <div className="appearance-settings">
                    <div className="theme-selector">
                      <h3>Theme</h3>
                      <div className="theme-options">
                        <button className="theme-option active">Light</button>
                        <button className="theme-option">Dark</button>
                        <button className="theme-option">System</button>
                      </div>
                    </div>
                    <div className="color-selector">
                      <h3>Accent Color</h3>
                      <div className="color-options">
                        <button className="color-option" style={{ backgroundColor: '#3B82F6' }}></button>
                        <button className="color-option" style={{ backgroundColor: '#10B981' }}></button>
                        <button className="color-option" style={{ backgroundColor: '#F59E0B' }}></button>
                        <button className="color-option" style={{ backgroundColor: '#EF4444' }}></button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    const renderContent = () => {
      switch(activeView) {
        case 'dashboard':
          return (
            <>
              <div className="cards-container">
                <Card icon={<FaMoneyBillWave size={25} color={'#578808'} />} title="Total Income" amount={`$${dashboardData.income?.toLocaleString()}`} change="+12%" className='card' />
                <Card icon={<FaArrowDown size={25} color={'#578808'} />} title="Total Expenses" amount={`$${dashboardData.expenses?.toLocaleString()}`} change="-8%"  className='card'/>
                <Card icon={<FaPiggyBank size={25} color={'#578808'} />} title="Savings" amount={`$${dashboardData.savings?.toLocaleString()}`} change="+23%" className='card'/>
                <Card icon={<FaPercent size={25} color={'#578808'} />} title="Profit Rate" amount={`${dashboardData.rate}%`} change="+5%" className='card'/>
              </div>
      
              <div className="charts-container">
                <div className="chart-container">
                  <h2 className="chart-title">Expenses Breakdown</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        data={[
                          { name: 'Food', value: dashboardData.food || 0 },
                          { name: 'Transport', value: dashboardData.trCom || 0 },
                          { name: 'Clothes', value: dashboardData.clothes || 0 },
                          { name: 'Shoes', value: dashboardData.shoes || 0 },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {[
                          { name: 'Food', value: dashboardData.food || 0 },
                          { name: 'Transport', value: dashboardData.trCom || 0 },
                          { name: 'Clothes', value: dashboardData.clothes || 0 },
                          { name: 'Shoes', value: dashboardData.shoes || 0 },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
        
                <div className="chart-container">
                  <h2 className="chart-title">Expense Trends</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={[
                      { name: 'Mon', expense: 30 },
                      { name: 'Tue', expense: 40 },
                      { name: 'Wed', expense: 38 },
                      { name: 'Thu', expense: 50 },
                      { name: 'Fri', expense: 60 },
                      { name: 'Sat', expense: 65 },
                      { name: 'Sun', expense: 70 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="expense" stroke="#3498db" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          );
        case 'history':
          return (
            <div className="table-container">
              <div className="table-header">
                <h2 className="table-title">Latest Expenses</h2>
                <div className="filter-options">
                  <select className="filter-select">
                    <option>All Categories</option>
                  </select>
                  <input type="date" className="filter-input" />
                </div>
              </div>
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Total Expense</th>
                    <th>Savings</th>
                    <th>Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '2025-04-25', category: 'Food', total: 45, savings: 15, rate: '25%' },
                    { date: '2025-04-24', category: 'Transport', total: 32.5, savings: 7.5, rate: '18%' },
                    { date: '2025-04-23', category: 'Clothes', total: 120, savings: -20, rate: '-15%' },
                  ].map((exp, index) => (
                    <tr key={index}>
                      <td>{exp.date}</td>
                      <td>{exp.category}</td>
                      <td>${exp.total}</td>
                      <td className={exp.savings >= 0 ? 'positive' : 'negative'}>${exp.savings}</td>
                      <td>{exp.rate}</td>
                      <td className="view-details">View Details</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        case 'trends':
          return renderTrends();
        case 'settings':
          return renderSettings();
        default:
          return null;
      }
    };

    return (
      <>
        <ToastContainer />
        <div className="dashboard-container">
          <div className='aside_navbar'>
              <img src={logo_dashboard} alt='food' />
              <h1>Smart Expense</h1>
              <div className='links'>
                  <a href='#' onClick={(e) => { e.preventDefault(); setActiveView('dashboard'); }} className={activeView === 'dashboard' ? 'active' : ''}>Dashboard</a>
                  <a href='#' onClick={(e) => { e.preventDefault(); setActiveView('history'); }} className={activeView === 'history' ? 'active' : ''}>History</a>
                  <a href='#' onClick={(e) => { e.preventDefault(); setActiveView('trends'); }} className={activeView === 'trends' ? 'active' : ''}>Trends</a>
                  <a href='#' onClick={(e) => { e.preventDefault(); setActiveView('settings'); }} className={activeView === 'settings' ? 'active' : ''}>Settings</a>
              </div>
          </div>

          <div className="main-content">
            <div className="top-nav">
              <h1 className="welcome-text">Welcome back, {username || 'User'}!</h1>
              <div className="nav-buttons">
                <button className="btn btn-back"><IoMdArrowRoundBack style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '7px',
                      position: 'relative',
                      top: '2px' }} /> <Link to='/table' style={{textDecoration: 'none', color:'white'}}>Back</Link> </button>
                <button className="btn btn-logout" onClick={handlelogout}>Logout <FiLogOut  style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '5px',
                      position: 'relative',
                      top: '2px'}}/></button>
              </div>
            </div>
            
            {renderContent()}
          </div>
        </div>
      </>
    );
};

const Card = ({ icon, title, amount, change, down }) => (
  <div className="card">
    <div className="card-icon">{icon}</div>
    <div className="card-content">
      <h3 className="card-title">{title}</h3>
      <p className="card-amount">{amount}</p>
      <p className={`card-change ${down ? 'negative' : 'positive'}`}>{change} vs last month</p>
    </div>
  </div>
);

export default Dashboard;



