import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import axios from "axios";

jest.mock("axios");

describe("AI Image Caption Generator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("TC#1 – Renders header and upload prompt", () => {
    render(<App />);
    expect(screen.getByText(/AI Image Caption Generator/i)).toBeInTheDocument();
    expect(screen.getByText(/Click or drag & drop an image here/i)).toBeInTheDocument();
  });

  test("TC#2 – Uploads valid image and shows preview", async () => {
    render(<App />);
    const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText(/upload/i) || screen.getByRole("textbox", { hidden: true });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });
  });

  test("TC#3 – Shows error for unsupported file type", () => {
    render(<App />);
    const file = new File(["dummy"], "test.gif", { type: "image/gif" });
    const input = screen.getByLabelText(/upload/i) || screen.getByRole("textbox", { hidden: true });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText(/Only JPEG, PNG, and WebP images are supported/i)).toBeInTheDocument();
  });

  test("TC#4 – Generates caption on valid submission", async () => {
    axios.post.mockResolvedValueOnce({ data: { caption: "A scenic mountain view." } });

    render(<App />);
    const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText(/upload/i) || screen.getByRole("textbox", { hidden: true });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Generate Caption/i));

    await waitFor(() => {
      expect(screen.getByText(/A scenic mountain view/i)).toBeInTheDocument();
    });
  });

  test("TC#5 – Shows error on backend failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("Server error"));

    render(<App />);
    const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText(/upload/i) || screen.getByRole("textbox", { hidden: true });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Generate Caption/i));

    await waitFor(() => {
      expect(screen.getByText(/Error generating caption/i)).toBeInTheDocument();
    });
  });
});
