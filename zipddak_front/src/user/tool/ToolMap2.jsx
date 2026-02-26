import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";

const KakaoMapModal = () => {
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken]= useAtom(tokenAtom);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const fixedMarker = useRef(null);
  const clickMarker = useRef(null);
  const infowindow = useRef(null);

  const [clickedAddress, setClickedAddress] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);

  // 지도 초기화
  useEffect(() => {
    if (!isMapOpen || !window.kakao || !user?.addr1) return;

    map.current = new window.kakao.maps.Map(mapContainer.current, {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 1,
    });

    infowindow.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });

    const geocoder = new window.kakao.maps.services.Geocoder();

    // 고정 마커
    geocoder.addressSearch(user.addr1, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        map.current.setCenter(coords);

        fixedMarker.current = new window.kakao.maps.Marker({
          position: coords,
          map: map.current,
          title: "내 주소",
        });

        // fixedMarker 클릭 시 선택
        window.kakao.maps.event.addListener(fixedMarker.current, "click", () => {
          const address = result[0].address.address_name;
          infowindow.current.setContent(
            `<div style="padding:5px;">${address}</div>`
          );
          infowindow.current.open(map.current, fixedMarker.current);

          setClickedAddress(address);
          setSelectedMarker(fixedMarker.current);
        });
      }
    });

    // 클릭 마커 생성 (처음 안보임)
    clickMarker.current = new window.kakao.maps.Marker({ map: map.current });
    clickMarker.current.setMap(null);

    // 지도 클릭 시 클릭 마커 이동/표시
    map.current.addListener("click", (mouseEvent) => {
      const latlng = mouseEvent.latLng;

      clickMarker.current.setPosition(latlng);
      clickMarker.current.setMap(map.current);

      geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (res, stat) => {
        if (stat === window.kakao.maps.services.Status.OK) {
          const detailAddr = res[0].address.address_name;
          infowindow.current.setContent(
            `<div style="padding:5px;">${detailAddr}</div>`
          );
          infowindow.current.open(map.current, clickMarker.current);

          setClickedAddress(detailAddr);
          setSelectedMarker(clickMarker.current);
        }
      });
    });
  }, [isMapOpen, user]);

//   const handleSave = () => {
//     if (!selectedMarker) return alert("마커를 선택하세요!");
//     alert(`DB에 저장할 주소: ${clickedAddress}`);

//     const data = {
//     toolIdx: toolIdx,
//     clickedAddress: clickedAddress,
//     };

//    token&&myAxios(token,setToken).post(`tool/directRental/map`, data)
//    .then(res=>{
//     console.log(res.data);
//    })
//    .catch(err => {
//     console.log(err);
//    })
//     setIsOpen(false);
//   };

  return (
    <div>
      <button onClick={() => setIsMapOpen(true)}>지도 열기</button>

      {isMapOpen && (
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
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "16px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setIsMapOpen(false)}
              style={{ position: "absolute", top: 8, right: 8 }}
            >
              X
            </button>

            <div
              ref={mapContainer}
              style={{ width: "100%", height: "400px", marginBottom: "10px" }}
            />

            <input
              type="text"
              value={clickedAddress}
              onChange={(e) => setClickedAddress(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <button onClick={handleSave} style={{ width: "100%" }}>
              주소 저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KakaoMapModal;
