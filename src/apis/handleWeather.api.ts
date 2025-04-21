//https://api.open-meteo.com/v1/forecast?latitude=-33.4569&longitude=-70.6483&hourly=temperature_2m&current=temperature_2m,precipitation,rain,is_day&forecast_days=1

export async function handleWeather(latitude: string, longitude: string) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.append("latitude", latitude);
  url.searchParams.append("longitude", longitude);
  url.searchParams.append("hourly", "temperature_2m");
  url.searchParams.append(
    "current",
    "temperature_2m,precipitation,rain,is_day"
  );
  url.searchParams.append("forecast_days", "1");
  const response = await fetch(url.toString());
  const data = await response.json();

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data),
      },
    ],
  };
}
