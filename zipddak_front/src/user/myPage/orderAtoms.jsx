import { atomWithStorage, createJSONStorage } from "jotai/utils";

// 주문 상세 조회 시 상품 그룹 정보
export const deliveryGroupsAtom = atomWithStorage(
  "deliveryGroups",
  [],
  createJSONStorage(() => sessionStorage)
);

// 교환/반품 시 상품 그룹 정보
export const selectedDeliveryGroupsAtom = atomWithStorage(
  "selectedDeliveryGroups",
  [],
  createJSONStorage(() => sessionStorage)
);
