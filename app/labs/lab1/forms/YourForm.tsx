export default function YourForm() {
  return (
    <form id="wd-your-form">
      <h2>Student Profile</h2>

      <label htmlFor="first-name">First Name: </label>
      <input id="first-name" type="text" placeholder="Pyait" />
      <br />
      <label htmlFor="last-name">Last Name: </label>
      <input id="last-name" type="text" placeholder="Myat" />
      <br />
      <label htmlFor="student-id">Student ID: </label>
      <input id="student-id" type="password" placeholder="003973692" />
      <br />
      <label htmlFor="school-email">School Email: </label>
      <input
        id="school-email"
        type="email"
        placeholder="myat.p@northeastern.edu"
      />
      <br />
      <label htmlFor="graduation-year">Expected Graduation Year: </label>
      <input
        id="graduation-year"
        type="number"
        min={2026}
        max={2035}
        placeholder="2028"
      />
      <br />
      <label htmlFor="start-date">Program Start Date: </label>
      <input id="start-date" type="date" defaultValue="2026-09-09" />
      <br />
      <label htmlFor="excitement">Course Excitement Level (0-10): </label>
      <input id="excitement" type="range" min="0" max="10" defaultValue="7" />
      <br />

      <label htmlFor="bio">Why are you taking this course?</label>
      <br />
      <textarea
        id="bio"
        cols={50}
        rows={3}
        placeholder="I am pursuing a master's in computer science and want to strengthen my web development skills."
      />
      <br />

      <label>Class Standing: </label>
      <br />
      <input type="radio" name="class-standing" id="freshman" />
      <label htmlFor="freshman">Freshman</label>
      <br />
      <input type="radio" name="class-standing" id="sophomore" />
      <label htmlFor="sophomore">Sophomore</label>
      <br />
      <input type="radio" name="class-standing" id="junior" />
      <label htmlFor="junior">Junior</label>
      <br />
      <input type="radio" name="class-standing" id="senior" />
      <label htmlFor="senior">Senior</label>
      <br />
      <input type="radio" name="class-standing" id="graduate" />
      <label htmlFor="graduate">Graduate</label>
      <br />
      <label>Enrollment Status: </label>
      <br />
      <input type="radio" name="enrollment-status" id="full-time" />
      <label htmlFor="full-time">Full-Time</label>
      <br />
      <input type="radio" name="enrollment-status" id="part-time" />
      <label htmlFor="part-time">Part-Time</label>
      <br />

      <label>Interests: </label>
      <br />
      <input type="checkbox" name="interests" id="python" />
      <label htmlFor="python">Python</label>
      <br />
      <input type="checkbox" name="interests" id="typescript" />
      <label htmlFor="typescript">TypeScript</label>
      <br />
      <input type="checkbox" name="interests" id="javascript" />
      <label htmlFor="javascript">JavaScript</label>
      <br />
      <input type="checkbox" name="interests" id="java" />
      <label htmlFor="java">Java</label>
      <br />

      <label htmlFor="major">Major: </label>
      <select id="major" defaultValue="COMPUTER_SCIENCE">
        <option value="ARTIFICIAL_INTELLIGENCE">Artificial Intelligence</option>
        <option value="COMPUTER_SCIENCE">Computer Science</option>
        <option value="CYBERSECURITY">Cybersecurity</option>
        <option value="DATA_SCIENCE">Data Science</option>
        <option value="ROBOTICS">Robotics</option>
      </select>
      <br />


      <label htmlFor="topics">Topics of Interest: </label>
      <br />
      <select
        id="topics"
        multiple
        defaultValue={["fullstack", "deployment"]}
      >
        <option value="frontend">Frontend Development</option>
        <option value="backend">Backend Development</option>
        <option value="fullstack">Full-Stack Development</option>
        <option value="databases">Databases</option>
        <option value="testing">Testing</option>
        <option value="deployment">Deployment and DevOps</option>
      </select>
      <br />

      <button id="save-profile" type="submit">Save</button>
      <button id="cancel-profile" type="button">Cancel</button>
    </form>
  );
}
