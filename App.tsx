import { StatusBar } from 'expo-status-bar';
import ColorPicker from 'react-native-wheel-color-picker'
import { useRef, useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, SafeAreaView, Animated, Pressable, Modal } from 'react-native';
import ColorView from 'src/components/colorView';
import { closeEnough, colorsAreEqual, generateGrayscale, generateRandomTarget, printRGB, rgbPercentageDiff, rgbToHex } from 'src/utils/colors';
import hexRgb from 'hex-rgb';
import Slider from '@react-native-community/slider';

const SWATCH_DISTANCE = 20;
const END_SWATCH_DISTANCE = -40;
const GREEN = '#0cab00';
const GRAY_BG = '#eee';
const TRIANGLE_WIDTH = 15;
const STARTING_HEALTH = 10;

export default function App() {
  console.log('Bug fixes');
  const [health, setHealth] = useState(STARTING_HEALTH);
  const [grayscaleMode, setGrayscaleMode] = useState(true);
  const [guessedColor, setGuessedColor] = useState(hexRgb('#000'));
  const [justGuessed, setJustGuessed] = useState(false);
  const [percentageDiff, setPercentageDiff] = useState(-1); 
  const [targetColor, setTargetColor] = useState(generateRandomTarget(grayscaleMode));
  const [targetsCount, setTargetsCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const swatchDistance= useRef(new Animated.Value(SWATCH_DISTANCE)).current;
  
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    if(window?.document?.body?.style != null)
      document.body.style.overflow = 'hidden';
  }, []);

  const reset = () => {
    setJustGuessed(false);
    setPercentageDiff(-1);

    setTargetColor(generateRandomTarget(grayscaleMode));
    Animated.timing(swatchDistance, {
      toValue: SWATCH_DISTANCE,
      duration: 0,
      useNativeDriver: false
    }).start();
    
    setHealth(STARTING_HEALTH);
    setTargetsCount(0);
    setGameOver(false);
  };
  
  useEffect(() => {
    reset();
  }, [grayscaleMode]);

  const updateHealth = (diff:number) => {
    if(roundsToZero(diff)) {
      return;
    }
    setHealth(old => {
      return old - Math.abs(Math.round(diff));
    });
  };
  
  const roundsToZero = (diff:number) => {
     return Math.round(diff) === 0;
  }
  
  const perfectGuess = colorsAreEqual(guessedColor, targetColor);
  const nearlyPerfect = roundsToZero(percentageDiff)  && !perfectGuess;
  const notPerfectOrNearlyPerfect = perfectGuess || nearlyPerfect;
  const targetMsg = targetsCount >= 1 ? `Target #${targetsCount + 1}: ` : 'Target: ';

  useEffect(() => {
    if(health <= 0) {
      setGameOver(true);
    }
  }, [health]);
  
  const bottomContainerEl = () => {
    if (gameOver) return <View style={styles.headerContainer}>
      <Text style={styles.headerText}> All Health Depleted! </Text>
      <View style={styles.playAgain}>
      <Button title='Play Again' onPress={() => setModalVisible(true)} />
      </View>
    </View>

    return <View style={styles.bottomContainer}>
      <Pressable
        onPress={(e) => {e.preventDefault();}}
        style={{
        display: 'flex',
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200, width: '100%'
      }}>
        {grayscaleMode &&
          <Slider
            style={{ width: '100%', marginBottom: 0, height: 30 }}
            minimumValue={0}
            maximumValue={255}
            step={1}
            onValueChange={(x) => {
              setGuessedColor(generateGrayscale(x));
            }}
          />}
        {!grayscaleMode &&
          <ColorPicker
            swatchesOnly={false}
            onColorChange={a => {
              setGuessedColor(hexRgb(a));
            }}
            thumbSize={40}
            sliderSize={60}
            noSnap={true}
            row={true}
            swatches={false}
            discrete={false}
          />}
      </Pressable>

      {justGuessed &&
        <Button
          title='Next Challenge'
          color={GREEN}
          onPress={() => {
            setTargetsCount(x => x + 1);
            Animated.timing(swatchDistance, {
              toValue: SWATCH_DISTANCE,
              duration: 100,
              useNativeDriver: false
            }).start();

            let newTarget = generateRandomTarget(grayscaleMode);
            // Don't choose something too close:
            let tries = 0;
            while (closeEnough(guessedColor, newTarget) && tries < 10) {
              tries++;
              newTarget = generateRandomTarget(grayscaleMode);
            }

            setTargetColor(newTarget);
            setJustGuessed(false);
          }} />
      }
      {!justGuessed &&
        <Button
          title='Submit Guess'
          onPress={() => {
            setJustGuessed(true);
            const _percentageDiff = rgbPercentageDiff(guessedColor, targetColor);
            updateHealth(_percentageDiff);
            setPercentageDiff(_percentageDiff);

            Animated.timing(swatchDistance, {
              toValue: END_SWATCH_DISTANCE,
              duration: 1500,
              useNativeDriver: false
            }).start();
          }} />
      }
    </View>
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>Match That Color</Text>
          <Text style={styles.headerText}>Select your desired difficulty level:</Text>
          <Pressable 
            style={styles.button}
            onPress={() => {
            setModalVisible(false);
            setGrayscaleMode(true);
            reset();
          }}>
            <Text>Grayscale Only</Text>
          </Pressable>
          
          <Pressable
            style={styles.button}
            onPress={() => {
            setModalVisible(false);
            setGrayscaleMode(false);
            reset();
          }}>
            <Text>All Colors</Text>
          </Pressable>
          
        </View>
      </Modal>
      <View style={styles.headerContainer}>
        <Text onPress={() => setModalVisible(x => !x)} style={styles.score}>
          Health: {Math.round(health)}%
        </Text>
        <StatusBar style="auto" />
        {!justGuessed && <Text style={styles.resultsText}>Match the colors:</Text>}
        {justGuessed && !notPerfectOrNearlyPerfect && <Text style={styles.resultsText}> You were within: {Math.round(percentageDiff)}%</Text>}
        {justGuessed && nearlyPerfect && <Text style={styles.resultsText}>Nearly Perfect Guess!</Text>}
        {justGuessed && perfectGuess && <Text style={styles.resultsText}>Perfect Guess!</Text>}
      </View>

      <View style={styles.middleContainer}>
        <Pressable style={styles.swatchContainer} 
          onPress={() => { setGrayscaleMode(x => !x) }}>
          <ColorView color={targetColor} />
          <View>
            {!justGuessed && <Text style={styles.swatchDesc}>Target</Text>}
            {justGuessed && <View>
              <Text style={styles.swatchDesc}>{targetMsg}</Text> 
              <Text style={[styles.swatchGuess, { bottom: -50}]}>{printRGB(targetColor)}</Text>
            </View>}
          </View>
        </Pressable>
        <Animated.View style={[styles.swatchContainer, {marginLeft: swatchDistance}]}>
          <ColorView color={guessedColor} />
          <View>
            {<Text style={styles.swatchDesc}>Your Guess:</Text>}
            {<Text style={styles.swatchGuess}>{printRGB(guessedColor)}</Text>}
          </View>
        </Animated.View>
      </View>
      {bottomContainerEl()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerContainer: {
    paddingTop: 10,
    alignItems: 'center'
  },
  middleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  bottomContainer: {
    padding: 10,
    width: '100%'
  },
  score: {
    fontSize: 22
  },
  resultsText: {
    textAlign: 'center',
    paddingTop: 20,
    fontSize: 38
  },
  swatchContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10
  },
  swatchGuess: {
    position: 'absolute',
    width: '150%',
    bottom: -10
  },
  swatchDesc: {
    padding: 10
  },
  button: {
    textAlign: 'center',
    padding: 20,
    margin: 20,
    borderRadius: 20,
    backgroundColor: GRAY_BG
  },
  slider: { 
    width: '100%', 
    height: 40 
  },
  arrowDown: {
    position: 'absolute',
    left: TRIANGLE_WIDTH/2,
    bottom: -1 * TRIANGLE_WIDTH,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: TRIANGLE_WIDTH,
    borderRightWidth: TRIANGLE_WIDTH,
    borderBottomWidth: TRIANGLE_WIDTH * 2,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: GRAY_BG,
    transform: [{ rotate: "180deg" }]
  },
  title: {
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 26
  },
  headerText: {
    fontSize: 20,
    paddingBottom: 10
  },
  playAgain: {
    paddingBottom: 5
  },
  modal: {
    padding: 30
  }
});
