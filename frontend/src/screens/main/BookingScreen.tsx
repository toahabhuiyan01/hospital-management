import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Text, Card, Paragraph, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:6969/api';

const BookingScreen = ({ route, navigation }) => {
  const { serviceId, serviceName, hospitalName } = route.params;
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { userToken } = useAuth();

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      
      const formattedDate = date.toISOString();
      
      const response = await axios.post(
        `${API_URL}/bookings`,
        {
          serviceId,
          date: formattedDate,
          notes
        },
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      );
      
      Alert.alert(
        'Success',
        'Your appointment has been booked successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Bookings') }]
      );
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Book Appointment</Title>
          <Paragraph style={styles.subtitle}>{hospitalName}</Paragraph>
          <Paragraph style={styles.service}>Service: {serviceName}</Paragraph>
          
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Select Date and Time:</Text>
            <Button 
              mode="outlined" 
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              {date.toLocaleString()}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="datetime"
                display="default"
                onChange={onDateChange}
                minimumDate={minDate}
              />
            )}
            <HelperText type="info">Appointments must be booked at least 1 day in advance</HelperText>
          </View>

          <TextInput
            label="Additional Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={4}
          />
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleBooking}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Confirm Booking
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  service: {
    fontSize: 16,
    marginBottom: 24,
    fontWeight: '500',
  },
  dateContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateButton: {
    marginVertical: 8,
  },
  input: {
    marginBottom: 16,
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  button: {
    minWidth: 120,
  },
});

export default BookingScreen;