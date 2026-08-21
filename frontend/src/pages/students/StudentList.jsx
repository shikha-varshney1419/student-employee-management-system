import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import Loader from '../../components/Loader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Pagination from '../../components/Pagination.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import Toast from '../../components/Toast.jsx';

const COURSES = ['BCA', 'B.Tech', 'MCA', 'MBA', 'Other'];
const STATUSES = ['Active', 'Inactive'];

export default function StudentList() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const fetchStudents = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await studentService.list({
        search: search || undefined,
        course: course || undefined,
        year: year || undefined,
        status: status || undefined,
        page,
        limit: 10,
      });
      setStudents(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load students.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, course, year, status]);

  useEffect(() => {
    const timer = setTimeout(() => fetchStudents(1), 300); // debounce search
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, course, year, status]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await studentService.remove(deleteTarget.id);
      setToast({ show: true, message: 'Student deleted successfully.', variant: 'success' });
      setDeleteTarget(null);
      fetchStudents(pagination.page);
    } catch (err) {
      setToast({
        show: true,
        message: err?.response?.data?.message || 'Failed to delete student.',
        variant: 'danger',
      });
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCourse('');
    setYear('');
    setStatus('');
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h4 className="fw-bold mb-0">Student Management</h4>
        <Link to="/students/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1" />
          Add New Student
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
                placeholder="Search by ID, name, email, phone, course, college..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6 col-md-2">
            <select className="form-select" value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">All Courses</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
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
          <Loader label="Loading students..." />
        ) : students.length === 0 ? (
          <EmptyState
            icon="bi-mortarboard"
            title="No students found"
            subtitle="Try adjusting your search or filters, or add a new student."
            actionLabel="Add New Student"
            onAction={() => navigate('/students/new')}
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>College</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="table-hover-row">
                      <td className="fw-semibold">{s.student_id}</td>
                      <td>
                        <Link to={`/students/${s.id}`}>{s.full_name}</Link>
                        <div className="text-muted small">{s.email}</div>
                      </td>
                      <td>{s.course}</td>
                      <td>{s.year}</td>
                      <td>{s.college}</td>
                      <td>
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <Link to={`/students/${s.id}`} className="btn btn-outline-secondary" title="View">
                            <i className="bi bi-eye" />
                          </Link>
                          <Link to={`/students/${s.id}/edit`} className="btn btn-outline-primary" title="Edit">
                            <i className="bi bi-pencil" />
                          </Link>
                          <button
                            className="btn btn-outline-danger"
                            title="Delete"
                            onClick={() => setDeleteTarget(s)}
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
                Showing {students.length} of {pagination.total} students
              </div>
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchStudents} />
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Student"
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
