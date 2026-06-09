const dns = require('dns').promises;

/**
 * Validates an email address.
 * - Basic regex syntax verification.
 * - Blacklist check for common test/temporary/disposable domains.
 * - Custom rules for major providers (Gmail, Yahoo, Outlook/Hotmail).
 * - Live MX (Mail Exchange) record DNS lookup.
 * 
 * @param {string} email The email address to validate.
 * @returns {Promise<{valid: boolean, reason?: string}>}
 */
async function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, reason: 'Email must be a non-empty string.' };
  }

  const trimmedEmail = email.trim();

  // 1. Basic Syntax Check (RFC 5322)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, reason: 'Please enter a valid email address format.' };
  }

  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Email must contain exactly one @ symbol.' };
  }

  const [localPart, domain] = parts;
  const lowerDomain = domain.toLowerCase();
  const lowerLocalPart = localPart.toLowerCase();

  // 2. Block Common Disposable / Test Domains
  const blockedDomains = [
    'test.com', 'example.com', 'example.org', 'example.net',
    'mailinator.com', 'yopmail.com', 'dispostable.com',
    'tempmail.com', '10minutemail.com', 'trashmail.com',
    'guerrillamail.com', 'sharklasers.com', 'maildrop.cc',
    'getairmail.com', 'temp-mail.org', 'fakeinbox.com'
  ];
  if (blockedDomains.includes(lowerDomain)) {
    return { valid: false, reason: `Emails from domain '${domain}' are not allowed.` };
  }

  // 3. Block Common Fake / Test Local Parts
  const blockedLocalParts = [
    'test', 'dummy', 'admin', 'administrator', 'user', '123',
    '12345', '123456', 'abc', 'xyz', 'info', 'support', 'mail',
    'email', 'temp', 'fake', 'guest', 'testing'
  ];
  if (blockedLocalParts.includes(lowerLocalPart)) {
    return { valid: false, reason: `The email prefix '${localPart}' is invalid or reserved.` };
  }

  // 4. Strict Validation for Major Providers
  if (lowerDomain === 'gmail.com') {
    // Gmail requirements: 6 to 30 chars, only letters/digits/periods, must have letters
    if (localPart.length < 6 || localPart.length > 30) {
      return { valid: false, reason: 'Gmail address must be between 6 and 30 characters.' };
    }
    if (!/[a-zA-Z]/.test(localPart)) {
      return { valid: false, reason: 'Gmail address must contain at least one letter.' };
    }
    if (!/^[a-zA-Z0-9.]+$/.test(localPart)) {
      return { valid: false, reason: 'Gmail address can only contain letters, numbers, and periods.' };
    }
  } else if (lowerDomain === 'yahoo.com' || lowerDomain === 'yahoo.co.in') {
    // Yahoo requirements: 4 to 32 chars, must start with a letter, only letters/digits/underscores/periods
    if (localPart.length < 4 || localPart.length > 32) {
      return { valid: false, reason: 'Yahoo address must be between 4 and 32 characters.' };
    }
    if (!/^[a-zA-Z]/.test(localPart)) {
      return { valid: false, reason: 'Yahoo address must start with a letter.' };
    }
    if (!/^[a-zA-Z0-9._]+$/.test(localPart)) {
      return { valid: false, reason: 'Yahoo address can only contain letters, numbers, underscores, and periods.' };
    }
  } else if (['outlook.com', 'hotmail.com', 'live.com'].includes(lowerDomain)) {
    // Outlook requirements: 3 to 64 chars, must start with a letter, only letters/digits/periods/underscores/hyphens
    if (localPart.length < 3 || localPart.length > 64) {
      return { valid: false, reason: 'Outlook/Hotmail address must be between 3 and 64 characters.' };
    }
    if (!/^[a-zA-Z]/.test(localPart)) {
      return { valid: false, reason: 'Outlook/Hotmail address must start with a letter.' };
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(localPart)) {
      return { valid: false, reason: 'Outlook/Hotmail address can only contain letters, numbers, periods, underscores, and hyphens.' };
    }
  }

  // 5. MX Record Lookup Check
  try {
    const mxRecords = await dns.resolveMx(lowerDomain);
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, reason: `The domain '${domain}' is not configured to receive emails.` };
    }
  } catch (err) {
    return { valid: false, reason: `The domain '${domain}' does not exist or has no mail servers.` };
  }

  return { valid: true };
}

module.exports = { validateEmail };
