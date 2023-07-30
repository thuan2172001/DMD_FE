import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { api } from "services";
export default function MiniChart({
  url,
  dateFrom,
  dateTo,
  input,
  source = "backend",
}: {
  source?: "backend" | "analytic";
  input?: any;
  url: string;
  dateFrom: Date;
  dateTo: Date;
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function loadData() {
      try {
        let rs = await api.post(url, {
          dateFrom,
          dateTo,
          groupBy: "date",
          ...input,
        });
        setData(rs);
      } catch (error) {
        setError("invalid");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [url]);
  return (
    <div>
      {error !== null && <p>Invalid Permission</p>}
      {loading && <p>Loading...</p>}
      {data !== null && (
        <Line
          data={data.data}
          options={{
            scales: {
              y: {
                display: true,
                ticks: {
                  display: false,
                },
              },
              x: {
                display: false,
              },
            },
          }}
        />
      )}
    </div>
  );
}
