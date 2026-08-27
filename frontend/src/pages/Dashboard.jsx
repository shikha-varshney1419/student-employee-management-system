import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../services/studentService';
import employeeService from '../services/employeeService';
import Loader from '../components/Loader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';

/** Animates a number counting up from 0 to `value` over `duration` ms. */
function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);
  const frame = useRef();

  useEffect(() => {
    const start = performance.now();
    const startVal = 0;
    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(startVal + (value - startVal) * progress));
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  return display;
}

function StatCard({ icon, label, value, gradient }) {
  const animated = useCountUp(value);
  return (
    <div className="stat-card-wrapper">
      <div className={`stat-card ${gradient} h-100`}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="small opacity-75">{label}</div>
            <div className="stat-value">{animated}</div>
          </div>
          <i className={`bi ${icon} stat-icon`} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [studentStats, setStudentStats] = useState({ total: 0, active: 0, recent: [] });
  const [employeeStats, setEmployeeStats] = useState({ total: 0, active: 0, recent: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [sRes, eRes] = await Promise.all([studentService.stats(), employeeService.stats()]);
        setStudentStats(sRes);
        setEmployeeStats(eRes);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <div className="dashboard-content">
      <h4 className="fw-bold mb-4">Dashboard Overview</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-stats mb-4">
        <StatCard icon="bi-mortarboard-fill" label="Total Students" value={studentStats.total} gradient="bg-grad-indigo" />
        <StatCard icon="bi-person-check-fill" label="Active Students" value={studentStats.active} gradient="bg-grad-cyan" />
        <StatCard icon="bi-people-fill" label="Total Employees" value={employeeStats.total} gradient="bg-grad-green" />
        <StatCard icon="bi-person-badge-fill" label="Active Employees" value={employeeStats.active} gradient="bg-grad-amber" />
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="glass-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Recent Students</h6>
              <Link to="/students" className="small">
                View all
              </Link>
            </div>
            {studentStats.recent.length === 0 ? (
              <EmptyState icon="bi-mortarboard" title="No students yet" subtitle="Add your first student to get started." />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Course</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentStats.recent.map((s) => (
                      <tr key={s.id} className="table-hover-row">
                        <td>
                          <Link to={`/students/${s.id}`}>{s.full_name}</Link>
                          <div className="text-muted small">{s.student_id}</div>
                        </td>
                        <td>{s.course}</td>
                        <td>
                          <StatusBadge status={s.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="glass-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Recent Employees</h6>
              <Link to="/employees" className="small">
                View all
              </Link>
            </div>
            {employeeStats.recent.length === 0 ? (
              <EmptyState icon="bi-people" title="No employees yet" subtitle="Add your first employee to get started." />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeStats.recent.map((emp) => (
                      <tr key={emp.id} className="table-hover-row">
                        <td>
                          <Link to={`/employees/${emp.id}`}>{emp.full_name}</Link>
                          <div className="text-muted small">{emp.employee_id}</div>
                        </td>
                        <td>{emp.department}</td>
                        <td>
                          <StatusBadge status={emp.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
