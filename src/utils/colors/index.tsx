import { mean } from 'lodash';
import rgbHex from 'rgb-hex';
//hexRgb('4183c4');
//=> {red: 65, green: 131, blue: 196, alpha: 1}

export type ColorRGB = {
 red: number,
 green: number,
 blue: number,
 alpha?: number   
};

const MIN_PERCENTAGE_THRESHOLD = 5.0;

export const colorsAreEqual = (color1:ColorRGB, color2:ColorRGB) => {
    return rgbHex(color1.red ?? 0, color1.green ?? 0, color1.blue ?? 0) === 
        rgbHex(color2.red ?? 1, color2.green ?? 1, color2.blue ?? 1);
};

export const generateRandomTarget = (grayscaleMode:boolean):ColorRGB => {
    if(grayscaleMode) {
       const gray = generateRandomTargetSingle();
       return {
        red: gray,
        green: gray,
        blue: gray,
        alpha: 1
       };
    }
    return {
        red: generateRandomTargetSingle(),
        green: generateRandomTargetSingle(),
        blue: generateRandomTargetSingle(),
        alpha: 1
    };
};

export const generateGrayscale = (gray:number) => {
    return {
        red: gray,
        green: gray,
        blue: gray,
        alpha: 1
    }
};

export const printRGB = (color:ColorRGB) => {
    const { red, green, blue } = color;
    return `rgb:${red}, ${green}, ${blue}`;
};

const generateRandomTargetSingle = () => {
    return Math.round(Math.random() * 255);
};

export const rgbToHex = (color1: ColorRGB) => {
    return '#' + rgbHex(color1.red ?? 0, color1.green ?? 0, color1.blue ??0) 
};

export const rgbPercentageDiff = (color1:ColorRGB, color2:ColorRGB) => {
    const r = calculateDiffPercentageSingle(color1.red, color2.red);
    const g = calculateDiffPercentageSingle(color1.green, color2.green);
    const b = calculateDiffPercentageSingle(color1.blue, color2.blue);
    return mean([r, g, b]);
};

const calculateDiffPercentageSingle = (guess:number, target:number, max = 255) => {
   const g = (guess / max);
   const t = (target / max);
   const diff = Math.abs(g-t);
   const percentageDiff = diff * 100;
   return percentageDiff;
};

export const closeEnough = (color1:ColorRGB, color2:ColorRGB) => {
    const percentageDiff = rgbPercentageDiff(color1, color2);
    return percentageDiff <= MIN_PERCENTAGE_THRESHOLD;
};
