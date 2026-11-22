export default function WorkingWithRemoteObjects() {
  const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

  return (
    <div id="wd-working-with-remote-objects">
      <h4>Retrieving Objects</h4>
      <a
        id="wd-retrieve-assignments"
        href={`${HTTP_SERVER}/lab5/assignment`}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Get Assignment
      </a>
      <h4>Retrieving Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        href={`${HTTP_SERVER}/lab5/assignment/title`}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Get Title
      </a>
    </div>
  );
}
