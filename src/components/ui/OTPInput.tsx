import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Keyboard,
  Platform,
  Animated
} from 'react-native';
import { DESIGN_SYSTEM } from '../../styles/designSystem';

interface OTPInputProps {
  code: string;
  setCode: (code: string) => void;
  onFull: (code: string) => void;
  length?: number;
}

export const OTPInput: React.FC<OTPInputProps> = ({ code, setCode, onFull, length = 6 }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputs = useRef<(TextInput | null)[]>([]);
  const pulseAnims = useRef<Animated.Value[]>(
    new Array(length).fill(null).map(() => new Animated.Value(1))
  );

  // Auto-focus the first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputs.current[0]?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Sync external code state if changed (e.g. on paste)
  useEffect(() => {
    if (code.length === length) {
      setOtp(code.split(''));
    }
  }, [code, length]);

  // Pulse animation for focused box
  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < length) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnims.current[focusedIndex], {
            toValue: 1.05,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnims.current[focusedIndex], {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [focusedIndex, length]);

  const handleChange = (text: string, index: number) => {
    // Handle paste of full OTP code
    if (text.length > 1) {
      const digits = text.replace(/\D/g, '').slice(0, length).split('');
      const newOtp = new Array(length).fill('');
      digits.forEach((d, i) => { newOtp[i] = d; });
      setOtp(newOtp);
      const fullCode = newOtp.join('');
      setCode(fullCode);
      if (fullCode.length === length) {
        onFull(fullCode);
        Keyboard.dismiss();
      } else {
        inputs.current[digits.length]?.focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);
    const fullCode = newOtp.join('');
    setCode(fullCode);

    // Auto-advance to next box
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (fullCode.length === length && !fullCode.includes('')) {
      onFull(fullCode);
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move back and clear previous
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        setCode(newOtp.join(''));
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  // Split into two groups of 3 for cognitive chunking
  const midpoint = Math.floor(length / 2);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* First group of 3 */}
        <View style={styles.group}>
          {otp.slice(0, midpoint).map((digit, index) => (
            <Animated.View
              key={index}
              style={[
                { transform: [{ scale: focusedIndex === index ? pulseAnims.current[index] : 1 }] }
              ]}
            >
              <TextInput
                ref={(ref) => { inputs.current[index] = ref; }}
                style={[
                  styles.input,
                  digit ? styles.inputFilled : null,
                  focusedIndex === index ? styles.inputFocused : null,
                ]}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                keyboardType="number-pad"
                maxLength={1}
                textContentType="oneTimeCode"
                autoComplete={Platform.OS === 'web' ? ('one-time-code' as any) : undefined}
                selectionColor={DESIGN_SYSTEM.COLORS.PRIMARY}
                caretHidden={true}
              />
            </Animated.View>
          ))}
        </View>

        {/* Center gap separator */}
        <View style={styles.separator}>
          <View style={styles.separatorDot} />
        </View>

        {/* Second group of 3 */}
        <View style={styles.group}>
          {otp.slice(midpoint).map((digit, realIndex) => {
            const index = realIndex + midpoint;
            return (
              <Animated.View
                key={index}
                style={[
                  { transform: [{ scale: focusedIndex === index ? pulseAnims.current[index] : 1 }] }
                ]}
              >
                <TextInput
                  ref={(ref) => { inputs.current[index] = ref; }}
                  style={[
                    styles.input,
                    digit ? styles.inputFilled : null,
                    focusedIndex === index ? styles.inputFocused : null,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  keyboardType="number-pad"
                  maxLength={1}
                  textContentType="oneTimeCode"
                  autoComplete={Platform.OS === 'web' ? ('one-time-code' as any) : undefined}
                  selectionColor={DESIGN_SYSTEM.COLORS.PRIMARY}
                  caretHidden={true}
                />
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const BOX_SIZE = 52;

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: DESIGN_SYSTEM.SPACING.L,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: {
    flexDirection: 'row',
    gap: 8,
  },
  separator: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DESIGN_SYSTEM.COLORS.BORDER,
  },
  input: {
    width: BOX_SIZE,
    height: BOX_SIZE + 8,
    borderWidth: 2,
    borderColor: DESIGN_SYSTEM.COLORS.BORDER,
    borderRadius: DESIGN_SYSTEM.RADIUS.M,
    backgroundColor: DESIGN_SYSTEM.COLORS.SURFACE,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  inputFilled: {
    borderColor: DESIGN_SYSTEM.COLORS.PRIMARY,
    backgroundColor: '#EEF2FF',
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
  },
  inputFocused: {
    borderColor: DESIGN_SYSTEM.COLORS.PRIMARY,
    borderWidth: 2.5,
    shadowColor: DESIGN_SYSTEM.COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
});
