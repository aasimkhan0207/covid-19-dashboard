import { useEffect, useState } from "react";

import axios from "./Axios";

import "./App.css";
import LineGraph from "./components/LineGraph";
import CovidSummary from "./components/CovidSummary";

function App() {
  // States
  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const [totalRecovered, setTotalRecovered] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [loading, setLoading] = useState(true);
  const [covidSummary, setCovidSummary] = useState({});
  const [days, setDays] = useState(7);
  const [country, setCountry] = useState("");
  const [coronaCountList, setCoronaCountList] = useState([]); // Graph Y-label
  const [label, setLabel] = useState([]); // Graph X-label

  // Hook
  useEffect(() => {
    axios
      .get(`/summary`)
      .then((res) => {
        setLoading(false);

        if (res.status === 200) {
          //console.log("res.data", res.data);
          const globalData = res.data.Global;
          setTotalConfirmed(globalData.TotalConfirmed);
          setTotalRecovered(globalData.TotalRecovered);
          setTotalDeaths(globalData.TotalDeaths);
          setCovidSummary(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // COUNTRY Handler
  const countryHandler = (event) => {
    setCountry(event.target.value);

    // today
    const to = formatDate(new Date());

    // from date
    const d = new Date();
    d.setDate(d.getDate() - days); // subtract 7 days
    const from = formatDate(d);

    getReportByDateRange(event.target.value, from, to);
  };

  // DAYS Handler
  const daysHandler = (event) => {
    setDays(event.target.value);

    // today
    const to = formatDate(new Date());

    // from date
    const d = new Date();
    d.setDate(d.getDate() - event.target.value); // subtract 7 days
    const from = formatDate(d);

    getReportByDateRange(country, from, to);
  };

  const formatDate = (date) => {
    const d = new Date(date); // create Date o bject from date passed as param.

    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); // index starts from 0  ;   012 --> 12
    const _date = d.getDate();

    const fomattedDate = `${year}-${month}-${_date}`; // 2021-02-28
    return fomattedDate;
  };

  const getReportByDateRange = (countrySlug, from, to) => {
    axios
      .get(
        `/country/${countrySlug}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`
      )
      .then((res) => {
        console.log(res);

        // Y-AXIS
        const yAxis = res.data.map((d) => d.Cases);
        setCoronaCountList(yAxis);

        // X-AXIS
        const xAxis = res.data.map((d) => d.Date.substring(8, 10));

        setLabel(xAxis);

        const covidDetails = covidSummary.Countries.find(
          (country) => country.Slug === countrySlug
        );

        setTotalConfirmed(covidDetails.TotalConfirmed);
        setTotalRecovered(covidDetails.TotalRecovered);
        setTotalDeaths(covidDetails.TotalDeaths);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // render if data loading
  if (loading) {
    return <p>Data is Being Fetched...</p>;
  }

  return (
    <div className="App">
      <CovidSummary
        totalConfirmed={totalConfirmed}
        totalRecovered={totalRecovered}
        totalDeaths={totalDeaths}
        country={country}
      />

      <select value={country} onChange={countryHandler}>
        <option value="">Select Country</option>
        {covidSummary.Countries &&
          covidSummary.Countries.map((country) => (
            <option key={country.Slug} value={country.Slug}>
              {country.Country}
            </option>
          ))}
      </select>

      <select onChange={daysHandler}>
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
      </select>

      <LineGraph yAxis={coronaCountList} label={label} />
    </div>
  );
}

export default App;
