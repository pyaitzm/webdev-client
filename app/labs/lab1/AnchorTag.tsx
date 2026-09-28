export default function AnchorTag() {
  return (
    <>
      <h4>Anchor tag</h4>
      Please{" "}
      <a href="https://www.lipsum.com" id="wd-lipsum">
        click here
      </a>{" "}
      to get dummy text.
      <br />
      <a href="https://github.com/jannunzi" id="wd-github">
        GitHub
      </a>
      <br />

      A Popular Website:{" "}
      <a href="https://www.google.com" id="wd-your-link">
        Google
      </a>
      <br />
      This is my{" "}
      <a
        id="wd-your-github"
        href="https://github.com/pyaitzm"
        target="_blank"
        rel="noreferrer"
      >
        GitHub Profile
      </a>
      .
      <br />

      <a
        href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table"
        id="wd-ai-link"
      >
        MDN: table element
      </a>
      <br />
    </>
  );
}
