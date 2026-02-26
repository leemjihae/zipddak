import "../css/ExpertQuestion.css";

export default function ExpertQuestion({ question }) {
    // const question = {
    //     question: "서비스가 시작되기전 어떤 절차로 진행하나요?",
    //     answer: "견적서 확인 및 예상 금액 전달 전화 상담 또는 채팅 상담 진행 예약 양식 작성 및 예약금 입금 장소 전일 담당 팀장님 해피콜 진행 청소 완료 후 잔금 입금",
    // };

    return (
        <div>
            <div>
                <span className="font-15 medium">Q.</span>
                <span className="font-15 medium margin-left-5">{question.question}</span>
            </div>
            <div className="font-14 answer-div">{question.answer}</div>
        </div>
    );
}
