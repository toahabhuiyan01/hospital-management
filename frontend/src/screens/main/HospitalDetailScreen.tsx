import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, List, Divider, Text } from 'react-native-paper';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Hospital, Service } from '../../types';

const HospitalDetailScreen = ({ route, navigation }) => {
  const { hospitalId } = route.params;
  const [hospital, setHospital] = useState<Hospital>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userToken } = useAuth();

  useEffect(() => {
    fetchHospitalDetails();
  }, [hospitalId]);

  const fetchHospitalDetails = async () => {
    try {
      setLoading(true);
      const hospitalResponse = await axios.get(`/hospitals/${hospitalId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setHospital(hospitalResponse.data);

      const servicesResponse = await axios.get(`/services/hospital/${hospitalId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setServices(servicesResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch hospital details. Please try again.');
      console.error('Error fetching hospital details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchHospitalDetails} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  if (!hospital) {
    return (
      <View style={styles.centered}>
        <Text>Hospital not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{hospital.name}</Title>
          <Paragraph style={styles.address}>{hospital.address}</Paragraph>
          {hospital.description && (
            <Paragraph style={styles.description}>{hospital.description}</Paragraph>
          )}
        </Card.Content>
      </Card>

      <View style={styles.servicesContainer}>
        <Title style={styles.sectionTitle}>Available Services</Title>
        {services.length === 0 ? (
          <Text style={styles.noServices}>No services available at this hospital</Text>
        ) : (
          services.map((service) => (
            <Card key={service.id} style={styles.serviceCard}>
              <Card.Content>
                <Title style={styles.serviceTitle}>{service.name}</Title>
                {service.description && (
                  <Paragraph style={styles.serviceDescription}>{service.description}</Paragraph>
                )}
                <View style={styles.serviceDetails}>
                  <Paragraph>Price: ${service.price.toFixed(2)}</Paragraph>
                  <Paragraph>Duration: {service.duration} minutes</Paragraph>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button 
                  mode="contained" 
                  onPress={() => navigation.navigate('Booking', { 
                    serviceId: service.id,
                    serviceName: service.name,
                    hospitalName: hospital.name
                  })}
                >
                  Book Appointment
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  address: {
    marginTop: 5,
    color: '#666',
  },
  description: {
    marginTop: 10,
  },
  servicesContainer: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  serviceCard: {
    marginBottom: 10,
    elevation: 1,
  },
  serviceTitle: {
    fontSize: 16,
  },
  serviceDescription: {
    marginTop: 5,
    color: '#666',
  },
  serviceDetails: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noServices: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
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
});

export default HospitalDetailScreen;