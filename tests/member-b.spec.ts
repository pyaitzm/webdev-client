import { expect, test, type Page, type Locator } from "@playwright/test";
import users from "../app/(kambaz)/database/users.json";
import { defaultFolderNames } from "../app/(kambaz)/courses/[cid]/piazza/shared/mockData";
import { usePazzaStore } from "../app/(kambaz)/courses/[cid]/piazza/member-b/pazzaStore";

const manageURL = "/courses/RS101/piazza/manage/folders";
const question = /Question about homework 1/;
const note = /Office hours scheduling note/;
const button = (root: Page | Locator, name: string | RegExp) => root.getByRole("button", { name, exact: true });

async function signIn(page: Page, id: string) {
  await page.waitForLoadState("networkidle");
  const user = users.find(user => user._id === id)!;
  await page.locator("#wd-username").fill(user.username);
  await page.locator("#wd-password").fill(user.password);
  await page.locator("#wd-signin-btn").click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function openCourse(page: Page, cid = "RS101") {
  if (!page.url().endsWith("/dashboard")) await page.locator("#wd-dashboard-link").click();
  await page.locator(`a.wd-dashboard-course-link[href="/courses/${cid}/home"]`).click();
  await page.locator("#wd-course-piazza-link").click();
  await expect(page.getByRole("heading", { name: "Class at a Glance" })).toBeVisible();
}

async function loginCourse(page: Page, id: string) {
  await page.goto("/account/signin");
  await signIn(page, id);
  await openCourse(page);
}

for (const [id, kind, author] of [["123", "Student", "Tony Stark"], ["678", "Instructor", "Nick Fury"]]) {
  test(kind + " answer CRUD, formatting, attribution and statistics", async ({ page }) => {
    await loginCourse(page, id);
    const metric = page.getByRole("heading", { name: kind + " Responses" }).locator("..").locator("p");
    const before = Number(await metric.innerText());
    await button(page, question).click();
    const seeded = page.locator("#wd-pazza-answers li").filter({ hasText: "Start with the diagram" });
    await expect(seeded.locator("p")).toHaveText("Start with the diagram in the assignment.");
    if (kind === "Student") await expect(button(seeded, "Edit")).toHaveCount(0);
    await expect(button(page, "Post Answer")).toBeDisabled();
    const composer = page.locator('[aria-label="Answer content"]');
    await composer.locator(".ql-bold").click();
    await composer.locator(".ql-editor").pressSequentially("First answer");
    await button(page, "Post Answer").click();
    const section = page.getByRole("heading", { name: kind + " Answers" }).locator("..");
    const row = section.locator("li").filter({ hasText: "First answer" });
    await expect(row.locator("strong")).toHaveText("First answer");
    await expect(row).toContainText(author);
    await expect(row.locator("time")).toHaveText(/\d/);
    await button(row, "Edit").click();
    const editor = section.locator('[aria-label="Edit answer"] .ql-editor');
    await editor.fill("Discard this edit");
    await button(section, "Cancel").click();
    await expect(row).toBeVisible();
    await button(row, "Edit").click();
    await editor.fill("Revised answer");
    await button(section, "Save").click();
    if (kind === "Instructor") {
      await button(page, note).click();
      await expect(page.locator("#wd-pazza-answers")).toHaveCount(0);
    }
    await button(page, "Q&A").click();
    await expect(metric).toHaveText(String(before + 1));
    await button(page, question).click();
    const revised = section.locator("li").filter({ hasText: "Revised answer" });
    await button(revised, "Delete").click();
    await expect(revised).toHaveCount(0);
    await button(page, "Q&A").click();
    await expect(metric).toHaveText(String(before));
  });
}

test("discussions and nested replies support CRUD, cancellation, reopening and cascade deletion", async ({ page }) => {
  await loginCourse(page, "234");
  await button(page, question).click();
  const panel = page.locator("#wd-pazza-follow-ups");
  await page.getByLabel("Start a follow-up discussion").fill("My discussion");
  await button(panel, "Add Discussion").click();
  const thread = panel.locator("article").filter({ hasText: "My discussion" });
  await button(thread, "Edit").click();
  await page.getByLabel("Edit follow-up discussion").fill("Discard");
  await button(panel, "Cancel").click();
  await expect(thread).toBeVisible();
  await button(thread, "Edit").click();
  await page.getByLabel("Edit follow-up discussion").fill("My discussion edited");
  await button(panel, "Save").click();
  await button(thread, "Mark resolved").click();
  for (const [index, text] of ["Root reply", "Child reply", "Grandchild reply"].entries()) {
    await button(thread, "Reply").nth(index).click();
    await page.locator("#wd-new-reply").fill(text);
    await button(panel, "Post Reply").click();
  }
  await button(page, note).click();
  await expect(thread).toHaveCount(0);
  await button(page, question).click();
  await expect(thread.getByText("Resolved", { exact: true })).toBeVisible();
  await button(thread, "Mark unresolved").click();
  await expect(thread.getByText("Unresolved", { exact: true })).toBeVisible();
  const child = thread.getByText("Child reply", { exact: true }).locator("..");
  await button(child, "Edit").first().click();
  await page.getByLabel("Edit reply", { exact: true }).fill("Discard");
  await button(thread, "Cancel").click();
  await button(child, "Edit").first().click();
  await page.getByLabel("Edit reply", { exact: true }).fill("Edited child");
  await button(thread, "Save").click();
  const edited = thread.getByText("Edited child", { exact: true }).locator("..");
  await expect(edited.getByText("Grandchild reply")).toBeVisible();
  await button(edited, "Reply").first().click();
  await button(edited, "Delete").first().click();
  await expect(page.locator("#wd-new-reply")).toHaveCount(0);
  await expect(thread.getByText("Grandchild reply")).toHaveCount(0);
  await expect(thread.getByText("Root reply")).toBeVisible();
  await button(thread, "Delete").first().click();
  await expect(thread).toHaveCount(0);
  await expect(panel.getByText("Let's compare our diagrams.")).toBeVisible();
});

test("a second student cannot modify another student's records, and faculty can moderate them", async ({ page }) => {
  await loginCourse(page, "123");
  await button(page, question).click();
  const otherThread = page.locator("#wd-pazza-follow-ups article").first();
  await expect(button(otherThread, "Mark resolved")).toHaveCount(0);
  const threadControls = otherThread.locator(":scope > div.flex").filter({ has: button(page, "Reply") });
  await expect(button(threadControls, "Edit")).toHaveCount(0);
  await expect(button(threadControls, "Delete")).toHaveCount(0);
  await page.locator('[aria-label="Answer content"] .ql-editor').fill("Student-owned answer");
  await button(page, "Post Answer").click();
  const row = page.locator("#wd-pazza-answers li").filter({ hasText: "Student-owned answer" });
  for (const id of ["234", "678"]) {
    await page.locator("#wd-account-link").click();
    await page.locator("#wd-signout-btn").click();
    await signIn(page, id);
    await openCourse(page);
    await button(page, question).click();
    await expect(row).toBeVisible();
    const reply = page.getByText("Let's compare our diagrams.", { exact: true }).locator("..");
    if (id === "234") {
      await expect(button(row, "Edit")).toHaveCount(0);
      await expect(button(row, "Delete")).toHaveCount(0);
      await expect(reply.locator(":scope > button").filter({ hasText: "Edit" })).toHaveCount(0);
      await expect(reply.locator(":scope > button").filter({ hasText: "Delete" })).toHaveCount(0);
    } else {
      await expect(button(row, "Edit")).toBeVisible();
      await button(row, "Delete").click();
      await expect(row).toHaveCount(0);
      await expect(button(reply, "Delete").first()).toBeVisible();
      await page.getByRole("link", { name: "Manage Class" }).click();
      await expect(page).toHaveURL(manageURL);
      await expect(page.locator("#wd-pazza-manage-folders").getByRole("checkbox")).toHaveCount(11);
    }
  }
});

test("guest access, direct folder URL and signed-in student restriction", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("pageerror", error => {
    if (/hydrat|react error #418/i.test(error.message)) hydrationErrors.push(error.message);
  });
  await page.goto(manageURL, { waitUntil: "networkidle" });
  const denied = page.getByRole("heading", { name: "Instructor access required" });
  await expect(denied).toBeVisible();
  await page.locator("#wd-account-link").click();
  await signIn(page, "123");
  await page.goBack();
  await page.goBack();
  await expect(page).toHaveURL(manageURL);
  await expect(denied).toBeVisible();
  await expect(page.getByLabel("New folder name")).toHaveCount(0);
  await page.locator("#wd-course-piazza-link").click();
  await expect(page.getByLabel("Current user")).toHaveText("Tony Stark");
  await expect(page.getByRole("link", { name: "Manage Class" })).toHaveCount(0);
  await page.goto("/courses/RS101/piazza", { waitUntil: "networkidle" });
  await expect(page.getByLabel("Current user")).toHaveText("Guest");
  await button(page, question).click();
  await expect(page.getByText("Let's compare our diagrams.")).toBeVisible();
  await expect(button(page, "Reply")).toHaveCount(0);
  await expect(page.locator("#wd-new-discussion, #wd-new-reply")).toHaveCount(0);
  await expect(button(page, "Post Answer")).toHaveCount(0);
  expect(hydrationErrors).toEqual([]);
});

test("folder management, shared filter and post form, and three-course isolation", async ({ page }) => {
  await page.goto("/account/signin");
  await signIn(page, "456"); // The TA fixture is initially enrolled in RS101 and RS103.
  await page.locator("#wd-enrollments-toggle").click();
  const aerodynamics = page.locator(".wd-dashboard-course").filter({ hasText: "Aerodynamics" });
  await button(aerodynamics, "Enroll").click();
  await openCourse(page);
  const manage = page.getByRole("link", { name: "Manage Class" });
  const list = page.locator("#wd-pazza-manage-folders");
  const filters = page.getByLabel("Pazza folder filters");
  const folderRow = (name: string) => list.getByLabel("Select " + name, { exact: true }).locator("..");
  await manage.click();
  await expect(list.getByRole("checkbox")).toHaveCount(11);
  const initial = await list.getByRole("checkbox").evaluateAll(boxes => boxes.map(box => box.getAttribute("aria-label")));
  expect(initial).toEqual(defaultFolderNames.map(name => "Select " + name));
  for (const name of ["New folder", "Second folder"]) {
    await list.getByLabel("New folder name").fill(name);
    await button(list, "Add Folder").click();
  }
  await button(folderRow("New folder"), "Edit").click();
  await list.getByLabel("Edit folder name").fill("Discard");
  await button(list, "Cancel").click();
  await button(folderRow("New folder"), "Edit").click();
  await list.getByLabel("Edit folder name").fill("Renamed folder");
  await button(list, "Save").click();
  await button(folderRow("hw1"), "Edit").click();
  await list.getByLabel("Edit folder name").fill("Homework one");
  await button(list, "Save").click();
  await folderRow("Homework one").getByRole("checkbox").check();
  await button(list, /Delete selected/).click();
  await expect(list.getByRole("alert")).toBeVisible();
  await page.locator("#wd-course-piazza-link").click();
  await button(filters, "Homework one").click();
  await button(page, question).click();
  await expect(page.getByLabel("Post folders")).toContainText("Homework one");
  await expect(button(filters, "Renamed folder")).toBeVisible();
  await button(page, "New Post").click();
  await page.getByRole("checkbox", { name: "Renamed folder" }).check();
  for (const cid of ["RS102", "RS103"]) {
    await openCourse(page, cid);
    await expect(button(filters, "Renamed folder")).toHaveCount(0);
    await expect(button(page, question)).toHaveCount(0);
    if (cid === "RS102") {
      await button(page, /Project discussion for RS102/).click();
      await expect(page.getByText("No instructor answers yet.")).toBeVisible();
      await expect(page.getByText("No follow-up discussions yet.")).toBeVisible();
    }
    await manage.click();
    await expect(list.getByRole("checkbox")).toHaveCount(11);
    await expect(folderRow("hw1")).toBeVisible();
  }
  await openCourse(page);
  await manage.click();
  for (const name of ["Renamed folder", "Second folder"]) await folderRow(name).getByRole("checkbox").check();
  await button(list, /Delete selected/).click();
  await expect(list.getByRole("checkbox")).toHaveCount(11);
  await page.locator("#wd-course-piazza-link").click();
  await expect(button(filters, "Renamed folder")).toHaveCount(0);
  await button(page, "New Post").click();
  await expect(page.getByRole("checkbox", { name: "Second folder" })).toHaveCount(0);
});

test("the post-deletion integration action removes only that course and post's children", () => {
  const previous = usePazzaStore.getState();
  const { answers, discussions, replies } = previous;
  const otherAnswer = { ...answers[0], courseId: "RS102" };
  const otherDiscussion = { ...discussions[0], courseId: "RS102" };
  const otherReply = { ...replies[0], courseId: "RS102" };
  usePazzaStore.setState({ answers: [...answers, otherAnswer], discussions: [...discussions, otherDiscussion], replies: [...replies, otherReply] });
  try {
    previous.removePostData("RS101", answers[0].postId);
    const state = usePazzaStore.getState();
    expect(state.answers).toEqual([otherAnswer]);
    expect(state.discussions).toEqual([otherDiscussion]);
    expect(state.replies).toEqual([otherReply]);
  } finally {
    usePazzaStore.setState(previous);
  }
});

test("cascade actions leave no orphan records and preserve siblings", () => {
  const initial = usePazzaStore.getState();
  const [root, child] = initial.replies;
  const grandchild = { ...child, _id: "grandchild", parentReplyId: child._id };
  const sibling = { ...root, _id: "sibling" };
  const other = { ...child, courseId: "RS102" };
  try {
    usePazzaStore.setState({ replies: [grandchild, sibling, child, root, other] });
    initial.deleteReply(root.courseId, root.discussionId, root._id);
    expect(usePazzaStore.getState().replies).toEqual([sibling, other]);
    initial.setDiscussions(root.courseId, initial.discussions[0].postId, []);
    expect(usePazzaStore.getState().replies).toEqual([other]);
  } finally {
    usePazzaStore.setState(initial);
  }
});
