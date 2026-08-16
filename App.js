import React, { useState, useRef } from 'react';
import { StatusBar, StyleSheet, Modal, View, PanResponder, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './theme';

const { width } = Dimensions.get('window');

// Core
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import SearchScreen from './screens/SearchScreen';
import AllSetsScreen from './screens/AllSetsScreen';
import SeriesViewScreen from './screens/SeriesViewScreen';
import SetDetailScreen from './screens/SetDetailScreen';
import BinderDetailScreen from './screens/BinderDetailScreen'; // also used as "Set Card Grid"
import ChecklistScreen from './screens/ChecklistScreen';
import SetFiltersScreen from './screens/SetFiltersScreen';

// Card
import CardDetailScreen from './screens/CardDetailScreen';
import CardZoomScreen from './screens/CardZoomScreen';
import VariantsScreen from './screens/VariantsScreen';
import AddToCollectionScreen from './screens/AddToCollectionScreen';
import EditOwnedCardScreen from './screens/EditOwnedCardScreen';
import ChooseBinderScreen from './screens/ChooseBinderScreen';

// Binders
import BindersScreen from './screens/BindersScreen';
import BinderSettingsScreen from './screens/BinderSettingsScreen';
import CoverDesignerScreen from './screens/CoverDesignerScreen';

// Wishlist
import WishlistScreen from './screens/WishlistScreen';
import WishlistDetailScreen from './screens/WishlistDetailScreen';

// Collection
import MyCollectionScreen from './screens/MyCollectionScreen';
import CollectionAllScreen from './screens/CollectionAllScreen';
import CollectionFiltersScreen from './screens/CollectionFiltersScreen';
import CollectionOverviewScreen from './screens/CollectionOverviewScreen';

// Profile / Settings
import ProfileScreen from './screens/ProfileScreen';
import AppearanceScreen from './screens/AppearanceScreen';
import LanguageScreen from './screens/LanguageScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import DataSyncScreen from './screens/DataSyncScreen';
import AboutScreen from './screens/AboutScreen';

// States
import LoadingScreen from './screens/states/LoadingScreen';
import EmptyBindersScreen from './screens/states/EmptyBindersScreen';
import EmptyWishlistScreen from './screens/states/EmptyWishlistScreen';
import EmptyCollectionScreen from './screens/states/EmptyCollectionScreen';
import NoSearchResultsScreen from './screens/states/NoSearchResultsScreen';
import OfflineScreen from './screens/states/OfflineScreen';
import ApiErrorScreen from './screens/states/ApiErrorScreen';
import SetCompleteScreen from './screens/states/SetCompleteScreen';
import BinderCompleteScreen from './screens/states/BinderCompleteScreen';
import CardNotOwnedScreen from './screens/states/CardNotOwnedScreen';

// Dev
import DevMenuScreen from './screens/DevMenuScreen';

// Simple in-memory stack navigator — no external navigation library required.
// Screen paths are explicit so the app can navigate by route name or canonical path.
const SCREEN_PATHS = {
  Splash: '/',
  Home: '/home',
  Search: '/search',
  AllSets: '/sets',
  SeriesView: '/series',
  SetDetail: '/sets/:setId',
  SetCardGrid: '/sets/:setId/cards',
  Checklist: '/sets/:setId/checklist',
  SetFilters: '/sets/filters',

  CardDetail: '/cards/:cardId',
  CardZoom: '/cards/:cardId/zoom',
  Variants: '/cards/:cardId/variants',
  AddToCollection: '/cards/:cardId/add-to-collection',
  EditOwnedCard: '/cards/:cardId/edit-owned-card',
  ChooseBinder: '/cards/:cardId/choose-binder',

  Binders: '/binders',
  BinderDetail: '/binders/:binderId',
  BinderSettings: '/binders/:binderId/settings',
  CoverDesigner: '/binders/:binderId/cover',

  Wishlist: '/wishlist',
  WishlistDetail: '/wishlist/:wishlistId',

  MyCollection: '/collection',
  CollectionAll: '/collection/all',
  CollectionFilters: '/collection/filters',
  CollectionOverview: '/collection/overview',

  Profile: '/profile',
  Appearance: '/profile/appearance',
  Language: '/profile/language',
  Notifications: '/profile/notifications',
  DataSync: '/profile/data-sync',
  About: '/about',

  Loading: '/loading',
  EmptyBinders: '/empty/binders',
  EmptyWishlist: '/empty/wishlist',
  EmptyCollection: '/empty/collection',
  NoSearchResults: '/search/no-results',
  Offline: '/offline',
  ApiError: '/error/api',
  SetComplete: '/sets/:setId/complete',
  BinderComplete: '/binders/:binderId/complete',
  CardNotOwned: '/cards/:cardId/not-owned',

  DevMenu: '/dev-menu',
  Menu: '/menu',
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

  Wishlist: WishlistScreen,
  WishlistDetail: WishlistDetailScreen,

  MyCollection: MyCollectionScreen,
  CollectionAll: CollectionAllScreen,
  CollectionFilters: CollectionFiltersScreen,
  CollectionOverview: CollectionOverviewScreen,

  Profile: ProfileScreen,
  Appearance: AppearanceScreen,
  Language: LanguageScreen,
  Notifications: NotificationsScreen,
  DataSync: DataSyncScreen,
  About: AboutScreen,

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
  const template = SCREEN_PATHS[route] || `/${String(route).replace(/([A-Z])/g, '-$1').replace(/^-/, '').toLowerCase()}`;

  return Object.entries(params).reduce((path, [key, value]) => {
    if (value === undefined || value === null) {
      return path;
    }
    return path.replace(`:${key}`, encodeURIComponent(String(value)));
  }, template);
};

const resolveRoute = (route) => {
  if (!route || typeof route !== 'string') {
    return 'Home';
  }

  if (route.startsWith('/')) {
    const normalized = route.replace(/\/+$/, '') || '/';
    const match = Object.entries(SCREEN_PATHS).find(([, path]) => {
      const template = path.replace(/\/+$/, '') || '/';
      if (template === normalized) {
        return true;
      }

      const templateParts = template.split('/');
      const actualParts = normalized.split('/');
      if (templateParts.length !== actualParts.length) {
        return false;
      }

      return templateParts.every((part, index) => part.startsWith(':') || part === actualParts[index]);
    });

    return match ? match[0] : 'Home';
  }

  return route;
};

export default function App() {
  const [stack, setStack] = useState([{ route: 'Home', params: {}, path: buildScreenPath('Home') }]);
  const [menuOpen, setMenuOpen] = useState(false);

  const current = stack[stack.length - 1];
  const swipeEdge = Math.min(64, Math.max(32, width * 0.18));
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        return gestureState.x0 <= swipeEdge && stack.length > 1;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const horizontal = Math.abs(gestureState.dx);
        const vertical = Math.abs(gestureState.dy);
        return horizontal > 40 && horizontal > vertical * 1.2 && gestureState.x0 <= swipeEdge && stack.length > 1;
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldGoBack = gestureState.dx > 100 && Math.abs(gestureState.dy) < 100;
        if (shouldGoBack) {
          goBack();
        }
      },
    })
  ).current;

  const navigate = (route, params = {}) => {
    if (route === 'Menu' || route === '/menu') {
      setMenuOpen(true);
      return;
    }

    const normalizedRoute = resolveRoute(route);
    setMenuOpen(false);
    setStack((prev) => [
      ...prev,
      { route: normalizedRoute, params, path: buildScreenPath(normalizedRoute, params) },
    ]);
  };

  const goBack = () => {
    setMenuOpen(false);
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const screenProps = { navigate, goBack, params: current.params, path: current.path };
  const Screen = SCREENS[current.route] || HomeScreen;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <View style={styles.appRoot} {...panResponder.panHandlers}>
          <Screen {...screenProps} />
        </View>

        <Modal
          visible={menuOpen}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setMenuOpen(false)}
        >
          <View style={styles.safeArea}>
            <MenuScreen navigate={navigate} goBack={() => setMenuOpen(false)} />
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  appRoot: { flex: 1 },
});
