import React, {useEffect}from "react";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="page-container" style={{padding:"15px"}}>
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-value">$0.00</p>
          <span className="stat-change">↑ +12.5%</span>
        </div>
        <div className="stat-card">
          <h3>Transactions</h3>
          <p className="stat-value">0</p>
          <span className="stat-change">↑ +5.2%</span>
        </div>
        <div className="stat-card">
          <h3>Inventory Value</h3>
          <p className="stat-value">$12,498</p>
          <span className="stat-change">→ 0.0%</span>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <p className="stat-value">2</p>
          <span className="stat-change">↓ -1 item</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
