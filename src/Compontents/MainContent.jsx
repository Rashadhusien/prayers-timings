import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayers from "./Prayers";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";
import "moment/dist/locale/ar-dz";

moment.locale("ar");

function MainContent() {
  // STATE

  const [nextPrayerIndex, setnextPrayerIndex] = useState(2);

  const [timings, setTiming] = useState({
    Fajr: "",
    Dhuhr: "",
    Asr: "",
    Maghrib: "",
    Isha: "",
  });

  const [city, setCity] = useState({
    displayName: "القاهرة",
    apiName: "cairo",
    apiCountryName: "Egypt",
  });

  const [today, setToday] = useState("");

  const [remaingingTime, setremaingingTime] = useState("");

  const availableCitys = [
    {
      id: 1,
      displayName: "القاهرة",
      apiName: "cairo",
      apiCountryName: "EG",
    },
    {
      id: 2,
      displayName: "الكويت",
      apiName: "Al Kuwayt",
      apiCountryName: "KW",
    },
    {
      id: 3,
      displayName: "مكة المكرمة",
      apiName: "Makkah al Mukarramah",
      apiCountryName: "SA",
    },
  ];

  const prayersArray = [
    { key: "Fajr", displayName: " الفجر" },
    { key: "Dhuhr", displayName: " الضهر" },
    { key: "Asr", displayName: " العصر" },
    { key: "Maghreb", displayName: " المغرب" },
    { key: "Isha", displayName: " العشاء" },
  ];

  function cityChange(event) {
    const cityObject = availableCitys.find((city) => {
      return city.apiName === event.target.value;
    });

    setCity(cityObject);
  }

  const getTimgings = async () => {
    // console.log(city.apiName, city.apiCountryName);
    // console;
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=${city.apiName}&country=${city.apiCountryName}`
    );
    // console.log(response.data.data.date);
    setTiming(response.data.data.timings);
  };

  useEffect(() => {
    getTimgings();

    // console.log("the time isss", t.format("Y"))
  }, [city]);

  useEffect(() => {
    const t = moment();

    setToday(t.format("MMM Do YYYY | h:mm"));

    let interval = setInterval(() => {
      setupCountDownTimer();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  // const data = await axios.get(
  //   "https://api.aladhan.com/v1/timingsByCity?city=cairo&country=Egypt"
  // );

  const setupCountDownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;

    // const Isha = timings["Isha"];
    // const IshaMoment = moment(Isha, "hh:mm");
    // console.log(momentNow.isBefore(IshaMoment));

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }
    setnextPrayerIndex(prayerIndex);

    // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDiffernce = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDiffernce;
    }
    // console.log(remainingTime);

    const durationRemainingTime = moment.duration(remainingTime);

    setremaingingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} :${durationRemainingTime.hours()}`
    );

    // console.log(durationRemainingTime.days());

    // console.log(
    //   "duration is",
    //   durationRemainingTime.hours(),
    //   durationRemainingTime.minutes(),
    //   durationRemainingTime.seconds()
    // );
  };

  return (
    <>
      {/* TOP ROW */}
      <Grid container>
        <Grid xs={12} sm={4} md={4}>
          <div>
            <h2>{today}</h2>
            <h1>{city.displayName}</h1>
          </div>
        </Grid>
        <Grid xs={12} sm={4} md={4}>
          <div>
            <h2>متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
            <h1>{remaingingTime}</h1>
          </div>
        </Grid>
        <Grid xs={12} sm={4} md={4}>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            style={{ marginTop: "40px", marginBottom: "20px" }}
          >
            <FormControl style={{ width: "20%" }}>
              <InputLabel id="demo-simple-select-label">
                <span style={{ color: "white" }}>المدينة</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                onChange={cityChange}
              >
                {availableCitys.map((city) => {
                  return (
                    <MenuItem key={city.id} value={city.apiName}>
                      {city.displayName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Stack>
        </Grid>
      </Grid>
      {/* END TOP ROW */}
      <Divider style={{ borderColor: "white", opacity: "0.1" }} />
      {/* PRAYERS CARDS */}
      <Stack
        direction={"row"}
        justifyContent={"space-around"}
        alignItems={"center"}
        style={{ marginTop: "50px", flexWrap: "wrap", gap: "15px" }}
      >
        <Prayers
          name="الفجر"
          image="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"
          time={timings.Fajr}
        />
        <Prayers
          name="الظهر"
          image="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"
          time={timings.Dhuhr}
        />
        <Prayers
          name="العصر"
          image="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"
          time={timings.Asr}
        />
        <Prayers
          name="المغرب"
          image="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"
          time={timings.Maghrib}
        />
        <Prayers
          name="العشاء"
          image="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"
          time={timings.Isha}
        />
      </Stack>
      {/*END PRAYERS CARDS */}
      {/* START SELECT CITY */}

      {/* END SELECT CITY */}
      <Grid container>
        <footer>
          create with &lt;3 By
          <a
            href="https://www.linkedin.com/in/rashad-husein-2770622aa/"
            target="_blank"
          >
            {" "}
            Rashad{" "}
          </a>{" "}
          From
          <a href="https://www.youtube.com/@tarmeez" target="_blank">
            {" "}
            TarmeezAcademy{" "}
          </a>
        </footer>
      </Grid>
    </>
  );
}

export default MainContent;
