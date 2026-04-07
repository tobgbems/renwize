/**
 * HTML for password reset transactional email (Resend).
 * @param {{ resetUrl: string }} opts
 */
export function buildPasswordResetEmailHtml({ resetUrl }) {
  const href = resetUrl.replace(/"/g, "");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset your Renwize password</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;padding:32px;">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1e254a;">Reset your password</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#64748b;">
                We received a request to reset the password for your Renwize account. Click the button below to choose a new password. This link expires in one hour.
              </p>
              <p style="margin:0 0 24px;">
                <a href="${href}" style="display:inline-block;background:#1fa168;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:8px;">Reset password</a>
              </p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#94a3b8;">
                If you did not request this, you can ignore this email. Your password will stay the same.
              </p>
              <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#94a3b8;word-break:break-all;">
                Or copy this link:<br /><a href="${href}" style="color:#1fa168;">${href}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
