import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);

        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleSelectUf(value: any) {
    const uf = value;

    setSelectedUf(uf);
  }

  function handleSelectCity(value: any) {
    const city = value;

    setSelectedCity(city);
  }

  function handleNavigateToPoints() {
    navigation.navigate('Points');
  }
  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      imageStyle={{ width: 274, height: 368 }}
      style={styles.container}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}> Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos a encontrar pontos de coleta de forma eficente.
        </Text>
      </View>

      <Text style={styles.selectText}>Selecione um local</Text>
      <View style={styles.select}>
        <RNPickerSelect
          style={{ inputAndroid: styles.selectInput }}
          useNativeAndroidPickerStyle={true}
          onValueChange={(value) => handleSelectUf(value)}
          placeholder={{
            label: 'Selecione uma UF',
            color: '#808090',
          }}
          value={selectedUf}
          items={ufs.map((uf) => ({ label: `${uf}`, value: uf }))}
        />

        <RNPickerSelect
          style={{ inputAndroid: styles.selectInput }}
          useNativeAndroidPickerStyle={true}
          onValueChange={(value) => handleSelectCity(value)}
          disabled={selectedUf || selectedUf === 'undefined' ? false : true}
          placeholder={{
            label: 'Selecione uma cidade',
            color: '#808090',
          }}
          value={selectedCity}
          items={cities.map((city) => ({ label: `${city}`, value: city }))}
        />
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon size={25} name="arrow-right" color="#FFF" />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {
    flex: 0.5,
    justifyContent: 'space-evenly',
  },

  select: {
    flex: 0.25,
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 2,
    borderWidth: 0.1,
    borderRadius: 8,
    paddingRight: 30,
  },

  selectText: {
    color: '#322153',
    fontSize: 24,
    fontFamily: 'Roboto_500Medium',
    paddingBottom: 15,
  },

  selectInput: {
    color: 'black',
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

export default Home;
