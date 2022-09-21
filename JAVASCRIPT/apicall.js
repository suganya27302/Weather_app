function fetchCityName() {
  let response = new Promise(async (resolve, reject) => {
    let cityName = await fetch("https://soliton.glitch.me?city=Nome", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    resolve(cityName);
  });
  return response;
}
fetchCityName().then(
  (response) => console.log(response.json()),
  //   (response) => async (response) => {
  //     let cityName = await response.json();
  //     console.log(cityName);
  //   },
  (error) => console.log(error)
);
