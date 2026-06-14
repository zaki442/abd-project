/**
 * @param {string | null | undefined} email
 * @returns {string}
 */
function normalizeRegistrationEmail(email) {
  return (email || '').trim().toLowerCase()
}

/**
 * @param {Array<{ email?: string, formation_id?: string, job_id?: string }>} registrations
 * @param {string | null | undefined} email
 * @param {string | null | undefined} entityId
 * @param {string} [entityField='formation_id']
 * @returns {boolean}
 */
function hasDuplicateEmail(registrations, email, entityId = null, entityField = 'formation_id') {
  const normalizedEmail = normalizeRegistrationEmail(email)

  return registrations.some((registration) => {
    const matchesEmail = normalizeRegistrationEmail(registration?.email) === normalizedEmail
    const matchesEntity = !entityId || registration?.[entityField] === entityId

    return matchesEmail && matchesEntity
  })
}

module.exports = {
  normalizeRegistrationEmail,
  hasDuplicateEmail,
}
