var weeks = [];
var activeWeek = Number(window.location.hash.replace("#", ""));

const weekListElement = document.querySelector("#week-list")

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
    console.log(weeks);

    weeks.forEach(({week_number}) => {
      const button = document.createElement('button')
      button.onclick = () => changeWeek(week_number)
      button.innerText = 'Week ' + week_number
      weekListElement.appendChild(button)
    })

    const startingActiveWeek = activeWeek || weeks[0].week_number;
    changeWeek(startingActiveWeek)
  } catch (error) {
    console.log("Error getting weeks:", error);
  }
};

firestoreFetchWeeks();

const fetchActiveWeek = async () => {
  const week = weeks.find((w) => w.week_number == activeWeek);
  if (week.essaysFetched) return;
  const essays = await db
    .collection("submissions")
    .where("week", "==", activeWeek)
    .get();
  essays.forEach((essay) => {
    week.essays.push({
      id: essay.id,
      ...essay.data(),
    });
    console.log(week.essays);
  });
  week.essaysFetched = true;
};

const changeWeek = async (n) => {
  activeWeek = n;
  await fetchActiveWeek();
  changeWeekDisplay();
};

const weekTitle = document.querySelector("#week-title")
const weekDateRange = document.querySelector("#week-date-range")
const weekEssayList = document.querySelector("#week-essay-list")

const changeWeekDisplay = () => {
  // first: update week selector list
  const weekIndex = weeks.findIndex(w => w.week_number == activeWeek);
  const week = weeks[weekIndex];
  [...weekListElement.children].forEach(e => e.disabled = false)
  weekListElement.children[weekIndex].disabled = true

  // second: update week title
  weekTitle.innerHTML = `Week ${activeWeek}: <i>${week.theme}</i>`
  weekDateRange.innerText = `(${stinkyFormatDate(week.date_start)} - ${stinkyFormatDate(week.date_end)})`

  // third: update week essays
  // teardown all essays
  weekEssayList.innerHTML = ''
  week.essays.forEach(essay => {
    const li = document.createElement('li')
    li.innerHTML = `
      <h3>${essay.title ? `<i>${essay.title}</i> by ` : ''}${essay.writer}</h3>
			<p>${getTextExcerpt(essay.content)}</p>
			<a href="/essay#${essay.id}"><button>Read</button></a>
    `
    weekEssayList.appendChild(li)
  })
}

const stinkyFormatDate = (timestamp) => {
  const seconds = timestamp.seconds
  const millis = seconds * 1000
  const date = new Date(millis)
  const segments = date.toDateString().split(' ')
  return segments[1] + ' ' + segments[2]
}

const getTextExcerpt = (fulltext) => {
  const clipped = fulltext.substring(0, EXCERPT_MAX_LENGTH)
  const words = clipped.split(' ')
  words.pop()
  return words.join(' ') + '...'
}