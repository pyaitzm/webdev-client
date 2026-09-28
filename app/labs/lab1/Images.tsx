/* eslint-disable @next/next/no-img-element */
export default function Images() {
  return (
    <div id="wd-images">
      <h4>Image tag</h4>
      Loading an image from the internet:
      <br />
      <img
        id="wd-starship"
        width="400px"
        alt="Starship"
        src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
      />
      <br />
      Loading a local image:
      <br />
      <img
        id="wd-teslabot"
        src="/images/teslabot.jpg"
        height="200px"
        alt="Tesla Bot (Optimus) humanoid robot"
      />
      <br />
      Loading another remote image:
      <br />
      <img
        id="wd-ai-image"
        src="https://solarsystem.nasa.gov/system/resources/detail_files/4114_N00279747.jpg"
        width="200px"
        alt="Earth from space"
      />
      <br />
      Loading another local image:
      <br />
      <img
        id="wd-your-image"
        src="/images/schedule.jpg"
        height="325px"
        alt="Ryan's Fall 2026 Class Schedule"
      />
    </div>
  );
}
