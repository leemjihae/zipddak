export const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("ko-KR");
};

//처리 시간 중 가장 빠른 시간 골라냄 (반품 수거용)
export const getEarliestDateAccept = (items) => {
    if (!Array.isArray(items) || items.length === 0) return "-";

    const dates = items.map((item) => item.refundAcceptedAt).filter(Boolean); // 문자열만 남김 (yyyy-MM-dd)
    if (dates.length === 0) return "-";

    const earliest = dates.reduce((min, cur) => (cur < min ? cur : min), dates[0]);

    return earliest;
};

//처리 시간 중 가장 빠른 시간 골라냄 (반품 수거완료용)
export const getEarliestDatePickup = (items) => {
    if (!Array.isArray(items) || items.length === 0) return "-";

    const dates = items.map((item) => item.refundPickupComplatedAt).filter(Boolean); // 문자열만 남김 (yyyy-MM-dd)
    if (dates.length === 0) return "-";

    const earliest = dates.reduce((min, cur) => (cur < min ? cur : min), dates[0]);

    return earliest;
};

//처리 시간 중 가장 빠른 시간 골라냄 (반품완료 처리 결과용)
export const getEarliestDateCompleted = (items) => {
    if (!Array.isArray(items) || items.length === 0) return "-";

    const dates = items.map((item) => item.refundComplatedAt).filter(Boolean);
    if (dates.length === 0) return "-";

    const earliest = dates.reduce((min, cur) => (cur < min ? cur : min), dates[0]);

    return earliest;
};

//처리 시간 중 가장 빠른 시간 골라냄 (반품 처리 결과용)
export const getEarliestDate = (items) => {
    if (!Array.isArray(items) || items.length === 0) return "-";

    const dates = items.flatMap((item) => [item.refundRejectedAt, item.refundComplatedAt]).filter(Boolean); // 문자열만 남김 (yyyy-MM-dd)
    // .map((d) => new Date(d))
    // .filter((d) => !isNaN(d)); // 유효하지 않은 Date 제거

    if (dates.length === 0) return "-";

    const earliest = dates.reduce((min, cur) => (cur < min ? cur : min), dates[0]);

    return earliest;
    // .toLocaleString("ko-KR");
};
