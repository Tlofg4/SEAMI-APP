import React, { useMemo, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BottomNavProps {
  /** Optional: override visibility */
  visible?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ visible = true }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Route detection compatible with expo-router and react-navigation
  const pathname = usePathname();
  const route = useRoute();

  const currentKey = useMemo(() => {
    // Prefer pathname when available (expo-router)
    const path = pathname || '';
    if (path.includes('dashboard-teacher') || path.endsWith('/teacher') || route?.name === 'teacher' || route?.name === 'dashboard-teacher') {
      return 'teacher';
    }
    if (path.includes('dashboard') || route?.name === 'dashboard') {
      return 'dashboard';
    }
    if (path.includes('profile') || route?.name === 'profile') {
      return 'profile';
    }
    return 'other';
  }, [pathname, route?.name]);

  // Animated scale for center button
  const scale = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
      friction: 5,
      tension: 120,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 120,
    }).start();
  };

  if (!visible) return null;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}> 
      {/* Left: Home */}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/dashboard')}
        style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}
      >
        <Ionicons name="home-outline" size={26} color="#111827" />
      </Pressable>

      {/* Center: dynamic icon with animated scale */}
      <Animated.View style={[styles.centerWrapper, { transform: [{ scale }] }]}> 
        <Pressable
          accessibilityRole="button"
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => {
            // Example action for center button
            if (currentKey === 'teacher') {
              // Could open creation flow or navigate accordingly
              router.push('/dashboard-teacher');
            } else {
              router.push('/dashboard');
            }
          }}
          style={({ pressed }) => [styles.centerButton, pressed && styles.centerPressed]}
        >
          {currentKey === 'teacher' ? (
            <Ionicons name="add" size={30} color="#ffffff" />
          ) : (
            <MaterialCommunityIcons name="meditation" size={30} color="#ffffff" />
          )}
        </Pressable>
      </Animated.View>

      {/* Right: Profile */}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/profile')}
        style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}
      >
        <Ionicons name="person-circle-outline" size={26} color="#111827" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 12,
    // Soft shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
      default: {
        // web
        shadowColor: '#00000014',
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 12 },
        shadowRadius: 24,
      },
    }),
  },
  tabButton: {
    width: 56,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  centerWrapper: {
    position: 'relative',
    top: -18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 72,
    height: 72,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  centerPressed: {
    opacity: 0.95,
  },
});

export default BottomNav;