import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  StatusBar,
  StyleSheet,
  Modal,
  View,
  PanResponder,
  Dimensions,
  Animated,
  Easing,
  Linking,
  Appearance,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { colors, setThemeSettings } from "./theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "./components/BottomNav";
import { supabase } from "./lib/supabase";
import { AppContext } from "./AppContext";
import {
  addCollectibleToFreeformBinder,
  collectibleKey,
  getSetRequirements,
  mergeWishlistRequirements,
  normalizeBinder,
  ownedQuantity,
  removeCollectibleFromFreeformBinder,
} from "./lib/collectibles";
import { CARD_LIBRARY, getCardById, SETS } from "./data";
import { calculateInsights } from "./lib/collectorAnalytics";
import { DEFAULT_SET_FILTERS } from "./lib/cardFilters";
import { evaluateMilestones } from "./lib/milestones";
import { createHistoryEvent } from "./lib/history";
import {
  getPrimaryFlexBinder,
  upsertPrimaryFlexBinder,
} from "./lib/flexBinder";
import { normalizeVaultAssets } from "./lib/vault";
import {
  calculateVaultPortfolio,
  makePortfolioSnapshot,
} from "./lib/valueEngine";

const APP_STORAGE_KEY = "@pokefile/user-data-v1";
const LEGACY_STORAGE_KEY = "@poke-haus/user-data-v1";
const DEFAULT_PREFERENCES = {
  theme: "Dark",
  accent: "#D6B42C",
  density: "Comfortable",
  language: "English (US)",
  animations: true,
  currency: "EUR",
  notifications: {
    wishlistPriceDrops: true,
    setRestockAlerts: true,
    newSetReleases: true,
    collectionMilestones: false,
    binderReminders: true,
  },
};
const DEFAULT_COLLECTION_FILTERS = {
  sets: [],
  rarity: "All",
  condition: "All",
  ownership: "Owned",
  sortBy: "Set Number (Default)",
};

const { width } = Dimensions.get("window");

// Core
import SplashScreen from "./screens/SplashScreen";
import HomeScreen from "./screens/HomeScreen";
import MenuScreen from "./screens/MenuScreen";
import SearchScreen from "./screens/SearchScreen";
import AllSetsScreen from "./screens/AllSetsScreen";
import SeriesViewScreen from "./screens/SeriesViewScreen";
import SetDetailScreen from "./screens/SetDetailScreen";
import BinderDetailScreen from "./screens/BinderDetailScreen"; // also used as "Set Card Grid"
import ChecklistScreen from "./screens/ChecklistScreen";
import SetFiltersScreen from "./screens/SetFiltersScreen";

// Card
import CardDetailScreen from "./screens/CardDetailScreen";
import CardZoomScreen from "./screens/CardZoomScreen";
import VariantsScreen from "./screens/VariantsScreen";
import AddToCollectionScreen from "./screens/AddToCollectionScreen";
import EditOwnedCardScreen from "./screens/EditOwnedCardScreen";
import ChooseBinderScreen from "./screens/ChooseBinderScreen";

// Binders
import BindersScreen from "./screens/BindersScreen";
import BinderSettingsScreen from "./screens/BinderSettingsScreen.js";
import CoverDesignerScreen from "./screens/CoverDesignerScreen.js";
import FlexBinderEditorScreen from "./screens/FlexBinderEditorScreen";
import FlexBinderPageScreen from "./screens/FlexBinderPageScreen";

// Wishlist
import WishlistScreen from "./screens/WishlistScreen";
import TradesScreen from "./screens/TradesScreen";
import WishlistDetailScreen from "./screens/WishlistDetailScreen";
import MissingListScreen from "./screens/MissingListScreen";

// Collection
import MyCollectionScreen from "./screens/MyCollectionScreen";
import CollectionAllScreen from "./screens/CollectionAllScreen";
import CollectionFiltersScreen from "./screens/CollectionFiltersScreen";
import CollectionOverviewScreen from "./screens/CollectionOverviewScreen";

// Profile / Settings
import ProfileScreen from "./screens/ProfileScreen";
import AppearanceScreen from "./screens/AppearanceScreen";
import LanguageScreen from "./screens/LanguageScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import DataSyncScreen from "./screens/DataSyncScreen";
import AboutScreen from "./screens/AboutScreen";
import CollectorDNAScreen from "./screens/CollectorDNAScreen";
import InsightsScreen from "./screens/InsightsScreen";
import MilestonesScreen from "./screens/MilestonesScreen";
import CollectionHistoryScreen from "./screens/CollectionHistoryScreen";
import VaultScreen from "./screens/VaultScreen";
import AddGradedAssetScreen from "./screens/AddGradedAssetScreen";
import AddSealedAssetScreen from "./screens/AddSealedAssetScreen";
import AddVaultAssetScreen from "./screens/AddVaultAssetScreen";
import VaultAssetDetailScreen from "./screens/VaultAssetDetailScreen";
import ValueHistoryScreen from "./screens/ValueHistoryScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignInScreen from "./screens/SignInScreen";
import EmailVerificationScreen from "./screens/EmailVerificationScreen";
import VerificationCodeScreen from "./screens/VerificationCodeScreen";
import AccountVerifiedScreen from "./screens/AccountVerifiedScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import PasswordResetEmailSentScreen from "./screens/PasswordResetEmailSentScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import PasswordResetSuccessfulScreen from "./screens/PasswordResetSuccessfulScreen";
import AuthErrorScreen from "./screens/AuthErrorScreen";
import AccountAlreadyExistsScreen from "./screens/AccountAlreadyExistsScreen";
import SocialAuthConfirmScreen from "./screens/SocialAuthConfirmScreen";
import CompleteProfileScreen from "./screens/CompleteProfileScreen";
import OnboardingScreen from "./screens/OnboardingScreen";

// States
import LoadingScreen from "./screens/states/LoadingScreen";
import EmptyBindersScreen from "./screens/states/EmptyBindersScreen";
import EmptyWishlistScreen from "./screens/states/EmptyWishlistScreen";
import EmptyCollectionScreen from "./screens/states/EmptyCollectionScreen";
import NoSearchResultsScreen from "./screens/states/NoSearchResultsScreen";
import OfflineScreen from "./screens/states/OfflineScreen";
import ApiErrorScreen from "./screens/states/ApiErrorScreen";
import SetCompleteScreen from "./screens/states/SetCompleteScreen";
import BinderCompleteScreen from "./screens/states/BinderCompleteScreen";
import CardNotOwnedScreen from "./screens/states/CardNotOwnedScreen";

// Dev
import DevMenuScreen from "./screens/DevMenuScreen";

// Simple in-memory stack navigator — no external navigation library required.
// Screen paths are explicit so the app can navigate by route name or canonical path.
const SCREEN_PATHS = {
  Splash: "/",
  Home: "/home",
  Search: "/search",
  AllSets: "/sets",
  SeriesView: "/series",
  SetDetail: "/sets/:setId",
  SetCardGrid: "/sets/:setId/cards",
  Checklist: "/sets/:setId/checklist",
  SetFilters: "/sets/filters",

  CardDetail: "/cards/:cardId",
  CardZoom: "/cards/:cardId/zoom",
  Variants: "/cards/:cardId/variants",
  AddToCollection: "/cards/:cardId/add-to-collection",
  EditOwnedCard: "/cards/:cardId/edit-owned-card",
  ChooseBinder: "/cards/:cardId/choose-binder",

  Binders: "/binders",
  BinderDetail: "/binders/:binderId",
  BinderSettings: "/binders/:binderId/settings",
  CoverDesigner: "/binders/:binderId/cover",
  FlexBinderEditor: "/binders/flex/:binderId/edit",
  FlexBinderPage: "/binders/flex/:binderId",

  Wishlist: "/wishlist",
  WishlistDetail: "/wishlist/:wishlistId",
  MissingList: "/binders/:binderId/missing",

  MyCollection: "/collection",
  CollectionAll: "/collection/all",
  CollectionFilters: "/collection/filters",
  CollectionOverview: "/collection/overview",
  Vault: "/collection/vault",
  AddVaultAsset: "/collection/vault/add",
  AddGradedAsset: "/collection/vault/graded/add",
  AddSealedAsset: "/collection/vault/sealed/add",
  VaultAssetDetail: "/collection/vault/assets/:assetId",
  ValueHistory: "/collection/vault/history",

  Profile: "/profile",
  Appearance: "/profile/appearance",
  Language: "/profile/language",
  Notifications: "/profile/notifications",
  DataSync: "/profile/data-sync",
  About: "/about",
  CollectorDNA: "/profile/collector-dna",
  Insights: "/profile/insights",
  Milestones: "/profile/milestones",
  CollectionHistory: "/profile/history",
  Signup: "/signup",
  Welcome: "/welcome",
  SignIn: "/signin",
  EmailVerification: "/signup/email-verification",
  VerificationCode: "/signup/verification-code",
  AccountVerified: "/signup/verified",
  ForgotPassword: "/password/forgot",
  PasswordResetEmailSent: "/password/email-sent",
  ResetPassword: "/password/reset",
  PasswordResetSuccessful: "/password/reset-successful",
  AuthError: "/auth/error",
  AccountAlreadyExists: "/auth/account-exists",
  SocialAuthConfirm: "/auth/social-confirm",
  CompleteProfile: "/auth/complete-profile",
  Onboarding: "/onboarding",

  Loading: "/loading",
  EmptyBinders: "/empty/binders",
  EmptyWishlist: "/empty/wishlist",
  EmptyCollection: "/empty/collection",
  NoSearchResults: "/search/no-results",
  Offline: "/offline",
  ApiError: "/error/api",
  SetComplete: "/sets/:setId/complete",
  BinderComplete: "/binders/:binderId/complete",
  CardNotOwned: "/cards/:cardId/not-owned",

  DevMenu: "/dev-menu",
  Menu: "/menu",
};

const SCREENS = {
  Splash: SplashScreen,
  Home: HomeScreen,
  Search: SearchScreen,
  AllSets: AllSetsScreen,
  SeriesView: SeriesViewScreen,
  SetDetail: SetDetailScreen,
  SetCardGrid: BinderDetailScreen,
  Checklist: ChecklistScreen,
  SetFilters: SetFiltersScreen,

  CardDetail: CardDetailScreen,
  CardZoom: CardZoomScreen,
  Variants: VariantsScreen,
  AddToCollection: AddToCollectionScreen,
  EditOwnedCard: EditOwnedCardScreen,
  ChooseBinder: ChooseBinderScreen,

  Binders: BindersScreen,
  BinderDetail: BinderDetailScreen,
  BinderSettings: BinderSettingsScreen,
  CoverDesigner: CoverDesignerScreen,
  FlexBinderEditor: FlexBinderEditorScreen,
  FlexBinderPage: FlexBinderPageScreen,

  Wishlist: WishlistScreen,
  Trades: TradesScreen,
  WishlistDetail: WishlistDetailScreen,
  MissingList: MissingListScreen,

  MyCollection: MyCollectionScreen,
  CollectionAll: CollectionAllScreen,
  CollectionFilters: CollectionFiltersScreen,
  CollectionOverview: CollectionOverviewScreen,
  Vault: VaultScreen,
  AddVaultAsset: AddVaultAssetScreen,
  AddGradedAsset: AddGradedAssetScreen,
  AddSealedAsset: AddSealedAssetScreen,
  VaultAssetDetail: VaultAssetDetailScreen,
  ValueHistory: ValueHistoryScreen,

  Profile: ProfileScreen,
  Appearance: AppearanceScreen,
  Language: LanguageScreen,
  Notifications: NotificationsScreen,
  DataSync: DataSyncScreen,
  About: AboutScreen,
  CollectorDNA: CollectorDNAScreen,
  Insights: InsightsScreen,
  Milestones: MilestonesScreen,
  CollectionHistory: CollectionHistoryScreen,
  Signup: SignupScreen,
  Welcome: WelcomeScreen,
  SignIn: SignInScreen,
  EmailVerification: EmailVerificationScreen,
  VerificationCode: VerificationCodeScreen,
  AccountVerified: AccountVerifiedScreen,
  ForgotPassword: ForgotPasswordScreen,
  PasswordResetEmailSent: PasswordResetEmailSentScreen,
  ResetPassword: ResetPasswordScreen,
  PasswordResetSuccessful: PasswordResetSuccessfulScreen,
  AuthError: AuthErrorScreen,
  AccountAlreadyExists: AccountAlreadyExistsScreen,
  SocialAuthConfirm: SocialAuthConfirmScreen,
  CompleteProfile: CompleteProfileScreen,
  Onboarding: OnboardingScreen,

  Loading: LoadingScreen,
  EmptyBinders: EmptyBindersScreen,
  EmptyWishlist: EmptyWishlistScreen,
  EmptyCollection: EmptyCollectionScreen,
  NoSearchResults: NoSearchResultsScreen,
  Offline: OfflineScreen,
  ApiError: ApiErrorScreen,
  SetComplete: SetCompleteScreen,
  BinderComplete: BinderCompleteScreen,
  CardNotOwned: CardNotOwnedScreen,

  DevMenu: DevMenuScreen,
};

const buildScreenPath = (route, params = {}) => {
  const template =
    SCREEN_PATHS[route] ||
    `/${String(route)
      .replace(/([A-Z])/g, "-$1")
      .replace(/^-/, "")
      .toLowerCase()}`;

  return Object.entries(params).reduce((path, [key, value]) => {
    if (value === undefined || value === null) {
      return path;
    }
    return path.replace(`:${key}`, encodeURIComponent(String(value)));
  }, template);
};

const resolveRoute = (route) => {
  if (!route || typeof route !== "string") {
    return "Home";
  }

  if (route.startsWith("/")) {
    const normalized = route.replace(/\/+$/, "") || "/";
    const match = Object.entries(SCREEN_PATHS).find(([, path]) => {
      const template = path.replace(/\/+$/, "") || "/";
      if (template === normalized) {
        return true;
      }

      const templateParts = template.split("/");
      const actualParts = normalized.split("/");
      if (templateParts.length !== actualParts.length) {
        return false;
      }

      return templateParts.every(
        (part, index) => part.startsWith(":") || part === actualParts[index],
      );
    });

    return match ? match[0] : "Home";
  }

  return route;
};

const AUTH_ROUTES = [
  "Welcome",
  "Signup",
  "SignIn",
  "EmailVerification",
  "VerificationCode",
  "AccountVerified",
  "ForgotPassword",
  "PasswordResetEmailSent",
  "ResetPassword",
  "PasswordResetSuccessful",
  "AuthError",
  "AccountAlreadyExists",
  "SocialAuthConfirm",
  "CompleteProfile",
  "Onboarding",
];

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  const fontsReady = fontsLoaded || Boolean(fontsError);
  const [stack, setStack] = useState([
    { route: "Welcome", params: {}, path: buildScreenPath("Welcome") },
  ]);
  const stackRef = useRef(stack);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionQuantities, setCollectionQuantities] = useState({});
  const [binders, setBinders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [historyEvents, setHistoryEvents] = useState([]);
  const [unlockedMilestones, setUnlockedMilestones] = useState([]);
  const [completedBinderIds, setCompletedBinderIds] = useState([]);
  const [vaultAssets, setVaultAssets] = useState([]);
  const [valueSnapshots, setValueSnapshots] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [rawAcquisitions, setRawAcquisitions] = useState({});
  const [collectionFilters, setCollectionFilters] = useState(
    DEFAULT_COLLECTION_FILTERS,
  );
  const [setFiltersByKey, setSetFiltersByKey] = useState({});
  const updateSetFilters = (key, filters) =>
    setSetFiltersByKey((current) => ({ ...current, [key]: { ...DEFAULT_SET_FILTERS, ...filters } }));
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    email: "",
    avatarUri: "",
    createdAt: "",
  });
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [systemColorScheme, setSystemColorScheme] = useState(
    Appearance.getColorScheme() || "dark",
  );
  const effectiveTheme = preferences.theme === "System"
    ? (systemColorScheme === "light" ? "Light" : "Dark")
    : preferences.theme;
  const [storageReady, setStorageReady] = useState(false);
  const [splashMinimumElapsed, setSplashMinimumElapsed] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const screenEntrance = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => setSplashMinimumElapsed(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme || "dark");
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    StatusBar.setBarStyle(
      effectiveTheme === "Light" ? "dark-content" : "light-content",
      true,
    );
  }, [effectiveTheme]);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(APP_STORAGE_KEY)
      .then((saved) => saved || AsyncStorage.getItem(LEGACY_STORAGE_KEY))
      .then((saved) => {
        if (!active || !saved) return;
        const parsed = JSON.parse(saved);
        if (
          parsed.collectionQuantities &&
          typeof parsed.collectionQuantities === "object"
        )
          setCollectionQuantities(parsed.collectionQuantities);
        if (Array.isArray(parsed.binders))
          setBinders(parsed.binders.map(normalizeBinder));
        if (Array.isArray(parsed.wishlistItems))
          setWishlistItems(parsed.wishlistItems);
        if (Array.isArray(parsed.historyEvents))
          setHistoryEvents(parsed.historyEvents);
        if (Array.isArray(parsed.unlockedMilestones))
          setUnlockedMilestones(parsed.unlockedMilestones);
        if (Array.isArray(parsed.completedBinderIds))
          setCompletedBinderIds(parsed.completedBinderIds);
        if (Array.isArray(parsed.vaultAssets))
          setVaultAssets(normalizeVaultAssets(parsed.vaultAssets));
        if (Array.isArray(parsed.valueSnapshots))
          setValueSnapshots(parsed.valueSnapshots);
        if (Array.isArray(parsed.priceAlerts))
          setPriceAlerts(parsed.priceAlerts);
        if (
          parsed.rawAcquisitions &&
          typeof parsed.rawAcquisitions === "object"
        )
          setRawAcquisitions(parsed.rawAcquisitions);
        if (parsed.userProfile && typeof parsed.userProfile === "object")
          setUserProfile(parsed.userProfile);
        if (parsed.preferences && typeof parsed.preferences === "object") {
          const migratedAccent = String(parsed.preferences.accent || "").toUpperCase() === "#8B5CF6"
            ? DEFAULT_PREFERENCES.accent
            : parsed.preferences.accent;
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...parsed.preferences,
            accent: migratedAccent || DEFAULT_PREFERENCES.accent,
            notifications: {
              ...DEFAULT_PREFERENCES.notifications,
              ...parsed.preferences.notifications,
            },
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setStorageReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    AsyncStorage.setItem(
      APP_STORAGE_KEY,
      JSON.stringify({
        collectionQuantities,
        binders,
        wishlistItems,
        userProfile,
        preferences,
        historyEvents,
        unlockedMilestones,
        completedBinderIds,
        vaultAssets,
        valueSnapshots,
        priceAlerts,
        rawAcquisitions,
      }),
    ).catch(() => {});
  }, [
    collectionQuantities,
    binders,
    wishlistItems,
    userProfile,
    preferences,
    historyEvents,
    unlockedMilestones,
    completedBinderIds,
    vaultAssets,
    valueSnapshots,
    priceAlerts,
    rawAcquisitions,
    storageReady,
  ]);

  const collectionInsights = useMemo(
    () =>
      calculateInsights(
        collectionQuantities,
        CARD_LIBRARY,
        SETS,
        binders,
        wishlistItems,
        getSetRequirements,
      ),
    [collectionQuantities, binders, wishlistItems],
  );
  const vaultPortfolio = useMemo(
    () =>
      calculateVaultPortfolio({
        ownership: collectionQuantities,
        cards: CARD_LIBRARY,
        assets: vaultAssets,
        rawAcquisitions,
        currency: preferences.currency || "EUR",
      }),
    [collectionQuantities, vaultAssets, rawAcquisitions, preferences.currency],
  );
  useEffect(() => {
    if (!storageReady) return;
    const qualified = evaluateMilestones({
      totalPhysical: collectionInsights.totalPhysical,
      binders,
      binderStats: collectionInsights.binderStats,
      vaultAssets,
      vaultValue: vaultPortfolio.totalValue,
      currency: vaultPortfolio.currency,
    });
    const known = new Set(unlockedMilestones.map((item) => item.id));
    const newlyUnlocked = qualified.filter((item) => !known.has(item.id));
    if (!newlyUnlocked.length) return;
    const timestamp = new Date().toISOString();
    setUnlockedMilestones((current) => [
      ...current,
      ...newlyUnlocked.map((item) => ({ id: item.id, unlockedAt: timestamp })),
    ]);
    setHistoryEvents((current) => [
      ...newlyUnlocked.map((item) =>
        createHistoryEvent("milestone-unlocked", {
          milestoneId: item.id,
          milestoneTitle: item.title,
        }),
      ),
      ...current,
    ]);
  }, [
    storageReady,
    collectionInsights,
    binders,
    unlockedMilestones,
    vaultAssets,
    vaultPortfolio,
  ]);

  useEffect(() => {
    if (!storageReady) return;
    setValueSnapshots((current) => {
      const last = current[current.length - 1];
      if (
        last &&
        last.rawValue === vaultPortfolio.rawValue &&
        last.gradedValue === vaultPortfolio.gradedValue &&
        last.sealedValue === vaultPortfolio.sealedValue &&
        last.currency === vaultPortfolio.currency
      )
        return current;
      return [...current, makePortfolioSnapshot(vaultPortfolio)].slice(-1000);
    });
  }, [
    storageReady,
    vaultPortfolio.rawValue,
    vaultPortfolio.gradedValue,
    vaultPortfolio.sealedValue,
    vaultPortfolio.currency,
  ]);

  useEffect(() => {
    if (!storageReady) return;
    const complete = collectionInsights.binderStats.filter(
      (item) => item.total > 0 && item.missing === 0,
    );
    const known = new Set(completedBinderIds);
    const newlyCompleted = complete.filter(
      (item) => !known.has(item.binder.id),
    );
    if (!newlyCompleted.length) return;
    setCompletedBinderIds((current) => [
      ...new Set([...current, ...newlyCompleted.map((item) => item.binder.id)]),
    ]);
    setHistoryEvents((current) => [
      ...newlyCompleted.map((item) =>
        createHistoryEvent("binder-completed", {
          binderId: item.binder.id,
          binderName: item.binder.name,
        }),
      ),
      ...current,
    ]);
  }, [storageReady, collectionInsights.binderStats, completedBinderIds]);

  useEffect(() => {
    if (typeof Appearance.setColorScheme === "function") {
      Appearance.setColorScheme(preferences.theme === "System" ? null : preferences.theme === "Light" ? "light" : "dark");
    }
  }, [preferences.theme]);

  useEffect(() => {
    if (!storageReady) return;
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        if (!user) return;
        setUserProfile((currentProfile) => ({
          ...currentProfile,
          displayName:
            currentProfile.displayName ||
            user.user_metadata?.display_name ||
            user.email?.split("@")[0] ||
            "Collector",
          email: user.email || currentProfile.email,
          avatarUri:
            currentProfile.avatarUri || user.user_metadata?.avatar_url || "",
          createdAt: currentProfile.createdAt || user.created_at || "",
        }));
      })
      .catch(() => {});
  }, [storageReady]);

  useEffect(() => {
    let active = true;
    const openAuthUrl = async (incomingUrl) => {
      if (!incomingUrl || !incomingUrl.startsWith("pokefile://")) return;
      const parameterString = incomingUrl.includes("#")
        ? incomingUrl.split("#")[1]
        : incomingUrl.split("?")[1];
      const parameters = new URLSearchParams(parameterString || "");
      const code = parameters.get("code");
      const accessToken = parameters.get("access_token");
      const refreshToken = parameters.get("refresh_token");
      const isRecovery =
        incomingUrl.includes("reset-password") ||
        parameters.get("type") === "recovery";
      let error = null;
      if (code) ({ error } = await supabase.auth.exchangeCodeForSession(code));
      else if (accessToken && refreshToken)
        ({ error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }));
      if (!error && active) {
        const route = isRecovery ? "ResetPassword" : "AccountVerified";
        setStack([{ route, params: {}, path: buildScreenPath(route) }]);
      } else if (error && active)
        setStack([
          {
            route: "AuthError",
            params: { reason: "reset" },
            path: buildScreenPath("AuthError"),
          },
        ]);
    };

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!active) return;
        if (session) {
          setUserProfile((currentProfile) => ({
            ...currentProfile,
            displayName:
              currentProfile.displayName ||
              session.user.user_metadata?.display_name ||
              session.user.email?.split("@")[0] ||
              "Collector",
            email: session.user.email || currentProfile.email,
            avatarUri:
              currentProfile.avatarUri ||
              session.user.user_metadata?.avatar_url ||
              "",
            createdAt:
              currentProfile.createdAt || session.user.created_at || "",
          }));
          setStack([
            { route: "Home", params: {}, path: buildScreenPath("Home") },
          ]);
        }
        setAuthReady(true);
      })
      .catch(() => {
        if (active) setAuthReady(true);
      });

    Linking.getInitialURL().then(openAuthUrl);
    const linkSubscription = Linking.addEventListener("url", ({ url }) =>
      openAuthUrl(url),
    );
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && active)
          setStack([
            {
              route: "ResetPassword",
              params: {},
              path: buildScreenPath("ResetPassword"),
            },
          ]);
        if (event === "SIGNED_OUT" && active) {
          setUserProfile({
            displayName: "",
            email: "",
            avatarUri: "",
            createdAt: "",
          });
          setStack([
            { route: "Welcome", params: {}, path: buildScreenPath("Welcome") },
          ]);
        }
        if (session?.user && active)
          setUserProfile((currentProfile) => ({
            ...currentProfile,
            displayName:
              currentProfile.displayName ||
              session.user.user_metadata?.display_name ||
              session.user.email?.split("@")[0] ||
              "Collector",
            email: session.user.email || currentProfile.email,
          }));
      },
    );
    return () => {
      active = false;
      linkSubscription.remove();
      authListener.subscription.unsubscribe();
    };
  }, []);

  const current = stack[stack.length - 1];
  useEffect(() => {
    screenEntrance.setValue(0);
    Animated.timing(screenEntrance, {
      toValue: 1,
      duration: preferences.animations === false ? 0 : 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [current.path, preferences.animations, screenEntrance]);
  useEffect(() => {
    stackRef.current = stack;
  }, [stack]);
  const swipeEdge = Math.min(88, Math.max(48, width * 0.22));
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        return gestureState.x0 <= swipeEdge && stackRef.current.length > 1;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const horizontal = Math.abs(gestureState.dx);
        const vertical = Math.abs(gestureState.dy);
        return (
          gestureState.dx > 12 &&
          horizontal > vertical * 1.35 &&
          gestureState.x0 <= swipeEdge &&
          stackRef.current.length > 1
        );
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (_, gestureState) => {
        const shouldGoBack =
          gestureState.dx > Math.min(110, width * 0.28) &&
          Math.abs(gestureState.dy) < 90;
        if (shouldGoBack) {
          setStack((currentStack) =>
            currentStack.length > 1 ? currentStack.slice(0, -1) : currentStack,
          );
        }
      },
      onPanResponderTerminate: () => {},
    }),
  ).current;

  const navigate = (route, params = {}) => {
    if (route === "Menu" || route === "/menu") {
      setMenuOpen(true);
      return;
    }

    const normalizedRoute = resolveRoute(route);
    setMenuOpen(false);
    if (normalizedRoute === "Home" && AUTH_ROUTES.includes(current.route)) {
      setStack([{ route: "Home", params: {}, path: buildScreenPath("Home") }]);
      return;
    }
    setStack((prev) => [
      ...prev,
      {
        route: normalizedRoute,
        params,
        path: buildScreenPath(normalizedRoute, params),
      },
    ]);
  };

  const goBack = () => {
    setMenuOpen(false);
    setStack((prev) =>
      prev.length > 1
        ? prev.slice(0, -1)
        : [{ route: "Home", params: {}, path: buildScreenPath("Home") }],
    );
  };

  const updateCurrentParams = (changes) => {
    setStack((prev) =>
      prev.map((entry, index) =>
        index === prev.length - 1
          ? { ...entry, params: { ...entry.params, ...changes } }
          : entry,
      ),
    );
  };

  const navigateTab = (route) => {
    setMenuOpen(false);
    setStack([{ route, params: {}, path: buildScreenPath(route) }]);
  };

  const addCardToCollection = (cardId) => {
    const key = collectibleKey(cardId);
    setCardQuantity(key, Math.max(1, ownedQuantity(collectionQuantities, key)));
  };
  const setCardQuantity = (cardId, quantity) => {
    const key = collectibleKey(cardId);
    setCollectionQuantities((current) => {
      const oldValue = ownedQuantity(current, key);
      const newValue = Math.max(0, Math.floor(Number(quantity) || 0));
      if (oldValue === newValue) return current;
      const next = { ...current };
      if (newValue > 0) next[key] = newValue;
      else delete next[key];
      const card = getCardById(
        key,
        CARD_LIBRARY.find((item) => collectibleKey(item) === key),
      );
      const type =
        oldValue === 0
          ? "card-added"
          : newValue === 0
            ? "card-removed"
            : "quantity-changed";
      setHistoryEvents((events) => [
        createHistoryEvent(type, {
          collectibleKey: key,
          name: card?.name || key,
          finish: card?.variant || card?.finish,
          oldValue,
          newValue,
        }),
        ...events,
      ]);
      if (
        oldValue === 0 &&
        newValue > 0 &&
        wishlistItems.some((item) => collectibleKey(item) === key)
      ) {
        setHistoryEvents((events) => [
          createHistoryEvent("wishlist-acquired", {
            collectibleKey: key,
            name: card?.name || key,
            finish: card?.variant || card?.finish,
          }),
          ...events,
        ]);
      }
      return next;
    });
  };
  const setCardsCollected = (cardIds, collected) => {
    setCollectionQuantities((current) => {
      const next = { ...current };
      cardIds.forEach((cardId) => {
        if (collected) next[cardId] = Math.max(1, ownedQuantity(next, cardId));
        else delete next[cardId];
      });
      return next;
    });
  };
  const createBinder = (binder) => {
    const normalized = normalizeBinder({
      ...binder,
      id: binder.id || `binder-${Date.now()}`,
    });
    if (normalized.kind === "flex") {
      const existingFlex = getPrimaryFlexBinder(binders);
      setBinders((current) => upsertPrimaryFlexBinder(current, normalized));
      if (!existingFlex)
        setHistoryEvents((current) => [
          createHistoryEvent("binder-created", {
            binderId: normalized.id,
            binderName: normalized.name || normalized.title,
          }),
          ...current,
        ]);
      return;
    }
    setBinders((current) => [...current, normalized]);
    setHistoryEvents((current) => [
      createHistoryEvent("binder-created", {
        binderId: normalized.id,
        binderName: normalized.name || normalized.title,
      }),
      ...current,
    ]);
  };
  const updateBinder = (binderId, changes) => {
    setBinders((current) =>
      current.map((binder) =>
        binder.id === binderId ? { ...binder, ...changes } : binder,
      ),
    );
  };
  const addCardToBinder = (binderId, card) => {
    const key = collectibleKey(card);
    const cardRecord =
      typeof card === "string" ? getCardById(card, null) : card;
    if (!key || !cardRecord) return;
    setBinders((current) =>
      current.map((binder) => {
        if (binder.id !== binderId) return binder;
        return addCollectibleToFreeformBinder(binder, cardRecord);
      }),
    );
  };
  const removeCardFromBinder = (binderId, slotIndex) => {
    setBinders((current) =>
      current.map((binder) => {
        if (binder.id !== binderId) return binder;
        return removeCollectibleFromFreeformBinder(binder, slotIndex);
      }),
    );
  };
  const addRequirementsToWishlist = (requirements) => {
    setWishlistItems((current) =>
      mergeWishlistRequirements(current, requirements),
    );
  };
  const updateWishlistItem = (itemId, changes) => {
    setWishlistItems((current) =>
      current.map((item) =>
        collectibleKey(item) === itemId ? { ...item, ...changes } : item,
      ),
    );
    if (Object.prototype.hasOwnProperty.call(changes, "targetPrice")) {
      const parsedTarget = Number(changes.targetPrice);
      const target =
        changes.targetPrice === "" ||
        changes.targetPrice == null ||
        !Number.isFinite(parsedTarget) ||
        parsedTarget <= 0
          ? null
          : parsedTarget;
      setPriceAlerts((current) =>
        target == null
          ? current.filter((alert) => alert.collectibleId !== itemId)
          : [
              ...current.filter((alert) => alert.collectibleId !== itemId),
              {
                collectibleId: itemId,
                targetPrice: target,
                enabled: true,
                preferredMarket: "scrydex",
                condition: "below-target",
              },
            ],
      );
      setHistoryEvents((current) => [
        createHistoryEvent("wishlist-target-changed", {
          collectibleKey: itemId,
          name: wishlistItems.find((item) => collectibleKey(item) === itemId)
            ?.name,
          newValue: target,
        }),
        ...current,
      ]);
    }
  };
  const removeWishlistItem = (itemId) => {
    setWishlistItems((current) =>
      current.filter((item) => collectibleKey(item) !== itemId),
    );
    setPriceAlerts((current) =>
      current.filter((alert) => alert.collectibleId !== itemId),
    );
  };
  const saveVaultAsset = (asset) => {
    setVaultAssets((current) => {
      const previous = current.find((item) => item.id === asset.id);
      const next = previous
        ? current.map((item) => (item.id === asset.id ? asset : item))
        : [...current, asset];
      const eventType = previous
        ? previous.manualValue?.value !== asset.manualValue?.value
          ? "manual-valuation-changed"
          : previous.quantity !== asset.quantity
            ? "vault-quantity-changed"
            : "purchase-information-updated"
        : asset.type === "graded"
          ? "graded-asset-added"
          : "sealed-asset-added";
      setHistoryEvents((events) => [
        createHistoryEvent(eventType, {
          assetId: asset.id,
          name: asset.name || asset.productName,
          oldValue: previous?.quantity,
          newValue: asset.quantity,
        }),
        ...events,
      ]);
      return next;
    });
  };
  const deleteVaultAsset = (assetId) =>
    setVaultAssets((current) => {
      const asset = current.find((item) => item.id === assetId);
      if (!asset) return current;
      setHistoryEvents((events) => [
        createHistoryEvent(
          asset.type === "graded"
            ? "graded-asset-removed"
            : "sealed-asset-removed",
          { assetId, name: asset.name || asset.productName },
        ),
        ...events,
      ]);
      return current.filter((item) => item.id !== assetId);
    });
  const updateRawAcquisition = (collectibleId, changes) => {
    setRawAcquisitions((current) => ({
      ...current,
      [collectibleId]: { ...(current[collectibleId] || {}), ...changes },
    }));
    setHistoryEvents((current) => [
      createHistoryEvent("purchase-information-updated", {
        collectibleKey: collectibleId,
        name: getCardById(collectibleId, null)?.name,
      }),
      ...current,
    ]);
  };
  const updateUserProfile = (changes) => {
    setUserProfile((currentProfile) => ({ ...currentProfile, ...changes }));
    const metadata = {};
    if (changes.displayName !== undefined)
      metadata.display_name = changes.displayName;
    if (Object.keys(metadata).length)
      supabase.auth.updateUser({ data: metadata }).catch(() => {});
  };
  const updatePreferences = (changes) =>
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      ...changes,
    }));
  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  setThemeSettings({
    ...preferences,
    theme: effectiveTheme,
  });
  const screenProps = {
    navigate,
    goBack,
    updateCurrentParams,
    params: current.params,
    path: current.path,
    collectionQuantities,
    addCardToCollection,
    setCardQuantity,
    setCardsCollected,
    binders,
    createBinder,
    updateBinder,
    addCardToBinder,
    removeCardFromBinder,
    wishlistItems,
    addRequirementsToWishlist,
    updateWishlistItem,
    removeWishlistItem,
    historyEvents,
    unlockedMilestones,
    vaultAssets,
    saveVaultAsset,
    deleteVaultAsset,
    valueSnapshots,
    priceAlerts,
    rawAcquisitions,
    updateRawAcquisition,
    collectionFilters,
    setCollectionFilters,
    setFiltersByKey,
    updateSetFilters,
    logOut,
  };
  const Screen =
    !storageReady || !authReady || !splashMinimumElapsed || !fontsReady
      ? SplashScreen
      : SCREENS[current.route] || HomeScreen;
  const showBottomNav =
    fontsReady &&
    storageReady &&
    authReady &&
    splashMinimumElapsed &&
    !AUTH_ROUTES.includes(current.route);

  return (
    <AppContext.Provider
      value={{ userProfile, updateUserProfile, preferences, updatePreferences, logOut }}
    >
      <SafeAreaProvider>
        <SafeAreaView
          style={[
            styles.safeArea,
            { backgroundColor: effectiveTheme === "Light" ? "#F7F7F9" : "#000000" },
          ]}
          edges={showBottomNav ? ["top"] : ["top", "bottom"]}
        >
          <StatusBar
            key={effectiveTheme}
            barStyle={
              effectiveTheme === "Light" ? "dark-content" : "light-content"
            }
            backgroundColor={effectiveTheme === "Light" ? "#F7F7F9" : "#000000"}
            animated
          />
          <View style={styles.appRoot} {...panResponder.panHandlers}>
            <Animated.View
              style={[
                styles.appRoot,
                {
                  opacity: screenEntrance,
                  transform: [
                    {
                      translateY: screenEntrance.interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Screen {...screenProps} />
            </Animated.View>
          </View>
          {showBottomNav ? (
            <BottomNav
              activeRoute={current.route}
              onNavigate={navigateTab}
              onMenu={() => setMenuOpen(true)}
            />
          ) : null}

          <Modal
            visible={menuOpen}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setMenuOpen(false)}
          >
            <View style={styles.safeArea}>
              <MenuScreen
                navigate={navigate}
                goBack={() => setMenuOpen(false)}
              />
            </View>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  appRoot: { flex: 1 },
});
