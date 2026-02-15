/**
 * Email Service Module
 *
 * Handles sending contact form notifications with support for:
 * - Mode A (smtp): Real mailbox - sends from custom domain
 * - Mode B (forward_only): Uses personal email with proper headers
 *
 * @module src/services/emailService
 */

const {
    getEmailConfig,
    createTransporter,
    getSafeErrorMessage,
    isEmailConfigured
} = require('../config/email');

// Cached transporter instance
let cachedTransporter = null;

/**
 * Get or create the email transporter
 * @returns {Object} Nodemailer transporter
 */
function getTransporter() {
    if (!cachedTransporter) {
        cachedTransporter = createTransporter();
    }
    return cachedTransporter;
}

/**
 * Reset the cached transporter (useful for config changes)
 */
function resetTransporter() {
    cachedTransporter = null;
}

/**
 * Sanitize string to prevent header injection attacks
 * Removes CR and LF characters that could inject additional headers
 * @param {string} str - Input string
 * @returns {string} Sanitized string
 */
function sanitizeForHeaders(str) {
    if (!str) return '';
    return String(str)
        .replace(/[\r\n]/g, ' ')  // Replace CRLF with space
        .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, '') // Remove control characters
        .trim()
        .slice(0, 500); // Limit length
}

/**
 * Sanitize email address
 * @param {string} email
 * @returns {string|null} Sanitized email or null if invalid
 */
function sanitizeEmail(email) {
    if (!email) return null;
    const sanitized = sanitizeForHeaders(email).toLowerCase();
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : null;
}

/**
 * Build email HTML body for contact notification
 * @param {Object} data - Contact form data
 * @returns {string} HTML email body
 */
function buildContactEmailHtml(data) {
    const { name, email, subject, message, timestamp, userAgent, ip } = data;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0d6efd, #6610f2); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #495057; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #0d6efd; }
        .message-box { white-space: pre-wrap; word-wrap: break-word; }
        .footer { font-size: 12px; color: #6c757d; padding: 15px; text-align: center; border-top: 1px solid #dee2e6; }
        .meta { font-size: 11px; color: #999; margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">📬 New Contact Form Submission</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">From your portfolio at manaskumarbehera.com</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">👤 Name</div>
                <div class="value">${escapeHtml(name)}</div>
            </div>
            <div class="field">
                <div class="label">📧 Email</div>
                <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
            </div>
            <div class="field">
                <div class="label">📋 Subject</div>
                <div class="value">${escapeHtml(subject || 'No subject')}</div>
            </div>
            <div class="field">
                <div class="label">💬 Message</div>
                <div class="value message-box">${escapeHtml(message)}</div>
            </div>
            <div class="meta">
                <strong>📅 Received:</strong> ${timestamp}<br>
                ${ip ? `<strong>🌐 IP:</strong> ${escapeHtml(ip)}<br>` : ''}
                ${userAgent ? `<strong>🖥️ User Agent:</strong> ${escapeHtml(userAgent.slice(0, 150))}` : ''}
            </div>
        </div>
        <div class="footer">
            This email was sent from the contact form on your portfolio website.<br>
            Reply directly to this email to respond to ${escapeHtml(name)}.
        </div>
    </div>
</body>
</html>`;
}

/**
 * Build plain text email body for contact notification
 * @param {Object} data - Contact form data
 * @returns {string} Plain text email body
 */
function buildContactEmailText(data) {
    const { name, email, subject, message, timestamp, userAgent, ip } = data;

    return `
NEW CONTACT FORM SUBMISSION
============================

From: ${name}
Email: ${email}
Subject: ${subject || 'No subject'}

Message:
${message}

-----------------------------
Received: ${timestamp}
${ip ? `IP: ${ip}` : ''}
${userAgent ? `User Agent: ${userAgent.slice(0, 150)}` : ''}

Reply to this email to respond to ${name}.
`;
}

/**
 * Escape HTML entities to prevent XSS
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Send contact form notification email
 *
 * @param {Object} data - Contact form data
 * @param {string} data.name - Sender name
 * @param {string} data.email - Sender email
 * @param {string} data.subject - Message subject (optional)
 * @param {string} data.message - Message content
 * @param {string} data.userAgent - Browser user agent (optional)
 * @param {string} data.ip - Client IP address (optional)
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
async function sendContactNotification(data) {
    // Check if email is configured
    if (!isEmailConfigured()) {
        console.log('⚠️ Email not configured - skipping notification');
        return { success: false, error: 'Email not configured' };
    }

    const config = getEmailConfig();
    const transporter = getTransporter();

    // Sanitize inputs
    const sanitizedData = {
        name: sanitizeForHeaders(data.name),
        email: sanitizeEmail(data.email),
        subject: sanitizeForHeaders(data.subject) || 'Contact Form Submission',
        message: data.message ? String(data.message).trim().slice(0, 10000) : '',
        timestamp: data.timestamp || new Date().toISOString(),
        userAgent: data.userAgent || null,
        ip: data.ip || null
    };

    // Validate sanitized data
    if (!sanitizedData.email) {
        return { success: false, error: 'Invalid email address' };
    }

    if (!sanitizedData.name || !sanitizedData.message) {
        return { success: false, error: 'Name and message are required' };
    }

    // Build email options based on mode
    let mailOptions;

    if (config.mode === 'smtp') {
        // Mode A: Real mailbox SMTP
        // From: web@manaskumarbehera.com, Reply-To: user's email
        mailOptions = {
            from: config.fromAddress,
            to: config.to,
            replyTo: sanitizedData.email,
            subject: `🎯 [Contact] ${sanitizedData.subject} - from ${sanitizedData.name}`,
            html: buildContactEmailHtml(sanitizedData),
            text: buildContactEmailText(sanitizedData)
        };
    } else {
        // Mode B: Forward-only fallback
        // From: personal email, Reply-To: custom domain
        mailOptions = {
            from: `"${config.fromName}" <${config.user}>`,
            to: config.to,
            replyTo: config.replyToDomain,
            subject: `🎯 [Portfolio Contact] ${sanitizedData.subject} - from ${sanitizedData.name}`,
            html: buildContactEmailHtml(sanitizedData),
            text: buildContactEmailText(sanitizedData)
        };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Contact notification sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        const safeError = getSafeErrorMessage(error);
        console.error(`❌ Failed to send contact notification: ${safeError}`);
        return { success: false, error: safeError };
    }
}

/**
 * Send auto-reply to the contact form submitter
 *
 * @param {Object} data - Contact form data
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
async function sendAutoReply(data) {
    if (!isEmailConfigured()) {
        return { success: false, error: 'Email not configured' };
    }

    const config = getEmailConfig();
    const transporter = getTransporter();

    const sanitizedEmail = sanitizeEmail(data.email);
    if (!sanitizedEmail) {
        return { success: false, error: 'Invalid email address' };
    }

    const sanitizedName = sanitizeForHeaders(data.name);
    const sanitizedSubject = sanitizeForHeaders(data.subject) || 'your message';
    const sanitizedMessage = data.message ? String(data.message).trim().slice(0, 5000) : '';

    const mailOptions = {
        from: config.fromAddress,
        to: sanitizedEmail,
        replyTo: config.mode === 'smtp' ? config.from : config.user,
        subject: `Re: ${sanitizedSubject} - Thank you for reaching out!`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0d6efd, #6610f2); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f8f9fa; padding: 25px; border: 1px solid #dee2e6; }
        .quote { border-left: 3px solid #0d6efd; padding-left: 15px; margin: 20px 0; color: #666; background: white; padding: 15px; border-radius: 0 4px 4px 0; }
        .footer { padding: 20px; text-align: center; font-size: 14px; color: #6c757d; }
        .social a { color: #0d6efd; text-decoration: none; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">Thank you for contacting me!</h2>
        </div>
        <div class="content">
            <p>Hi ${escapeHtml(sanitizedName)},</p>
            <p>Thank you for reaching out! I have received your message and will get back to you within <strong>24-48 hours</strong>.</p>
            <p><strong>Your message:</strong></p>
            <div class="quote">${escapeHtml(sanitizedMessage).replace(/\n/g, '<br>')}</div>
            <p>In the meantime, feel free to check out my portfolio and projects.</p>
            <p>Best regards,<br><strong>Manas Kumar Behera</strong><br>Salesforce Developer & Architect</p>
        </div>
        <div class="footer">
            <div class="social">
                <a href="https://github.com/manaskumarbehera">GitHub</a> |
                <a href="https://linkedin.com/in/manas-behera-68607547">LinkedIn</a> |
                <a href="https://www.manaskumarbehera.com">Website</a>
            </div>
        </div>
    </div>
</body>
</html>`,
        text: `
Hi ${sanitizedName},

Thank you for reaching out! I have received your message and will get back to you within 24-48 hours.

Your message:
${sanitizedMessage}

Best regards,
Manas Kumar Behera
Salesforce Developer & Architect

GitHub: https://github.com/manaskumarbehera
LinkedIn: https://linkedin.com/in/manas-behera-68607547
Website: https://www.manaskumarbehera.com
`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Auto-reply sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        const safeError = getSafeErrorMessage(error);
        console.error(`❌ Failed to send auto-reply: ${safeError}`);
        return { success: false, error: safeError };
    }
}

/**
 * Send recommendation notification email
 *
 * @param {Object} recommendation - Recommendation data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function sendRecommendationNotification(recommendation) {
    if (!isEmailConfigured()) {
        return { success: false, error: 'Email not configured' };
    }

    const config = getEmailConfig();
    const transporter = getTransporter();

    const { id, name, title, email, linkedin, relationship, message, rating, timestamp } = recommendation;

    const mailOptions = {
        from: config.fromAddress,
        to: config.to,
        subject: `⭐ [NEW RECOMMENDATION] from ${sanitizeForHeaders(name)}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ffc107, #ff9800); color: #333; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; }
        .quote { border-left: 3px solid #ffc107; padding: 15px; margin: 20px 0; background: white; border-radius: 0 4px 4px 0; font-style: italic; }
        .actions { margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 4px; }
        .btn { display: inline-block; padding: 10px 20px; margin: 5px; border-radius: 4px; text-decoration: none; font-weight: bold; }
        .btn-approve { background: #28a745; color: white; }
        .btn-reject { background: #dc3545; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">⭐ New Recommendation Submitted!</h2>
        </div>
        <div class="content">
            <p><strong>From:</strong> ${escapeHtml(name)}</p>
            <p><strong>Title:</strong> ${escapeHtml(title)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>LinkedIn:</strong> ${linkedin ? `<a href="${escapeHtml(linkedin)}">${escapeHtml(linkedin)}</a>` : 'Not provided'}</p>
            <p><strong>Relationship:</strong> ${escapeHtml(relationship)}</p>
            <p><strong>Rating:</strong> ${'⭐'.repeat(rating)}</p>
            <div class="quote">${escapeHtml(message)}</div>
            <p><small>Received: ${timestamp}</small></p>
            <div class="actions">
                <a href="https://www.manaskumarbehera.com/api/recommendations/approve?id=${id}&key=${process.env.ADMIN_KEY || 'manas2026'}" class="btn btn-approve">✅ Approve</a>
                <a href="https://www.manaskumarbehera.com/api/recommendations/reject?id=${id}&key=${process.env.ADMIN_KEY || 'manas2026'}" class="btn btn-reject">❌ Reject</a>
            </div>
        </div>
    </div>
</body>
</html>`
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        const safeError = getSafeErrorMessage(error);
        console.error(`❌ Failed to send recommendation notification: ${safeError}`);
        return { success: false, error: safeError };
    }
}

module.exports = {
    sendContactNotification,
    sendAutoReply,
    sendRecommendationNotification,
    getTransporter,
    resetTransporter,
    sanitizeForHeaders,
    sanitizeEmail,
    escapeHtml
};

