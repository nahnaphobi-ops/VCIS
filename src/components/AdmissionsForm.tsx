import { useMemo, useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { school } from '../lib/school'
import { useSchool } from '../lib/useSchool'
import { submitAdmissionsApplication } from '../lib/edutrack'
import { fadeUp, viewportOnce } from '../lib/motion'

const PROGRAMMES = ['Early Years', 'Primary', 'Junior High'] as const

const FALLBACK_REQUIREMENTS = [
  {
    id: 'fallback-birth',
    title: 'Birth certificate',
    description: 'Original or certified copy of the child’s birth certificate.',
    requirement_type: 'document',
    is_required: true,
  },
  {
    id: 'fallback-photo',
    title: 'Passport-size photographs',
    description: 'Two recent passport-size photographs of the child.',
    requirement_type: 'document',
    is_required: true,
  },
  {
    id: 'fallback-id',
    title: 'Parent / guardian ID',
    description: 'Valid national ID, passport, or voter ID of the enrolling parent/guardian.',
    requirement_type: 'document',
    is_required: true,
  },
  {
    id: 'fallback-fees',
    title: 'Admission / enrolment fees',
    description: 'Fees due at enrolment are confirmed after placement. Contact the school for the current schedule.',
    requirement_type: 'fee',
    is_required: true,
  },
]

export function AdmissionsForm() {
  const reduceMotion = useReducedMotion()
  const { live } = useSchool()
  const [childName, setChildName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [programme, setProgramme] = useState('')
  const [classLevel, setClassLevel] = useState('')
  const [guardianName, setGuardianName] = useState('')
  const [guardianPhone, setGuardianPhone] = useState('')
  const [guardianEmail, setGuardianEmail] = useState('')
  const [relationship, setRelationship] = useState('parent')
  const [previousSchool, setPreviousSchool] = useState('')
  const [message, setMessage] = useState('')
  const [howHeard, setHowHeard] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const requirements = useMemo(() => {
    if (live?.enrollment_requirements && live.enrollment_requirements.length > 0) {
      return live.enrollment_requirements
    }
    return FALLBACK_REQUIREMENTS
  }, [live])

  const classLevels = live?.class_levels || []
  const dueFees = (live?.fee_categories || []).filter((c) => c.due_at_enrollment)

  async function onDownloadPdf() {
    setError('')
    setDownloadingPdf(true)
    try {
      const { downloadAdmissionsFormPdf } = await import('../lib/admissionsPdf')
      downloadAdmissionsFormPdf({
        requirements,
        fees: dueFees,
        fields: {
          childName,
          dateOfBirth,
          gender,
          programme,
          classLevel,
          guardianName,
          guardianPhone,
          guardianEmail,
          relationship,
          previousSchool,
          howHeard,
          message,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not download PDF form')
    } finally {
      setDownloadingPdf(false)
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!childName.trim() || !guardianName.trim() || !guardianPhone.trim()) {
      setError('Please fill in the child’s name, guardian name, and phone number.')
      return
    }
    if (!acknowledged) {
      setError('Please confirm you have reviewed the enrolment requirements.')
      return
    }

    setSubmitting(true)
    try {
      const result = await submitAdmissionsApplication({
        child_full_name: childName.trim(),
        date_of_birth: dateOfBirth || undefined,
        gender: gender || undefined,
        desired_programme: programme || undefined,
        desired_class_level: classLevel || undefined,
        guardian_full_name: guardianName.trim(),
        guardian_phone: guardianPhone.trim(),
        guardian_email: guardianEmail.trim() || undefined,
        relationship,
        previous_school: previousSchool.trim() || undefined,
        message: message.trim() || undefined,
        how_heard: howHeard.trim() || undefined,
        acknowledged_requirements: true,
        company: honeypot,
      })
      setSuccess(result.message || 'Application received. Our admissions team will contact you shortly.')
      setChildName('')
      setDateOfBirth('')
      setGender('')
      setProgramme('')
      setClassLevel('')
      setGuardianName('')
      setGuardianPhone('')
      setGuardianEmail('')
      setPreviousSchool('')
      setMessage('')
      setHowHeard('')
      setAcknowledged(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit application')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="apply" className="section-pad bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="kicker">Apply Online</p>
          <h2 className="heading-display text-[var(--navy)]">Start your child’s application.</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Submit this form and it lands directly in the Victoria Crest EduTrack admissions dashboard for review.
            Official phone: {school.phoneDisplay}.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Prefer paper? Download a PDF of this form — any details you have already typed will be included.
          </p>
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={downloadingPdf}
            className="btn btn-outline mt-4"
          >
            {downloadingPdf ? 'Preparing PDF…' : 'Download PDF form'}
          </button>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-extrabold text-[var(--navy)]">Enrolment requirements</h3>
            <ul className="space-y-3">
              {requirements.map((req) => (
                <li key={req.id} className="rounded-[12px] bg-[var(--cream)] p-4">
                  <p className="font-bold text-[var(--navy)]">
                    {req.title}
                    {req.is_required ? (
                      <span className="ml-2 text-xs font-bold tracking-wide text-[var(--orange)] uppercase">
                        Required
                      </span>
                    ) : null}
                  </p>
                  {req.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{req.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>

            {dueFees.length > 0 ? (
              <div className="rounded-[12px] border border-[var(--cream-muted)] p-4">
                <p className="text-xs font-bold tracking-[0.16em] text-[var(--orange)] uppercase">
                  Fees due at enrolment
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--navy)]">
                  {dueFees.map((fee) => (
                    <li key={fee.id} className="flex justify-between gap-3">
                      <span>{fee.name}</span>
                      <span className="font-bold text-[var(--orange)]">
                        GHS {Number(fee.default_amount).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          className="rounded-[1.25rem] bg-[var(--navy)] px-5 py-8 text-white sm:px-8"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--orange-bright)]">
            Admissions form
          </p>
          <h3 className="mt-2 text-2xl font-extrabold">Child & guardian details</h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold tracking-[0.14em] uppercase sm:col-span-2">
              Child’s full name *
              <input
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="input-field mt-2"
                placeholder="As on birth certificate"
              />
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase">
              Date of birth
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="input-field mt-2"
              />
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase">
              Gender
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input-field mt-2"
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase">
              Programme
              <select
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                className="input-field mt-2"
              >
                <option value="">Select</option>
                {PROGRAMMES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase">
              Preferred class level
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="input-field mt-2"
              >
                <option value="">Select</option>
                {classLevels.length > 0
                  ? classLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))
                  : ['KG1', 'KG2', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'JHS1', 'JHS2', 'JHS3'].map(
                      (level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ),
                    )}
              </select>
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase sm:col-span-2">
              Guardian full name *
              <input
                required
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="input-field mt-2"
              />
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase">
              Guardian phone *
              <input
                required
                type="tel"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className="input-field mt-2"
                placeholder="05X XXX XXXX"
              />
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase">
              Guardian email
              <input
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                className="input-field mt-2"
              />
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase">
              Relationship
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="input-field mt-2"
              >
                <option value="parent">Parent</option>
                <option value="guardian">Guardian</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase">
              How did you hear about us?
              <input
                value={howHeard}
                onChange={(e) => setHowHeard(e.target.value)}
                className="input-field mt-2"
                placeholder="Facebook, friend, visit…"
              />
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase sm:col-span-2">
              Previous school
              <input
                value={previousSchool}
                onChange={(e) => setPreviousSchool(e.target.value)}
                className="input-field mt-2"
                placeholder="If transferring"
              />
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase sm:col-span-2">
              Message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="input-field mt-2 resize-y"
                placeholder="Anything we should know about placement or timing…"
              />
            </label>
          </div>

          {/* Honeypot */}
          <label className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
            Company
            <input value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </label>

          <label className="mt-5 flex items-start gap-3 text-sm text-white/85">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1"
            />
            <span>
              I have reviewed the enrolment requirements and understand the school will contact me to
              confirm documents, fees, and placement.
            </span>
          </label>

          {error ? <p className="mt-4 text-sm font-semibold text-red-200">{error}</p> : null}
          {success ? <p className="mt-4 text-sm font-semibold text-[var(--teal-bright)]">{success}</p> : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
            <button
              type="button"
              onClick={onDownloadPdf}
              className="btn btn-white w-full sm:w-auto"
              disabled={downloadingPdf}
            >
              {downloadingPdf ? 'Preparing PDF…' : 'Download PDF'}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
