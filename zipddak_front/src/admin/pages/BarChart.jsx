import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function BarChart({ bar }) {
    const data = {
        labels: bar?.map((item) => {
            const month = item.month.split("-")[1]; // "07"
            return `${Number(month)}월`; // 7월
        }),
        datasets: [
            {
                label: "월별 판매 수익",
                data: bar?.map((item) => item.value),
                backgroundColor: "#10B981",
                borderRadius: 6,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: "bottom",
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: "100%", height: "350px" }}>
            <Bar data={data} options={options} />
        </div>
    );
}
