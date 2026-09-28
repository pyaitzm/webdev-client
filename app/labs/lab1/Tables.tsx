export default function Tables() {
  return (
    <div id="wd-tables">
      <h4>Table Tag</h4>
      <table border={1} width="100%">
        <thead>
          <tr>
            <th>Quiz</th>
            <th align="center">Topic</th>
            <th align="center">Date</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Q1</td>
            <td align="center">HTML</td>
            <td align="center">2/3/21</td>
            <td align="right">85</td>
          </tr>
          <tr>
            <td>Q2</td>
            <td align="center">CSS</td>
            <td align="center">2/10/21</td>
            <td align="right">90</td>
          </tr>
          <tr>
            <td>Q3</td>
            <td align="center">JavaScript</td>
            <td align="center">2/17/21</td>
            <td align="right">95</td>
          </tr>
          <tr>
            <td>Q4</td>
            <td align="center">React</td>
            <td align="center">2/24/21</td>
            <td align="right">88</td>
          </tr>
          <tr>
            <td>Q5</td>
            <td align="center">TypeScript</td>
            <td align="center">3/3/21</td>
            <td align="right">92</td>
          </tr>
          <tr>
            <td>Q6</td>
            <td align="center">Components</td>
            <td align="center">3/10/21</td>
            <td align="right">87</td>
          </tr>
          <tr>
            <td>Q7</td>
            <td align="center">Routing</td>
            <td align="center">3/17/21</td>
            <td align="right">94</td>
          </tr>
          <tr>
            <td>Q8</td>
            <td align="center">State</td>
            <td align="center">3/24/21</td>
            <td align="right">91</td>
          </tr>
          <tr>
            <td>Q9</td>
            <td align="center">Forms</td>
            <td align="center">3/31/21</td>
            <td align="right">89</td>
          </tr>
          <tr>
            <td>Q10</td>
            <td align="center">APIs</td>
            <td align="center">4/7/21</td>
            <td align="right">93</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Average</td>
            <td align="right">90.4</td>
          </tr>
        </tfoot>
      </table>

      <h4>My Class Schedule</h4>
      <table id="wd-your-table" border={5} width="98%">
        <thead>
          <tr>
            <th align="center">Day</th>
            <th align="center">Class</th>
            <th align="center">Time</th>
            <th align="center">Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td align="center" rowSpan={2}>Monday</td>
            <td align="center">CS5011 Recitation for CS5010</td>
            <td align="center">02:50 PM - 04:20 PM</td>
            <td align="center">Ryder Hall - Room 456</td>
          </tr>
          <tr>
            <td align="center">CS5610 Web Development</td>
            <td align="center">06:00 PM - 09:20 PM</td>
            <td align="center">Shillman Hall - Room 105</td>
          </tr>
          <tr>
            <td align="center">Tuesday</td>
            <td align="center">CS5010 Programming Design Paradigm</td>
            <td align="center">01:35 PM - 03:15 PM</td>
            <td align="center">Richards Hall - Room 236</td>
          </tr>
          <tr>
            <td align="center" rowSpan={2}>Friday</td>
            <td align="center">EXED6000 Professional Development Co-Op</td>
            <td align="center">11:45 AM - 12:35 PM</td>
            <td align="center">Richards Hall - Room 325</td>
          </tr>
          <tr>
            <td align="center">CS5010 Programming Design Paradigm</td>
            <td align="center">01:35 PM - 03:15 PM</td>
            <td align="center">Richards Hall - Room 236</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
