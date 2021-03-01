import React from "react";
import NumberFormat from "react-number-format";
import Card from "./Card";

function CovidSummary(props) {
  const { totalConfirmed, totalRecovered, totalDeaths, country } = props;

  return (
    <div>
      <h1 style={{ textTransform: "capitalize" }}>
        {country === "" ? "World Wide Coronavirus Cases" : country}
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card>
          <span>Totoal Confirmed </span>
          <span>
            {
              <NumberFormat
                value={totalConfirmed}
                displayType={"text"}
                thousandSeparator={true}
              />
            }
          </span>
        </Card>
        <Card>
          <span>Totoal Recovered </span>
          <span>
            {
              <NumberFormat
                value={totalRecovered}
                displayType={"text"}
                thousandSeparator={true}
              />
            }
          </span>
        </Card>
        <Card>
          <span>Totoal Death </span>
          <span>
            {
              <NumberFormat
                value={totalDeaths}
                displayType={"text"}
                thousandSeparator={true}
              />
            }
          </span>
        </Card>
      </div>
    </div>
  );
}

export default CovidSummary;
