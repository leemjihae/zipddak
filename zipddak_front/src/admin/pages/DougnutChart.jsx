import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

export default function DougnutChart({ dougnut }) {
    const data = {
        labels: ["멤버십", "전문가 매칭 수수료", "판매 수수료", "공구 대여 수수료"],
        datasets: [
            {
                data: [dougnut?.membership, dougnut?.matchingFee, dougnut?.orderFee, dougnut?.rentalFee],
                backgroundColor: ["#16A34A", "#2563EB", "#D97706", "#7C3AED"],
                borderWidth: 1,
            },
        ],
    };

    // options는 data 밖에 둠
    const options = {
        plugins: {
            legend: {
                position: "bottom",
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: "100%", height: "220px", margin: "0 auto" }}>
            <Doughnut data={data} options={options} />
        </div>
    );
}
