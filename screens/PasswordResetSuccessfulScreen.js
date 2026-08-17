import React from 'react';
import FigmaAuthStatus from '../components/FigmaAuthStatus';
export default function PasswordResetSuccessfulScreen({ navigate }) { return <FigmaAuthStatus eyebrow="VERIFICATION COMPLETE" title="Security Cleared" icon="checkmark" heading="Password Redefined" message="Your trainer credentials have been successfully updated on the master index. You may now sign in using your new credentials." primaryLabel="Sign In to Profile" onPrimary={() => navigate('SignIn')} />; }
