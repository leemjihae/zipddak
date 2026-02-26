import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Input, Modal, ModalBody } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";

export function Account() {
  const [account, setAccount] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);

  // 정산계좌 조회
  const getAccount = () => {
    myAxios(token, setToken)
      .get(
        "http://localhost:8080" +
          `/expertSettle/detail?username=${user.username}`
      )
      .then((res) => {
        setAccount(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 정산계좌 수정
  const modifyAccount = () => {
    const body = {
      username: user.username,
      expertSettleDto: {
        settleBank: account.settleBank,
        settleAccount: account.settleAccount,
        settleHost: account.settleHost,
      },
    };

    myAxios(token, setToken)
      .post("http://localhost:8080" + "/expertSettle/modify", body)
      .then((res) => {
        if (res.data) {
          setIsModalOpen(true);

          setTimeout(() => {
            setIsModalOpen(false);
          }, 1500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 전문가 활동상태 수정
  const toggleActivityStatus = () => {
    myAxios(token, setToken)
      .post("http://localhost:8080" + "/activityStatus", {
        username: user.username,
      })
      .then((res) => {
        if (res.data) {
          setIsModalOpen(true);

          setTimeout(() => {
            setIsModalOpen(false);
            getAccount();
          }, 1500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <div className="mypage-layout">
      <h1 className="mypage-title">정산계좌 관리</h1>
      <div>
        <h3 className="mypage-sectionTitle">계좌 정보</h3>
        <div className="labelInput-wrapper">
          <label style={{ width: "120px" }}>예금주</label>
          <Input
            value={account.settleHost}
            onChange={(e) =>
              setAccount({ ...account, settleHost: e.target.value })
            }
          />
        </div>
        <div className="labelInput-wrapper">
          <label style={{ width: "120px" }}>은행명</label>
          <Input
            type="select"
            style={{ width: "200px" }}
            value={account.settleBank}
            onChange={(e) =>
              setAccount({ ...account, settleBank: e.target.value })
            }
          >
            <option value="">은행 선택</option>
            <option value="국민은행">국민은행</option>
            <option value="신한은행">신한은행</option>
            <option value="우리은행">우리은행</option>
            <option value="하나은행">하나은행</option>
            <option value="농협은행">농협은행</option>
            <option value="기업은행">기업은행</option>
            <option value="SC제일은행">SC제일은행</option>
          </Input>
        </div>
        <div className="labelInput-wrapper">
          <label style={{ width: "120px" }}>계좌번호</label>
          <Input
            type="number"
            value={account.settleAccount}
            onChange={(e) =>
              setAccount({ ...account, settleAccount: e.target.value })
            }
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {account.activityStatus === "ACTIVE" ? (
          <p
            style={{
              color: "#ADADAD",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "18px",
            }}
            onClick={() => toggleActivityStatus()}
          >
            전문가 활동중단
          </p>
        ) : (
          <p
            style={{
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "18px",
            }}
            onClick={() => toggleActivityStatus()}
          >
            전문가 활동재개
          </p>
        )}
        <button
          className="primary-button"
          style={{ width: "200px", height: "40px", fontSize: "14px" }}
          onClick={() => modifyAccount()}
        >
          완료
        </button>
        <span style={{ width: "48.4px" }} />
      </div>

      <Modal
        isOpen={isModalOpen}
        className="mypage-modal"
        style={{ width: "380px" }}
      >
        <ModalBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              fontSize: "14px",
            }}
          >
            <p>정상적으로 수정되었습니다.</p>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
