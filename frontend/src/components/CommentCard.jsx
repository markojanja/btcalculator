import { useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditIcon, TrashIcon } from "lucide-react";
import CommentEditor from "./CommentEditor";
import useAuth from "../hooks/useAuth";

const CommentCard = ({ comment, setComments }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [editing, setEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.description);
  const { user } = useAuth();

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    setComments((prevComments) =>
      prevComments.map((c) =>
        c.id === comment.id ? { ...c, description: editedComment } : c,
      ),
    );

    await axios.put(
      `${BACKEND_URL}/tasks/comments/${comment.id}`,
      {
        description: editedComment,
      },
      { withCredentials: true },
    );

    setEditing(false);
  };

  const handleDelete = async () => {
    await axios.delete(`${BACKEND_URL}/tasks/comments/${comment.id}`, {
      withCredentials: true,
    });

    setComments((prevComments) =>
      prevComments.filter((c) => c.id !== comment.id),
    );
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div className="items-center text-sm text-muted-foreground">
          {new Date(comment.createdAt).toLocaleString()}
        </div>
        {user?.id === comment.userId && (
          <div className="flex gap-0">
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <EditIcon />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <TrashIcon />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className={"text-left"}>
        {editing ? (
          <>
            <CommentEditor value={editedComment} onChange={setEditedComment} />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(comment.description),
            }}
          />
        )}
      </CardContent>
      <CardFooter>{comment.user?.username}</CardFooter>
    </Card>
  );
};

export default CommentCard;
