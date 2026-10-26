import { useCallback, useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const INITIAL_FORM = {
  rainwaterHarvestingUnitname: '',
  capacityLitres: '',
  installationDate: '',
  active: true,
};

function App() {
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');

  const showNotice = (type, message) => setNotice({ type, message });

  const loadUnits = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Harvestingunit/displayall`);
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      const data = await response.json();
      setUnits(Array.isArray(data) ? data : []);
    } catch (error) {
      showNotice('danger', `Unable to load harvesting units. ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  const filteredUnits = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return units;
    return units.filter((unit) =>
      String(unit.rainwaterHarvestingUnitname || '').toLowerCase().includes(query),
    );
  }, [search, units]);

  const totalCapacity = useMemo(
    () => units.reduce((total, unit) => total + Number(unit.capacityLitres || 0), 0),
    [units],
  );

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    const name = form.rainwaterHarvestingUnitname.trim();
    const capacity = Number(form.capacityLitres);
    if (!name) nextErrors.rainwaterHarvestingUnitname = 'A unit name is required.';
    else if (name.length < 2 || name.length > 100) {
      nextErrors.rainwaterHarvestingUnitname = 'Use between 2 and 100 characters.';
    }
    if (form.capacityLitres === '') nextErrors.capacityLitres = 'Capacity is required.';
    else if (!Number.isFinite(capacity) || capacity <= 0 || capacity > 100000000) {
      nextErrors.capacityLitres = 'Enter a value between 0.01 and 100,000,000 litres.';
    }
    if (!form.installationDate) nextErrors.installationDate = 'Installation date is required.';
    else if (form.installationDate > new Date().toISOString().slice(0, 10)) {
      nextErrors.installationDate = 'Installation date cannot be in the future.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const addUnit = async (event) => {
    event.preventDefault();
    setNotice(null);
    if (!validate()) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Harvestingunit/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rainwaterHarvestingUnitname: form.rainwaterHarvestingUnitname.trim(),
          capacityLitres: Number(form.capacityLitres),
          installationDate: form.installationDate,
          active: form.active,
        }),
      });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      setForm(INITIAL_FORM);
      showNotice('success', 'Harvesting unit added successfully.');
      await loadUnits();
    } catch (error) {
      showNotice('danger', `Unable to add the unit. ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUnit = async (id) => {
    if (!window.confirm('Delete this harvesting unit? This action cannot be undone.')) return;
    setDeletingId(id);
    setNotice(null);
    try {
      const response = await fetch(`${API_BASE_URL}/Harvestingunit/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      showNotice('success', 'Harvesting unit deleted successfully.');
      await loadUnits();
    } catch (error) {
      showNotice('danger', `Unable to delete the unit. ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2" href="#overview">
            <span className="brand-mark"><i className="bi bi-droplet-fill" /></span>
            <span>Rain<span className="brand-accent">Harvest</span></span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <div className="navbar-nav ms-auto">
              <a className="nav-link" href="#overview">Overview</a>
              <a className="nav-link" href="#add-unit">Add unit</a>
              <a className="nav-link" href="#units">All units</a>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero-section" id="overview">
          <div className="container position-relative">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <span className="eyebrow"><i className="bi bi-stars me-2" />Sustainable water management</span>
                <h1>Every drop has a <span>purpose.</span></h1>
                <p className="hero-copy">
                  Keep your rainwater harvesting infrastructure organised, measurable, and ready to make an impact.
                </p>
                <a className="btn btn-light btn-lg px-4" href="#add-unit">Register a unit <i className="bi bi-arrow-down ms-2" /></a>
              </div>
              <div className="col-lg-5 d-none d-lg-block">
                <div className="hero-illustration">
                  <i className="bi bi-cloud-rain-fill cloud-icon" />
                  <div className="water-tank"><i className="bi bi-droplet-half" /><span>COLLECT</span></div>
                  <i className="bi bi-arrow-down arrow-icon" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container stats-row" aria-label="Harvesting summary">
          <div className="row g-3">
            <StatCard icon="bi-stack" value={units.length} label="Registered units" />
            <StatCard icon="bi-moisture" value={`${totalCapacity.toLocaleString()} L`} label="Total capacity" />
            <StatCard icon="bi-activity" value={units.filter((unit) => unit.active !== false).length} label="Active systems" />
          </div>
        </section>

        <section className="container content-section" id="add-unit">
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="section-heading">
                <span className="eyebrow dark">Manage infrastructure</span>
                <h2>Add a harvesting unit</h2>
                <p>Register a new system with its capacity and installation details. The unit ID is generated automatically.</p>
              </div>
              <div className="info-note"><i className="bi bi-lightbulb-fill" /><span>Accurate capacity data helps you understand your water-saving impact over time.</span></div>
            </div>
            <div className="col-lg-7">
              <form className="card form-card" onSubmit={addUnit} noValidate>
                <div className="card-body p-4 p-md-5">
                  <div className="mb-4">
                    <label className="form-label" htmlFor="unitName">Unit name</label>
                    <input className={`form-control ${errors.rainwaterHarvestingUnitname ? 'is-invalid' : ''}`} id="unitName" name="rainwaterHarvestingUnitname" value={form.rainwaterHarvestingUnitname} onChange={updateField} placeholder="e.g. North Block Rooftop System" maxLength="100" />
                    <div className="invalid-feedback">{errors.rainwaterHarvestingUnitname}</div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="capacity">Capacity (litres)</label>
                      <div className="input-group">
                        <input className={`form-control ${errors.capacityLitres ? 'is-invalid' : ''}`} id="capacity" name="capacityLitres" type="number" min="0.01" max="100000000" step="0.01" value={form.capacityLitres} onChange={updateField} placeholder="5000" />
                        <span className="input-group-text">L</span>
                        <div className="invalid-feedback">{errors.capacityLitres}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="installationDate">Installation date</label>
                      <input className={`form-control ${errors.installationDate ? 'is-invalid' : ''}`} id="installationDate" name="installationDate" type="date" max={new Date().toISOString().slice(0, 10)} value={form.installationDate} onChange={updateField} />
                      <div className="invalid-feedback">{errors.installationDate}</div>
                    </div>
                  </div>
                  <div className="form-check form-switch my-4">
                    <input className="form-check-input" id="active" name="active" type="checkbox" checked={form.active} onChange={updateField} />
                    <label className="form-check-label" htmlFor="active">This system is currently active</label>
                  </div>
                  <button className="btn btn-primary w-100 py-2" type="submit" disabled={isSaving}>
                    {isSaving ? <><span className="spinner-border spinner-border-sm me-2" />Saving unit...</> : <><i className="bi bi-plus-lg me-2" />Add harvesting unit</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="units-section" id="units">
          <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
              <div className="section-heading mb-0">
                <span className="eyebrow dark">Your infrastructure</span>
                <h2>Registered units</h2>
              </div>
              <div className="search-wrap"><i className="bi bi-search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by unit name..." aria-label="Search units" /></div>
            </div>
            {notice && <div className={`alert alert-${notice.type} d-flex align-items-center gap-2`} role="alert"><i className={`bi ${notice.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />{notice.message}<button className="btn-close ms-auto" onClick={() => setNotice(null)} aria-label="Dismiss" /></div>}
            {isLoading ? <LoadingState /> : filteredUnits.length === 0 ? <EmptyState hasSearch={Boolean(search)} /> : (
              <div className="row g-3">
                {filteredUnits.map((unit) => <UnitCard key={unit.rainwaterHarvestingUnitid} unit={unit} deletingId={deletingId} onDelete={deleteUnit} />)}
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="app-footer"><div className="container d-flex flex-column flex-md-row justify-content-between gap-2"><span><i className="bi bi-droplet-fill me-2" />RainHarvest Unit Manager</span><span>Building a more resilient tomorrow, one drop at a time.</span></div></footer>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return <div className="col-md-4"><div className="stat-card"><div className="stat-icon"><i className={`bi ${icon}`} /></div><div><strong>{value}</strong><span>{label}</span></div></div></div>;
}

function UnitCard({ unit, deletingId, onDelete }) {
  const id = unit.rainwaterHarvestingUnitid;
  return <article className="col-md-6 col-xl-4"><div className="unit-card h-100"><div className="d-flex justify-content-between align-items-start mb-3"><span className="unit-badge">UNIT #{id}</span><span className={`status-pill ${unit.active === false ? 'inactive' : ''}`}><span />{unit.active === false ? 'Inactive' : 'Active'}</span></div><h3>{unit.rainwaterHarvestingUnitname}</h3><div className="unit-details"><span><i className="bi bi-moisture" />{Number(unit.capacityLitres || 0).toLocaleString()} litres</span><span><i className="bi bi-calendar3" />{unit.installationDate || 'Date not provided'}</span></div><button className="btn btn-outline-danger btn-sm mt-4" onClick={() => onDelete(id)} disabled={deletingId === id}>{deletingId === id ? <><span className="spinner-border spinner-border-sm me-1" />Deleting</> : <><i className="bi bi-trash3 me-1" />Delete unit</>}</button></div></article>;
}

function LoadingState() {
  return <div className="empty-state"><div className="spinner-border text-primary mb-3" /><p>Loading your harvesting units...</p></div>;
}

function EmptyState({ hasSearch }) {
  return <div className="empty-state"><i className="bi bi-inboxes empty-icon" /><h3>{hasSearch ? 'No matching units' : 'No units registered yet'}</h3><p>{hasSearch ? 'Try another search term.' : 'Add your first harvesting unit above to get started.'}</p></div>;
}

export default App;
