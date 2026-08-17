import React from 'react';
import FigmaAuthStatus from '../components/FigmaAuthStatus';
const REASONS = {
  link: { heading: 'Verification Link Expired', message: 'The validation link is no longer active. Request a new secure link to continue your trainer registration.', primary: 'Request New Link', target: 'EmailVerification' },
  otp: { heading: 'Security Code Expired', message: 'The confirmation code is no longer active. Request a new code to continue verification.', primary: 'Request New Code', target: 'EmailVerification' },
  reset: { heading: 'Reset Link Invalid', message: 'The recovery link may have expired or already been used. Request a new password reset link.', primary: 'Request New Link', target: 'ForgotPassword' },
};
export default function AuthErrorScreen({ navigate, goBack, params }) { const reason = REASONS[params?.reason] || { heading: 'Invalid Credentials', message: 'The login credentials provided do not align with our trainer registry databases. Please verify your entries or recover your account.', primary: 'Try Logging In Again', target: 'SignIn' }; return <FigmaAuthStatus eyebrow="LOG PROTOCOL" title="Authentication Error" icon="warning-outline" tone="error" heading={reason.heading} message={reason.message} primaryLabel={reason.primary} onPrimary={() => navigate(reason.target, { email: params?.email })} secondaryLabel="Contact Support Index" onSecondary={() => navigate('About')} onBack={goBack} />; }
