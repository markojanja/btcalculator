import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuth from "../hooks/useAuth";
import { isStaff } from "../constants/domain";
import { formatDateTime } from "../lib/format";
import { taskKeys, tasksApi } from "../api/tasks";
import RichTextEditor from "./RichTextEditor";
import HtmlContent from "./HtmlContent";

const CommentCard = ({ comment, taskId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.description);

  // Mirrors the backend: authors edit their comments; authors and staff delete.
  const isAuthor = user?.id === comment.userId;
  const canDelete = isAuthor || isStaff(user);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) });

  const save = useMutation({
    mutationFn: () => tasksApi.updateComment(comment.id, draft),
    onSuccess: () => {
      setEditing(false);
      refresh();
    },
  });

  const remove = useMutation({
    mutationFn: () => tasksApi.deleteComment(comment.id),
    onSuccess: refresh,
  });

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div className="items-center text-sm text-muted-foreground">
          {formatDateTime(comment.createdAt)}
        </div>
        <div className="flex gap-0">
          {isAuthor && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Edit comment"
              onClick={() => setEditing(true)}
            >
              <Pencil />
            </Button>
          )}
          {canDelete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Delete comment"
              disabled={remove.isPending}
              onClick={() => remove.mutate()}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-left">
        {editing ? (
          <>
            <RichTextEditor variant="comment" value={draft} onChange={setDraft} />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                disabled={save.isPending}
                onClick={() => save.mutate()}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <HtmlContent html={comment.description} />
        )}
      </CardContent>
      <CardFooter>{comment.user?.username}</CardFooter>
    </Card>
  );
};

export default CommentCard;
