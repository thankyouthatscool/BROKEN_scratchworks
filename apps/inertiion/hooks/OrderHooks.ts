import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { OrderItemProps } from "@types";
import { setPickQueueLocalStorage, setPickedItemsLocalStorage } from "@utils";

export const useOrderHooks = () => {
  const { isInitialLoadComplete } = useAppSelector(({ app }) => app);
  const { pickQueue, pickedItems, priorityPickOrder } = useAppSelector(
    ({ orders }) => orders
  );

  const handlePickQueueChange = async (pickQueue: string[]) => {
    await setPickQueueLocalStorage(pickQueue);
  };

  const handlePickedItemsChange = async (pickedItems: OrderItemProps[]) => {
    await setPickedItemsLocalStorage(pickedItems);
  };

  useEffect(() => {
    if (!!isInitialLoadComplete) {
      handlePickQueueChange(pickQueue);
    }
  }, [isInitialLoadComplete, pickQueue]);

  useEffect(() => {
    if (!!isInitialLoadComplete) {
      handlePickedItemsChange(pickedItems);
    }
  }, [isInitialLoadComplete, pickedItems]);
};
