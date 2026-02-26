import { useCallback } from "react";

export const useDeliveryPolicy = (watch, setValue) => {
    if (typeof watch !== "function") {
        console.error("watch must be a function. Received:", watch);
        return {
            selected: { delivery: false, pickup: false },
            toggleDelivery: () => {},
            togglePickup: () => {},
        };
    }

    const selected = watch("shippingMethod") || { delivery: false, pickup: false };

    const toggleDelivery = useCallback(() => {
        setValue("shippingMethod.delivery", !selected.delivery);
    }, [selected.delivery, setValue]);

    const togglePickup = useCallback(() => {
        setValue("shippingMethod.pickup", !selected.pickup);
    }, [selected.pickup, setValue]);

    return {
        selected,
        toggleDelivery,
        togglePickup,
    };
};
