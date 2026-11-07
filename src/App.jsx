import { useEffect, useMemo, useState } from 'react'
import './App.css'

const pages = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'kyc', label: 'KYC Details' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'address', label: 'Address' },
  { id: 'employment', label: 'Employment Details' },
  { id: 'income', label: 'Income Details' },
  { id: 'fatca', label: 'FATCA Details' },
  { id: 'documents', label: 'Documents Upload' },
]

const field = (name, label, type = 'text', options = {}) => ({
  name,
  label,
  type,
  ...options,
})

const selectOptions = {
  title: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'],
  gender: ['Female', 'Male', 'Other'],
  maritalStatus: ['Single', 'Married', 'Divorced', 'Widowed'],
  customerStatus: ['Active', 'Inactive', 'Dormant', 'Deceased'],
  customerType: ['Individual', 'Sole proprietor'],
  pepIndicator: ['No', 'Yes'],
  ckycStatus: ['Not Registered', 'Pending', 'Registered'],
  kycCompliant: ['No', 'Yes'],
  addressType: ['Residential', 'Permanent', 'Communication', 'Office'],
  country: ['India', 'United States', 'United Kingdom', 'Other'],
  employmentType: ['Salaried', 'Self-employed', 'Business', 'Retired', 'Student', 'Other'],
  salaryMode: ['Bank transfer', 'Cheque', 'Cash', 'Other'],
  usPerson: ['No', 'Yes'],
  taxResident: ['No', 'Yes'],
  yesNo: ['No', 'Yes'],
}

const formPages = {
  basic: [
    {
      title: 'Customer Information',
      fields: [
        field('cifNumber', 'CIF Number', 'text', { placeholder: 'System generated', readOnly: true }),
        field('customerType', 'Customer Type', 'select', { options: selectOptions.customerType, required: true }),
        field('title', 'Title', 'select', { options: selectOptions.title }),
        field('firstName', 'First Name', 'text', { required: true }),
        field('middleName', 'Middle Name'),
        field('lastName', 'Last Name', 'text', { required: true }),
        field('dateOfBirth', 'Date of Birth', 'date', { required: true, validate: 'dob' }),
        field('age', 'Age', 'text', { readOnly: true, derived: true }),
        field('gender', 'Gender', 'select', { options: selectOptions.gender, required: true }),
        field('maritalStatus', 'Marital Status', 'select', { options: selectOptions.maritalStatus }),
        field('nationality', 'Nationality', 'text', { required: true }),
        field('placeOfBirth', 'Place of Birth'),
        field('motherName', 'Mother’s Name'),
        field('fatherName', 'Father’s Name'),
        field('spouseName', 'Spouse Name'),
        field('customerStatus', 'Customer Status', 'select', { options: selectOptions.customerStatus, required: true }),
      ],
    },
    {
      title: 'Identity & Contact Details',
      fields: [
        field('pan', 'PAN', 'text', { required: true, validate: 'pan', placeholder: 'ABCDE1234F', maxLength: 10 }),
        field('aadhaar', 'Aadhaar Number', 'text', { required: true, validate: 'aadhaar', placeholder: '12 digit Aadhaar', maxLength: 12 }),
        field('passportNumber', 'Passport Number'),
        field('voterId', 'Voter ID'),
        field('drivingLicense', 'Driving Licence No.'),
        field('mobile', 'Mobile Number', 'tel', { required: true, validate: 'mobile', placeholder: '10 digit mobile number' }),
        field('alternateMobile', 'Alternate Mobile', 'tel', { validate: 'mobile' }),
        field('email', 'Email Address', 'email', { required: true, validate: 'email' }),
        field('preferredContact', 'Preferred Contact', 'select', { options: ['Mobile', 'Email', 'Post'] }),
        field('customerSince', 'Customer Since', 'date'),
      ],
    },
  ],
  kyc: [
    {
      title: 'KYC & Risk Information',
      fields: [
        field('kycName', 'KYC Name', 'text', { required: true }),
        field('customerOpenDate', 'Customer Open Date', 'date', { required: true, validate: 'notFuture' }),
        field('kycRating', 'KYC Rating', 'select', { options: ['Low', 'Medium', 'High'], required: true }),
        field('pepIndicator', 'PEP Indicator', 'select', { options: selectOptions.pepIndicator, required: true }),
        field('amlRating', 'AML Rating', 'select', { options: ['Low', 'Medium', 'High'], required: true }),
        field('ckycStatus', 'CKYC Status', 'select', { options: selectOptions.ckycStatus, required: true }),
        field('ckycNumber', 'CKYC No.', 'text', { validate: 'ckyc' }),
        field('kycDate', 'KYC Date', 'date', { required: true, validate: 'kycDate' }),
        field('nextKycReviewDate', 'Next KYC Review Date', 'date', { validate: 'nextKyc' }),
        field('riskProfileExpiryDate', 'Risk Profile Expiry Date', 'date', { validate: 'riskExpiry' }),
        field('kycCompliant', 'KYC Compliant Indicator', 'select', { options: selectOptions.kycCompliant, required: true }),
      ],
    },
  ],
  facilities: [
    {
      title: 'Customer Reference',
      fields: [
        field('kycName', 'KYC Name', 'text', { required: true }),
        field('customerOpenDate', 'Customer Open Date', 'date', { required: true, validate: 'notFuture' }),
      ],
    },
  ],
  address: [
    {
      title: 'Address Information',
      fields: [
        field('addressType', 'Address Type', 'select', { options: selectOptions.addressType, required: true }),
        field('addressLine1', 'Address Line 1', 'text', { required: true, wide: true }),
        field('addressLine2', 'Address Line 2', 'text', { wide: true }),
        field('addressLine3', 'Address Line 3', 'text', { wide: true }),
        field('country', 'Country', 'select', { options: selectOptions.country, required: true }),
        field('state', 'State / Province', 'text', { required: true }),
        field('district', 'District'),
        field('city', 'City / Town', 'text', { required: true }),
        field('pinCode', 'PIN Code', 'text', { required: true, validate: 'pin', maxLength: 6 }),
        field('addressMobile', 'Contact Mobile', 'tel', { validate: 'mobile' }),
        field('addressEmail', 'Contact Email', 'email', { validate: 'email' }),
        field('addressProofType', 'Address Proof Type', 'select', { options: ['Aadhaar', 'Passport', 'Utility bill', 'Driving licence', 'Other'] }),
        field('addressProofNumber', 'Address Proof Number'),
        field('addressProofDate', 'Proof Issue / Verification Date', 'date', { validate: 'notFuture' }),
      ],
    },
  ],
  employment: [
    {
      title: 'Employment Information',
      fields: [
        field('employmentType', 'Employment Type', 'select', { options: selectOptions.employmentType, required: true }),
        field('occupation', 'Occupation', 'text', { required: true }),
        field('employerName', 'Employer / Business Name', 'text', { required: true }),
        field('designation', 'Designation'),
        field('department', 'Department'),
        field('experienceYears', 'Total Experience (Years)', 'number', { min: 0, step: 0.1 }),
        field('joiningDate', 'Joining Date', 'date', { validate: 'notFuture' }),
        field('officePhone', 'Office Phone', 'tel', { validate: 'mobile' }),
        field('officeEmail', 'Office Email', 'email', { validate: 'email' }),
        field('officeAddress', 'Office Address', 'text', { wide: true }),
        field('officeCity', 'Office City'),
        field('officePin', 'Office PIN Code', 'text', { validate: 'pin', maxLength: 6 }),
      ],
    },
  ],
  income: [
    {
      title: 'Income & Banking Information',
      fields: [
        field('incomeType', 'Income Type', 'select', { options: ['Salary', 'Business', 'Professional', 'Investment', 'Pension', 'Other'], required: true }),
        field('monthlyIncome', 'Monthly Income', 'number', { required: true, min: 0, step: '0.01', validate: 'amount' }),
        field('annualIncome', 'Annual Income', 'number', { required: true, min: 0, step: '0.01', validate: 'amount' }),
        field('otherIncome', 'Other Income (Monthly)', 'number', { min: 0, step: '0.01', validate: 'amount' }),
        field('salaryMode', 'Salary Mode', 'select', { options: selectOptions.salaryMode }),
        field('incomeSource', 'Income Source', 'text', { required: true }),
        field('bankName', 'Bank Name'),
        field('bankAccountNumber', 'Bank Account Number'),
        field('ifsc', 'IFSC Code', 'text', { validate: 'ifsc', maxLength: 11, placeholder: 'ABCD0123456' }),
        field('incomeProofType', 'Income Proof Type', 'select', { options: ['Salary slip', 'Bank statement', 'IT return', 'Form 16', 'Other'] }),
        field('incomeProofReference', 'Income Proof Reference'),
      ],
    },
  ],
  fatca: [
    {
      title: 'FATCA / CRS Information',
      fields: [
        field('taxResident', 'Tax Resident Outside India', 'select', { options: selectOptions.taxResident, required: true }),
        field('taxCountries', 'Country / Countries of Tax Residency', 'text', { wide: true }),
        field('countryOfBirth', 'Country of Birth', 'select', { options: selectOptions.country, required: true }),
        field('fatcaNationality', 'Nationality', 'text', { required: true }),
        field('tin', 'Tax Identification Number (TIN)'),
        field('tinUnavailableReason', 'TIN Unavailable Reason'),
        field('usPerson', 'US Person Indicator', 'select', { options: selectOptions.usPerson, required: true }),
        field('usTin', 'US TIN'),
        field('fatcaDeclarationDate', 'FATCA Declaration Date', 'date', { required: true, validate: 'notFuture' }),
        field('fatcaReviewDate', 'Last Review Date', 'date', { validate: 'notFuture' }),
        field('fatcaUsBirth', 'Born in the United States', 'select', { options: selectOptions.yesNo }),
        field('fatcaUsAddress', 'US Address / Telephone Indicator', 'select', { options: selectOptions.yesNo }),
        field('fatcaConsent', 'Declaration & Consent Confirmed', 'select', { options: selectOptions.yesNo, required: true }),
      ],
    },
  ],
}

const initialFacilities = [
  { name: 'SMS', enabled: false },
  { name: 'Mobile Application', enabled: false },
  { name: 'Cheque Book', enabled: false },
  { name: 'Internet Banking', enabled: false },
  { name: 'ATM', enabled: false },
  { name: 'IMPS', enabled: false },
]

const documents = [
  { id: 'panDocument', label: 'PAN' },
  { id: 'aadhaarDocument', label: 'Aadhaar' },
  { id: 'passportDocument', label: 'Passport' },
  { id: 'photograph', label: 'Photograph', accept: 'image/*' },
  { id: 'signature', label: 'Signature', accept: 'image/*' },
  { id: 'addressProof', label: 'Address Proof' },
  { id: 'identityProof', label: 'Identity Proof' },
  { id: 'incomeProof', label: 'Income Proof' },
  { id: 'otherDocuments', label: 'Other Supporting Documents', multiple: true },
]

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return ''
  const dob = new Date(`${dateOfBirth}T00:00:00`)
  if (Number.isNaN(dob.getTime())) return ''
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) age -= 1
  return age >= 0 ? String(age) : ''
}

function validateValue(name, value, fieldConfig, values) {
  if (fieldConfig.required && !String(value ?? '').trim()) return `${fieldConfig.label} is required.`
  if (!String(value ?? '').trim()) return ''

  const text = String(value).trim()
  switch (fieldConfig.validate) {
    case 'pan':
      return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(text.toUpperCase()) ? '' : 'Enter a valid PAN (e.g. ABCDE1234F).'
    case 'aadhaar':
      return /^\d{12}$/.test(text) ? '' : 'Aadhaar must contain exactly 12 digits.'
    case 'mobile':
      return /^\+?[0-9]{10,13}$/.test(text.replace(/[\s()-]/g, '')) ? '' : 'Enter a valid mobile number (10 to 13 digits).'
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? '' : 'Enter a valid email address.'
    case 'pin':
      return /^\d{6}$/.test(text) ? '' : 'PIN code must contain exactly 6 digits.'
    case 'ifsc':
      return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(text.toUpperCase()) ? '' : 'Enter a valid 11-character IFSC code.'
    case 'ckyc':
      return /^[0-9]{14}$/.test(text) ? '' : 'CKYC number must contain 14 digits.'
    case 'amount':
      return Number(text) >= 0 ? '' : `${fieldConfig.label} cannot be negative.`
    case 'dob':
      return new Date(`${text}T00:00:00`) <= new Date(new Date().toDateString()) ? '' : 'Date of Birth cannot be in the future.'
    case 'notFuture':
      return new Date(`${text}T00:00:00`) <= new Date(new Date().toDateString()) ? '' : `${fieldConfig.label} cannot be in the future.`
    case 'kycDate':
      if (new Date(`${text}T00:00:00`) > new Date(new Date().toDateString())) return 'KYC Date cannot be in the future.'
      if (values.customerOpenDate && text < values.customerOpenDate) return 'KYC Date cannot be before Customer Open Date.'
      return ''
    case 'nextKyc':
      return values.kycDate && text < values.kycDate ? 'Next review date cannot be before KYC Date.' : ''
    case 'riskExpiry':
      return values.kycDate && text < values.kycDate ? 'Risk Profile Expiry Date cannot be before KYC Date.' : ''
    default:
      return ''
  }
}

function FormField({ config, value, error, onChange, onBlur }) {
  const id = `field-${config.name}`
  const common = {
    id,
    name: config.name,
    value: value ?? '',
    onChange: (event) => onChange(config.name, event.target.value),
    onBlur: () => onBlur(config.name, config),
    readOnly: config.readOnly,
    required: config.required,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
  }

  return (
    <div className={`field ${config.wide ? 'field-wide' : ''}`}>
      <label htmlFor={id}>{config.label}{config.required && <span className="required-mark"> *</span>}</label>
      {config.type === 'select' ? (
        <select {...common}>
          <option value="">Select</option>
          {config.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input
          {...common}
          type={config.type}
          placeholder={config.placeholder}
          min={config.min}
          max={config.max}
          step={config.step}
          maxLength={config.maxLength}
        />
      )}
      {error && <span className="field-error" id={`${id}-error`} role="alert">{error}</span>}
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState(0)
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [facilities, setFacilities] = useState(initialFacilities)
  const [editingFacility, setEditingFacility] = useState(null)
  const [facilityDraft, setFacilityDraft] = useState(false)
  const [viewFacility, setViewFacility] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [previewFile, setPreviewFile] = useState(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [readyForReview, setReadyForReview] = useState(false)

  const active = pages[activePage]
  const age = useMemo(() => calculateAge(values.dateOfBirth), [values.dateOfBirth])
  const previewUrl = useMemo(() => previewFile ? URL.createObjectURL(previewFile) : '', [previewFile])

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const updateValue = (name, value) => {
    setReadyForReview(false)
    const nextValues = { ...values, [name]: name === 'pan' || name === 'ifsc' ? value.toUpperCase() : value }
    setValues(nextValues)
    if (touched[name] || submitAttempted) {
      const currentField = Object.values(formPages).flat(2).find((item) => item.name === name)
      if (currentField) setErrors((previous) => ({ ...previous, [name]: validateValue(name, value, currentField, nextValues) }))
    }
    if (name === 'customerOpenDate' || name === 'kycDate') {
      const dependentNames = ['kycDate', 'nextKycReviewDate', 'riskProfileExpiryDate']
      setErrors((previous) => {
        const nextErrors = { ...previous }
        dependentNames.forEach((fieldName) => {
          const fieldConfig = Object.values(formPages).flat(2).find((item) => item.name === fieldName)
          if (fieldConfig && nextValues[fieldName]) nextErrors[fieldName] = validateValue(fieldName, nextValues[fieldName], fieldConfig, nextValues)
        })
        return nextErrors
      })
    }
  }

  const validateField = (name, config, formValues = values) => {
    const message = validateValue(name, formValues[name], config, formValues)
    setErrors((previous) => ({ ...previous, [name]: message }))
    setTouched((previous) => ({ ...previous, [name]: true }))
    return !message
  }

  const validatePage = (pageId) => {
    let valid = true
    ;(formPages[pageId] ?? []).forEach((section) => section.fields.forEach((config) => {
      if (!validateField(config.name, config)) valid = false
    }))
    return valid
  }

  const validateAll = () => {
    let firstInvalidPage = -1
    let valid = true
    Object.entries(formPages).forEach(([pageId, sections]) => {
      let pageValid = true
      sections.forEach((section) => section.fields.forEach((config) => {
        if (!validateField(config.name, config)) {
          valid = false
          pageValid = false
        }
      }))
      if (!pageValid && firstInvalidPage === -1) firstInvalidPage = pages.findIndex((page) => page.id === pageId)
    })
    return { valid, firstInvalidPage }
  }

  const goToPage = (index) => {
    if (index >= 0 && index < pages.length) setActivePage(index)
  }

  const moveNext = () => {
    if (validatePage(active.id) && activePage < pages.length - 1) goToPage(activePage + 1)
  }

  const handleOk = () => {
    if (activePage < pages.length - 1) {
      if (validatePage(active.id)) goToPage(activePage + 1)
      return
    }
    setSubmitAttempted(true)
    const result = validateAll()
    setReadyForReview(result.valid)
    if (!result.valid) {
      setActivePage(result.firstInvalidPage)
      setTimeout(() => document.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitAttempted(true)
    const result = validateAll()
    if (result.valid) {
      setReadyForReview(true)
    } else {
      setReadyForReview(false)
      setActivePage(result.firstInvalidPage)
      document.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleCancel = () => {
    if (!window.confirm('Cancel this customer entry and clear all entered information?')) return
    setValues({})
    setErrors({})
    setTouched({})
    setFacilities(initialFacilities)
    setUploadedFiles({})
    setActivePage(0)
    setSubmitAttempted(false)
    setReadyForReview(false)
  }

  const onFileChange = (id, event) => {
    const selected = Array.from(event.target.files ?? [])
    if (selected.length) setUploadedFiles((previous) => ({
      ...previous,
      [id]: documents.find((document) => document.id === id)?.multiple ? selected : selected[0],
    }))
    event.target.value = ''
  }

  const fileList = (file) => Array.isArray(file) ? file : file ? [file] : []

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="bank-nameplate">
          <div className="bank-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" focusable="false">
              <path d="M3 11 16 4l13 7v2H3zm3 3h3v10H6zm6 0h3v10h-3zm6 0h3v10h-3zm6 0h3v10h-3zM4 26h24v3H4z" />
            </svg>
          </div>
          <span className="bank-name">Name of the Bank</span>
        </div>
        <div className="header-details">
          <div className="header-detail"><span>Operation Date</span><strong>{new Intl.DateTimeFormat('en-GB').format(new Date())}</strong></div>
          <div className="header-detail"><span>Branch</span><strong>—</strong></div>
          <div className="header-detail"><span>User</span><strong>—</strong></div>
        </div>
        <div className="system-date"><span>System Date</span><strong>{new Intl.DateTimeFormat('en-GB').format(new Date())}</strong></div>
      </header>

      <section className="page-heading">
        <div className="product-name">Nexora</div>
        <h1>Individual Customer Master</h1>
      </section>

      <nav className="tab-bar" aria-label="Customer information pages">
        {pages.map((page, index) => (
          <button
            type="button"
            className={`tab-button ${index === activePage ? 'active' : ''} ${index < activePage ? 'visited' : ''}`}
            key={page.id}
            onClick={() => goToPage(index)}
            aria-current={index === activePage ? 'page' : undefined}
          >
            <span className="tab-index">{String(index + 1).padStart(2, '0')}</span>
            <span>{page.label}</span>
          </button>
        ))}
      </nav>

      <form className="customer-form" onSubmit={handleSubmit} noValidate>
        <div className="form-toolbar">
          <div>
            <span className="page-step">STEP {String(activePage + 1).padStart(2, '0')} OF 08</span>
            <h2>{active.label}</h2>
          </div>
          <span className="form-note"><span className="required-mark">*</span> Required fields</span>
        </div>

        <div className="form-content">
          {formPages[active.id]?.map((section) => (
            <section className="form-section" key={section.title}>
              <h3>{section.title}</h3>
              <div className="field-grid">
                {section.fields.map((config) => (
                  <FormField
                    key={config.name}
                    config={config}
                    value={config.derived ? age : values[config.name]}
                    error={errors[config.name]}
                    onChange={updateValue}
                    onBlur={validateField}
                  />
                ))}
              </div>
            </section>
          ))}

          {active.id === 'facilities' && (
            <>
              <section className="form-section">
                <div className="section-heading-row"><h3>Customer Facilities</h3><span className="table-caption">{facilities.length} facilities</span></div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Facility</th><th>Availability</th><th>Status</th><th className="actions-heading">Actions</th></tr></thead>
                    <tbody>
                      {facilities.map((facility, index) => (
                        <tr key={facility.name}>
                          <td className="facility-name">{facility.name}</td>
                          <td>{editingFacility === index ? (
                            <select className="table-select" aria-label={`${facility.name} availability`} value={facilityDraft ? 'Enabled' : 'Disabled'} onChange={(event) => setFacilityDraft(event.target.value === 'Enabled')}>
                              <option>Enabled</option><option>Disabled</option>
                            </select>
                          ) : <span className={`status-pill ${facility.enabled ? 'status-enabled' : 'status-disabled'}`}>{facility.enabled ? 'Enabled' : 'Disabled'}</span>}</td>
                          <td>{facility.enabled ? 'Active' : 'Not subscribed'}</td>
                          <td className="row-actions">
                            {editingFacility === index ? (
                              <><button type="button" className="text-action" onClick={() => { setFacilities((previous) => previous.map((item, rowIndex) => rowIndex === index ? { ...item, enabled: facilityDraft } : item)); setEditingFacility(null) }}>Save</button><button type="button" className="text-action muted-action" onClick={() => setEditingFacility(null)}>Cancel</button></>
                            ) : (
                              <><button type="button" className="text-action" onClick={() => setViewFacility(facility)}>View</button><button type="button" className="text-action" onClick={() => { setFacilityDraft(facility.enabled); setEditingFacility(index) }}>Edit</button><button type="button" className="text-action delete-action" onClick={() => { setFacilities((previous) => previous.filter((_, rowIndex) => rowIndex !== index)); setEditingFacility(null) }}>Delete</button></>
                            )}
                          </td>
                        </tr>
                      ))}
                      {facilities.length === 0 && <tr><td className="empty-row" colSpan="4">No facilities are listed.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {active.id === 'documents' && (
            <section className="form-section documents-section">
              <h3>Customer Documents</h3>
              <p className="section-help">Select a file to upload. You can preview, replace, or remove an uploaded document.</p>
              <div className="document-list">
                {documents.map((document) => {
                  const uploaded = uploadedFiles[document.id]
                  const files = fileList(uploaded)
                  return (
                    <div className="document-row" key={document.id}>
                      <div className="document-label"><span className="document-icon" aria-hidden="true">▤</span><div><strong>{document.label}</strong><small>{files.length ? files.map((item) => item.name).join(', ') : 'No file selected'}</small></div></div>
                      <div className="document-actions">
                        {files.length > 0 && <button type="button" className="text-action" onClick={() => setPreviewFile(files[0])}>Preview</button>}
                        {files.length > 0 && <button type="button" className="text-action delete-action" onClick={() => setUploadedFiles((previous) => { const next = { ...previous }; delete next[document.id]; return next })}>Remove</button>}
                        <input id={`upload-${document.id}`} className="file-input" type="file" accept={document.accept} multiple={document.multiple} onChange={(event) => onFileChange(document.id, event)} />
                        <label className="upload-button" htmlFor={`upload-${document.id}`}>{files.length ? 'Replace' : 'Upload'}</label>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="upload-note">Files are kept in this browser session only and are not uploaded to a server.</p>
            </section>
          )}
        </div>

        <footer className="form-footer">
          <div className="footer-left">
            {readyForReview ? <span className="review-message" role="status">Validation complete. Ready for review; no data was submitted.</span> : <span className="draft-indicator"><span /> Entry in progress</span>}
          </div>
          <div className="footer-actions">
            <button type="button" className="button button-outline" onClick={handleCancel}>Cancel</button>
            <button type="button" className="button button-secondary" onClick={() => activePage > 0 && goToPage(activePage - 1)} disabled={activePage === 0}>Previous</button>
            <button type="button" className="button button-secondary" onClick={handleOk}>OK</button>
            {activePage < pages.length - 1 ? (
              <button type="button" className="button button-primary" onClick={moveNext}>Next <span aria-hidden="true">›</span></button>
            ) : (
              <button type="submit" className="button button-primary">Submit</button>
            )}
          </div>
        </footer>
      </form>

      {viewFacility && (
        <div className="modal-backdrop" role="presentation" onClick={() => setViewFacility(null)}>
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="facility-dialog-title" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-heading"><h2 id="facility-dialog-title">Facility Details</h2><button type="button" className="dialog-close" aria-label="Close" onClick={() => setViewFacility(null)}>×</button></div>
            <dl className="detail-list"><div><dt>Facility</dt><dd>{viewFacility.name}</dd></div><div><dt>Availability</dt><dd>{viewFacility.enabled ? 'Enabled' : 'Disabled'}</dd></div><div><dt>Status</dt><dd>{viewFacility.enabled ? 'Active' : 'Not subscribed'}</dd></div></dl>
            <div className="dialog-actions"><button type="button" className="button button-primary" onClick={() => setViewFacility(null)}>Close</button></div>
          </section>
        </div>
      )}

      {previewFile && (
        <div className="modal-backdrop" role="presentation" onClick={() => setPreviewFile(null)}>
          <section className="dialog preview-dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-heading"><div><h2 id="preview-title">Document Preview</h2><p>{previewFile.name}</p></div><button type="button" className="dialog-close" aria-label="Close preview" onClick={() => setPreviewFile(null)}>×</button></div>
            {previewFile.type.startsWith('image/') ? <img className="image-preview" src={previewUrl} alt={`Preview of ${previewFile.name}`} /> : previewFile.type === 'application/pdf' ? <iframe className="pdf-preview" src={previewUrl} title={`Preview of ${previewFile.name}`} /> : <p className="preview-unavailable">Preview is not available for this file type. <a href={previewUrl} target="_blank" rel="noreferrer">Open document</a></p>}
          </section>
        </div>
      )}
    </main>
  )
}

export default App
