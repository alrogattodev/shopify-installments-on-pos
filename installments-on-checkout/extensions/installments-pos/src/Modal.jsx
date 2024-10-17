import React, {useState, useEffect, ReactNode} from 'react';

//import { CartDiscountType } from '@shopify/ui-extensions/point-of-sale'
import { Text, Navigator, RadioButtonList, Screen, ScrollView, Button, Stack, useApi, reactExtension } from '@shopify/ui-extensions-react/point-of-sale';

const SmartGridModal = () => {
  const api = useApi();
  //const [subtotal, setSubtotal] = useState(0);
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

  return (
    <Navigator>
      <Screen name='Discounts' title='Available Discounts'>
        <ScrollView>
          {Array.from(Array(18)).map((_, count) =>
          textElement((count+1) + ": " + "R$"+(subtotal / (count+1)).toFixed(2) + " em " + (count+1) + "x"),
          )}
        </ScrollView>
        <Text>{`Valor total: R$${(subtotal / 1).toFixed(2)}`}</Text>
      </Screen>
    </Navigator>
  )
}

export default reactExtension('pos.home.modal.render', () => {
  return <SmartGridModal />
})