import { useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentEditor from "./CommentEditor";
import useAuth from "../hooks/useAuth";

const CommentCard = ({ comment, setComments }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [editing, setEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.description);
  const { user } = useAuth();

  // Same rules as the backend: authors edit; authors and staff delete
  const isAuthor = user?.id === comment.userId;
  const canDelete = isAuthor || ["ADMIN", "MANAGER"].includes(user?.role);
  const username = comment.user?.username ?? "Unknown";

  const handleSave = async () => {
    try {
      await axios.put(
        `${BACKEND_URL}/tasks/comments/${comment.id}`,
        { description: editedComment },
        { withCredentials: true },
      );
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id ? { ...c, description: editedComment } : c,
        ),
      );
      setEditing(false);
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/tasks/comments/${comment.id}`, {
        withCredentials: true,
      });
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch {
      // the error toast (axios interceptor) shows what went wrong
    }
  };

  return (
    <article className="flex gap-3 text-left">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold uppercase text-primary">
        {username.slice(0, 2)}
      </span>
      <div className="min-w-0 flex-1 rounded-lg border bg-card">
        <header className="flex items-center justify-between gap-2 border-b px-3 py-2">
          <p className="text-sm">
            <span className="font-medium">{username}</span>{" "}
            <span className="text-muted-foreground">
              · {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </p>
          {!editing && (isAuthor || canDelete) && (
            <div className="flex">
              {isAuthor && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setEditing(true)}
                  aria-label="Edit comment"
                >
                  <Pencil />
                </Button>
              )}
              {canDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="hover:text-destructive"
                  onClick={handleDelete}
                  aria-label="Delete comment"
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          )}
        </header>
        <div className="px-3 py-2 text-sm">
          {editing ? (
            <div className="flex flex-col gap-2">
              <CommentEditor value={editedComment} onChange={setEditedComment} />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditedComment(comment.description);
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="rte break-words"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(comment.description),
              }}
            />
          )}
        </div>
      </div>
    </article>
  );
};

export default CommentCard;
