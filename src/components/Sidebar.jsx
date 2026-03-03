import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  //list menu item
  const menuItems = [
    { id: "dashboard", label: "📊 Dashboard", path: "/dashboard" },
    {
      id: "products",
      label: "📦 Product Management",
      path: "/products",
      submenu: [
        { id: "categories", label: "Categories", path: "/categories" },
        { id: "brands", label: "Brands", path: "/brands" },
        { id: "products", label: "Products", path: "/products" },
      ],
    },
    {
      id: "sales",
      label: "💳 Point Of Sale",
      path: "/pos",
      submenu: [
        { id: "new-sale", label: "New Sale", path: "/sales/new" },
        { id: "sales-list", label: "Sales History", path: "/sales" },
      ],
    },
    { id: "customers", label: "👥 Customer", path: "/customers" },
    {
      id: "reports",
      label: "📈 Report",
      path: "/reports",
      submenu: [
        { id: "sales-report", label: "Sales Report", path: "/reports/sales" },
        {
          id: "inventory-report",
          label: "Inventory Report",
          path: "/reports/inventory",
        },
        {
          id: "customer-report",
          label: "Customer Report",
          path: "/reports/customer",
        },
      ],
    },
    {
      id: "setting",
      label: "📈 Setting",
      path: "/Setting",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSubmenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>CLUBCODE POS</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="nav-item-wrapper">
            <button
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => {
                if (item.submenu) {
                  toggleSubmenu(item.id);
                } else {
                  handleNavigation(item.path);
                }
              }}
            >
              <span>{item.label}</span>
              {item.submenu && (
                <span
                  className={`submenu-toggle ${expandedMenu === item.id ? "open" : ""}`}
                >
                  ▼
                </span>
              )}
            </button>

            {item.submenu && expandedMenu === item.id && (
              <div className="submenu">
                {item.submenu.map((subitem) => (
                  <button
                    key={subitem.id}
                    className={`submenu-item ${
                      location.pathname === subitem.path ? "active" : ""
                    }`}
                    onClick={() => handleNavigation(subitem.path)}
                  >
                    {subitem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
