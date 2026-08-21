import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import Loader from '../../components/Loader.jsx';
import Toast from '../../components/Toast.jsx';

const TYPES = ['Full Time', 'Part Time', 'Intern', 'Contract'];
const STATUSES = ['Active', 'Inactive'];

const emptyForm = {
  employee_id: '',
  full_name: '',
  email: '',
  phone: '',
  department: '',
  designation: '',
  join_date: '',
  employee_type: 'Full Time',
  status: 'Active',
};

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', variant: 'danger' });

  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      setLoading(true);
      try {
        const res = await employeeService.getById(id);
        const e = res.data;
        setForm({
          employee_id: e.employee_id,
          full_name: e.full_name,
          email: e.email,
          phone: e.phone,
          department: e.department,
          designation: e.designation,
          join_date: e.join_date ? e.join_date.slice(0, 10) : '',
          employee_type: e.employee_type,
          status: e.status,
        });
      } catch (err) {
        setToast({ show: true, message: 'Failed to load employee data.', variant: 'danger' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.employee_id.trim()) errs.employee_id = 'Employee ID is required.';
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'A valid email is required.';
    if (!form.phone.trim() || !/^[0-9+\-\s()]{7,20}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.';
    if (!form.department.trim()) errs.department = 'Department is required.';
    if (!form.designation.trim()) errs.designation = 'Designation is required.';
    if (!form.join_date) errs.join_date = 'Join date is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit) {
        await employeeService.update(id, form);
      } else {
        await employeeService.create(form);
      }
      navigate('/employees', { state: { flash: isEdit ? 'Employee updated.' : 'Employee added.' } });
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (Array.isArray(apiErrors)) {
        const mapped = {};
        apiErrors.forEach((e2) => {
          mapped[e2.field] = e2.message;
        });
        setErrors(mapped);
      }
      setToast({
        show: true,
        message: err?.response?.data?.message || 'Failed to save employee.',
        variant: 'danger',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading employee..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/employees" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left" />
        </Link>
        <h4 className="fw-bold mb-0">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h4>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-4" noValidate>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Employee ID</label>
            <input
              className={`form-control ${errors.employee_id ? 'is-invalid' : ''}`}
              value={form.employee_id}
              onChange={handleChange('employee_id')}
              placeholder="e.g. EMP2026001"
            />
            {errors.employee_id && <div className="invalid-feedback">{errors.employee_id}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold">Full Name</label>
            <input
              className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
              value={form.full_name}
              onChange={handleChange('full_name')}
              placeholder="[Placeholder: Employee's Full Name]"
            />
            {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={form.email}
              onChange={handleChange('email')}
              placeholder="employee@example.com"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold">Phone Number</label>
            <input
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="+91 90000 00000"
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold">Department</label>
            <input
              className={`form-control ${errors.department ? 'is-invalid' : ''}`}
              value={form.department}
              onChange={handleChange('department')}
              placeholder="[Placeholder: e.g. Engineering]"
            />
            {errors.department && <div className="invalid-feedback">{errors.department}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold">Designation</label>
            <input
              className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
              value={form.designation}
              onChange={handleChange('designation')}
              placeholder="[Placeholder: e.g. Software Engineer]"
            />
            {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold">Join Date</label>
            <input
              type="date"
              className={`form-control ${errors.join_date ? 'is-invalid' : ''}`}
              value={form.join_date}
              onChange={handleChange('join_date')}
            />
            {errors.join_date && <div className="invalid-feedback">{errors.join_date}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold">Employee Type</label>
            <select className="form-select" value={form.employee_type} onChange={handleChange('employee_type')}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold">Status</label>
            <select className="form-select" value={form.status} onChange={handleChange('status')}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : isEdit ? (
              'Update Employee'
            ) : (
              'Add Employee'
            )}
          </button>
          <Link to="/employees" className="btn btn-outline-secondary">
            Cancel
          </Link>
        </div>
      </form>

      <Toast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
