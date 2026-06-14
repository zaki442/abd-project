function normalizeRegistrationEmail(email) {
  return (email || '').trim().toLowerCase()
}

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
