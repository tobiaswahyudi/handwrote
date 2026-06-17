var weeks = [];
var activeWeek = Number(window.location.hash.replace("#", ""));

const essayId = window.location.hash.replace("#", "");
const title = document.querySelector("#title");
const writer = document.querySelector("#writer");
const weekSelect = document.querySelector("#week-select");
const content = document.querySelector("#content");

let submitted = false;

const firestoreFetchWeeks = async () => {
  try {
    const fetchedWeeks = await db.collection("weeks").get();
    fetchedWeeks.forEach((week) =>
      weeks.push({
        id: week.id,
        ...week.data(),
        essays: [],
        essaysFetched: false,
      }),
    );
    weeks.sort((a, b) => b.week_number - a.week_number);

    weeks.forEach(({ week_number, theme }) => {
      const option = document.createElement("option");
      option.innerText = `Week ${week_number} (${theme})`;
      option.value = week_number;
      weekSelect.appendChild(option);
    });

    weekSelect.value = activeWeek;

    writer.value = getUser()?.displayName;
  } catch (error) {
    console.log("Error getting weeks:", error);
  }
};

firestoreFetchWeeks();

const handleFormSubmit = (e) => {
  const user = getUser();
  if (!user || submitted) return;
  submitted = true;
  e.preventDefault();
  console.log(e);
  const formData = {
    ...Object.fromEntries(new FormData(e.target)),
    created_by: user.uid
  }
  console.log(formData);

  title.disabled = true
  writer.disabled = true
  weekSelect.disabled = true
  content.disabled = true

  db.collection("submissions")
    .add(formData)
    .then(() => {
      window.navigation.back();
    });
};
