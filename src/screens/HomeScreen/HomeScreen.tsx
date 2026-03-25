import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useI18n} from '@hooks/useI18n';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// ────────────────────────────────────────────
// Skeleton
// ────────────────────────────────────────────
const SkeletonBox = ({
  w,
  h,
  r = 8,
  style,
}: {
  w: number | 'full';
  h: number;
  r?: number;
  style?: any;
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {toValue: 1, duration: 800, useNativeDriver: false}),
        Animated.timing(shimmer, {toValue: 0, duration: 800, useNativeDriver: false}),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  const bg = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ECECEC', '#F7F7F7'],
  });

  return (
    <Animated.View
      style={[
        {
          width: w === 'full' ? '100%' : w,
          height: h,
          borderRadius: r,
          backgroundColor: bg,
        },
        style,
      ]}
    />
  );
};

const HomeSkeleton = () => (
  <ScrollView
    style={styles.flex}
    contentContainerStyle={styles.scrollPad}
    showsVerticalScrollIndicator={false}>
    {/* Header */}
    <View style={styles.header}>
      <View style={{flex: 1}}>
        <SkeletonBox w={100} h={12} r={4} />
        <SkeletonBox w={200} h={20} r={4} style={{marginTop: 8}} />
      </View>
      <SkeletonBox w={44} h={44} r={22} />
    </View>

    {/* Weekly */}
    <SkeletonBox w="full" h={76} r={12} style={{marginTop: 20, marginHorizontal: 16}} />

    {/* Categories */}
    <View style={styles.catRow}>
      {[80, 70, 90, 60].map((cw, i) => (
        <SkeletonBox key={i} w={cw} h={36} r={18} />
      ))}
    </View>

    {/* Today's Plan banner */}
    <SkeletonBox w="full" h={140} r={16} style={{marginTop: 20, marginHorizontal: 16}} />

    {/* Section */}
    <View style={styles.sectionRow}>
      <SkeletonBox w={130} h={16} r={4} />
      <SkeletonBox w={60} h={12} r={4} />
    </View>

    {/* Workout cards */}
    <View style={styles.cardsGrid}>
      {[0, 1].map(i => (
        <View key={i} style={{width: CARD_WIDTH}}>
          <SkeletonBox w={CARD_WIDTH} h={140} r={12} />
          <SkeletonBox w={CARD_WIDTH - 30} h={13} r={4} style={{marginTop: 10}} />
          <SkeletonBox w={CARD_WIDTH - 60} h={11} r={4} style={{marginTop: 6}} />
        </View>
      ))}
    </View>

    {/* Section 2 */}
    <View style={styles.sectionRow}>
      <SkeletonBox w={150} h={16} r={4} />
    </View>

    {/* Horizontal cards */}
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 16, gap: 12}}>
      {[0, 1, 2].map(i => (
        <View key={i}>
          <SkeletonBox w={220} h={130} r={12} />
          <SkeletonBox w={160} h={13} r={4} style={{marginTop: 8}} />
          <SkeletonBox w={100} h={11} r={4} style={{marginTop: 4}} />
        </View>
      ))}
    </ScrollView>
  </ScrollView>
);

// ────────────────────────────────────────────
// Staggered fade-in per section
// ────────────────────────────────────────────
const FadeInSection = ({delay, children}: {delay: number; children: React.ReactNode}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {toValue: 1, duration: 400, useNativeDriver: true}),
        Animated.timing(translateY, {toValue: 0, duration: 400, useNativeDriver: true}),
      ]).start();
    }, delay);
    return () => clearTimeout(t);
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={{opacity, transform: [{translateY}]}}>
      {children}
    </Animated.View>
  );
};

// ────────────────────────────────────────────
// Data
// ────────────────────────────────────────────
const CATEGORIES = [
  {id: '1', label: 'Tümü'},
  {id: '2', label: 'Güç'},
  {id: '3', label: 'Kardiyo'},
  {id: '4', label: 'Esneklik'},
  {id: '5', label: 'HIIT'},
];

const DAILY_PLAN = {
  title: 'Bugünün Antrenmanı',
  subtitle: 'Üst Vücut & Core',
  duration: '45 dk',
  calories: '320 kcal',
  exercises: 8,
};

const WORKOUTS = [
  {
    id: '1',
    title: 'Göğüs & Triceps',
    duration: '40 dk',
    level: 'Orta',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Bacak Günü',
    duration: '50 dk',
    level: 'Zor',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Sırt & Biceps',
    duration: '45 dk',
    level: 'Orta',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    title: 'Omuz & Trapez',
    duration: '35 dk',
    level: 'Kolay',
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400&h=300&fit=crop',
  },
];

const QUICK_WORKOUTS = [
  {
    id: 'q1',
    title: '7 Dakika HIIT',
    duration: '7 dk',
    image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=400&h=260&fit=crop',
  },
  {
    id: 'q2',
    title: 'Sabah Yoga',
    duration: '15 dk',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=260&fit=crop',
  },
  {
    id: 'q3',
    title: 'Core Güçlendirme',
    duration: '20 dk',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=260&fit=crop',
  },
];

const WEEKLY_STATS = [
  {day: 'Pzt', done: true},
  {day: 'Sal', done: true},
  {day: 'Çar', done: true},
  {day: 'Per', done: false},
  {day: 'Cum', done: false},
  {day: 'Cmt', done: false},
  {day: 'Paz', done: false},
];

// ────────────────────────────────────────────
// Content
// ────────────────────────────────────────────
const HomeContent = () => {
  const [activeCat, setActiveCat] = useState('1');

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <FadeInSection delay={0}>
        <View style={styles.header}>
          <View style={{flex: 1}}>
            <Text style={styles.greeting}>Merhaba 👋</Text>
            <Text style={styles.headerTitle}>Antrenman zamanı!</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>H</Text>
          </View>
        </View>
      </FadeInSection>

      {/* Weekly progress */}
      <FadeInSection delay={80}>
        <View style={styles.weekRow}>
          {WEEKLY_STATS.map((d, i) => (
            <View key={i} style={styles.weekItem}>
              <View style={[styles.weekDot, d.done && styles.weekDotDone]}>
                {d.done && <Text style={styles.weekCheck}>✓</Text>}
              </View>
              <Text style={[styles.weekDay, d.done && styles.weekDayDone]}>
                {d.day}
              </Text>
            </View>
          ))}
        </View>
      </FadeInSection>

      {/* Categories */}
      <FadeInSection delay={160}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[styles.catChip, activeCat === c.id && styles.catChipActive]}
              onPress={() => setActiveCat(c.id)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.catText,
                  activeCat === c.id && styles.catTextActive,
                ]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </FadeInSection>

      {/* Today's Plan */}
      <FadeInSection delay={240}>
        <TouchableOpacity style={styles.todayCard} activeOpacity={0.85}>
          <View style={styles.todayContent}>
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>GÜNLÜK PLAN</Text>
            </View>
            <Text style={styles.todayTitle}>{DAILY_PLAN.subtitle}</Text>
            <View style={styles.todayMeta}>
              <Text style={styles.todayMetaItem}>⏱ {DAILY_PLAN.duration}</Text>
              <Text style={styles.todayMetaItem}>🔥 {DAILY_PLAN.calories}</Text>
              <Text style={styles.todayMetaItem}>💪 {DAILY_PLAN.exercises} hareket</Text>
            </View>
          </View>
          <View style={styles.todayStart}>
            <Text style={styles.todayStartText}>Başla</Text>
          </View>
        </TouchableOpacity>
      </FadeInSection>

      {/* Workouts header */}
      <FadeInSection delay={320}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Antrenmanlar</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Tümü</Text>
          </TouchableOpacity>
        </View>
      </FadeInSection>

      {/* Workout cards — each card fades in individually */}
      <View style={styles.cardsGrid}>
        {WORKOUTS.map((w, i) => (
          <FadeInSection key={w.id} delay={400 + i * 100}>
            <TouchableOpacity style={styles.workoutCard} activeOpacity={0.8}>
              <Image source={{uri: w.image}} style={styles.workoutImage} />
              <View style={styles.workoutOverlay}>
                <Text style={styles.workoutLevel}>{w.level}</Text>
              </View>
              <Text style={styles.workoutTitle} numberOfLines={1}>{w.title}</Text>
              <Text style={styles.workoutDuration}>{w.duration}</Text>
            </TouchableOpacity>
          </FadeInSection>
        ))}
      </View>

      {/* Quick workouts header */}
      <FadeInSection delay={820}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Hızlı Antrenmanlar</Text>
        </View>
      </FadeInSection>

      {/* Quick workouts list */}
      <FadeInSection delay={900}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRow}>
          {QUICK_WORKOUTS.map(q => (
            <TouchableOpacity key={q.id} style={styles.quickCard} activeOpacity={0.8}>
              <Image source={{uri: q.image}} style={styles.quickImage} />
              <View style={styles.quickDuration}>
                <Text style={styles.quickDurationText}>{q.duration}</Text>
              </View>
              <Text style={styles.quickTitle} numberOfLines={1}>{q.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </FadeInSection>

      <View style={{height: 100}} />
    </ScrollView>
  );
};

// ────────────────────────────────────────────
// Main
// ────────────────────────────────────────────
const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const skeletonOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(skeletonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsLoading(false));
    }, 1500);
    return () => clearTimeout(t);
  }, [skeletonOpacity]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      {isLoading ? (
        <Animated.View style={[styles.flex, {opacity: skeletonOpacity}]}>
          <HomeSkeleton />
        </Animated.View>
      ) : (
        <HomeContent />
      )}
    </SafeAreaView>
  );
};

// ────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  flex: {
    flex: 1,
  },
  scrollPad: {
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    marginTop: 2,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1EB7A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
  },

  // Weekly progress
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  weekItem: {
    alignItems: 'center',
    gap: 6,
  },
  weekDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDotDone: {
    backgroundColor: '#1EB7A7',
  },
  weekCheck: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  weekDay: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  weekDayDone: {
    color: '#1EB7A7',
  },

  // Categories
  catRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 18,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  catChipActive: {
    backgroundColor: '#1EB7A7',
  },
  catText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  catTextActive: {
    color: '#FFF',
  },

  // Today card
  todayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
  },
  todayContent: {
    flex: 1,
  },
  todayBadge: {
    backgroundColor: '#1EB7A7',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  todayBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  todayTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 10,
    letterSpacing: -0.3,
  },
  todayMeta: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 12,
  },
  todayMetaItem: {
    color: '#AAA',
    fontSize: 12,
    fontWeight: '500',
  },
  todayStart: {
    backgroundColor: '#1EB7A7',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  todayStartText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // Section
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1EB7A7',
  },

  // Workout cards grid
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  workoutCard: {
    width: CARD_WIDTH,
  },
  workoutImage: {
    width: CARD_WIDTH,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  workoutOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  workoutLevel: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  workoutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginTop: 8,
  },
  workoutDuration: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginTop: 2,
  },

  // Quick workouts
  quickRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  quickCard: {
    width: 200,
  },
  quickImage: {
    width: 200,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  quickDuration: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#1EB7A7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  quickDurationText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginTop: 8,
  },
});

export default HomeScreen;
