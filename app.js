const form = document.querySelector("form");
const input = document.querySelector("form input");
// formun içindeki span
const msgSpan = form.querySelector("span");
const list = document.querySelector(".container .cities");
//.class .class vs .class.class boşlıuklu olunca parent vhild ilişkisi vardır yoksa classı tamamen bu diyoruz

localStorage.setItem(
  "apiKey",
  EncryptStringAES("b4ec2f4998deadc580c3e8e3b4302f56")
);

//buton 4  şekilde click yapılır :html inline assign, addEventListener, onclick, setAttribute("submit", submitFunction)
form.addEventListener("submit", (e) => {
  //aynı sayfaya veri göndermesini tekrar tekra yenimeyi engelemek için
  e.preventDefault();
  // alert("form was submitted")
  getWeatherDataFromApi();

  //inputu temizlemek için
  form.reset();
  //input.value="";
  // e.target.reset()
  //target vs currentTarget
  //   e.currentTarget.reset();
});

//apiden veri çeken fonksiyonum
const getWeatherDataFromApi = async () => {
  const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
  console.log(apiKey);
  const cityName = input.value;
  const units = "metric";
  const lang = "tr";

  //https request url(endpoint
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`;

  try {
    //burda await yazmamızın sebebi veriler gelsin sonra devam et demek için
    const response = await fetch(url).then((response) => response.json());

    console.log(response);
    //obj. destructuring
    const { main, name, sys, weather } = response;

    const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

    console.log(iconUrl);

    //aynı isimdeki şehirlerin eklenmesini engellemek için
    const cityNameSpan = list.querySelectorAll("span");
    //filter map reduce forEach==> array
    //forEach ==> nodeList
    if (cityNameSpan.length > 0) {
      const filteredArray = [...cityNameSpan].filter(
        (span) => span.innerText == name
      );
      if (filteredArray.length > 0) {
        msgSpan.innerText = `You already know the weather for ${name}, Please search for another city 😉`;
        setTimeout(() => {
          msgSpan.innerText = "";
        }, 5000);
        return;
      }
    }

    const createdLi = document.createElement("li");

    createdLi.classList.add("city");

    createdLi.innerHTML = `<li class="city">
<h2 class="city-name" data-name="${name}, ${sys.country}">
  <span>${name}</span>
  <sup>${sys.country}</sup>
</h2>
<div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
<figure>
  // <img class="city-icon" src="${iconUrl}">
  <figcaption>${weather[0].description}</figcaption>
</figure>
</li>`;

    //append vs. prepend
    //eklediğimiz şehir ekranda başa gelsin diye
    list.prepend(createdLi);
  } catch (error) {
    //error logging
    //postErrorLog("weather.js", "getWeatherDataFromApi", date.now(), error)
    msgSpan.innerText = "city not found";
    setTimeout(() => {
      msgSpan.innerText = "";
    }, 5000);
  }
};
