import React, {useState, useEffect, ReactNode} from 'react';
import { reactExtension, Text, Navigator, RadioButtonList, Screen, ScrollView, Button, Stack, useApi } from '@shopify/ui-extensions-react/point-of-sale';

const SmartGridModal = () => {
  const api = useApi();
  const [selected, setSelected] =
    React.useState('');

  const subtotal = api.cart.subscribable.initial.subtotal;
  useEffect(() => {
    const fetchCartSubtotal = async () => {
      const cart = await api.cart.fetch();
      setSubtotal(cart.subtotal);
    };

    fetchCartSubtotal();
  }, [api]);

  const textElement = (
    count,
  ) => {
    return (
      <Stack
        direction="vertical"
        paddingHorizontal="Small"
        paddingVertical="Small"
      >
        <Text>{`Opção ${count} `}</Text>
      </Stack>
    )
  }
  const onButtonPress = (type, title, amount) => {
    // You can apply a discount through the cart API
    api.cart.applyCartDiscount(type, title, amount);

    // You can show a toast to notify the user of something
    api.toast.show('Discount applied');
  }

  const parcelasOptions = Array.from({ length: 18 }, (_, count) => 
    `${count + 1}x de R$${(subtotal / (count + 1)).toFixed(2)}`
  );

  return (
    <Navigator>
      <Screen name='Discounts' title='Available Discounts'>
        <RadioButtonList
          items={parcelasOptions}
          onItemSelected={setSelected}
          initialSelectedItem={selected}
        />
        <Text>{`Você selecionou: ${selected}`}</Text>
        <Text>{`Valor total: R$${(subtotal / 1).toFixed(2)}`}</Text>
      </Screen>
    </Navigator>
  )
}

export default reactExtension('pos.home.modal.render', () => {
  return <SmartGridModal />
})