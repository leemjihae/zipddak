export default function MembershipInfoCard({ type }) {
  return type === "short" ? (
    <div
      style={{
        display: "flex",
        padding: "30px",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "8px",
        border: "1px solid #EFF1F5",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "282px",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          집딱 멤버십
        </p>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          월{" "}
          <span
            style={{
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            30,000
          </span>{" "}
          원
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          fontSize: "13px",
          fontWeight: "400",
          whiteSpace: "nowrap",
        }}
      >
        <p>
          <i class="bi bi-check2" style={{ marginRight: "5px" }}></i>메인 페이지
          ‘추천 전문가’ 우선 노출 중
        </p>
        <p>
          <i class="bi bi-check2" style={{ marginRight: "5px" }}></i>전문가 찾기
          페이지 상단 노출 보장
        </p>
        <p>
          <i class="bi bi-check2" style={{ marginRight: "5px" }}></i>맞춤 요청서
          등록 시 실시간 알림 제공 중
        </p>
      </div>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        padding: "12px",
        flexDirection: "column",
        gap: "10px",
        borderRadius: "8px",
        border: "1px solid#E1E4ED",
        boxShadow: "0 1px 4px 0 rgba(25, 33, 61, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: "32px 24px",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            fontWeight: "700",
          }}
        >
          집딱 멤버십
        </p>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "600",
            whiteSpace: "nowrap",
          }}
        >
          전문가 멤버십으로 더 많은 고객을 만나보세요
        </p>
        <p
          style={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            whiteSpace: "nowrap",
          }}
        >
          고객에게 더 잘 보이고,
          <br />더 빠르게 연결되는 전문가 전용 혜택을 제공합니다.
        </p>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "500",
            marginTop: "10px",
          }}
        >
          월{" "}
          <span
            style={{
              fontSize: "32px",
              fontWeight: "600",
            }}
          >
            30,000
          </span>{" "}
          원
        </p>
      </div>
      <div
        style={{
          display: "flex",
          padding: "20px 26px",
          flexDirection: "column",
          gap: "24px",
          fontSize: "16px",
          fontWeight: "400",
          whiteSpace: "nowrap",
        }}
      >
        <p
          style={{
            fontWeight: "600",
          }}
        >
          멤버십 혜택
        </p>
        <p>
          <i class="bi bi-check-circle-fill" style={{ marginRight: "5px" }}></i>
          메인 페이지 ‘추천 전문가’ 영역에 우선 노출
        </p>
        <p>
          <i class="bi bi-check-circle-fill" style={{ marginRight: "5px" }}></i>
          전문가 찾기 상단 고정 노출
        </p>
        <p>
          <i class="bi bi-check-circle-fill" style={{ marginRight: "5px" }}></i>
          맞춤 요청서 등록 시 실시간 알림 제공
        </p>
      </div>
    </div>
  );
}
