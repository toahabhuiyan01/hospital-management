import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, Searchbar } from 'react-native-paper';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Hospital } from '../../types';

const HospitalListScreen = ({ navigation }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { userToken } = useAuth();

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/hospitals`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setHospitals(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch hospitals. Please try again.');
      console.error('Error fetching hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter((hospital: Hospital) =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHospitalItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('HospitalDetail', { hospitalId: item.id })}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.address}</Paragraph>
        {item.description && <Paragraph numberOfLines={2}>{item.description}</Paragraph>}
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => navigation.navigate('HospitalDetail', { hospitalId: item.id })}>
          View Services
        </Button>
      </Card.Actions>
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
      <Searchbar
        placeholder="Search hospitals"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      {error ? (
        <View style={styles.centered}>
          <Paragraph style={styles.errorText}>{error}</Paragraph>
          <Button mode="contained" onPress={fetchHospitals} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredHospitals}
          keyExtractor={(item) => item.id}
          renderItem={renderHospitalItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Paragraph>No hospitals found</Paragraph>
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
  },
  searchbar: {
    margin: 10,
    elevation: 2,
  },
  list: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
    elevation: 2,
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

export default HospitalListScreen;