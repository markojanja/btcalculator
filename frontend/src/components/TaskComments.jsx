import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { taskKeys, tasksApi, useComments } from "../api/tasks";
import RichTextEditor from "./RichTextEditor";
import CommentCard from "./CommentCard";

// Comment box plus the task's comment thread.
const TaskComments = ({ taskId }) => {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const { data: comments = [] } = useComments(taskId);

  const addComment = useMutation({
    mutationFn: () => tasksApi.addComment(taskId, draft),
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) });
    },
  });

  return (
    <Card className="w-full h-auto">
      <CardContent>
        <Card className="flex flex-col gap-2 h-auto mb-2">
          <CardHeader>
            <CardTitle className="text-left">Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              variant="comment"
              placeholder="Add comment..."
              value={draft}
              onChange={setDraft}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={addComment.isPending}
              onClick={() => addComment.mutate()}
            >
              Comment
            </Button>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-2">
          {comments.length === 0 && <p>This task has no comments.</p>}
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} taskId={taskId} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskComments;
