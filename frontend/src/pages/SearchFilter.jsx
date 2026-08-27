import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../services/studentService';
import employeeService from '../services/employeeService';
import Loader from '../components/Loader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';

const COURSES = ['BCA', 'B.Tech', 'MCA', 'MBA', 'Other'];
const TYPES = ['Full Time', 'Part Time', 'Intern', 'Contract'];
const STATUSES = ['Active', 'Inactive'];

export default function SearchFilter() {
  const [tab, setTab] = useState('students'); // 'students' | 'employees'

  const [studentQuery, setStudentQuery] = useState({ search: '', course: '', status: '' });
  const [employeeQuery, setEmployeeQuery] = useState({ search: '', department: '', employeeType: '', status: '' });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const runSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      if (tab === 'students') {
        const res = await studentService.list({
          search: studentQuery.search || undefined,
          course: studentQuery.course || undefined,
          status: studentQuery.status || undefined,
          limit: 20,
        });
        setResults(res.data);
      } else {
        const res = await employeeService.list({
          search: employeeQuery.search || undefined,
          department: employeeQuery.department || undefined,
          employeeType: employeeQuery.employeeType || undefined,
          status: employeeQuery.status || undefined,
          limit: 20,
        });
        setResults(res.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (next) => {
    setTab(next);
    setResults([]);
    setSearched(false);
    setError('');
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">Search & Filter</h4>

     <ul className="nav nav-pills mb-3">
       <li className="nav-item">
        <button
          type="button"
          className="nav-link"
          style={{
            backgroundColor: tab === 'students' ? '#F39A1E' : 'transparent',
            color: tab === 'students' ? '#FFFFFF' : '#0B1F3A',
            fontWeight: 600,
            border: 'none',
          }}
          onClick={() => switchTab('students')}
        >
          <i className="bi bi-mortarboard-fill me-1" />
          Students
        </button>
      </li>

      <li className="nav-item">
        <button
          type="button"
          className="nav-link"
          style={{
            backgroundColor: tab === 'employees' ? '#F39A1E' : 'transparent',
            color: tab === 'employees' ? '#FFFFFF' : '#0B1F3A',
            fontWeight: 600,
            border: 'none',
          }}
          onClick={() => switchTab('employees')}
        >
          <i className="bi bi-people-fill me-1" />
          Employees
        </button>
      </li>
    </ul>

      <form className="glass-card p-3 mb-3" onSubmit={runSearch}>
        {tab === 'students' ? (
          <div className="row g-2">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search by ID, name, email, phone, course, college..."
                value={studentQuery.search}
                onChange={(e) => setStudentQuery((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={studentQuery.course}
                onChange={(e) => setStudentQuery((prev) => ({ ...prev, course: e.target.value }))}
              >
                <option value="">All Courses</option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={studentQuery.status}
                onChange={(e) => setStudentQuery((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-search me-1" />
                Search
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by ID, name, email, department, designation..."
                value={employeeQuery.search}
                onChange={(e) => setEmployeeQuery((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="col-6 col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Department"
                value={employeeQuery.department}
                onChange={(e) => setEmployeeQuery((prev) => ({ ...prev, department: e.target.value }))}
              />
            </div>
            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={employeeQuery.employeeType}
                onChange={(e) => setEmployeeQuery((prev) => ({ ...prev, employeeType: e.target.value }))}
              >
                <option value="">All Types</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={employeeQuery.status}
                onChange={(e) => setEmployeeQuery((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-search me-1" />
                Search
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="glass-card p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <Loader label="Searching..." />
        ) : !searched ? (
          <EmptyState icon="bi-search" title="Start a search" subtitle="Use the filters above to find students or employees." />
        ) : results.length === 0 ? (
          <EmptyState icon="bi-inbox" title="No results found" subtitle="Try different search terms or filters." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>{tab === 'students' ? 'Course' : 'Department'}</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="table-hover-row">
                    <td className="fw-semibold">{tab === 'students' ? r.student_id : r.employee_id}</td>
                    <td>
                      {r.full_name}
                      <div className="text-muted small">{r.email}</div>
                    </td>
                    <td>{tab === 'students' ? r.course : r.department}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="text-end">
                      <Link to={`/${tab}/${r.id}`} className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-eye" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
