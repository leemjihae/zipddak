import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function LineChart({ line }) {
    const data = {
        labels: line?.map((item) => {
            const month = item.month.split("-")[1]; // "07"
            return `${Number(month)}월`; // 7월
        }),
        datasets: [
            {
                label: "월별 수익",
                data: line?.map((item) => item.value),
                borderColor: "#6366F1",
                backgroundColor: "rgba(99, 102, 241, 0.15)",
                tension: 0.4, // 곡선 정도
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: "bottom",
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: "100%", height: "350px" }}>
            <Line data={data} options={options} />
        </div>
    );
}
