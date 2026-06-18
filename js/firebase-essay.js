const essayId = window.location.hash.replace("#", "");
const title = document.querySelector("#title");
const writer = document.querySelector("#writer");
const weekPrompt = document.querySelector("#week-prompt");
const content = document.querySelector("#content");
const backLink = document.querySelector("#back-link");
const backButton = document.querySelector("#back-button");

const firestoreFetchEssay = async () => {
  if (!essayId) return;

  try {
    const fetchedEssay = await db.collection("submissions").doc(essayId).get();

    const essay = {
      id: fetchedEssay.id,
      ...fetchedEssay.data(),
    };

    console.log(essay)

    const fetchedWeek = await db
      .collection("weeks")
      .where("week_number", "==", Number(essay.week))
      .get();

    const week = fetchedWeek.docs[0].data();

    console.log(week)

    if (essay.title) {
      title.innerHTML = `<i>${essay.title}</i>`;
      writer.innerText = `by ${essay.writer}`;
    } else {
      title.innerText = essay.writer;
    }

    weekPrompt.innerHTML = `Submitted for Week ${essay.week}: <i>${week.theme}</i>`;

    content.innerHTML = essay.content.replaceAll("\n", "<br>");

    backButton.innerText += ' ' + essay.week
    backLink.href = `./#${essay.week}`
  } catch (error) {
    console.log("Error getting weeks:", error);
  }
};

firestoreFetchEssay();
