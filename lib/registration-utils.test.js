const test = require('node:test')
const assert = require('node:assert/strict')

const { hasDuplicateEmail, normalizeRegistrationEmail } = require('./registration-utils')

test('normalizes emails for duplicate detection', () => {
  assert.equal(normalizeRegistrationEmail('  Jane@example.com  '), 'jane@example.com')
})

test('detects duplicate emails case-insensitively', () => {
  const registrations = [
    { email: 'Jane@example.com' },
    { email: 'other@example.com' },
  ]

  assert.equal(hasDuplicateEmail(registrations, 'jane@example.com'), true)
  assert.equal(hasDuplicateEmail(registrations, 'new@example.com'), false)
})

test('only counts duplicates in the same formation', () => {
  const registrations = [
    { email: 'jane@example.com', formation_id: 'formation-2' },
  ]

  assert.equal(
    hasDuplicateEmail(registrations, 'jane@example.com', 'formation-1', 'formation_id'),
    false,
  )
})
