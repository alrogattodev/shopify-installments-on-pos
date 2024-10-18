import React, {useState, useEffect, ReactNode} from 'react';
import { reactExtension, Text, Navigator, RadioButtonList, Screen, ScrollView, Button, useApi } from '@shopify/ui-extensions-react/point-of-sale';
console.error("WELCOME");
const SmartGridModal = () => {
  const api = useApi();

  const [selected, setSelected] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  //subtotal = api.cart.subscribable.initial.subtotal;
  useEffect(() => {
    // check if subtotal is available
    if (api.cart && api.cart.subscribable && api.cart.subscribable.initial) {
      setSubtotal(api.cart.subscribable.initial.subtotal);
    } else {
      console.log('Subtotal não disponível ainda');
    }
  }, [api]);
  const parcelasOptions = Array.from({ length: 18 }, (_, count) => 
    `${count + 1}x de R$${(subtotal / (count + 1)).toFixed(2)}`
  );

  const aplicarParcelas = async () => {
    if (!selected) {
      await api.cart.updateNote('Teste de nota fixa');      
      api.toast.show('Por favor, selecione o número de parcelas.');
      return;
    }

    // add description
    try { 
      await api.cart.addCartProperties({Engraving: `Forma de Pagamento: ${selected}`})
    } catch (error) {
      console.error('Erro ao aplicar parcelas:', error);
    }
  };
 
  
  return (
    <Navigator>
      <Screen name='Parcelas' title='Selecione o número de parcelas'>
        <ScrollView>
          <RadioButtonList
            items={parcelasOptions}
            onItemSelected={setSelected}
            initialSelectedItem={selected}
          />
          <Text>{`Você selecionou: ${selected}`}</Text>
          <Text>{`Valor total: R$${(subtotal / 1).toFixed(2)}`}</Text>
          <Button title="Aplicar" onPress={aplicarParcelas} />
        </ScrollView>
      </Screen>
    </Navigator>
  )
}

export default reactExtension('pos.home.modal.render', () => {
  return <SmartGridModal />
})