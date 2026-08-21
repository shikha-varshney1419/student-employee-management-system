import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import Loader from '../../components/Loader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Pagination from '../../components/Pagination.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import Toast from '../../components/Toast.jsx';

const TYPES = ['Full Time', 'Part Time', 'Intern', 'Contract'];
const STATUSES = ['Active', 'Inactive'];

export default function EmployeeList() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [status, setStatus] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const fetchEmployees = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await employeeService.list({
        search: search || undefined,
        department: department || undefined,
        employeeType: employeeType || undefined,
        status: status || undefined,
        page,
        limit: 10,
      });
      setEmployees(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load employees.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, department, employeeType, status]);

  useEffect(() => {
    const timer = setTimeout(() => fetchEmployees(1), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, department, employeeType, status]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await employeeService.remove(deleteTarget.id);
      setToast({ show: true, message: 'Employee deleted successfully.', variant: 'success' });
      setDeleteTarget(null);
      fetchEmployees(pagination.page);
    } catch (err) {
      setToast({
        show: true,
        message: err?.response?.data?.message || 'Failed to delete employee.',
        variant: 'danger',
      });
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setDepartment('');
    setEmployeeType('');
    setStatus('');
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h4 className="fw-bold mb-0">Employee Management</h4>
        <Link to="/employees/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1" />
          Add New Employee
        </Link>
      </div>

      <div className="glass-card p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-transparent">
                <i className="bi bi-search" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by ID, name, email, department, designation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6 col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <select className="form-select" value={employeeType} onChange={(e) => setEmployeeType(e.target.value)}>
              <option value="">All Types</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
              <i className="bi bi-x-circle me-1" />
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <Loader label="Loading employees..." />
        ) : employees.length === 0 ? (
          <EmptyState
            icon="bi-people"
            title="No employees found"
            subtitle="Try adjusting your search or filters, or add a new employee."
            actionLabel="Add New Employee"
            onAction={() => navigate('/employees/new')}
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} className="table-hover-row">
                      <td className="fw-semibold">{emp.employee_id}</td>
                      <td>
                        <Link to={`/employees/${emp.id}`}>{emp.full_name}</Link>
                        <div className="text-muted small">{emp.email}</div>
                      </td>
                      <td>{emp.department}</td>
                      <td>{emp.designation}</td>
                      <td>{emp.employee_type}</td>
                      <td>
                        <StatusBadge status={emp.status} />
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <Link to={`/employees/${emp.id}`} className="btn btn-outline-secondary" title="View">
                            <i className="bi bi-eye" />
                          </Link>
                          <Link to={`/employees/${emp.id}/edit`} className="btn btn-outline-primary" title="Edit">
                            <i className="bi bi-pencil" />
                          </Link>
                          <button
                            className="btn btn-outline-danger"
                            title="Delete"
                            onClick={() => setDeleteTarget(emp)}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
              <div className="text-muted small">
                Showing {employees.length} of {pagination.total} employees
              </div>
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchEmployees} />
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.full_name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
