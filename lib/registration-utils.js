function normalizeRegistrationEmail(email) {
  return (email || '').trim().toLowerCase()
}

function hasDuplicateEmail(registrations, email) {
  const normalizedEmail = normalizeRegistrationEmail(email)

  return registrations.some((registration) => {
    return normalizeRegistrationEmail(registration?.email) === normalizedEmail
  })
}

module.exports = {
  normalizeRegistrationEmail,
  hasDuplicateEmail,
}
