import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import studentService from '../../services/studentService';
import Loader from '../../components/Loader.jsx';
import Toast from '../../components/Toast.jsx';

const COURSES = ['BCA', 'B.Tech', 'MCA', 'MBA', 'Other'];
const STATUSES = ['Active', 'Inactive'];

const emptyForm = {
  student_id: '',
  full_name: '',
  email: '',
  phone: '',
  college: '',
  course: 'BCA',
  year: '',
  internship: '',
  join_date: '',
  status: 'Active',
};

export default function StudentForm() {
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
        const res = await studentService.getById(id);
        const s = res.data;
        setForm({
          student_id: s.student_id,
          full_name: s.full_name,
          email: s.email,
          phone: s.phone,
          college: s.college,
          course: s.course,
          year: s.year,
          internship: s.internship || '',
          join_date: s.join_date ? s.join_date.slice(0, 10) : '',
          status: s.status,
        });
      } catch (err) {
        setToast({ show: true, message: 'Failed to load student data.', variant: 'danger' });
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
    if (!form.student_id.trim()) errs.student_id = 'Student ID is required.';
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'A valid email is required.';
    if (!form.phone.trim() || !/^[0-9+\-\s()]{7,20}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.';
    if (!form.college.trim()) errs.college = 'College is required.';
    if (!form.year.trim()) errs.year = 'Year is required.';
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
        await studentService.update(id, form);
      } else {
        await studentService.create(form);
      }
      navigate('/students', { state: { flash: isEdit ? 'Student updated.' : 'Student added.' } });
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
        message: err?.response?.data?.message || 'Failed to save student.',
        variant: 'danger',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading student..." />;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/students" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left" />
        </Link>
        <h4 className="fw-bold mb-0">{isEdit ? 'Edit Student' : 'Add New Student'}</h4>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-4" noValidate>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Student ID</label>
            <input
              className={`form-control ${errors.student_id ? 'is-invalid' : ''}`}
              value={form.student_id}
              onChange={handleChange('student_id')}
              placeholder="e.g. STU2026001"
            />
            {errors.student_id && <div className="invalid-feedback">{errors.student_id}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold">Full Name</label>
            <input
              className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
              value={form.full_name}
              onChange={handleChange('full_name')}
              placeholder="[Placeholder: Student's Full Name]"
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
              placeholder="student@example.com"
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
            <label className="form-label small fw-semibold">College</label>
            <input
              className={`form-control ${errors.college ? 'is-invalid' : ''}`}
              value={form.college}
              onChange={handleChange('college')}
              placeholder="[Placeholder: College Name]"
            />
            {errors.college && <div className="invalid-feedback">{errors.college}</div>}
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-semibold">Course</label>
            <select className="form-select" value={form.course} onChange={handleChange('course')}>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-semibold">Year</label>
            <input
              className={`form-control ${errors.year ? 'is-invalid' : ''}`}
              value={form.year}
              onChange={handleChange('year')}
              placeholder="e.g. 2nd Year"
            />
            {errors.year && <div className="invalid-feedback">{errors.year}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold">Internship (optional)</label>
            <input
              className="form-control"
              value={form.internship}
              onChange={handleChange('internship')}
              placeholder="[Placeholder: Internship details]"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold">Join Date</label>
            <input
              type="date"
              className={`form-control ${errors.join_date ? 'is-invalid' : ''}`}
              value={form.join_date}
              onChange={handleChange('join_date')}
            />
            {errors.join_date && <div className="invalid-feedback">{errors.join_date}</div>}
          </div>

          <div className="col-md-6">
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
              'Update Student'
            ) : (
              'Add Student'
            )}
          </button>
          <Link to="/students" className="btn btn-outline-secondary">
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
