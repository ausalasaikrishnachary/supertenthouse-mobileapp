import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Phone, MessageCircle, Mail, Headphones, ChevronRight, Send } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Dimensions_width = Dimensions.get('window').width;

const faqs = [
  { q: 'How do I book a decoration package?', a: 'Browse our packages, select one that fits your needs, customize it with add-ons, and proceed to checkout.' },
  { q: 'What is the cancellation policy?', a: 'Free cancellation up to 7 days before the event. 50% charge within 7 days, full charge within 48 hours.' },
  { q: 'Do you provide installation?', a: 'Yes, professional installation is included with all our products and packages at no extra cost.' },
  { q: 'What areas do you serve?', a: 'We currently serve Bengaluru and surrounding areas within 50km radius. Contact us for other locations.' },
  { q: 'Can I customize my package?', a: 'Absolutely! All packages are fully customizable. Add or remove items based on your requirements.' },
];

export default function SupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([
    { from: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [showChat, setShowChat] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Thank you for your message. Our team will get back to you shortly!' }]);
    }, 1000);
  };

  if (showChat) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setShowChat(false)}>
            <ArrowLeft color={COLORS.neutral[800]} size={24} />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <View style={styles.chatAvatar}><Headphones color={COLORS.white} size={20} /></View>
            <View>
              <Text style={styles.chatName}>Live Chat Support</Text>
              <View style={styles.onlineRow}><View style={styles.onlineDot} /><Text style={styles.onlineText}>Online now</Text></View>
            </View>
          </View>
        </View>

        <FlatList
          data={messages}
          style={{ flex: 1, paddingHorizontal: SPACING.md }}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.msgRow, item.from === 'user' && styles.msgRowUser]}>
              <View style={[styles.msgBubble, item.from === 'user' ? styles.msgBubbleUser : styles.msgBubbleBot]}>
                <Text style={[styles.msgText, item.from === 'user' && styles.msgTextUser]}>{item.text}</Text>
              </View>
            </View>
          )}
        />

        <View style={styles.chatInput}>
          <TextInput style={styles.chatTextInput} placeholder="Type a message..." placeholderTextColor={COLORS.neutral[400]} value={input} onChangeText={setInput} />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Send color={COLORS.white} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={COLORS.neutral[800]} size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Customer Support</Text>
          <Text style={styles.subtitle}>We're here to help 24/7</Text>
        </View>
      </View>

      <View style={styles.contactGrid}>
        <TouchableOpacity style={styles.contactCard} onPress={() => {}}>
          <View style={[styles.contactIcon, { backgroundColor: COLORS.primary[700] }]}>
            <Phone color={COLORS.white} size={24} />
          </View>
          <Text style={styles.contactTitle}>Call Us</Text>
          <Text style={styles.contactDesc}>+91 98765 43210</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactCard} onPress={() => {}}>
          <View style={[styles.contactIcon, { backgroundColor: COLORS.success }]}>
            <MessageCircle color={COLORS.white} size={24} />
          </View>
          <Text style={styles.contactTitle}>WhatsApp</Text>
          <Text style={styles.contactDesc}>Chat with us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactCard} onPress={() => {}}>
          <View style={[styles.contactIcon, { backgroundColor: COLORS.gold[400] }]}>
            <Mail color={COLORS.neutral[900]} size={24} />
          </View>
          <Text style={styles.contactTitle}>Email</Text>
          <Text style={styles.contactDesc}>support@supertent.com</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactCard} onPress={() => setShowChat(true)}>
          <View style={[styles.contactIcon, { backgroundColor: COLORS.primary[500] }]}>
            <Headphones color={COLORS.white} size={24} />
          </View>
          <Text style={styles.contactTitle}>Live Chat</Text>
          <Text style={styles.contactDesc}>Talk to an agent</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.faqSection}>
        <Text style={styles.faqSectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, i) => (
          <TouchableOpacity key={i} style={styles.faqCard}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <ChevronRight color={COLORS.neutral[400]} size={20} />
            </View>
            <Text style={styles.faqA}>{faq.a}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  title: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.neutral[900] },
  subtitle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 2 },
  contactGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, gap: SPACING.md },
  contactCard: { width: (Dimensions_width - SPACING.md * 3) / 2, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.lg, alignItems: 'center', ...SHADOWS.small },
  contactIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  contactTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  contactDesc: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.neutral[500], marginTop: 4, textAlign: 'center' },
  faqSection: { marginTop: SPACING.xl, paddingHorizontal: SPACING.md },
  faqSectionTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.neutral[900], marginBottom: SPACING.md },
  faqCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900], flex: 1 },
  faqA: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.neutral[600], marginTop: 8, lineHeight: 18 },
  chatHeaderInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chatAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary[700], justifyContent: 'center', alignItems: 'center' },
  chatName: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: COLORS.neutral[900] },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  onlineText: { fontSize: 11, fontFamily: 'Inter-Regular', color: COLORS.success },
  msgRow: { flexDirection: 'row', marginVertical: 4 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgBubble: { maxWidth: '75%', paddingHorizontal: SPACING.md, paddingVertical: 10, borderRadius: RADIUS.lg },
  msgBubbleBot: { backgroundColor: COLORS.white, borderBottomLeftRadius: 4, ...SHADOWS.small },
  msgBubbleUser: { backgroundColor: COLORS.primary[700], borderBottomRightRadius: 4 },
  msgText: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[900] },
  msgTextUser: { color: COLORS.white },
  chatInput: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, paddingBottom: 30, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.neutral[100], gap: SPACING.sm },
  chatTextInput: { flex: 1, backgroundColor: COLORS.neutral[100], borderRadius: RADIUS.xl, paddingHorizontal: SPACING.md, height: 44, fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.neutral[900] },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary[700], justifyContent: 'center', alignItems: 'center' },
});
