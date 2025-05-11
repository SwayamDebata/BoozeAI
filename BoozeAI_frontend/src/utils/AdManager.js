import { AppOpenAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.APP_OPEN
  : 'ca-app-pub-4693002133615714/4360706356'; // Replace with your actual App Open Ad unit

let appOpenAd = null;
let unsubscribe = null;

const loadAppOpenAd = ({ onAdLoaded, onAdClosed }) => {
  if (appOpenAd) {
    unsubscribe(); // Clean up if ad is already loaded
  }

  // Create the ad if it's not already created
  appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  unsubscribe = appOpenAd.onAdEvent((type) => {
    if (type === AdEventType.LOADED) {
      onAdLoaded?.();
    } else if (type === AdEventType.CLOSED) {
      onAdClosed?.();
    }
  });

  appOpenAd.load();

  return () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };
};

const showAppOpenAd = () => {
  if (appOpenAd && appOpenAd.loaded) {
    appOpenAd.show();
  }
};

export default {
  loadAppOpenAd,
  showAppOpenAd,
};
