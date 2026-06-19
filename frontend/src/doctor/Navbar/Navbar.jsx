import React, { useState, useMemo } from "react";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { Home, Calendar, Edit, Menu, X, LogOut } from "lucide-react";
import logo from "../../assets/logo.png";
import { navbarStylesDr } from "../../assets/dummyStyles";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const location = useLocation();

  // Try params first, then try to extract from pathname (e.g. /doctor-admin/123/...)
  const doctorId = useMemo(() => {
    if (params?.id) return params.id;
    const m = location.pathname.match(/\/doctor-admin\/([^/]+)/);
    if (m) return m[1];
    return null;
  }, [params, location.pathname]);

  // If we don't have an id, send users to login as a safe fallback
  const basePath = doctorId
    ? `/doctor-admin/${doctorId}`
    : "/doctor-admin/login";

  const navItems = [
    { name: "Dashboard", to: `${basePath}`, Icon: Home },
    { name: "Appointments", to: `${basePath}/appointments`, Icon: Calendar },
    { name: "Edit Profile", to: `${basePath}/profile/edit`, Icon: Edit },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className={navbarStylesDr.navContainer}>
        {/* Left Brand */}
        <div className={navbarStylesDr.leftBrand}>
          <div className={navbarStylesDr.logoContainer}>
            <img
              src={logo}
              alt="App logo"
              className={navbarStylesDr.logoImage}
            />
          </div>
          <div className={navbarStylesDr.brandTextContainer}>
            <div className={navbarStylesDr.brandTitle}>Medtek</div>
            <div className={navbarStylesDr.brandSubtitle}>
              HealthCare Solutions
            </div>
          </div>
        </div>

        {/* Desktop Menu (visible on lg) */}
        <div className={navbarStylesDr.desktopMenu}>
          <div className={navbarStylesDr.desktopMenuItems}>
            {navItems.map(({ name, to, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === basePath} // mark dashboard link as exact match
                className={({ isActive }) =>
                  `${navbarStylesDr.baseLink} ${isActive ? navbarStylesDr.activeLink : navbarStylesDr.inactiveLink}`
                }
                onClick={() => setOpen(false)}
              >
                <span className={navbarStylesDr.linkContent}>
                  <Icon size={16} className={navbarStylesDr.linkIcon} />
                  <span className={navbarStylesDr.linkText}>{name}</span>
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right side actions */}
        <div className={navbarStylesDr.rightActions}>
          {/* Logout button (desktop) */}
          <button
            className={navbarStylesDr.logoutButtonDesktop}
            onClick={() => {
              // TODO: integrate real logout (clear auth + redirect)
              window.location.href = "/doctor-admin/login";
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>

          {/* Hamburger Menu (mobile & tablet) */}
          <button
            className={navbarStylesDr.hamburgerButtonMd}
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            className={navbarStylesDr.hamburgerButtonLg}
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile & Tablet Menu */}
      <div className={navbarStylesDr.mobileMenuContainer(open)}>
        <div className={navbarStylesDr.mobileMenuContent}>
          {navItems.map(({ name, to, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === basePath}
              className={({ isActive }) =>
                `${navbarStylesDr.mobileBaseLink} ${
                  isActive
                    ? navbarStylesDr.mobileActiveLink
                    : navbarStylesDr.mobileInactiveLink
                }`
              }
              onClick={() => setOpen(false)}
            >
              <Icon size={18} className="text-emerald-600" />
              <span>{name}</span>
            </NavLink>
          ))}

          {/* Logout button mobile */}
          <button
            className={navbarStylesDr.mobileLogoutButton}
            onClick={() => {
              setOpen(false);
              window.location.href = "/doctor-admin/login";
            }}
          >
            <div className={navbarStylesDr.mobileLogoutContent}>
              <LogOut size={16} />
              Logout
            </div>
          </button>
        </div>
      </div>

      {/* Spacer so content doesn't hide behind navbar */}
      <div className={navbarStylesDr.spacer} />
    </>
  );
}
