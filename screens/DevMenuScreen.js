import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';

const GROUPS = [
  {
    title: 'Core',
    routes: [
      ['Splash', 'Splash', '/'],
      ['Home', 'Home', '/home'],
      ['Search', 'Search', '/search'],
      ['All Sets', 'AllSets', '/sets'],
      ['Series View', 'SeriesView', '/series'],
      ['Set Detail', 'SetDetail', '/sets/:setId'],
      ['Set Card Grid', 'SetCardGrid', '/sets/:setId/cards'],
      ['Checklist', 'Checklist', '/sets/:setId/checklist'],
      ['Set Filters', 'SetFilters', '/sets/filters'],
    ],
  },
  {
    title: 'Card',
    routes: [
      ['Card Detail', 'CardDetail', '/cards/:cardId'],
      ['Card Zoom', 'CardZoom', '/cards/:cardId/zoom'],
      ['Variants', 'Variants', '/cards/:cardId/variants'],
      ['Add to Collection', 'AddToCollection', '/cards/:cardId/add-to-collection'],
      ['Edit Owned Card', 'EditOwnedCard', '/cards/:cardId/edit-owned-card'],
      ['Choose Binder', 'ChooseBinder', '/cards/:cardId/choose-binder'],
    ],
  },
  {
    title: 'Binders',
    routes: [
      ['Binders', 'Binders', '/binders'],
      ['Binder Detail', 'BinderDetail', '/binders/:binderId'],
      ['Binder Settings', 'BinderSettings', '/binders/:binderId/settings'],
      ['Cover Designer', 'CoverDesigner', '/binders/:binderId/cover'],
    ],
  },
  {
    title: 'Wishlist',
    routes: [
      ['Wishlist', 'Wishlist', '/wishlist'],
      ['Wishlist Detail', 'WishlistDetail', '/wishlist/:wishlistId'],
    ],
  },
  {
    title: 'Collection',
    routes: [
      ['My Collection', 'MyCollection', '/collection'],
      ['Collection (All)', 'CollectionAll', '/collection/all'],
      ['Collection Filters', 'CollectionFilters', '/collection/filters'],
      ['Collection Overview', 'CollectionOverview', '/collection/overview'],
    ],
  },
  {
    title: 'Profile / Settings',
    routes: [
      ['Profile', 'Profile', '/profile'],
      ['Appearance', 'Appearance', '/profile/appearance'],
      ['Language', 'Language', '/profile/language'],
      ['Notifications', 'Notifications', '/profile/notifications'],
      ['Data & Sync', 'DataSync', '/profile/data-sync'],
      ['About', 'About', '/about'],
      ['Sign Up', 'Signup', '/signup'],
    ],
  },
  {
    title: 'Authentication',
    routes: [
      ['Welcome', 'Welcome', '/welcome'],
      ['Create Account', 'Signup', '/signup'],
      ['Email Verification', 'EmailVerification', '/signup/email-verification'],
      ['Verification Code', 'VerificationCode', '/signup/verification-code'],
      ['Account Verified', 'AccountVerified', '/signup/verified'],
      ['Social Confirmation', 'SocialAuthConfirm', '/auth/social-confirm'],
      ['Complete Profile', 'CompleteProfile', '/auth/complete-profile'],
      ['Onboarding', 'Onboarding', '/onboarding'],
      ['Forgot Password', 'ForgotPassword', '/password/forgot'],
      ['Reset Email Sent', 'PasswordResetEmailSent', '/password/email-sent'],
      ['Reset Password', 'ResetPassword', '/password/reset'],
      ['Reset Successful', 'PasswordResetSuccessful', '/password/reset-successful'],
      ['Auth Error', 'AuthError', '/auth/error'],
      ['Account Exists', 'AccountAlreadyExists', '/auth/account-exists'],
    ],
  },
  {
    title: 'States & Empty',
    routes: [
      ['Loading', 'Loading', '/loading'],
      ['Empty Binders', 'EmptyBinders', '/empty/binders'],
      ['Empty Wishlist', 'EmptyWishlist', '/empty/wishlist'],
      ['Empty Collection', 'EmptyCollection', '/empty/collection'],
      ['No Search Results', 'NoSearchResults', '/search/no-results'],
      ['Offline', 'Offline', '/offline'],
      ['API Error', 'ApiError', '/error/api'],
      ['Set Complete', 'SetComplete', '/sets/:setId/complete'],
      ['Binder Complete', 'BinderComplete', '/binders/:binderId/complete'],
      ['Card Not Owned', 'CardNotOwned', '/cards/:cardId/not-owned'],
    ],
  },
];

export default function DevMenuScreen({ navigate, goBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ALL SCREENS</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {GROUPS.map((group) => (
          <View key={group.title} style={{ marginTop: 24 }}>
            <Text style={styles.groupTitle}>{group.title.toUpperCase()}</Text>
            {group.routes.map(([label, route, path]) => (
              <TouchableOpacity key={route} style={styles.row} onPress={() => navigate(route)}>
                <View style={styles.labelWrap}>
                  <Text style={styles.rowText}>{label}</Text>
                  <Text style={styles.pathText}>{path}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  back: { color: colors.text, fontSize: 28, fontWeight: '300', width: 24 },
  title: { color: colors.text, fontSize: 13, fontWeight: '600', letterSpacing: 1.5 },
  groupTitle: { color: colors.purple, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border,
  },
  labelWrap: { flex: 1, paddingRight: 12 },
  rowText: { color: colors.text, fontSize: 15 },
  pathText: { color: colors.textSecondary, fontSize: 11, marginTop: 3 },
  chevron: { color: colors.textSecondary, fontSize: 16 },
});
