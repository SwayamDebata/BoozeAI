import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  ImageBackground,
  SafeAreaView,
  Animated,
  Easing,
  Image
} from 'react-native';
import LottieView from 'lottie-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { knowledgeData } from '../data/knowledgeData';

const { width } = Dimensions.get('window');

// --- Components ---

const SectionHeader = ({ title, subtitle }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionHeaderTitle}>{title}</Text>
    <Text style={styles.sectionHeaderSubtitle}>{subtitle}</Text>
  </View>
);

const SpiritCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.spiritCard, { backgroundColor: item.color + '20' }]} // 20% opacity using hex
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.spiritCardContent}>
        <View style={styles.lottieContainer}>
          <LottieView
            source={item.animation}
            autoPlay
            loop
            style={styles.spiritLottie}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.spiritTitle, { color: item.color }]}>{item.title}</Text>
        <Text style={styles.spiritDesc} numberOfLines={1}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const GarnishCard = ({ item }) => (
  <View style={styles.garnishCard}>
    <LottieView
      source={item.animation}
      autoPlay
      loop
      style={styles.garnishLottie}
    />
    <View style={styles.garnishTextContainer}>
      <Text style={styles.garnishTitle}>{item.title}</Text>
      <Text style={styles.garnishText}>{item.text}</Text>
    </View>
  </View>
);

const BasicCard = ({ item, onPress }) => (
  <TouchableOpacity 
    style={[styles.basicCard, { borderColor: item.color }]}
    onPress={() => onPress(item)}
    activeOpacity={0.8}
  >
    <View style={[styles.basicIconContainer, { backgroundColor: item.color + '20' }]}>
      {item.animation ? (
        <LottieView
          source={item.animation}
          autoPlay
          loop
          style={{ width: 60, height: 60 }}
          resizeMode="contain"
        />
      ) : (
        <MaterialCommunityIcons name={item.icon} size={32} color={item.color} />
      )}
    </View>
    <Text style={[styles.basicTitle, { color: item.color }]}>{item.title}</Text>
    <Text style={styles.basicText} numberOfLines={3}>{item.text}</Text>
  </TouchableOpacity>
);

const FamilyCard = ({ item }) => (
  <View style={[styles.familyCard, { backgroundColor: item.color }]}>
    <View style={styles.familyLottieContainer}>
        <LottieView
            source={item.animation}
            autoPlay
            loop
            style={styles.familyLottie}
            resizeMode="contain"
          />
    </View>
    <View style={{zIndex: 1}}>
      <Text style={styles.familyTitle}>{item.title}</Text>
      <Text style={styles.familySubtitle}>{item.subtitle}</Text>
      <Text style={styles.familyText}>{item.text}</Text>
    </View>
  </View>
);

const SurvivalTip = ({ item }) => (
  <View style={styles.survivalCard}>
    <View style={styles.survivalIcon}>
      <LottieView
        source={item.animation}
        autoPlay
        loop
        style={{ width: 60, height: 60 }}
      />
    </View>
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Text style={styles.survivalTitle}>{item.title}</Text>
      <Text style={styles.survivalText}>{item.text}</Text>
    </View>
  </View>
);

const DetailModal = ({ visible, item, onClose }) => {
  if (!item) return null;
  
  // Determine content specific to Spirits vs Basics
  const isSpirit = !!item.animation; 
  const isBasic = !item.animation;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingBottom: 50 }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image 
              source={require('../../assets/Close.png')} 
              style={{ width: 30, height: 30, tintColor: '#fff' }} 
            />
          </TouchableOpacity>
          
          <View style={styles.modalHeader}>
             {isSpirit ? (
               <LottieView
                source={item.animation}
                autoPlay
                loop
                style={{ width: 150, height: 150 }}
              />
             ) : (
                <View style={[styles.basicIconContainer, { backgroundColor: item.color + '20', width: 100, height: 100, borderRadius: 50, marginBottom: 15 }]}>
                  <MaterialCommunityIcons name={item.icon} size={50} color={item.color} />
                </View>
             )}
            <Text style={[styles.modalTitle, { color: item.color }]}>{item.title}</Text>
            {/* Description hidden in modal header to avoid redundancy/bad UX as per request */}
          </View>
          
          <ScrollView style={styles.modalBody}>
             <Text style={styles.sectionLabel}>{isBasic ? 'THE KNOWLEDGE' : 'THE BASICS'}</Text>
             <Text style={styles.modalDescription}>
               {item.details || item.text}
             </Text>
             
             {item.mixers && (
               <>
                 <Text style={[styles.sectionLabel, { marginTop: 20 }]}>PERFECT MIXERS</Text>
                 <View style={styles.pillsContainer}>
                   {item.mixers.map((mixer, index) => (
                     <View key={index} style={[styles.pill, { borderColor: item.color }]}>
                       <Text style={[styles.pillText, { color: item.color }]}>{mixer}</Text>
                     </View>
                   ))}
                 </View>
               </>
             )}
             
             <View style={{height: 40}} /> 
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default function KnowledgeHubScreen() {
  const [selectedSpirit, setSelectedSpirit] = useState(null);

  const renderHeader = () => (
    <View>
      <View style={styles.heroContainer}>
        <LottieView
          source={require('../../assets/beachvacation.json')}
          autoPlay
          loop
          style={styles.heroLottie}
        />
        <View style={{position: 'absolute', top: 60, left: 30, right: 20}}>
            <Text style={styles.heroTitle}>Mixology</Text>
            <Text style={styles.heroTitleAccent}>Masterclass</Text>
            <Text style={styles.heroSubtitle}>Become the bartender your friends love.</Text>
        </View>
      </View>

      <SectionHeader title="The Spirit Library" subtitle="Know your bottles" />
      <FlatList
        data={knowledgeData.spirits}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, paddingBottom: 20 }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <SpiritCard item={item} onPress={setSelectedSpirit} />
        )}
      />

      <SectionHeader title="Cocktail Families" subtitle="The 3 Pillars of Mixology" />
      <FlatList
        data={knowledgeData.families}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, paddingBottom: 20 }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <FamilyCard item={item} />}
      />

      <SectionHeader title="Bartender Basics" subtitle="Techniques & Tools" />
      <FlatList
        data={knowledgeData.basics}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, paddingBottom: 20 }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BasicCard item={item} onPress={setSelectedSpirit} />
        )}
      />

      <SectionHeader title="The Secret Sauce" subtitle="Level up your game" />
      <FlatList
        data={knowledgeData.secrets}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, paddingBottom: 20 }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BasicCard item={item} onPress={setSelectedSpirit} />
        )}
      />

      <SectionHeader title="Garnish & Glass" subtitle="The finishing touches" />
      <FlatList 
        data={knowledgeData.garnishes}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, paddingBottom: 20 }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <GarnishCard item={item} />}
      />

       <SectionHeader title="Survival Guide" subtitle="Drink smart, live long" />
       <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
          {knowledgeData.survival.map((item, index) => (
            <SurvivalTip key={index} item={item} />
          ))}
       </View>
    </View>
  );

  return (
    <View style={styles.container}>
       <FlatList 
         data={[]} // Using ListHeaderComponent for main content to enable full page scroll
         renderItem={null}
         ListHeaderComponent={renderHeader}
         showsVerticalScrollIndicator={false}
       />
       <DetailModal 
         visible={!!selectedSpirit} 
         item={selectedSpirit} 
         onClose={() => setSelectedSpirit(null)} 
       />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16162c',
  },
  heroContainer: {
    height: 260,
    backgroundColor: '#1C1C3A',
    justifyContent: 'center',
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    position: 'relative'
  },
  heroLottie: {
    width: 300,
    height: 300,
    position: 'absolute',
    right: -50,
    bottom: -40,
    opacity: 1,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  heroTitleAccent: {
    fontSize: 38,
    fontWeight: '800',
    color: '#E94560', // Neon Red/Pink
    letterSpacing: 1,
    lineHeight: 45,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 10,
    fontWeight: '500',
    maxWidth: '60%', 
  },
  sectionHeaderContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionHeaderSubtitle: {
    fontSize: 14,
    color: '#6e6e91',
    marginTop: 2,
  },
  // Spirit Card
  spiritCard: {
    width: 200,
    height: 260,
    borderRadius: 24,
    marginRight: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#3D3D64',
    justifyContent: 'flex-end',
  },
  spiritCardContent: {
    alignItems: 'center',
  },
  lottieContainer: {
    position: 'absolute',
    top: -140, 
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spiritLottie: {
    width: '100%',
    height: '100%',
  },
  spiritTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 60, // Space for the lottie
    textAlign: 'center',
  },
  spiritDesc: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  // Garnish Card
  garnishCard: {
    width: 160,
    height: 180,
    backgroundColor: '#252542',
    borderRadius: 20,
    marginRight: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3D3D64',
  },
  garnishLottie: {
    width: 80,
    height: 80,
  },
  garnishTextContainer: {
    alignItems: 'center',
  },
  garnishTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  garnishText: {
    fontSize: 12,
    color: '#A8A8A8',
    textAlign: 'center',
  },
  // Survival
  survivalCard: {
    flexDirection: 'row',
    backgroundColor: '#22223b',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#8e44ad',
  },
  survivalIcon: {
    marginRight: 15,
  },
  survivalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  survivalText: {
    fontSize: 13,
    color: '#B0B0B0',
    lineHeight: 18,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E30',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '85%',
    padding: 25,
  },
  
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalBody: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6e6e91',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#E0E0E0',
    lineHeight: 24,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Basic Card
  basicCard: {
    width: 180,
    height: 160,
    backgroundColor: '#252542',
    borderRadius: 20,
    marginRight: 15,
    padding: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basicIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  basicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  basicText: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Family Card
  familyCard: {
    width: 250,
    height: 150,
    borderRadius: 20,
    marginRight: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative'
  },
  familyLottieContainer: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 140,
    height: 140,
    opacity: 0.4
  },
  familyLottie: {
    width: '100%',
    height: '100%',
  },
  familyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 2,
    width: 160
  },
  familySubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    fontStyle: 'italic',
     width: 160
  },
  familyText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 16,
    width: 160
  },
});
