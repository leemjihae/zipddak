import { useEffect, useRef, useState } from "react";

const KakaoMapModalForTradeAddr = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);

  // 테스트용 주소
  const testAddr = "서울 성북구 아리랑로 4";

  useEffect(() => {
    if (!isOpen || !window.kakao) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    // 주소 → 좌표 변환
    geocoder.addressSearch(testAddr, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK) return;

      const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

      // 지도 생성
      map.current = new window.kakao.maps.Map(mapContainer.current, {
        center: coords,
        level: 1,
      });

      // 마커 이미지 설정
            const imageSrc =
                // "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
                "/zipddak_pin.png",
                imageSize = new window.kakao.maps.Size(64, 69),
                imageOption = { offset: new window.kakao.maps.Point(27, 69) };


      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      const marker = new window.kakao.maps.Marker({
        position: coords,
        image: markerImage,
      });
      marker.setMap(map.current);

      // 커스텀 오버레이
      const content = `<div class="customoverlay">
        <a href="https://map.kakao.com/link/map/${result[0].y},${result[0].x}" target="_blank">
          <span class="title">${testAddr}</span>
        </a>
      </div>`;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        map: map.current,
        position: coords,
        content,
        yAnchor: 1,
      });
    });
  }, [isOpen]);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>지도 테스트</button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "600px",
              height: "500px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "16px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{ position: "absolute", top: 8, right: 8 }}
            >
              X
            </button>

            <div
              ref={mapContainer}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KakaoMapModalForTradeAddr;
