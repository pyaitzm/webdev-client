export default function Destructing() {
  const person = {
    name: "John",
    sex: "male",
    age: 25,
    height: 180,
    weight: 75,
    city: "Boston",
  };
  const { name, age, height, city } = person;
  const numbers = ["one", "two", "three"];
  const [first, second, third] = numbers;
  return (
    <div id="wd-destructing">
      <h2>Destructing</h2>
      <h3>Object Destructing</h3>
      const &#123; name, age, height, city &#125; = &#123; name: "John", sex:
      "male", age: 25, height: 180, weight: 75, city: "Boston" &#125; <br />{" "}
      <br />
      name = {name} <br />
      age = {age} <br />
      height = {height} <br />
      city = {city}
      <h3>Array Destructing</h3>
      const [first, second, third] = ["one","two","three"] <br /> <br />
      first = {first} <br />
      second = {second} <br />
      third = {third}
      <hr />
    </div>
  );
}
