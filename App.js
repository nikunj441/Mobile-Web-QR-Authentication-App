import React, {useState} from 'react';  

import { View, Text, Button, Alert } from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';
import { PermissionsAndroid } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import { ViewPropTypes } from 'deprecated-react-native-prop-types'
import axios from 'axios';

const App = () => {
  const [phoneNumberInfo, setPhoneNumberInfo] = useState(0);
  const [permission, setPermission] = useState('')
  const [scannerOpen, setScannerOpen] = useState(false);
  const [message, setMessage] = useState('');

  //**********************************Request Phone Number****************************
  const requestPhoneNumber = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
    );
 

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, now access SIM card information
        try {
          const phoneNumber = await SmsRetriever.requestPhoneNumber();                        
          const phoneWithoutCountryCode = phoneNumber.replace(/^\+91/, ''); 
          setPhoneNumberInfo(phoneWithoutCountryCode);
          console.log(phoneWithoutCountryCode,"Phone number without country code",);
          setPermission('Successful')
        
        } catch (error) {
          console.log(JSON.stringify(error));
        }
      } else {
        
       setPermission('Denied')
       console.log('')
      }
    
    
  };


  const handleScanPress = () => {
    if (phoneNumberInfo !== 0) {
      setScannerOpen(true);
    }
    else{
      Alert.alert('Enter phone number first');
    }
  };

  const renderScanner = () => {
    return (
      <QRCodeScanner
        onRead={onSuccess}
        
        reactivate={true}
        reactivateTimeout={500}
      />
    );
  };

  const onSuccess = (event) => {
    // Handle the scanned QR code data
    const scannedData = event.data;
    sendToServer(phoneNumberInfo, scannedData);
    setScannerOpen(false);   
  };

  //send data to server
  const sendToServer = async(phoneNumber, scannedData) => {
    const url = `http://192.168.29.44:8080/attendance`; 
   

    try {
      const response =  await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      
      
      setScannerOpen(false)
     

      const responseData =  await response.json();
      console.log('Response data:', responseData); 
      setMessage(responseData.message);
      console.log(responseData.message);
    } catch (error) {
      console.error('Error sending data to server:', error);
      setMessage('Error: Failed to record attendance'); // Handle error
    }

  };

  const renderMessage = () => {
    // Render message component in the center of the screen
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'green', fontSize: 20 }}>{message}</Text>
      </View>
    );
  };

  

  return (
    
    <View style={{ flex: 1 }}>
      {message ? (
        // If message state is set, render message component
        renderMessage()
      ) : (
        // If message state is not set, render main UI components
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Phone Number: {phoneNumberInfo}</Text>
          <Text>Permission: {permission}</Text>
          <Button title="Get Phone Number" onPress={requestPhoneNumber} style={{ marginBottom: 20 }} />
          <View style={{ marginTop: 20 }}>
            <Button title="Scan" onPress={handleScanPress} />
          </View>
          {scannerOpen && renderScanner()}
        </View>
      )}
    </View>
    
  );
};

export default App;
