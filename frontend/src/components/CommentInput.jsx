import { useState } from "react";
import axios from "axios";
import { SendHorizontal } from "lucide-react";
import { getComments } from "../utils/fetchData.js";
import CommentEditor from "./CommentEditor.jsx";
import useCloudinary from "../hooks/useCloudinary.jsx";
import { Button } from "@/components/ui/button";

// Quill leaves "<p><br></p>" when empty; a comment needs text or an image
const isEmpty = (html) =>
  !html.includes("<img") &&
  !new DOMParser().parseFromString(html, "text/html").body.textContent?.trim();

const CommentInput = ({ taskID, setComments }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const { uploadImage } = useCloudinary();

  const handleComment = async () => {
    try {
      setSending(true);
      await axios.post(
        `${BACKEND_URL}/tasks/${taskID}/comments/new`,
        { description: comment },
        { withCredentials: true },
      );
      setComment("");
      getComments(BACKEND_URL, taskID, setComments);
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 text-left">
      <CommentEditor
        value={comment}
        onChange={setComment}
        uploadImage={uploadImage}
      />
      <Button
        type="button"
        size="sm"
        className="self-end"
        onClick={handleComment}
        disabled={sending || isEmpty(comment)}
      >
        <SendHorizontal />
        {sending ? "Posting…" : "Post comment"}
      </Button>
    </div>
  );
};

export default CommentInput;
