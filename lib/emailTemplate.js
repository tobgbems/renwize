/**
 * Branded HTML for transactional emails (inline CSS for email client compatibility).
 * Renwize palette: Sea Green #1FA168, navy #1E254A.
 */

const BRAND_GREEN = "#1FA168";
const BRAND_NAVY = "#1E254A";
const BG = "#F4F6F8";

/**
 * @param {object} params
 * @param {string} params.userName
 * @param {string} params.subscriptionName
 * @param {string} params.amountFormatted — e.g. "US$9.99" from formatMoney
 * @param {string} params.renewalDateFormatted — human-readable date
 * @param {string} [params.dashboardUrl] — defaults to production dashboard
 */
export function buildReminderEmailHtml({
  userName,
  subscriptionName,
  amountFormatted,
  renewalDateFormatted,
  dashboardUrl = "https://renwize.vercel.app/dashboard",
}) {
  const safeName = escapeHtml(userName || "there");
  const safeSub = escapeHtml(subscriptionName);
  const safeAmount = escapeHtml(amountFormatted);
  const safeDate = escapeHtml(renewalDateFormatted);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Renwize reminder</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BG};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(30,37,74,0.08);">
          <tr>
            <td style="padding:28px 28px 8px 28px;text-align:center;">
              <div style="font-size:26px;font-weight:700;letter-spacing:-0.02em;color:${BRAND_GREEN};">Renwize</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 24px 28px;color:${BRAND_NAVY};font-size:16px;line-height:1.6;">
              <p style="margin:0 0 16px 0;">Hi ${safeName},</p>
              <p style="margin:0 0 16px 0;">Just a heads up that your <strong>${safeSub}</strong> subscription of <strong>${safeAmount}</strong> is due to renew on <strong>${safeDate}</strong>.</p>
              <p style="margin:0 0 24px 0;">Log in to Renwize to manage your subscriptions.</p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td style="border-radius:8px;background:${BRAND_GREEN};">
                    <a href="${dashboardUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-weight:600;text-decoration:none;font-size:15px;">Open dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px 28px;border-top:1px solid #E8ECF2;color:#6B7280;font-size:13px;line-height:1.5;text-align:center;">
              You&apos;re receiving this because you have an active Renwize account.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
