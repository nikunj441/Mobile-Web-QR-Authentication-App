import React, {useState} from 'react';  

import { View, Text, Button, Platform } from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { PermissionsAndroid } from 'react-native';




const App = () => {
  const [phoneNumberInfo, setPhoneNumberInfo] = useState(0);
  const [permission, setPermission] = useState('')

  const requestPhoneNumber = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
    );
 

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, now access SIM card information
        try {
          const phoneNumber = await SmsRetriever.requestPhoneNumber();
          console.log(phoneNumber, 'phoneNumber');
          const pn = parsePhoneNumber(phoneNumber, 'ZZ');
                                 
          const phoneWithoutCountryCode = phoneNumber.replace(/^\+91/, ''); 
          setPhoneNumberInfo(phoneWithoutCountryCode);
          console.log(phoneWithoutCountryCode,"Phone number without country code",);
          setPermission('Successful')
        
        } catch (error) {
          console.log(JSON.stringify(error));
        }
      } else {
        // Permission denied
       // show the alert
       setPermission('Denied')
       console.log('')
      }
    // }
        // catch(err){
        //   console.log('rr');
        // }
    
  };




  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Extracted Phone Number Info:</Text>
      <Text>Phone Without Country: {phoneNumberInfo}</Text>      
      <Text>Permission: {permission}</Text>      
      <Button title="Get Phone Number" onPress={requestPhoneNumber} />
    </View>
  );
};

export default App;
