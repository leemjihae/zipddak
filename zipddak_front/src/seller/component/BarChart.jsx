import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const BarChart = () => {
    let data = {
        labels: ["7-8", "8-9", "9-10", "10-11", "11-12", "17-18", "18-19", "19-20"],
        datasets: [
            {
                type: "bar",
                label: "평균",
                backgroundColor: "rgb(255, 99, 132)",
                data: [13, 14, 15, 16],
                borderColor: "red",
                borderWidth: 2,
            },
            {
                type: "bar",
                label: "내 매출액",
                backgroundColor: "rgb(75, 192, 192)",
                data: [13, 14, 15, 16],
            },
        ],
    };
    const options = {
        plugins: {
            legend: {
                align: "end",
                labels: {
                    usePointStyle: true, // point 스타일 사용
                    pointStyle: "circle", // 원형 아이콘
                    boxWidth: 10, // 아이콘 크기
                    boxHeight: 10,
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: "100%", height: "350px", margin: "0 auto" }}>
            <Bar type="bar" data={data} options={options} />
        </div>
    );
};

export default BarChart;
