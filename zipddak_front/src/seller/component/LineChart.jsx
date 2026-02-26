import { Line } from "react-chartjs-2";
import "chart.js/auto";

const LineChart = () => {
    let data = {
        labels: ["7-8", "8-9", "9-10", "10-11", "11-12", "17-18", "18-19", "19-20"],
        datasets: [
            {
                type: "line",
                label: "평균",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                borderWidth: 2,
                data: [13, 14, 15, 16],
            },
            {
                type: "line",
                label: "내 판매수량",
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 2,
                data: [18, 19, 10, 9],
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
            <Line type="line" data={data} options={options} />
        </div>
    );
};

export default LineChart;
