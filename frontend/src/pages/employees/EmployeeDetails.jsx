import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import Loader from '../../components/Loader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';

function DetailRow({ icon, label, value }) {
  return (
    <div className="col-md-6">
      <div className="d-flex align-items-start gap-2">
        <i className={`bi ${icon} text-primary mt-1`} />
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fw-semibold">{value || '—'}</div>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await employeeService.getById(id);
        setEmployee(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Employee not found.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeeService.remove(id);
      navigate('/employees');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete employee.');
      setDeleting(false);
      setShowDelete(false);
    }
  };

  if (loading) return <Loader label="Loading employee details..." />;

  if (error || !employee) {
    return (
      <div className="alert alert-danger">
        {error || 'Employee not found.'}
        <div className="mt-2">
          <Link to="/employees" className="btn btn-sm btn-outline-secondary">
            Back to Employees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/employees" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left" />
        </Link>
        <h4 className="fw-bold mb-0">Employee Details</h4>
      </div>

      <div className="glass-card p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <span
              className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-bold"
              style={{ width: 60, height: 60, fontSize: '1.3rem' }}
            >
              {employee.full_name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h5 className="mb-1">{employee.full_name}</h5>
              <div className="text-muted small">{employee.employee_id}</div>
              <StatusBadge status={employee.status} />
            </div>
          </div>
          <div className="btn-group">
            <Link to={`/employees/${id}/edit`} className="btn btn-outline-primary">
              <i className="bi bi-pencil me-1" />
              Edit
            </Link>
            <button className="btn btn-outline-danger" onClick={() => setShowDelete(true)}>
              <i className="bi bi-trash me-1" />
              Delete
            </button>
          </div>
        </div>

        <hr />

        <div className="row g-4 mt-1">
          <DetailRow icon="bi-envelope" label="Email" value={employee.email} />
          <DetailRow icon="bi-telephone" label="Phone" value={employee.phone} />
          <DetailRow icon="bi-diagram-3" label="Department" value={employee.department} />
          <DetailRow icon="bi-award" label="Designation" value={employee.designation} />
          <DetailRow icon="bi-briefcase" label="Employee Type" value={employee.employee_type} />
          <DetailRow
            icon="bi-calendar-event"
            label="Join Date"
            value={employee.join_date ? new Date(employee.join_date).toLocaleDateString() : '—'}
          />
          <DetailRow
            icon="bi-clock-history"
            label="Record Created"
            value={employee.created_at ? new Date(employee.created_at).toLocaleString() : '—'}
          />
        </div>
      </div>

      <ConfirmModal
        show={showDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.full_name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  );
}
