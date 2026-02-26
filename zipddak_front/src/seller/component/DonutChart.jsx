import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

export default function DonutChart() {
    const data = {
        labels: ["카테1", "카테2", "카테3", "카테4", "카테5", "카테6", "카테7", "카테8", "카테9", "카테10", "카테11"],
        datasets: [
            {
                data: [12, 19, 3, 5, 7, 32, 12, 4, 18, 21, 16],
                backgroundColor: ["rgba(255, 99, 132)", "rgba(54, 162, 235)", "rgba(255, 54, 86)", "rgba(255, 206, 54)", "rgba(54, 206, 86)", "rgba(255, 54, 86)", "rgba(255, 206, 54)", "rgba(54, 206, 86)", "rgba(206, 206, 86)", "rgba(99, 206, 86)", "rgba(54, 206, 99)"],
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
        <div style={{ width: "100%", height: "300px", margin: "0 auto" }}>
            <Doughnut data={data} options={options} />
        </div>
    );
}
