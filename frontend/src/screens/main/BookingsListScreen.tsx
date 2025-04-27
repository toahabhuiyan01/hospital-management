import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Chip } from 'react-native-paper';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BookingsListScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userToken } = useAuth();

  useEffect(() => {
    fetchBookings();
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBookings();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/bookings`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setBookings(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      await axios.patch(
        `/bookings/${bookingId}`,
        { status: 'cancelled'},
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      );
      
      setBookings(prev => {
        const updatedBookings = prev.map(booking => {
          if (booking.id === bookingId) {
            return {
              ...booking,
              status: 'cancelled'
            };
          }
          return booking;
        });
        return updatedBookings;
      })
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel booking. Please try again.';
      console.error('Error cancelling booking:', error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderBookingItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Title style={styles.title}>{item.service.name}</Title>
          <Chip 
            mode="outlined" 
            style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
            textStyle={{ color: getStatusColor(item.status) }}
          >
            {item.status}
          </Chip>
        </View>
        <Paragraph style={styles.hospitalName}>{item.service.hospital.name}</Paragraph>
        <Paragraph style={styles.dateTime}>Date: {formatDate(item.date)}</Paragraph>
        {item.notes && <Paragraph style={styles.notes}>Notes: {item.notes}</Paragraph>}
      </Card.Content>
      {item.status.toLowerCase() !== 'cancelled' && (
        <Card.Actions>
          <Button 
            mode="outlined" 
            onPress={() => cancelBooking(item.id)}
            disabled={loading}
          >
            Cancel Booking
          </Button>
        </Card.Actions>
      )}
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={fetchBookings} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>No bookings found</Text>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Hospitals')}
                style={styles.bookButton}
              >
                Book an Appointment
              </Button>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  statusChip: {
    height: 30,
    lineHeight: 14
  },
  hospitalName: {
    fontSize: 16,
    marginBottom: 5,
  },
  dateTime: {
    marginBottom: 5,
  },
  notes: {
    fontStyle: 'italic',
    marginTop: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
  },
  bookButton: {
    marginTop: 20,
  },
});

export default BookingsListScreen;