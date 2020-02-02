import React, {Component} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNTesseractOcr from 'react-native-tesseract-ocr';

const Button =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
const imagePickerOptions = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true,
  },
};
const tessOptions = {
  whitelist: null,
  blacklist: '1234567890\'!"#$%&/()={}[]+*-_:;<>',
};

class ImagePickerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      extractedText: null,
      hasErrored: false,
      imageSource: null,
      isLoading: false,
    };
    this.selectImage = this.selectImage.bind(this);
  }

  selectImage() {
    this.setState({isLoading: true});

    ImagePicker.showImagePicker(imagePickerOptions, response => {
      if (response.didCancel) {
        this.setState({isLoading: false});
      } else if (response.error) {
        this.setState({
          isLoading: false,
          hasErrored: true,
          errorMessage: response.error,
        });
      } else {
        const source = {uri: response.uri};
        this.setState(
          {imageSource: source, hasErrored: false, errorMessage: null},
          this.extractTextFromImage(response.path),
        );
      }
    });
  }

  extractTextFromImage(imagePath) {
    RNTesseractOcr.recognize(imagePath, 'LANG_KOREAN', tessOptions)
      .then(result => {
        this.setState({isLoading: false, extractedText: result});
        Alert.alert('성공');
      })
      .catch(err => {
        console.log(err);
        this.setState({hasErrored: true, errorMessage: err.message});
        Alert.alert('실패');
      });
  }

  render() {
    const {
      errorMessage,
      extractedText,
      hasErrored,
      imageSource,
      isLoading,
    } = this.state;
    return (
      <View style={styles.container}>
        <Button onPress={this.selectImage}>
          <View>
            {imageSource === null ? (
              <Text>Tap me!</Text>
            ) : (
              <Image source={imageSource} />
            )}
          </View>
        </Button>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : hasErrored ? (
          <Text>{errorMessage}</Text>
        ) : (
          <Text>{extractedText}</Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImagePickerScreen;
//////////////////////////////////////////////////////////
// import React, {Component} from 'react';
// import {StyleSheet, Text, View, Image, Alert, Button} from 'react-native';
// import CustomButton from './CustomButton';
// import RNTesseractOcr from 'react-native-tesseract-ocr';
// import ImagePicker from 'react-native-image-picker';

// const imagePickerOptions = {
//   quality: 1.0,
//   maxWidth: 500,
//   maxHeight: 500,
//   storageOptions: {
//     skipBackup: true,
//   },
// };
// const tessOptions = {
//   whitelist: null,
//   blacklist: null,
// };

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       errorMessage: null,
//       extractedText: null,
//       hasErrored: false,
//       imageSource: null,
//       isLoading: false,
//     };
//     this.selectImage = this.selectImage.bind(this);
//   }
//   selectImage() {
//     this.setState({isLoading: true});

//     ImagePicker.showImagePicker(imagePickerOptions, response => {
//       if (response.didCancel) {
//         this.setState({isLoading: false});
//       } else if (response.error) {
//         this.setState({
//           isLoading: false,
//           hasErrored: true,
//           errorMessage: response.error,
//         });
//       } else {
//         const source = {uri: response.uri};
//         this.setState(
//           {imageSource: source, hasErrored: false, errorMessage: null},
//           this.extractTextFromImage(response.path),
//         );
//       }
//     });
//   }

//   extractTextFromImage(imagePath) {
//     Alert.alert(imagePath);
//     RNTesseractOcr.recognize(imagePath, 'LANG_KOREAN', tessOptions)
//       .then(result => {
//         console.log(result);
//         this.setState({isLoading: false, extractedText: result});
//         Alert.alert(this.state.extractedText);
//       })
//       .catch(err => {
//         this.setState({hasErrored: true, errorMessage: err.message});
//         Alert.alert('실패');
//       });
//     // console.log(this.state.extractedText);
//     // console.log(this.state.extractedText);
//     // console.log(123456);
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <View style={styles.header} />
//         <View style={styles.title}>
//           <Text style={{fontSize: 35, color: 'white'}}>
//             어서와,{'\n'}개발은 처음이지?
//           </Text>
//         </View>
//         <View style={styles.content}>
//           {/* <Image
//             style={{height: '100%', width: '100%', resizeMode: 'contain'}}
//             source={require('./img.jpg')}
//           /> */}
//         </View>
//         <View style={styles.footer}>
//           <CustomButton
//             buttonColor={'#444'}
//             title={'이미지 선택'}
//             // onPress={this._onPress.bind(this)}
//             onPress={this.selectImage.bind(this)}
//           />
//           <CustomButton
//             buttonColor={'#023e73'}
//             title={'로그인'}
//             // onPress={this._onPress.bind(this)}
//           />
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: 'black',
//   },
//   header: {
//     width: '100%',
//     height: '5%',
//     backgroundColor: '#ff9a9a',
//   },
//   title: {
//     width: '100%',
//     height: '18%',
//     justifyContent: 'center',
//     backgroundColor: '#9aa9ff',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 30,
//     backgroundColor: '#d6ca1a',
//   },
//   footer: {
//     width: '100%',
//     height: '20%',
//     //backgroundColor: '#1ad657',
//   },
// });
