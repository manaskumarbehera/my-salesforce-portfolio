/**
 * Email Configuration Module
 *
 * Supports two modes:
 * - Mode A (smtp): Real mailbox SMTP - sends from custom domain
 * - Mode B (forward_only): Forward-only fallback - uses personal email as From
 *
 * @module src/config/email
 */

const nodemailer = require('nodemailer');

/**
 * Get email configuration from environment variables
 * @returns {Object} Normalized email configuration
 * @throws {Error} If required environment variables are missing
 */
function getEmailConfig() {
    const mode = (process.env.EMAIL_MODE || 'smtp').toLowerCase();

    // Validate mode
    if (!['smtp', 'forward_only'].includes(mode)) {
        throw new Error(`Invalid EMAIL_MODE: ${mode}. Must be 'smtp' or 'forward_only'`);
    }

    // Required variables for all modes
    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT || '587', 10);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const to = process.env.EMAIL_TO;

    // Validate required variables
    const missing = [];
    if (!host) missing.push('EMAIL_HOST');
    if (!user) missing.push('EMAIL_USER');
    if (!pass) missing.push('EMAIL_PASS');
    if (!to) missing.push('EMAIL_TO');

    if (missing.length > 0) {
        throw new Error(`Missing required email config: ${missing.join(', ')}`);
    }

    // Optional variables with defaults
    const fromName = process.env.EMAIL_FROM_NAME || 'Manas';
    const replyToDomain = process.env.EMAIL_REPLY_TO_DOMAIN || 'web@manaskumarbehera.com';

    // EMAIL_FROM logic based on mode
    let from;
    if (mode === 'smtp') {
        from = process.env.EMAIL_FROM || replyToDomain;
    } else {
        from = process.env.EMAIL_FROM || user;
    }

    // Auto-determine secure based on port (true for 465, false for others)
    const secure = process.env.EMAIL_SECURE
        ? process.env.EMAIL_SECURE === 'true'
        : port === 465;

    return {
        mode,
        host,
        port,
        user,
        pass,
        to,
        from,
        fromName,
        replyToDomain,
        secure,
        // Formatted from address
        fromAddress: `"${fromName}" <${from}>`,
        // Full config object for nodemailer
        smtp: {
            host,
            port,
            secure,
            auth: {
                user,
                pass
            },
            // Connection timeouts
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 30000,
            // TLS options
            tls: {
                rejectUnauthorized: true,
                minVersion: 'TLSv1.2'
            }
        }
    };
}

/**
 * Create a nodemailer transporter with the current configuration
 * @returns {Object} Nodemailer transporter instance
 */
function createTransporter() {
    const config = getEmailConfig();
    return nodemailer.createTransport(config.smtp);
}

/**
 * Verify SMTP connection
 * @param {Object} transporter - Nodemailer transporter
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function verifyConnection(transporter) {
    try {
        await transporter.verify();
        return { success: true };
    } catch (error) {
        // Return safe error message (no credentials)
        const safeError = getSafeErrorMessage(error);
        return { success: false, error: safeError };
    }
}

/**
 * Get a safe error message without exposing sensitive information
 * @param {Error} error - The error object
 * @returns {string} Safe error message
 */
function getSafeErrorMessage(error) {
    const code = error.code || '';
    const responseCode = error.responseCode || '';

    // Map common SMTP errors to user-friendly messages
    const errorMap = {
        'EAUTH': 'Authentication failed. Check EMAIL_USER and EMAIL_PASS.',
        'ECONNREFUSED': 'Connection refused. Check EMAIL_HOST and EMAIL_PORT.',
        'ECONNECTION': 'Unable to connect to email server.',
        'ETIMEDOUT': 'Connection timed out. Check firewall/network settings.',
        'ESOCKET': 'Socket error. Try different EMAIL_PORT (465 or 587).',
        'EENVELOPE': 'Invalid sender or recipient address.',
        'EMESSAGE': 'Message sending failed.',
        'EDNS': 'DNS lookup failed for email server.'
    };

    // Check response codes
    if (responseCode === 535 || responseCode === 534) {
        return 'Authentication failed. For Gmail, use App Password. Check provider docs.';
    }
    if (responseCode === 550) {
        return 'Mailbox unavailable or access denied.';
    }
    if (responseCode === 553) {
        return 'Invalid sender address for this account.';
    }

    return errorMap[code] || `Email error: ${code || 'Unknown error'}`;
}

/**
 * Check if email is configured (all required vars present)
 * @returns {boolean}
 */
function isEmailConfigured() {
    try {
        getEmailConfig();
        return true;
    } catch {
        return false;
    }
}

/**
 * Get email health status (for /api/email/health endpoint)
 * @returns {Object} Health status object
 */
function getEmailHealthStatus() {
    try {
        const config = getEmailConfig();
        return {
            configured: true,
            mode: config.mode,
            host: config.host,
            port: config.port,
            secure: config.secure,
            from: maskEmail(config.from),
            to: maskEmail(config.to)
        };
    } catch (error) {
        return {
            configured: false,
            error: error.message
        };
    }
}

/**
 * Mask email address for safe logging (show first 2 chars + domain)
 * @param {string} email
 * @returns {string} Masked email
 */
function maskEmail(email) {
    if (!email || !email.includes('@')) return '***';
    const [local, domain] = email.split('@');
    const maskedLocal = local.slice(0, 2) + '***';
    return `${maskedLocal}@${domain}`;
}

module.exports = {
    getEmailConfig,
    createTransporter,
    verifyConnection,
    getSafeErrorMessage,
    isEmailConfigured,
    getEmailHealthStatus,
    maskEmail
};

