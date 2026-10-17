// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClientForm from "./ClientForm";
import UserForm from "./UserForm";
import ContentForm from "./ContentForm";
import TaskForm from "./TaskForm";

// Quill doesn't run in jsdom; a textarea is enough to test the forms.
vi.mock("../RichTextEditor", () => ({
  default: ({ value, onChange }) => (
    <textarea
      aria-label="Body"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

afterEach(cleanup);

// Radix measures elements with ResizeObserver, which jsdom doesn't provide.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const submitted = (onSubmit) => onSubmit.mock.calls[0][0];

describe("ClientForm", () => {
  it("submits the loaded client when editing", async () => {
    const onSubmit = vi.fn();
    render(
      <ClientForm
        initialValues={{ name: "Acme", status: "SUSPENDED", server: "live5", platform: ["MT4"] }}
        onSubmit={onSubmit}
      />,
    );

    await userEvent.clear(screen.getByLabelText("Name"));
    await userEvent.type(screen.getByLabelText("Name"), "Acme Ltd");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(submitted(onSubmit)).toEqual({
      name: "Acme Ltd",
      status: "SUSPENDED",
      server: "live5",
      platform: ["MT4"],
    });
  });

  it("starts empty with sensible defaults for a new client", async () => {
    const onSubmit = vi.fn();
    render(<ClientForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Name"), "New Co");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(submitted(onSubmit)).toEqual({
      name: "New Co",
      status: "ACTIVE",
      server: "live1",
      platform: [],
    });
  });
});

describe("UserForm", () => {
  it("suggests a username and needs matching passwords for a new user", async () => {
    const onSubmit = vi.fn();
    render(<UserForm isNew onSubmit={onSubmit} />);
    const create = screen.getByRole("button", { name: "Create" });

    await userEvent.type(screen.getByLabelText("Firstname"), "Ana");
    await userEvent.type(screen.getByLabelText("Lastname"), "Ivic");
    expect(screen.getByLabelText("Username")).toHaveProperty("value", "ana.ivic");

    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "short");
    expect(screen.getByText(/at least 8 characters/)).toBeTruthy();
    expect(create).toHaveProperty("disabled", true);

    await userEvent.type(screen.getByLabelText("Password"), "-enough");
    await userEvent.type(screen.getByLabelText("Repeat Password"), "short-nope");
    expect(screen.getByText("Passwords do not match")).toBeTruthy();
    expect(create).toHaveProperty("disabled", true);

    await userEvent.clear(screen.getByLabelText("Repeat Password"));
    await userEvent.type(screen.getByLabelText("Repeat Password"), "short-enough");
    await userEvent.click(create);

    expect(submitted(onSubmit)).toEqual({
      firstname: "Ana",
      lastname: "Ivic",
      username: "ana.ivic",
      email: "ana@example.com",
      password: "short-enough",
      role: "SUPPORT",
      active: true,
      centroid: false,
    });
  });

  it("edits without password fields and sends only user fields", async () => {
    const onSubmit = vi.fn();
    render(
      <UserForm
        initialValues={{
          id: "u1",
          createdAt: "2026-01-01",
          firstname: "Ana",
          lastname: "Ivic",
          username: "ana.custom",
          email: "ana@example.com",
          role: "MANAGER",
          active: false,
          centroid: true,
        }}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.queryByLabelText("Password")).toBeNull();
    // Editing the name must not overwrite an existing username.
    await userEvent.type(screen.getByLabelText("Lastname"), "c");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(submitted(onSubmit)).toEqual({
      firstname: "Ana",
      lastname: "Ivicc",
      username: "ana.custom",
      email: "ana@example.com",
      role: "MANAGER",
      active: false,
      centroid: true,
    });
  });
});

describe("ContentForm", () => {
  it("submits a guide without release fields", async () => {
    const onSubmit = vi.fn();
    render(<ContentForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Title"), "How to");
    await userEvent.type(screen.getByLabelText("Body"), "<p>Steps</p>");
    await userEvent.click(screen.getByLabelText("Published"));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(submitted(onSubmit)).toEqual({
      title: "How to",
      description: "<p>Steps</p>",
      published: true,
    });
  });

  it("sends a feature's release date as yyyy-MM-dd", async () => {
    const onSubmit = vi.fn();
    render(
      <ContentForm
        withRelease
        initialValues={{
          title: "Dark mode",
          description: "<p>x</p>",
          releaseDate: new Date(2026, 9, 1),
          released: true,
          published: false,
        }}
        onSubmit={onSubmit}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(submitted(onSubmit)).toEqual({
      title: "Dark mode",
      description: "<p>x</p>",
      releaseDate: "2026-10-01",
      released: true,
      published: false,
    });
  });
});

describe("TaskForm", () => {
  const renderWithClients = (ui) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { staleTime: Infinity } },
    });
    queryClient.setQueryData(["clients", "active"], [{ id: "c1", name: "Acme" }]);
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  };

  it("submits an edited task with its client", async () => {
    const onSubmit = vi.fn();
    renderWithClients(
      <TaskForm
        initialValues={{
          title: "Login issue",
          client: "c1",
          description: "<p>x</p>",
          status: "IN_PROGRESS",
          priority: "HIGH",
        }}
        submitLabel="Save changes"
        onSubmit={onSubmit}
      />,
    );

    // The selected client is shown (Radix also renders a hidden <select>).
    expect(screen.getAllByText("Acme").length).toBeGreaterThan(0);
    await userEvent.type(screen.getByLabelText("Title"), " (urgent)");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(submitted(onSubmit)).toEqual({
      title: "Login issue (urgent)",
      client: "c1",
      description: "<p>x</p>",
      status: "IN_PROGRESS",
      priority: "HIGH",
    });
  });

  it("starts a new task from the description template", async () => {
    const onSubmit = vi.fn();
    renderWithClients(<TaskForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Title"), "New one");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    const task = submitted(onSubmit);
    expect(task).toMatchObject({ title: "New one", client: "", status: "TODO", priority: "LOW" });
    expect(task.description).toContain("Problem Description");
  });
});
