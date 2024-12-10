import { View, Modal ,Text, Button, TextInput } from "react-native";
import React, { useState } from "react";
import CarRepository, { Car } from "../src/database/CarRepository";

const repository = new CarRepository();

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [carUpdate, setCarUpdate] = useState<Car>();
  const [filter, setFilter] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);

  const isNotEmpty = (value:any)=>{
    if(isNaN(Number(value))){
      return value != null && value != '';
    }
    return Number(value) > 0;
  }

  const create = async (car:Car) => {
    const id = await repository.create(car);
    await all();
  };

  const all = async () => {
    const cars = await repository.all();
    setCars(cars);

    console.log(cars);
  };

  const update = async()=>{
    if(isNotEmpty(carUpdate?.id) && isNotEmpty(carUpdate?.brand)  && isNotEmpty(carUpdate?.model) && isNotEmpty(carUpdate?.hp) ){
      await repository.update(carUpdate!)
      await all();
    }
    else if(isNotEmpty(carUpdate?.brand)  && isNotEmpty(carUpdate?.model) && isNotEmpty(carUpdate?.hp)){
      create(carUpdate!)
    }
    setModalVisible(false);
  }

  const deleteCar = async(id: number) => {
    await repository.delete(id);
    await all();

  }

  const openModalUpdate=(id?:number)=>{
    if(id != null )
      setCarUpdate(cars[id])
    else
      setCarUpdate({brand: '',
        model: '',
        hp: 0})
    setModalVisible(true);
  }

  const updateList = async () => {
    if(filter.length > 0){
      const cars = await repository.getByModel(filter);
      setCars(cars);
    }
  };

  return (
    <View>
      <Button onPress={()=> openModalUpdate()} title="create" />
      <Button onPress={all} title="Listar todos" />
      <TextInput style={{margin:10,borderWidth:1}} placeholder="Digite o modelo" value={filter} onChange={updateList} onChangeText={setFilter}/>

      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
      }}>
        <View style={{flex:1,backgroundColor:'white'}} >
        <TextInput style={{margin:10,borderWidth:1}} placeholder="Digite o modelo" value={carUpdate?.model} onChangeText={(text) => setCarUpdate((prev) => ({ ...prev!, model: text}))}/>
        <TextInput style={{margin:10,borderWidth:1}} placeholder="Digite o Marca" value={carUpdate?.brand} onChangeText={(text) => setCarUpdate((prev) => ({ ...prev!, brand: text}))}/>
        <TextInput style={{margin:10,borderWidth:1}} placeholder="Digite o quantidade de cavalos" value={carUpdate?.hp.toString()} onChangeText={(text) => setCarUpdate((prev) => ({ ...prev!, hp: Number(text)}))}/>
        <Button onPress={update} title="Salvar" />
        </View>
    </Modal>
      {cars.map((car,index) => (
        <View key={car.id}>
          <Text style={{margin:10}}>{car.id} - {car.brand} {car.model} {car.hp} </Text>
          <Button onPress={()=> openModalUpdate(index)} title="Atualizar Carro" />
          <Button onPress={()=>deleteCar(car.id!)} title="Remover Carro" />
        </View>
      ))}
    </View>
  );
}


